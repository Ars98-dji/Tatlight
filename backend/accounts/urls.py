from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView, LoginView, LogoutView,
    UserProfileView, UpdateProfileView, UploadAvatarView,
    ChangePasswordView, PasswordResetView, PasswordResetConfirmView,
    verify_email, resend_verification_email, delete_account,
    AdminUserListView, AdminUserDetailView
)

app_name = 'accounts'

urlpatterns = [

    # Authentification
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profil utilisateur
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/update/', UpdateProfileView.as_view(), name='update-profile'),
    path('profile/avatar/', UploadAvatarView.as_view(), name='upload-avatar'),
    
    # Gestion du mot de passe
    path('password/change/', ChangePasswordView.as_view(), name='change-password'),
    path('password/reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # Vérification d'email
    path('verify-email/<str:uidb64>/<str:token>/', verify_email, name='verify-email'),
    path('resend-verification/', resend_verification_email, name='resend-verification'),
    
    # Suppression de compte
    path('delete/', delete_account, name='delete-account'),

    # Admin - Gestion des utilisateurs
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<uuid:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
]