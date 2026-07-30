from rest_framework import serializers
from .models import Order, OrderItem, Coupon
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_title', 'product_price', 'quantity', 'total_price']


class OrderItemCreateSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.filter(is_active=True))

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("La quantité doit être au moins 1.")
        return value


class OrderListSerializer(serializers.ModelSerializer):
    items_count = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'total_amount',
            'payment_method', 'items_count', 'created_at'
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'status', 'total_amount',
            'payment_method', 'stripe_payment_intent_id',
            'flutterwave_transaction_id',
            'fedapay_transaction_id', 'fedapay_token',
            'billing_name', 'billing_email', 'billing_address',
            'coupon', 'discount_amount', 'notes', 'items',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'order_number', 'stripe_payment_intent_id', 'flutterwave_transaction_id', 'fedapay_transaction_id', 'fedapay_token']


class CreateOrderSerializer(serializers.Serializer):
    items = OrderItemCreateSerializer(many=True)
    billing_name = serializers.CharField(required=False, allow_blank=True)
    billing_email = serializers.EmailField(required=False, allow_blank=True)
    billing_address = serializers.CharField(required=False, allow_blank=True)
    coupon_code = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.ChoiceField(choices=['stripe', 'flutterwave', 'fedapay'], default='stripe')

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Au moins un article est requis.")
        return value


class CouponSerializer(serializers.ModelSerializer):
    is_valid = serializers.ReadOnlyField()

    class Meta:
        model = Coupon
        fields = [
            'id', 'code', 'discount_type', 'discount_percent',
            'discount_amount', 'min_purchase', 'max_uses',
            'used_count', 'is_active', 'is_valid', 'valid_from', 'valid_to'
        ]
        read_only_fields = ['used_count']


class CouponValidateSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
