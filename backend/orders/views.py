import hashlib
import hmac
import json

import stripe
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import status, generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView

from .models import Order, OrderItem, Coupon
from .serializers import (
    OrderListSerializer, OrderDetailSerializer, CreateOrderSerializer,
    CouponSerializer, CouponValidateSerializer
)
from products.models import Product
from accounts.models import User
from loyalty.models import LoyaltyTransaction

stripe.api_key = settings.STRIPE_SECRET_KEY


class OrderListView(generics.ListAPIView):
    serializer_class = OrderListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        data = serializer.validated_data
        items_data = data['items']

        total = 0
        order_items = []

        for item_data in items_data:
            product = item_data['product']
            quantity = item_data.get('quantity', 1)
            price = product.price
            subtotal = price * quantity
            total += subtotal
            order_items.append({
                'product': product,
                'product_title': product.title,
                'product_price': price,
                'quantity': quantity,
            })

        discount_amount = 0
        coupon = None
        coupon_code = data.get('coupon_code', '')
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code.upper())
                if coupon.is_valid and total >= coupon.min_purchase:
                    if coupon.discount_type == 'percent':
                        discount_amount = total * coupon.discount_percent / 100
                    else:
                        discount_amount = coupon.discount_amount
                    total -= discount_amount
                    if total < 0:
                        total = 0
            except Coupon.DoesNotExist:
                pass

        order = Order.objects.create(
            user=user,
            total_amount=total,
            payment_method=data.get('payment_method', 'stripe'),
            billing_name=data.get('billing_name', user.full_name),
            billing_email=data.get('billing_email', user.email),
            billing_address=data.get('billing_address', ''),
            coupon=coupon,
            discount_amount=discount_amount,
        )

        for item in order_items:
            OrderItem.objects.create(order=order, **item)
            product = item['product']
            product.sales_count += item['quantity']
            product.save(update_fields=['sales_count'])

        if coupon:
            coupon.used_count += 1
            coupon.save(update_fields=['used_count'])

        try:
            intent = stripe.PaymentIntent.create(
                amount=int(total * 100),
                currency='eur',
                metadata={
                    'order_id': str(order.id),
                    'order_number': order.order_number,
                },
            )
            order.stripe_payment_intent_id = intent.id
            order.save(update_fields=['stripe_payment_intent_id'])

            return Response({
                'order': OrderDetailSerializer(order).data,
                'client_secret': intent.client_secret,
                'stripe_public_key': settings.STRIPE_PUBLIC_KEY,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            order.status = 'cancelled'
            order.save(update_fields=['status'])
            return Response({
                'error': 'Erreur lors de l\'initialisation du paiement.',
            }, status=status.HTTP_400_BAD_REQUEST)


class ConfirmPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        payment_intent_id = request.data.get('payment_intent_id')
        if not payment_intent_id:
            return Response({'error': 'ID de paiement requis.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            if intent.status == 'succeeded':
                order = get_object_or_404(Order, stripe_payment_intent_id=payment_intent_id)
                order.status = 'completed'
                order.save(update_fields=['status'])

                user = order.user
                points = int(order.total_amount * 10)
                user.add_loyalty_points(points)

                from loyalty.models import LoyaltyTransaction
                LoyaltyTransaction.objects.create(
                    user=user,
                    points=points,
                    transaction_type='earned',
                    description=f'Points pour la commande {order.order_number}',
                    reference=order.order_number,
                )

                return Response({
                    'message': 'Paiement confirmé avec succès !',
                    'order': OrderDetailSerializer(order).data,
                })
            else:
                return Response({
                    'error': f'Paiement non confirmé. Statut: {intent.status}',
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'error': 'Erreur lors de la confirmation du paiement.',
            }, status=status.HTTP_400_BAD_REQUEST)


class GuestCheckoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email requis.'}, status=status.HTTP_400_BAD_REQUEST)

        items_data = request.data.get('items', [])
        if not items_data:
            return Response({'error': 'Au moins un article requis.'}, status=status.HTTP_400_BAD_REQUEST)

        total = 0
        order_items = []

        for item_data in items_data:
            product_id = item_data.get('product_id')
            product = get_object_or_404(Product, id=product_id, is_active=True)
            quantity = item_data.get('quantity', 1)
            price = product.price
            subtotal = price * quantity
            total += subtotal
            order_items.append({
                'product': product,
                'product_title': product.title,
                'product_price': price,
                'quantity': quantity,
            })

        order = Order.objects.create(
            total_amount=total,
            payment_method='stripe',
            billing_email=email,
        )

        for item in order_items:
            OrderItem.objects.create(order=order, **item)
            product = item['product']
            product.sales_count += item['quantity']
            product.save(update_fields=['sales_count'])

        try:
            intent = stripe.PaymentIntent.create(
                amount=int(total * 100),
                currency='eur',
                metadata={
                    'order_id': str(order.id),
                    'order_number': order.order_number,
                },
            )
            order.stripe_payment_intent_id = intent.id
            order.save(update_fields=['stripe_payment_intent_id'])

            return Response({
                'order': OrderDetailSerializer(order).data,
                'client_secret': intent.client_secret,
                'stripe_public_key': settings.STRIPE_PUBLIC_KEY,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            order.status = 'cancelled'
            order.save(update_fields=['status'])
            return Response({
                'error': 'Erreur lors de l\'initialisation du paiement.',
            }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    if not endpoint_secret:
        return Response({'error': 'Webhook secret non configuré.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        return Response({'error': 'Payload invalide.'}, status=status.HTTP_400_BAD_REQUEST)
    except stripe.error.SignatureVerificationError:
        return Response({'error': 'Signature invalide.'}, status=status.HTTP_400_BAD_REQUEST)

    if event['type'] == 'payment_intent.succeeded':
        intent = event['data']['object']
        payment_intent_id = intent['id']
        try:
            order = Order.objects.get(stripe_payment_intent_id=payment_intent_id)
            if order.status != 'completed':
                order.status = 'completed'
                order.save(update_fields=['status'])

                user = order.user
                if user:
                    points = int(order.total_amount * 10)
                    user.add_loyalty_points(points)
                    LoyaltyTransaction.objects.create(
                        user=user,
                        points=points,
                        transaction_type='earned',
                        description=f'Points pour la commande {order.order_number}',
                        reference=order.order_number,
                    )
        except Order.DoesNotExist:
            pass

    elif event['type'] == 'payment_intent.payment_failed':
        intent = event['data']['object']
        payment_intent_id = intent['id']
        try:
            order = Order.objects.get(stripe_payment_intent_id=payment_intent_id)
            order.status = 'cancelled'
            order.save(update_fields=['status'])
        except Order.DoesNotExist:
            pass

    return Response({'status': 'ok'})


class FlutterwaveInitializeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        from .flutterwave import initialize_payment

        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        data = serializer.validated_data
        items_data = data['items']

        total = 0
        order_items = []
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data.get('quantity', 1)
            subtotal = product.price * quantity
            total += subtotal
            order_items.append({
                'product': product,
                'product_title': product.title,
                'product_price': product.price,
                'quantity': quantity,
            })

        coupon = None
        discount_amount = 0
        coupon_code = data.get('coupon_code', '')
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code.upper())
                if coupon.is_valid and total >= coupon.min_purchase:
                    if coupon.discount_type == 'percent':
                        discount_amount = total * coupon.discount_percent / 100
                    else:
                        discount_amount = coupon.discount_amount
                    total -= discount_amount
                    if total < 0:
                        total = 0
            except Coupon.DoesNotExist:
                pass

        order = Order.objects.create(
            user=user,
            total_amount=total,
            payment_method='flutterwave',
            billing_name=data.get('billing_name', user.full_name),
            billing_email=data.get('billing_email', user.email),
            billing_address=data.get('billing_address', ''),
            coupon=coupon,
            discount_amount=discount_amount,
        )

        for item in order_items:
            OrderItem.objects.create(order=order, **item)
            product = item['product']
            product.sales_count += item['quantity']
            product.save(update_fields=['sales_count'])

        if coupon:
            coupon.used_count += 1
            coupon.save(update_fields=['used_count'])

        callback_url = f"{settings.FRONTEND_URL}/paiement/retour?order_id={order.id}"
        result = initialize_payment(order, callback_url)

        if result.get('status') == 'success':
            return Response({
                'order': OrderDetailSerializer(order).data,
                'payment_link': result['data']['link'],
                'tx_ref': result['data']['tx_ref'],
            }, status=status.HTTP_201_CREATED)
        else:
            order.status = 'cancelled'
            order.save(update_fields=['status'])
            return Response({
                'error': result.get('message', 'Erreur lors de l\'initialisation du paiement.'),
            }, status=status.HTTP_400_BAD_REQUEST)


class FlutterwaveVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from .flutterwave import verify_transaction

        tx_ref = request.data.get('tx_ref')
        transaction_id = request.data.get('transaction_id')

        if not tx_ref and not transaction_id:
            return Response({'error': 'Référence de transaction requise.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(order_number=tx_ref)
        except Order.DoesNotExist:
            return Response({'error': 'Commande introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if transaction_id:
            result = verify_transaction(transaction_id)
        else:
            return Response({'error': 'ID de transaction requis.'}, status=status.HTTP_400_BAD_REQUEST)

        if result.get('status') == 'success' and result['data'].get('status') == 'successful':
            if order.status != 'completed':
                order.status = 'completed'
                order.flutterwave_transaction_id = str(transaction_id)
                order.save(update_fields=['status', 'flutterwave_transaction_id'])

                user = order.user
                if user:
                    points = int(order.total_amount * 10)
                    user.add_loyalty_points(points)
                    from loyalty.models import LoyaltyTransaction
                    LoyaltyTransaction.objects.create(
                        user=user,
                        points=points,
                        transaction_type='earned',
                        description=f'Points pour la commande {order.order_number}',
                        reference=order.order_number,
                    )

            return Response({
                'message': 'Paiement confirmé avec succès !',
                'order': OrderDetailSerializer(order).data,
            })
        else:
            return Response({
                'error': 'Le paiement n\'a pas été confirmé.',
            }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def flutterwave_webhook(request):
    secret_hash = settings.FLUTTERWAVE_WEBHOOK_SECRET
    if secret_hash:
        signature = request.META.get('HTTP_VERIF_HASH', '')
        computed = hashlib.sha256(secret_hash.encode()).hexdigest()
        if signature != computed:
            return Response({'error': 'Signature invalide.'}, status=status.HTTP_400_BAD_REQUEST)

    payload = json.loads(request.body)
    event_type = payload.get('event')
    data = payload.get('data', {})

    if event_type == 'charge.completed' and data.get('status') == 'successful':
        tx_ref = data.get('tx_ref')
        transaction_id = data.get('id')
        try:
            order = Order.objects.get(order_number=tx_ref)
            if order.status != 'completed':
                order.status = 'completed'
                order.flutterwave_transaction_id = str(transaction_id)
                order.save(update_fields=['status', 'flutterwave_transaction_id'])

                user = order.user
                if user:
                    points = int(order.total_amount * 10)
                    user.add_loyalty_points(points)
                    from loyalty.models import LoyaltyTransaction
                    LoyaltyTransaction.objects.create(
                        user=user,
                        points=points,
                        transaction_type='earned',
                        description=f'Points pour la commande {order.order_number}',
                        reference=order.order_number,
                    )
        except Order.DoesNotExist:
            pass

    return Response({'status': 'ok'})


class CouponValidateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CouponValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data['code'].upper()
        total = serializer.validated_data['total']

        try:
            coupon = Coupon.objects.get(code=code)
            if not coupon.is_valid:
                return Response({
                    'valid': False,
                    'error': 'Ce code promo n\'est plus valide.'
                }, status=status.HTTP_400_BAD_REQUEST)

            if total < coupon.min_purchase:
                return Response({
                    'valid': False,
                    'error': f'Montant minimum d\'achat: {coupon.min_purchase}€.'
                }, status=status.HTTP_400_BAD_REQUEST)

            if coupon.discount_type == 'percent':
                discount = total * coupon.discount_percent / 100
            else:
                discount = coupon.discount_amount

            return Response({
                'valid': True,
                'coupon': CouponSerializer(coupon).data,
                'discount': discount,
                'total_after_discount': total - discount,
            })

        except Coupon.DoesNotExist:
            return Response({
                'valid': False,
                'error': 'Code promo invalide.'
            }, status=status.HTTP_404_NOT_FOUND)


class CouponListView(generics.ListCreateAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]


class CouponDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'pk'


class AdminOrderListView(generics.ListAPIView):
    queryset = Order.objects.all().prefetch_related('items')
    serializer_class = OrderListSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['order_number', 'billing_email', 'billing_name']
    ordering = ['-created_at']


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_purchases(request):
    orders = Order.objects.filter(
        user=request.user, status='completed'
    ).prefetch_related('items__product')

    purchases = []
    for order in orders:
        for item in order.items.all():
            if item.product:
                purchases.append({
                    'order_number': order.order_number,
                    'product_id': str(item.product.id),
                    'product_title': item.product_title,
                    'product_image': item.product.image.url if item.product.image else None,
                    'price': float(item.product_price),
                    'purchased_at': order.created_at,
                    'download_url': item.product.file.url if item.product.file and item.product.is_digital else None,
                })

    return Response({'purchases': purchases})


class FedaPayInitializeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from .fedapay import create_transaction

        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user if request.user.is_authenticated else None
        data = serializer.validated_data
        items_data = data['items']

        total = 0
        order_items = []
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data.get('quantity', 1)
            subtotal = product.price * quantity
            total += subtotal
            order_items.append({
                'product': product,
                'product_title': product.title,
                'product_price': product.price,
                'quantity': quantity,
            })

        coupon = None
        discount_amount = 0
        coupon_code = data.get('coupon_code', '')
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code.upper())
                if coupon.is_valid and total >= coupon.min_purchase:
                    if coupon.discount_type == 'percent':
                        discount_amount = total * coupon.discount_percent / 100
                    else:
                        discount_amount = coupon.discount_amount
                    total -= discount_amount
                    if total < 0:
                        total = 0
            except Coupon.DoesNotExist:
                pass

        billing_email = data.get('billing_email', '')
        if user and not billing_email:
            billing_email = user.email

        order = Order.objects.create(
            user=user,
            total_amount=total,
            payment_method='fedapay',
            billing_name=data.get('billing_name', user.full_name if user else ''),
            billing_email=billing_email,
            billing_address=data.get('billing_address', ''),
            coupon=coupon,
            discount_amount=discount_amount,
        )

        for item in order_items:
            OrderItem.objects.create(order=order, **item)
            product = item['product']
            product.sales_count += item['quantity']
            product.save(update_fields=['sales_count'])

        if coupon:
            coupon.used_count += 1
            coupon.save(update_fields=['used_count'])

        amount_xof = int(float(total) * 655.957)
        if amount_xof < 1:
            amount_xof = 1

        callback_url = f"{settings.FRONTEND_URL}/paiement/retour"
        status_code, result = create_transaction(
            amount_xof=amount_xof,
            description=f'Commande {order.order_number}',
            callback_url=callback_url,
            customer_email=billing_email,
            customer_firstname=user.full_name if user else '',
            customer_lastname='',
            mode='mtn_open',
        )

        if status_code in (200, 201) and result.get('payment_url'):
            transaction_id = result.get('id')
            order.fedapay_transaction_id = str(transaction_id) if transaction_id else ''
            order.save(update_fields=['fedapay_transaction_id'])

            return Response({
                'order': OrderDetailSerializer(order).data,
                'payment_url': result['payment_url'],
                'transaction_id': transaction_id,
            }, status=status.HTTP_201_CREATED)
        else:
            error_msg = result.get('message', str(result))

        order.status = 'cancelled'
        order.save(update_fields=['status'])
        return Response({
            'error': f"Erreur FedaPay : {error_msg}",
        }, status=status.HTTP_400_BAD_REQUEST)


class FedaPayVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from .fedapay import verify_transaction

        transaction_id = request.data.get('transaction_id')
        if not transaction_id:
            return Response({'error': 'ID de transaction requis.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(fedapay_transaction_id=str(transaction_id))
        except Order.DoesNotExist:
            return Response({'error': 'Commande introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        status_code, result = verify_transaction(transaction_id)
        if status_code in (200, 201) and result.get('status') == 'approved':
            if order.status != 'completed':
                order.status = 'completed'
                order.save(update_fields=['status'])

                user = order.user
                if user:
                    points = int(order.total_amount * 10)
                    user.add_loyalty_points(points)
                    from loyalty.models import LoyaltyTransaction
                    LoyaltyTransaction.objects.create(
                        user=user,
                        points=points,
                        transaction_type='earned',
                        description=f'Points pour la commande {order.order_number}',
                        reference=order.order_number,
                    )

            return Response({
                'message': 'Paiement confirmé avec succès !',
                'order': OrderDetailSerializer(order).data,
            })

        return Response({
            'error': 'Le paiement n\'a pas été confirmé.',
        }, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def fedapay_webhook(request):
    from .fedapay import verify_transaction

    payload = request.body
    signature = request.headers.get('X-FEDAPAY-SIGNATURE', '')

    webhook_secret = settings.FEDAPAY_WEBHOOK_SECRET
    if webhook_secret:
        import hmac
        expected = hmac.new(webhook_secret.encode(), payload, hashlib.sha256).hexdigest()
        if signature != expected:
            return Response({'error': 'Signature invalide.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        event = json.loads(payload)
    except json.JSONDecodeError:
        return Response({'error': 'Payload invalide.'}, status=status.HTTP_400_BAD_REQUEST)

    event_name = event.get('name', '')
    data = event.get('data', {})

    if event_name == 'transaction.approved':
        transaction_id = data.get('id')
        if transaction_id:
            _status_code, result = verify_transaction(transaction_id)
            if result.get('status') == 'approved':
                try:
                    order = Order.objects.get(fedapay_transaction_id=str(transaction_id))
                except Order.DoesNotExist:
                    return Response({'error': 'Commande introuvable.'}, status=status.HTTP_404_NOT_FOUND)

                if order.status != 'completed':
                    order.status = 'completed'
                    order.save(update_fields=['status'])

                    user = order.user
                    if user:
                        points = int(order.total_amount * 10)
                        user.add_loyalty_points(points)
                        from loyalty.models import LoyaltyTransaction
                        LoyaltyTransaction.objects.create(
                            user=user,
                            points=points,
                            transaction_type='earned',
                            description=f'Points pour la commande {order.order_number}',
                            reference=order.order_number,
                        )

    return Response({'received': True})
