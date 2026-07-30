# accounts/admin.py 
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, UserProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Configuration de l'interface admin pour User"""
    
    list_display = [
        'email', 'full_name', 'loyalty_tier', 'loyalty_points',
        'is_verified', 'is_active', 'date_joined', 'avatar_preview'
    ]
    list_filter = ['is_active', 'is_staff', 'is_verified', 'loyalty_tier', 'date_joined']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    fieldsets = (
        ('Informations de connexion', {
            'fields': ('email', 'password')
        }),
        ('Informations personnelles', {
            'fields': ('first_name', 'last_name', 'avatar', 'phone_number')
        }),
        ('Adresse', {
            'fields': ('address_line1', 'address_line2', 'city', 'postal_code', 'country'),
            'classes': ('collapse',)
        }),
        ('Programme de fidélité', {
            'fields': ('loyalty_points', 'loyalty_tier')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Préférences', {
            'fields': ('newsletter_subscribed', 'language_preference'),
            'classes': ('collapse',)
        }),
        ('Dates importantes', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name'),
        }),
    )
    
    readonly_fields = ['date_joined', 'last_login']
    
    def avatar_preview(self, obj):
        """Afficher un aperçu de l'avatar"""
        if obj.avatar:
            return format_html(
                '<img src="{}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />',
                obj.avatar.url
            )
        return '-'
    avatar_preview.short_description = 'Avatar'
    
    def full_name(self, obj):
        """Afficher le nom complet"""
        return obj.full_name
    full_name.short_description = 'Nom complet'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Configuration de l'interface admin pour UserProfile"""
    
    list_display = ['user', 'website', 'email_notifications', 'created_at']
    list_filter = ['email_notifications', 'product_updates', 'promotional_emails']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    
    fieldsets = (
        ('Utilisateur', {
            'fields': ('user',)
        }),
        ('Informations', {
            'fields': ('bio', 'website')
        }),
        ('Réseaux sociaux', {
            'fields': ('twitter_handle', 'instagram_handle', 'linkedin_url')
        }),
        ('Préférences de notification', {
            'fields': ('email_notifications', 'product_updates', 'promotional_emails')
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']