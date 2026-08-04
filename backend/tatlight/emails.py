# tatlight/emails.py
"""
Module central d'envoi d'emails transactionnels.

Toutes les fonctions utilisent DjangoTemplates pour générer le contenu HTML
puis django.core.mail pour expédier le message via le backend configuré
(console en dev, SMTP en production).
"""
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator


def _send_html_email(subject, template_name, context, to_email, reply_to=None):
    """Expédie un email HTML + texte brut à partir d'un template Django."""
    html_body = render_to_string(template_name, context)

    # Fallback texte brut : on retire <style>/<script>/<head>, les balises,
    # puis on compacte les lignes vides multiples.
    import re
    text_body = re.sub(r'<(style|script|head)[^>]*>.*?</\1>', '', html_body, flags=re.DOTALL)
    text_body = re.sub(r'<[^>]+>', '', text_body)
    text_body = re.sub(r'\n\s*\n\s*\n+', '\n\n', text_body)
    text_body = text_body.strip()

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
        reply_to=reply_to or [settings.DEFAULT_FROM_EMAIL],
    )
    email.attach_alternative(html_body, 'text/html')
    email.send(fail_silently=not settings.DEBUG)


def send_welcome_email(user):
    """Email de bienvenue à l'inscription."""
    context = {
        'user': user,
        'frontend_url': settings.FRONTEND_URL.rstrip('/'),
    }
    _send_html_email(
        subject='Bienvenue sur Tatlight ✨',
        template_name='emails/welcome.html',
        context=context,
        to_email=user.email,
    )


def send_verification_email(user):
    """Email de vérification d'adresse (lien valable 24h)."""
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    verify_link = f"{settings.FRONTEND_URL.rstrip('/')}/verify-email/{uid}/{token}/"

    context = {
        'user': user,
        'verify_link': verify_link,
    }
    _send_html_email(
        subject='Vérifiez votre adresse email - Tatlight',
        template_name='emails/verification.html',
        context=context,
        to_email=user.email,
    )


def send_password_reset_email(user):
    """Email de réinitialisation de mot de passe."""
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    reset_link = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password/{uid}/{token}"

    context = {
        'user': user,
        'reset_link': reset_link,
    }
    _send_html_email(
        subject='Réinitialisation de votre mot de passe Tatlight',
        template_name='emails/password_reset.html',
        context=context,
        to_email=user.email,
    )


def send_order_confirmation_email(order):
    """Email de confirmation après paiement réussi.

    Le destinataire est l'email de facturation de la commande
    (renseigné au checkout) ou, à défaut, celui de l'utilisateur.
    """
    recipient = order.billing_email or (order.user.email if order.user else None)
    if not recipient:
        return

    items = order.items.all()
    context = {
        'order': order,
        'items': items,
        'frontend_url': settings.FRONTEND_URL.rstrip('/'),
    }
    _send_html_email(
        subject=f'Confirmation de votre commande {order.order_number} - Tatlight',
        template_name='emails/order_confirmation.html',
        context=context,
        to_email=recipient,
    )
