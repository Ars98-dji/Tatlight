#!/usr/bin/env python
"""
Script de test pour vérifier que l'API Tatlight fonctionne correctement
"""
import requests
import json

API_BASE_URL = "http://127.0.0.1:8000/api"

def test_health_check():
    """Tester le health check"""
    print("🔍 Test du health check...")
    try:
        response = requests.get(f"{API_BASE_URL}/health/")
        print(f"✅ Status: {response.status_code}")
        print(f"📋 Réponse: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_api_root():
    """Tester la route racine de l'API"""
    print("\n🔍 Test de la route racine API...")
    try:
        response = requests.get(f"{API_BASE_URL}/")
        print(f"✅ Status: {response.status_code}")
        print(f"📋 Réponse: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_register():
    """Tester l'inscription d'un utilisateur"""
    print("\n🔍 Test de l'inscription...")
    test_user = {
        "email": "test@tatlight.com",
        "password": "TestPassword123!",
        "password_confirm": "TestPassword123!",
        "first_name": "Test",
        "last_name": "User"
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/auth/register/", json=test_user)
        print(f"✅ Status: {response.status_code}")
        if response.status_code == 201:
            print(f"📋 Utilisateur créé avec succès!")
            data = response.json()
            print(f"🔑 Access Token: {data['tokens']['access'][:50]}...")
            return True, data
        else:
            print(f"📋 Réponse: {response.json()}")
            return False, None
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False, None

def test_login():
    """Tester la connexion"""
    print("\n🔍 Test de la connexion...")
    credentials = {
        "email": "test@tatlight.com",
        "password": "TestPassword123!"
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/auth/login/", json=credentials)
        print(f"✅ Status: {response.status_code}")
        if response.status_code == 200:
            print(f"📋 Connexion réussie!")
            data = response.json()
            print(f"🔑 Access Token: {data['tokens']['access'][:50]}...")
            return True, data
        else:
            print(f"📋 Réponse: {response.json()}")
            return False, None
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False, None

def test_profile(access_token):
    """Tester la récupération du profil"""
    print("\n🔍 Test de récupération du profil...")
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    try:
        response = requests.get(f"{API_BASE_URL}/auth/profile/", headers=headers)
        print(f"✅ Status: {response.status_code}")
        if response.status_code == 200:
            print(f"📋 Profil récupéré avec succès!")
            data = response.json()
            print(f"👤 Email: {data['email']}")
            print(f"👤 Nom: {data['full_name']}")
            print(f"🎁 Points de fidélité: {data['loyalty_points']}")
            return True
        else:
            print(f"📋 Réponse: {response.json()}")
            return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    """Fonction principale"""
    print("=" * 60)
    print("🚀 TESTS DE L'API TATLIGHT")
    print("=" * 60)
    
    # Test 1: Health Check
    if not test_health_check():
        print("\n❌ Le serveur ne répond pas. Assurez-vous que Django est lancé.")
        return
    
    # Test 2: API Root
    test_api_root()
    
    # Test 3: Inscription
    success, register_data = test_register()
    if success:
        access_token = register_data['tokens']['access']
        # Test 4: Profil
        test_profile(access_token)
    else:
        # Si l'inscription échoue (utilisateur existe déjà), essayer de se connecter
        success, login_data = test_login()
        if success:
            access_token = login_data['tokens']['access']
            # Test 4: Profil
            test_profile(access_token)
    
    print("\n" + "=" * 60)
    print("✅ TOUS LES TESTS SONT TERMINÉS")
    print("=" * 60)

if __name__ == "__main__":
    main()