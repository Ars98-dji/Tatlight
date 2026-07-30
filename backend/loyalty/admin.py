from django.contrib import admin
from .models import LoyaltyTransaction, LoyaltyReward, LoyaltyRedemption


@admin.register(LoyaltyTransaction)
class LoyaltyTransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'points', 'transaction_type', 'description', 'created_at']
    list_filter = ['transaction_type', 'created_at']
    search_fields = ['user__email', 'description', 'reference']
    readonly_fields = ['created_at']


@admin.register(LoyaltyReward)
class LoyaltyRewardAdmin(admin.ModelAdmin):
    list_display = ['name', 'points_required', 'stock', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']


@admin.register(LoyaltyRedemption)
class LoyaltyRedemptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'reward', 'points_spent', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email', 'reward__name']
    readonly_fields = ['created_at']
