from django.urls import path
from . import views

app_name = 'orders'

urlpatterns = [
    path('', views.OrderListView.as_view(), name='order-list'),
    path('create/', views.CreateOrderView.as_view(), name='order-create'),
    path('confirm-payment/', views.ConfirmPaymentView.as_view(), name='order-confirm-payment'),
    path('guest-checkout/', views.GuestCheckoutView.as_view(), name='guest-checkout'),
    path('purchases/', views.user_purchases, name='user-purchases'),
    path('purchases/<uuid:product_id>/download/', views.ProductDownloadView.as_view(), name='product-download'),
    path('stripe-webhook/', views.stripe_webhook, name='stripe-webhook'),
    path('coupons/', views.CouponListView.as_view(), name='coupon-list'),
    path('coupons/validate/', views.CouponValidateView.as_view(), name='coupon-validate'),
    path('coupons/<uuid:pk>/', views.CouponDetailView.as_view(), name='coupon-detail'),
    path('admin/orders/', views.AdminOrderListView.as_view(), name='admin-order-list'),
    path('fedapay/initialize/', views.FedaPayInitializeView.as_view(), name='fedapay-initialize'),
    path('fedapay/verify/', views.FedaPayVerifyView.as_view(), name='fedapay-verify'),
    path('fedapay-webhook/', views.fedapay_webhook, name='fedapay-webhook'),
    path('<uuid:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
]
