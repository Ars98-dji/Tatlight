from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed


class VerifiedJWTAuthentication(JWTAuthentication):
    """JWTAuthentication qui refuse l'accès aux comptes dont l'email n'est pas vérifié.

    S'applique à tous les endpoints protégés : même un token émis avant la
    vérification devient inutilisable tant que l'email n'est pas confirmé.
    Les comptes staff/superuser sont exemptés (créés via le panneau admin,
    pas via l'inscription).
    """

    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        if not user.is_verified and not user.is_staff and not user.is_superuser:
            raise AuthenticationFailed(
                'Votre email n\'a pas encore été vérifié.',
                code='email_not_verified',
            )
        return user
