# accounts/views.py
from rest_framework import status, generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model, authenticate
from django.core.mail import send_mail
from django.conf import settings
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from .serializers import (
    UserSerializer, AdminUserSerializer, RegisterSerializer, LoginSerializer,
    ChangePasswordSerializer, UpdateProfileSerializer,
    PasswordResetSerializer, PasswordResetConfirmSerializer,
    UserProfileSerializer
)
from .models import UserProfile

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """Vue pour l'inscription d'un nouvel utilisateur"""
    
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        
        # Envoyer l'email de bienvenue
        self.send_welcome_email(user)
        # Envoyer l'email de vérification
        self.send_verification_email(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Inscription réussie ! Bienvenue sur Tatlight.'
        }, status=status.HTTP_201_CREATED)
    
    def send_welcome_email(self, user):
        """Envoyer un email de bienvenue au nouvel utilisateur"""
        subject = 'Bienvenue sur Tatlight ✨'
        message = f"""
        Bonjour {user.first_name or user.email},
        
        Bienvenue sur Tatlight ! Votre compte a été créé avec succès.
        
        Nous sommes ravis de vous accueillir dans notre communauté d'excellence.
        
        Commencez dès maintenant à explorer nos contenus premium :
        {settings.FRONTEND_URL}
        
        L'équipe Tatlight
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=True,
        )
    
    def send_verification_email(self, user):
        """Envoyer un email de vérification"""
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verify_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"
        
        subject = 'Vérifiez votre adresse email - Tatlight'
        message = f"""
        Bonjour {user.first_name or user.email},
        
        Merci de vous être inscrit sur Tatlight !
        
        Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :
        {verify_link}
        
        Ce lien est valable pendant 24 heures.
        
        L'équipe Tatlight
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=True,
        )


class LoginView(APIView):
    """Vue pour la connexion"""
    
    permission_classes = [permissions.AllowAny]
    
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
        
        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        
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
        
        user.avatar = avatar
        user.save()
        
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
            
            # Générer le token de réinitialisation
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Créer le lien de réinitialisation
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
            
            # Envoyer l'email
            subject = 'Réinitialisation de votre mot de passe Tatlight'
            message = f"""
            Bonjour {user.first_name or user.email},
            
            Vous avez demandé à réinitialiser votre mot de passe.
            
            Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :
            {reset_link}
            
            Ce lien est valable pendant 24 heures.
            
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            
            L'équipe Tatlight
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            
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
@permission_classes([permissions.IsAuthenticated])
def resend_verification_email(request):
    """Renvoyer l'email de vérification"""
    user = request.user
    if user.is_verified:
        return Response({'message': 'Email déjà vérifié.'}, status=status.HTTP_200_OK)

    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    verify_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"

    subject = 'Vérifiez votre adresse email - Tatlight'
    message = f"""
    Bonjour {user.first_name or user.email},
    
    Voici un nouveau lien pour vérifier votre adresse email :
    {verify_link}
    
    Ce lien est valable pendant 24 heures.
    
    L'équipe Tatlight
    """

    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=True)

    return Response({'message': 'Email de vérification renvoyé.'}, status=status.HTTP_200_OK)


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