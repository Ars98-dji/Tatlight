from rest_framework import serializers
from .models import LoyaltyTransaction, LoyaltyReward, LoyaltyRedemption


class LoyaltyTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltyTransaction
        fields = ['id', 'user', 'points', 'transaction_type', 'description', 'reference', 'created_at']
        read_only_fields = ['user']


class LoyaltyRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltyReward
        fields = ['id', 'name', 'description', 'points_required', 'image', 'stock', 'is_active', 'created_at']


class LoyaltyRedemptionSerializer(serializers.ModelSerializer):
    reward_name = serializers.CharField(source='reward.name', read_only=True)

    class Meta:
        model = LoyaltyRedemption
        fields = ['id', 'user', 'reward', 'reward_name', 'points_spent', 'created_at']
        read_only_fields = ['user']


class LoyaltyRedeemSerializer(serializers.Serializer):
    reward_id = serializers.UUIDField(required=True)


class LoyaltySummarySerializer(serializers.Serializer):
    total_points = serializers.IntegerField()
    lifetime_earned = serializers.IntegerField()
    lifetime_redeemed = serializers.IntegerField()
    tier = serializers.CharField()
    progress_to_next_tier = serializers.IntegerField()
    recent_transactions = LoyaltyTransactionSerializer(many=True)
    available_rewards = LoyaltyRewardSerializer(many=True)
