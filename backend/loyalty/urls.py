from django.urls import path
from . import views

app_name = 'loyalty'

urlpatterns = [
    path('summary/', views.loyalty_summary, name='loyalty-summary'),
    path('transactions/', views.LoyaltyTransactionListView.as_view(), name='transaction-list'),
    path('rewards/', views.LoyaltyRewardListView.as_view(), name='reward-list'),
    path('redemptions/', views.LoyaltyRedemptionListView.as_view(), name='redemption-list'),
    path('redeem/', views.RedeemRewardView.as_view(), name='redeem-reward'),
]
