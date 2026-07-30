from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductReview, ProductFeature


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'icon', 'product_count', 'order']
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True},
        }

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'order']


class ProductReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = ProductReview
        fields = ['id', 'user', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']

    def get_user_name(self, obj):
        return obj.user.full_name

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("La note doit être entre 1 et 5.")
        return value


class ProductFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductFeature
        fields = ['id', 'text', 'order']


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'type', 'title', 'slug', 'short_description', 'price',
            'compare_price', 'image', 'category_name', 'category_slug',
            'sales_count', 'rating', 'rating_count', 'is_featured', 'format',
            'file_size', 'created_at'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    feature_list = ProductFeatureSerializer(many=True, read_only=True)
    has_purchased = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'type', 'title', 'slug', 'description',
            'short_description', 'price', 'compare_price', 'image', 'file',
            'file_size', 'format', 'sales_count', 'rating', 'rating_count',
            'is_featured', 'is_digital', 'features', 'feature_list',
            'images', 'reviews', 'has_purchased', 'created_at', 'updated_at'
        ]

    def get_has_purchased(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return request.user.orders.filter(
            items__product=obj,
            status='completed'
        ).exists()


class AdminReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source='user.email', read_only=True)
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_slug = serializers.SlugField(source='product.slug', read_only=True)

    class Meta:
        model = ProductReview
        fields = ['id', 'user', 'user_name', 'user_email', 'product', 'product_title', 'product_slug', 'rating', 'comment', 'created_at']

    def get_user_name(self, obj):
        return obj.user.full_name


class ProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'category', 'type', 'title', 'slug', 'description',
            'short_description', 'price', 'compare_price', 'image', 'file',
            'file_size', 'format', 'is_featured', 'is_active', 'is_digital',
            'features'
        ]
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True},
            'short_description': {'required': False, 'allow_blank': True},
            'compare_price': {'required': False, 'allow_null': True},
        }
