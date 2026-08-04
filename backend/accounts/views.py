# accounts/views.py
import io
import uuid

from rest_framework import status, generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model, authenticate
from django.conf import settings
from django.core.files.base import ContentFile
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from PIL import Image
from tatlight.emails import (
    send_welcome_email,
    send_verification_email,
    send_password_reset_email,
)
from .serializers import (
    UserSerializer, AdminUserSerializer, RegisterSerializer, LoginSerializer,
    ChangePasswordSerializer, UpdateProfileSerializer,
    PasswordResetSerializer, PasswordResetConfirmSerializer,
    UserProfileSerializer
)
from .models import UserProfile

User = get_user_model()


def _process_image_upload(f):
    """Valide le contenu réel de l'image et la ré-encode avec un nom sûr.

    Empêche l'upload de fichiers piégés (HTML/JS déguisés en image) : seule
    une vraie image JPEG/PNG/WEBP passe, ré-encodée par Pillow.
    """
    allowed_formats = {
        'JPEG': 'jpg',
        'PNG': 'png',
        'WEBP': 'webp',
    }
    try:
        image = Image.open(f)
        image.verify()
    except Exception:
        return None
    f.seek(0)
    try:
        image = Image.open(f)
        fmt = image.format
        if fmt not in allowed_formats:
            return None
        if fmt == 'JPEG' and image.mode not in ('RGB', 'L'):
            image = image.convert('RGB')
        buffer = io.BytesIO()
        image.save(buffer, format=fmt)
        return ContentFile(
            buffer.getvalue(),
            name=f'avatar_{uuid.uuid4().hex}.{allowed_formats[fmt]}',
        )
    except Exception:
        return None


class RegisterView(generics.CreateAPIView):
    """Vue pour l'inscription d'un nouvel utilisateur"""
    
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'register'
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Envoyer l'email de vérification (le bienvenue part après la 1ère connexion)
        send_verification_email(user)
        
        # Pas de connexion automatique : l'utilisateur doit vérifier son email d'abord
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Inscription réussie ! Vérifiez votre email pour activer votre compte.'
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Vue pour la connexion"""
    
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'auth'
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        user = authenticate(request, email=email, password=password)
        
        if user is None:
            return Response({
                'error': 'Identifiants incorrects. Vérifiez votre email et votre mot de passe.'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({
                'error': 'Ce compte a été désactivé.'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_verified and not user.is_staff and not user.is_superuser:
            return Response({
                'error': 'Votre email n\'a pas encore été vérifié. Cliquez sur le lien reçu dans votre boîte mail pour activer votre compte.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)

        # Email de bienvenue : une seule fois, après la première connexion
        if not user.welcome_email_sent and not user.is_staff and not user.is_superuser:
            user.welcome_email_sent = True
            user.save(update_fields=['welcome_email_sent'])
            send_welcome_email(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Connexion réussie !'
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """Vue pour la déconnexion"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'message': 'Déconnexion réussie.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Une erreur est survenue lors de la déconnexion.'
            }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Vue pour récupérer et mettre à jour le profil utilisateur"""
    
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UpdateProfileView(generics.UpdateAPIView):
    """Vue pour mettre à jour le profil utilisateur"""
    
    serializer_class = UpdateProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'user': UserSerializer(instance).data,
            'message': 'Profil mis à jour avec succès !'
        }, status=status.HTTP_200_OK)


class UploadAvatarView(APIView):
    """Vue pour télécharger une photo de profil"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        
        if 'avatar' not in request.FILES:
            return Response({
                'error': 'Aucun fichier fourni.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        avatar = request.FILES['avatar']
        
        # Valider le type de fichier
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if avatar.content_type not in allowed_types:
            return Response({
                'error': 'Type de fichier non autorisé. Utilisez JPG, PNG ou WEBP.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Valider la taille (max 5MB)
        if avatar.size > 5 * 1024 * 1024:
            return Response({
                'error': 'Fichier trop volumineux. Maximum 5 MB.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Valider que c'est une vraie image et ré-encoder avec un nom sûr
        processed = _process_image_upload(avatar)
        if processed is None:
            return Response({
                'error': 'Fichier image invalide.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.avatar.save(processed.name, processed, save=True)
        
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Photo de profil mise à jour avec succès !'
        }, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    """Vue pour changer le mot de passe"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            'message': 'Mot de passe changé avec succès !'
        }, status=status.HTTP_200_OK)


class PasswordResetView(APIView):
    """Vue pour demander la réinitialisation du mot de passe"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
            # Envoyer l'email de réinitialisation (token généré dans le module)
            send_password_reset_email(user)
            
        except User.DoesNotExist:
            # Ne pas révéler si l'email existe ou non
            pass
        
        return Response({
            'message': 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.'
        }, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    """Vue pour confirmer la réinitialisation du mot de passe"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            uid = force_str(urlsafe_base64_decode(request.data.get('uid')))
            user = User.objects.get(pk=uid)
            token = serializer.validated_data['token']
            
            if not default_token_generator.check_token(user, token):
                return Response({
                    'error': 'Token invalide ou expiré.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Mot de passe réinitialisé avec succès !'
            }, status=status.HTTP_200_OK)
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({
                'error': 'Token invalide.'
            }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def verify_email(request, uidb64, token):
    """Vérifier l'adresse email d'un utilisateur"""
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'error': 'Lien de vérification invalide.'}, status=status.HTTP_400_BAD_REQUEST)

    if not default_token_generator.check_token(user, token):
        return Response({'error': 'Token de vérification invalide ou expiré.'}, status=status.HTTP_400_BAD_REQUEST)

    if user.is_verified:
        return Response({'message': 'Email déjà vérifié.'}, status=status.HTTP_200_OK)

    user.is_verified = True
    user.save(update_fields=['is_verified'])

    return Response({'message': 'Email vérifié avec succès !'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def resend_verification_email(request):
    """Renvoyer l'email de vérification"""
    email = request.data.get('email', '').strip()
    if not email:
        return Response({'error': 'L\'adresse email est requise.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        user = None

    # Message générique pour éviter l'énumération de comptes
    if user is not None and not user.is_verified:
        send_verification_email(user)

    return Response({
        'message': 'Si votre compte existe et n\'est pas vérifié, un email de vérification a été renvoyé.'
    }, status=status.HTTP_200_OK)


class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-date_joined']


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'pk'


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_account(request):
    """Supprimer le compte utilisateur"""
    user = request.user
    user.is_active = False
    user.save()
    
    # Optionnel : anonymiser les données
    # user.email = f"deleted_{user.id}@tatlight.com"
    # user.first_name = ""
    # user.last_name = ""
    # user.save()
    
    return Response({
        'message': 'Votre compte a été désactivé avec succès.'
    }, status=status.HTTP_200_OK)