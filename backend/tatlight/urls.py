# URLs.py 
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.utils import timezone
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Configuration de la documentation API (Swagger)
schema_view = get_schema_view(
    openapi.Info(
        title="Tatlight API",
        default_version='v1',
        description="API pour la plateforme Tatlight - Contenus digitaux premium",
        terms_of_service="https://www.tatlight.com/terms/",
        contact=openapi.Contact(email="contact@tatlight.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Health Check
    path('api/health/', lambda r: JsonResponse({
        'status': 'ok',
        'version': '1.0.0',
        'environment': 'development' if settings.DEBUG else 'production',
        'timestamp': timezone.now().isoformat(),
    }), name='health-check'),
    
    # API Endpoints
    path('api/auth/', include('accounts.urls', namespace='accounts')),
    path('api/products/', include('products.urls', namespace='products')),
    path('api/orders/', include('orders.urls', namespace='orders')),
    path('api/loyalty/', include('loyalty.urls', namespace='loyalty')),
]

# Servir les fichiers média en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Configuration du site admin
admin.site.site_header = "Administration Tatlight"
admin.site.site_title = "Tatlight Admin"
admin.site.index_title = "Tableau de bord"