from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    path('', views.ProductListView.as_view(), name='product-list'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('featured/', views.ProductFeaturedView.as_view(), name='product-featured'),
    path('type/<str:type>/', views.ProductByTypeView.as_view(), name='product-by-type'),
    path('search/', views.search_products, name='product-search'),
    path('<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('<uuid:product_id>/reviews/', views.ProductReviewListView.as_view(), name='product-reviews'),
    path('admin/categories/', views.CategoryAdminListView.as_view(), name='admin-category-list'),
    path('admin/categories/<slug:slug>/', views.CategoryAdminDetailView.as_view(), name='admin-category-detail'),
    path('admin/products/', views.ProductAdminListView.as_view(), name='admin-product-list'),
    path('admin/products/<slug:slug>/', views.ProductAdminDetailView.as_view(), name='admin-product-detail'),
    path('admin/products/<slug:slug>/gallery/', views.ProductGalleryAdminView.as_view(), name='admin-product-gallery'),
    path('admin/products/<slug:slug>/gallery/<uuid:image_id>/', views.ProductGalleryImageDeleteView.as_view(), name='admin-product-gallery-delete'),
    path('admin/reviews/', views.ReviewAdminListView.as_view(), name='admin-review-list'),
    path('admin/reviews/<uuid:pk>/', views.ReviewAdminDetailView.as_view(), name='admin-review-detail'),
]
