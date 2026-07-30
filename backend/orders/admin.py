from django.contrib import admin
from .models import Order, OrderItem, Coupon


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'product_title', 'product_price', 'quantity']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number', 'user', 'status', 'total_amount',
        'payment_method', 'created_at'
    ]
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['order_number', 'user__email', 'billing_name', 'billing_email']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    fieldsets = (
        ('Informations', {
            'fields': ('order_number', 'user', 'status')
        }),
        ('Montant', {
            'fields': ('total_amount',)
        }),
        ('Paiement', {
            'fields': ('payment_method', 'stripe_payment_intent_id')
        }),
        ('Facturation', {
            'fields': ('billing_name', 'billing_email', 'billing_address')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'product_title', 'product_price', 'quantity', 'created_at']
    search_fields = ['order__order_number', 'product_title']


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = [
        'code', 'discount_percent', 'discount_amount', 'min_purchase',
        'used_count', 'max_uses', 'is_active', 'valid_from', 'valid_to'
    ]
    list_filter = ['is_active']
    search_fields = ['code']
