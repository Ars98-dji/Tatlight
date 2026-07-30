from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


class LoyaltyTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('earned', 'Gagnés'),
        ('redeemed', 'Échangés'),
        ('expired', 'Expirés'),
        ('adjusted', 'Ajustés'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='loyalty_transactions', verbose_name='Utilisateur'
    )
    points = models.IntegerField(verbose_name='Points')
    transaction_type = models.CharField(
        max_length=20, choices=TRANSACTION_TYPES,
        verbose_name='Type de transaction'
    )
    description = models.CharField(
        max_length=300, verbose_name='Description'
    )
    reference = models.CharField(
        max_length=100, blank=True,
        verbose_name='Référence'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Créé le')

    class Meta:
        verbose_name = 'Transaction de fidélité'
        verbose_name_plural = 'Transactions de fidélité'
        ordering = ['-created_at']

    def __str__(self):
        sign = '+' if self.transaction_type == 'earned' else '-'
        return f"{self.user.email}: {sign}{self.points}pts ({self.transaction_type})"


class LoyaltyReward(models.Model):
    name = models.CharField(max_length=200, verbose_name='Nom')
    description = models.TextField(blank=True, verbose_name='Description')
    points_required = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name='Points requis'
    )
    image = models.ImageField(
        upload_to='loyalty/rewards/%Y/%m/',
        blank=True, null=True,
        verbose_name='Image'
    )
    stock = models.PositiveIntegerField(
        default=0,
        verbose_name='Stock (0 = illimité)'
    )
    is_active = models.BooleanField(default=True, verbose_name='Actif')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Créé le')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Mis à jour le')

    class Meta:
        verbose_name = 'Récompense'
        verbose_name_plural = 'Récompenses'
        ordering = ['points_required']

    def __str__(self):
        return f"{self.name} ({self.points_required} pts)"


class LoyaltyRedemption(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='loyalty_redemptions', verbose_name='Utilisateur'
    )
    reward = models.ForeignKey(
        LoyaltyReward, on_delete=models.CASCADE,
        related_name='redemptions', verbose_name='Récompense'
    )
    points_spent = models.PositiveIntegerField(verbose_name='Points dépensés')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Créé le')

    class Meta:
        verbose_name = 'Échange de récompense'
        verbose_name_plural = 'Échanges de récompenses'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} a échangé {self.reward.name}"
