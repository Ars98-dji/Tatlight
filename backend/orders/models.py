from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class Order(models.Model):
    ORDER_STATUS = [
        ('pending', 'En attente'),
        ('completed', 'Terminée'),
        ('cancelled', 'Annulée'),
        ('refunded', 'Remboursée'),
    ]

    PAYMENT_METHODS = [
        ('stripe', 'Carte bancaire (Stripe)'),
        ('flutterwave', 'Mobile Money (Flutterwave)'),
        ('fedapay', 'Mobile Money (FedaPay)'),
        ('free', 'Gratuit'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='orders',
        verbose_name='Utilisateur'
    )
    order_number = models.CharField(
        max_length=20, unique=True,
        verbose_name='Numéro de commande'
    )
    status = models.CharField(
        max_length=20, choices=ORDER_STATUS,
        default='pending', verbose_name='Statut'
    )
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name='Montant total'
    )
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_METHODS,
        default='stripe', verbose_name='Moyen de paiement'
    )
    stripe_payment_intent_id = models.CharField(
        max_length=255, blank=True,
        verbose_name='ID intention de paiement Stripe'
    )
    flutterwave_transaction_id = models.CharField(
        max_length=255, blank=True,
        verbose_name='ID transaction Flutterwave'
    )
    fedapay_transaction_id = models.CharField(
        max_length=255, blank=True,
        verbose_name='ID transaction FedaPay'
    )
    fedapay_token = models.CharField(
        max_length=255, blank=True,
        verbose_name='Token de paiement FedaPay'
    )
    billing_name = models.CharField(
        max_length=255, blank=True,
        verbose_name='Nom de facturation'
    )
    billing_email = models.EmailField(
        blank=True, verbose_name='Email de facturation'
    )
    billing_address = models.TextField(
        blank=True, verbose_name='Adresse de facturation'
    )
    coupon = models.ForeignKey(
        'orders.Coupon', on_delete=models.SET_NULL,
        null=True, blank=True, verbose_name='Code promo'
    )
    discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        verbose_name='Montant de la réduction'
    )
    notes = models.TextField(blank=True, verbose_name='Notes')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Créée le')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Mise à jour le')

    class Meta:
        verbose_name = 'Commande'
        verbose_name_plural = 'Commandes'
        ordering = ['-created_at']

    def __str__(self):
        return f"Commande {self.order_number}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self._generate_order_number()
        super().save(*args, **kwargs)

    def _generate_order_number(self):
        prefix = "TAT"
        suffix = uuid.uuid4().hex[:8].upper()
        return f"{prefix}-{suffix}"

    @property
    def items_count(self):
        return self.items.count()


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE,
        related_name='items', verbose_name='Commande'
    )
    product = models.ForeignKey(
        'products.Product', on_delete=models.SET_NULL,
        null=True, blank=True, verbose_name='Produit'
    )
    product_title = models.CharField(
        max_length=300, verbose_name='Titre du produit'
    )
    product_price = models.DecimalField(
        max_digits=10, decimal_places=2,
        verbose_name='Prix unitaire'
    )
    quantity = models.PositiveIntegerField(default=1, verbose_name='Quantité')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ajouté le')

    class Meta:
        verbose_name = 'Article de commande'
        verbose_name_plural = 'Articles de commande'

    def __str__(self):
        return f"{self.product_title} x{self.quantity}"

    @property
    def total_price(self):
        return self.product_price * self.quantity


class Coupon(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ('percent', 'Pourcentage'),
        ('fixed', 'Montant fixe'),
    ]

    code = models.CharField(
        max_length=50, unique=True,
        verbose_name='Code promo'
    )
    discount_type = models.CharField(
        max_length=10, choices=DISCOUNT_TYPE_CHOICES,
        default='percent', verbose_name='Type de réduction'
    )
    discount_percent = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name='Réduction (%)'
    )
    discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        verbose_name='Réduction (€)'
    )
    min_purchase = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        verbose_name='Achat minimum (€)'
    )
    max_uses = models.PositiveIntegerField(
        default=0,
        verbose_name='Utilisations max (0 = illimité)'
    )
    used_count = models.PositiveIntegerField(
        default=0, verbose_name='Utilisations'
    )
    is_active = models.BooleanField(default=True, verbose_name='Actif')
    valid_from = models.DateTimeField(verbose_name='Valable du')
    valid_to = models.DateTimeField(verbose_name='Valable au')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Créé le')

    class Meta:
        verbose_name = 'Code promo'
        verbose_name_plural = 'Codes promo'

    def __str__(self):
        return self.code

    @property
    def is_valid(self):
        from django.utils import timezone
        now = timezone.now()
        return (
            self.is_active and
            self.valid_from <= now <= self.valid_to and
            (self.max_uses == 0 or self.used_count < self.max_uses)
        )
