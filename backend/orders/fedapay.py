import requests
from django.conf import settings

BASE_URLS = {
    'sandbox': 'https://sandbox-api.fedapay.com/v1',
    'live': 'https://api.fedapay.com/v1',
}


def _base_url():
    env = settings.FEDAPAY_ENVIRONMENT
    return BASE_URLS.get(env, BASE_URLS['sandbox'])


def _headers():
    return {
        'Authorization': f'Bearer {settings.FEDAPAY_API_KEY}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }


def _unwrap(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, dict) and 'klass' in value:
                return value
    return data


def create_transaction(amount_xof, description, callback_url, customer_email, customer_firstname='', customer_lastname='', mode='mtn_open'):
    payload = {
        'description': description,
        'amount': amount_xof,
        'currency': {'iso': 'XOF'},
        'callback_url': callback_url,
        'mode': mode,
        'customer': {
            'email': customer_email,
            'firstname': customer_firstname or customer_email.split('@')[0],
            'lastname': customer_lastname or '',
        },
    }
    resp = requests.post(
        f'{_base_url()}/transactions',
        json=payload,
        headers=_headers(),
        timeout=30,
    )
    status_code = resp.status_code
    data = _unwrap(resp.json())
    return status_code, data


def verify_transaction(transaction_id):
    resp = requests.get(
        f'{_base_url()}/transactions/{transaction_id}',
        headers=_headers(),
        timeout=15,
    )
    status_code = resp.status_code
    data = _unwrap(resp.json())
    return status_code, data
