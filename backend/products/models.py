from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class Category(models.Model):
    name = models.CharField(max_length=200, verbose_name='Nom')
    slug = models.SlugField(max_length=250, unique=True, verbose_name='Slug')
    description = models.TextField(blank=True, verbose_name='Description')
    image = models.ImageField(
        upload_to='categories/%Y/%m/',
        blank=True, null=True,
        verbose_name='Image'
    )
    icon = models.CharField(max_length=50, blank=True, verbose_name='Icône')
    is_active = models.BooleanField(default=True, verbose_name='Active')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordre')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Créé le')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Mis à jour le')

    class Meta:
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    PRODUCT_TYPES = [
        ('ebook', 'Ebook'),
        ('template', 'Template'),
        ('formation', 'Formation'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE,
        related_name='products', verbose_name='Catégorie'
    )
    type = models.CharField(
        max_length=20, choices=PRODUCT_TYPES,
        verbose_name='Type de produit'
    )
    title = models.CharField(max_length=300, verbose_name='Titre')
    slug = models.SlugField(max_length=350, unique=True, verbose_name='Slug')
    description = models.TextField(verbose_name='Description complète')
    short_description = models.CharField(
        max_length=500, blank=True,
        verbose_name='Description courte'
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name='Prix (€)'
    )
    compare_price = models.DecimalField(
        max_digits=10, decimal_places=2,
        blank=True, null=True,
        validators=[MinValueValidator(0)],
        verbose_name='Prix barre'
    )
    image = models.ImageField(
        upload_to='products/%Y/%m/',
        blank=True, null=True,
        verbose_name='Image de couverture'
    )
    file = models.FileField(
        upload_to='products/files/%Y/%m/',
        blank=True, null=True,
        verbose_name='Fichier du produit'
    )
    file_size = models.CharField(
        max_length=20, blank=True,
        verbose_name='Taille du fichier'
    )
    format = models.CharField(
        max_length=50, blank=True,
        verbose_name='Format'
    )
    sales_count = models.PositiveIntegerField(default=0, verbose_name='Nombre de ventes')
    rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name='Note moyenne'
    )
    rating_count = models.PositiveIntegerField(default=0, verbose_name="Nombre d'avis")
    is_featured = models.BooleanField(default=False, verbose_name='Mis en avant')
    is_active = models.BooleanField(default=True, verbose_name='Actif')
    is_digital = models.BooleanField(default=True, verbose_name='Produit digital')
    features = models.JSONField(default=list, blank=True, verbose_name='Caractéristiques')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Créé le')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Mis à jour le')

    class Meta:
        verbose_name = 'Produit'
        verbose_name_plural = 'Produits'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['type', 'is_active']),
            models.Index(fields=['is_featured', 'is_active']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.short_description:
            self.short_description = self.description[:200] if self.description else ''
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE,
        related_name='images', verbose_name='Produit'
    )
    image = models.ImageField(upload_to='products/gallery/%Y/%m/', verbose_name='Image')
    is_primary = models.BooleanField(default=False, verbose_name='Image principale')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordre')

    class Meta:
        verbose_name = 'Image du produit'
        verbose_name_plural = 'Images des produits'
        ordering = ['order']

    def __str__(self):
        return f"Image de {self.product.title}"


class ProductReview(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE,
        related_name='reviews', verbose_name='Produit'
    )
    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE,
        related_name='reviews', verbose_name='Utilisateur'
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name='Note'
    )
    comment = models.TextField(blank=True, verbose_name='Commentaire')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Créé le')

    class Meta:
        verbose_name = 'Avis produit'
        verbose_name_plural = 'Avis produits'
        ordering = ['-created_at']
        unique_together = ['product', 'user']

    def __str__(self):
        return f"{self.user.email} - {self.product.title} ({self.rating}/5)"


class ProductFeature(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE,
        related_name='feature_list', verbose_name='Produit'
    )
    text = models.CharField(max_length=300, verbose_name='Texte')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordre')

    class Meta:
        verbose_name = 'Caractéristique'
        verbose_name_plural = 'Caractéristiques'
        ordering = ['order']

    def __str__(self):
        return self.text
