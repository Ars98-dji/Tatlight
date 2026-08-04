# accounts/models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from phonenumber_field.modelfields import PhoneNumberField
import uuid


class UserManager(BaseUserManager):
    """Gestionnaire personnalisé pour le modèle User"""
    
    def create_user(self, email, password=None, **extra_fields):
        """Créer et retourner un utilisateur avec un email et mot de passe"""
        if not email:
            raise ValueError('L\'adresse email est obligatoire')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Créer et retourner un superutilisateur"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser doit avoir is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser doit avoir is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Modèle User personnalisé pour Tatlight"""
    
    TIER_CHOICES = [
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
    ]
    
    # Informations de base
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, verbose_name='Adresse email')
    first_name = models.CharField(max_length=150, blank=True, verbose_name='Prénom')
    last_name = models.CharField(max_length=150, blank=True, verbose_name='Nom')
    
    # Photo de profil
    avatar = models.ImageField(
        upload_to='avatars/%Y/%m/',
        blank=True,
        null=True,
        verbose_name='Photo de profil'
    )
    
    # Informations de contact
    phone_number = PhoneNumberField(blank=True, null=True, verbose_name='Numéro de téléphone')
    
    # Adresse
    address_line1 = models.CharField(max_length=255, blank=True, verbose_name='Adresse ligne 1')
    address_line2 = models.CharField(max_length=255, blank=True, verbose_name='Adresse ligne 2')
    city = models.CharField(max_length=100, blank=True, verbose_name='Ville')
    postal_code = models.CharField(max_length=20, blank=True, verbose_name='Code postal')
    country = models.CharField(max_length=100, blank=True, default='France', verbose_name='Pays')
    
    # Programme de fidélité
    loyalty_points = models.IntegerField(default=0, verbose_name='Points de fidélité')
    loyalty_tier = models.CharField(
        max_length=20,
        choices=TIER_CHOICES,
        default='bronze',
        verbose_name='Niveau de fidélité'
    )
    
    # Métadonnées
    is_active = models.BooleanField(default=True, verbose_name='Actif')
    is_staff = models.BooleanField(default=False, verbose_name='Staff')
    is_verified = models.BooleanField(default=False, verbose_name='Email vérifié')
    welcome_email_sent = models.BooleanField(default=False, verbose_name='Email de bienvenue envoyé')
    date_joined = models.DateTimeField(default=timezone.now, verbose_name='Date d\'inscription')
    last_login = models.DateTimeField(null=True, blank=True, verbose_name='Dernière connexion')
    
    # Préférences
    newsletter_subscribed = models.BooleanField(default=True, verbose_name='Abonné newsletter')
    language_preference = models.CharField(max_length=10, default='fr', verbose_name='Langue préférée')
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-date_joined']
    
    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        """Retourne le nom complet de l'utilisateur"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.email
    
    @property
    def total_purchases(self):
        """Retourne le nombre total d'achats"""
        return self.orders.filter(status='completed').count()
    
    def add_loyalty_points(self, points):
        """Ajouter des points de fidélité et mettre à jour le tier"""
        self.loyalty_points += points
        self._update_loyalty_tier()
        self.save()
    
    def _update_loyalty_tier(self):
        """Mettre à jour le niveau de fidélité basé sur les points"""
        if self.loyalty_points >= 1000:
            self.loyalty_tier = 'platinum'
        elif self.loyalty_points >= 500:
            self.loyalty_tier = 'gold'
        elif self.loyalty_points >= 200:
            self.loyalty_tier = 'silver'
        else:
            self.loyalty_tier = 'bronze'


class UserProfile(models.Model):
    """Informations supplémentaires du profil utilisateur"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True, verbose_name='Bio')
    website = models.URLField(blank=True, verbose_name='Site web')
    
    # Réseaux sociaux
    twitter_handle = models.CharField(max_length=100, blank=True)
    instagram_handle = models.CharField(max_length=100, blank=True)
    linkedin_url = models.URLField(blank=True)
    
    # Préférences de notification
    email_notifications = models.BooleanField(default=True, verbose_name='Notifications email')
    product_updates = models.BooleanField(default=True, verbose_name='Mises à jour produits')
    promotional_emails = models.BooleanField(default=True, verbose_name='Emails promotionnels')
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Profil utilisateur'
        verbose_name_plural = 'Profils utilisateurs'
    
    def __str__(self):
        return f"Profil de {self.user.email}"