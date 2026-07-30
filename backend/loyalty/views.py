from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum

from .models import LoyaltyTransaction, LoyaltyReward, LoyaltyRedemption
from .serializers import (
    LoyaltyTransactionSerializer, LoyaltyRewardSerializer,
    LoyaltyRedemptionSerializer, LoyaltyRedeemSerializer,
    LoyaltySummarySerializer
)
from accounts.models import User


class LoyaltyTransactionListView(generics.ListAPIView):
    serializer_class = LoyaltyTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LoyaltyTransaction.objects.filter(user=self.request.user)


class LoyaltyRewardListView(generics.ListAPIView):
    queryset = LoyaltyReward.objects.filter(is_active=True)
    serializer_class = LoyaltyRewardSerializer
    permission_classes = [permissions.AllowAny]


class LoyaltyRedemptionListView(generics.ListAPIView):
    serializer_class = LoyaltyRedemptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LoyaltyRedemption.objects.filter(user=self.request.user).select_related('reward')


class RedeemRewardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LoyaltyRedeemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        reward_id = serializer.validated_data['reward_id']

        try:
            reward = LoyaltyReward.objects.get(id=reward_id, is_active=True)
        except LoyaltyReward.DoesNotExist:
            return Response({
                'error': 'Récompense introuvable.'
            }, status=status.HTTP_404_NOT_FOUND)

        if user.loyalty_points < reward.points_required:
            return Response({
                'error': f'Points insuffisants. Vous avez {user.loyalty_points} pts, besoin de {reward.points_required} pts.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if reward.stock > 0:
            redeemed_count = LoyaltyRedemption.objects.filter(reward=reward).count()
            if redeemed_count >= reward.stock:
                return Response({
                    'error': 'Cette récompense n\'est plus en stock.'
                }, status=status.HTTP_400_BAD_REQUEST)

        user.add_loyalty_points(-reward.points_required)

        redemption = LoyaltyRedemption.objects.create(
            user=user,
            reward=reward,
            points_spent=reward.points_required,
        )

        LoyaltyTransaction.objects.create(
            user=user,
            points=reward.points_required,
            transaction_type='redeemed',
            description=f'Échange: {reward.name}',
            reference=str(reward.id),
        )

        return Response({
            'message': f'Félicitations ! Vous avez échangé {reward.name}.',
            'redemption': LoyaltyRedemptionSerializer(redemption).data,
            'remaining_points': user.loyalty_points,
        }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def loyalty_summary(request):
    user = request.user

    earned = LoyaltyTransaction.objects.filter(
        user=user, transaction_type='earned'
    ).aggregate(total=Sum('points'))['total'] or 0

    redeemed = LoyaltyTransaction.objects.filter(
        user=user, transaction_type='redeemed'
    ).aggregate(total=Sum('points'))['total'] or 0

    tier_points_map = {'bronze': 200, 'silver': 500, 'gold': 1000, 'platinum': 0}
    next_tier_map = {'bronze': 'silver', 'silver': 'gold', 'gold': 'platinum', 'platinum': 'platinum'}
    next_tier = next_tier_map.get(user.loyalty_tier, 'platinum')
    points_for_next = tier_points_map.get(user.loyalty_tier, 0)
    progress = 0
    if points_for_next > 0:
        progress = min(100, int((user.loyalty_points / points_for_next) * 100))
    else:
        if user.loyalty_tier == 'platinum':
            progress = 100

    recent = LoyaltyTransaction.objects.filter(user=user)[:10]
    rewards = LoyaltyReward.objects.filter(is_active=True)

    data = {
        'total_points': user.loyalty_points,
        'lifetime_earned': earned,
        'lifetime_redeemed': redeemed,
        'tier': user.loyalty_tier,
        'next_tier': next_tier if user.loyalty_tier != 'platinum' else None,
        'progress_to_next_tier': progress,
        'recent_transactions': LoyaltyTransactionSerializer(recent, many=True).data,
        'available_rewards': LoyaltyRewardSerializer(rewards, many=True).data,
    }

    return Response(data)
