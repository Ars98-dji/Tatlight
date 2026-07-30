from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, ProductImage, ProductReview, ProductFeature


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'product_count', 'is_active', 'order', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Produits'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'type', 'price', 'sales_count',
        'rating', 'is_featured', 'is_active', 'created_at', 'thumbnail_preview'
    ]
    list_filter = ['type', 'category', 'is_featured', 'is_active']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['-created_at']
    readonly_fields = ['sales_count', 'rating', 'rating_count', 'thumbnail_preview']
    fieldsets = (
        ('Informations générales', {
            'fields': ('category', 'type', 'title', 'slug', 'description', 'short_description')
        }),
        ('Média', {
            'fields': ('image', 'thumbnail_preview', 'file', 'file_size', 'format')
        }),
        ('Prix et ventes', {
            'fields': ('price', 'compare_price', 'sales_count', 'rating', 'rating_count')
        }),
        ('Caractéristiques', {
            'fields': ('features',)
        }),
        ('Statut', {
            'fields': ('is_featured', 'is_active', 'is_digital')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def thumbnail_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" />',
                obj.image.url
            )
        return '-'
    thumbnail_preview.short_description = 'Aperçu'


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'is_primary', 'order']
    list_filter = ['is_primary']
    search_fields = ['product__title']


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'created_at']
    list_filter = ['rating']
    search_fields = ['product__title', 'user__email', 'comment']
    readonly_fields = ['created_at']


@admin.register(ProductFeature)
class ProductFeatureAdmin(admin.ModelAdmin):
    list_display = ['product', 'text', 'order']
    list_filter = ['product']
    search_fields = ['product__title', 'text']
