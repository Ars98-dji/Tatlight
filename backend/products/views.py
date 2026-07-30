from rest_framework import status, generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q, Count, Avg
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, ProductReview, ProductImage
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ProductWriteSerializer, ProductReviewSerializer, ProductImageSerializer,
    AdminReviewSerializer
)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering = ['order', 'name']


class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'category__slug', 'is_featured']
    search_fields = ['title', 'description', 'short_description']
    ordering_fields = ['price', 'sales_count', 'rating', 'created_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related('category')
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ProductFeaturedView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Product.objects.filter(
            is_active=True, is_featured=True
        ).select_related('category')[:8]


class ProductByTypeView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        product_type = self.kwargs.get('type')
        return Product.objects.filter(
            is_active=True, type=product_type
        ).select_related('category')


class ProductReviewListView(generics.ListCreateAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return ProductReview.objects.filter(product_id=self.kwargs['product_id']).select_related('user')

    def perform_create(self, serializer):
        product = generics.get_object_or_404(Product, id=self.kwargs['product_id'])
        if not self.request.user.orders.filter(
            items__product=product,
            status='completed'
        ).exists():
            raise PermissionDenied("Vous devez acheter ce produit avant de laisser un avis.")
        serializer.save(user=self.request.user, product=product)


class CategoryAdminListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering = ['order', 'name']


class CategoryAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'


class ProductAdminListView(generics.ListCreateAPIView):
    queryset = Product.objects.all().select_related('category')
    serializer_class = ProductWriteSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering = ['-created_at']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        gallery_files = request.FILES.getlist('gallery')
        for idx, img in enumerate(gallery_files):
            ProductImage.objects.create(
                product=product, image=img,
                is_primary=False, order=idx
            )

        return Response(
            ProductDetailSerializer(product, context=self.get_serializer_context()).data,
            status=status.HTTP_201_CREATED
        )


class ProductAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all().select_related('category')
    serializer_class = ProductWriteSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'

    def perform_update(self, serializer):
        product = serializer.save()

        gallery_files = self.request.FILES.getlist('gallery')
        if gallery_files:
            ProductImage.objects.filter(product=product).delete()
            for idx, img in enumerate(gallery_files):
                ProductImage.objects.create(
                    product=product, image=img,
                    is_primary=False, order=idx
                )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            ProductDetailSerializer(instance, context=self.get_serializer_context()).data
        )


class ProductGalleryAdminView(generics.ListCreateAPIView):
    serializer_class = ProductImageSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return ProductImage.objects.filter(product__slug=self.kwargs['slug']).order_by('order')

    def perform_create(self, serializer):
        product = generics.get_object_or_404(Product, slug=self.kwargs['slug'])
        serializer.save(product=product)


class ProductGalleryImageDeleteView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, slug, image_id):
        try:
            image = ProductImage.objects.get(id=image_id, product__slug=slug)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProductImage.DoesNotExist:
            return Response({'error': 'Image introuvable'}, status=status.HTTP_404_NOT_FOUND)


class ReviewAdminListView(generics.ListAPIView):
    queryset = ProductReview.objects.all().select_related('product', 'user')
    serializer_class = AdminReviewSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['comment', 'user__email', 'user__full_name', 'product__title']
    ordering = ['-created_at']


class ReviewAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductReview.objects.all()
    serializer_class = AdminReviewSerializer
    permission_classes = [permissions.IsAdminUser]


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_products(request):
    query = request.query_params.get('q', '')
    if not query or len(query) < 2:
        return Response({'results': []})

    products = Product.objects.filter(
        Q(is_active=True) &
        (Q(title__icontains=query) |
         Q(description__icontains=query) |
         Q(short_description__icontains=query) |
         Q(category__name__icontains=query))
    ).select_related('category')[:20]

    serializer = ProductListSerializer(products, many=True)
    return Response({'results': serializer.data, 'count': len(serializer.data)})
