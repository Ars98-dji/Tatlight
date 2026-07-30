import requests
import json
from django.conf import settings

BASE_URL = 'https://api.flutterwave.com/v3'


def _headers():
    return {
        'Authorization': f'Bearer {settings.FLUTTERWAVE_SECRET_KEY}',
        'Content-Type': 'application/json',
    }


def initialize_payment(order, callback_url):
    payload = {
        'tx_ref': order.order_number,
        'amount': str(order.total_amount),
        'currency': 'EUR',
        'redirect_url': callback_url,
        'customer': {
            'email': order.billing_email or 'client@tatlight.com',
            'name': order.billing_name or 'Client',
        },
        'customization': {
            'title': 'Tatlight',
            'description': f'Commande {order.order_number}',
        },
        'meta': {
            'order_id': str(order.id),
            'order_number': order.order_number,
        },
    }

    if order.payment_method == 'flutterwave':
        payload['payment_options'] = 'mobilemoney'

    resp = requests.post(
        f'{BASE_URL}/payments',
        json=payload,
        headers=_headers(),
        timeout=30,
    )
    return resp.json()


def verify_transaction(transaction_id):
    resp = requests.get(
        f'{BASE_URL}/transactions/{transaction_id}/verify',
        headers=_headers(),
        timeout=15,
    )
    return resp.json()
