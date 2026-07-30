#!/bin/bash

# Script d'initialisation rapide pour Tatlight Backend
# Ce script configure automatiquement l'environnement de développement

echo "🚀 INITIALISATION DE TATLIGHT BACKEND"
echo "======================================"
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_step() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# 1. Vérifier Python
echo "1️⃣  Vérification de Python..."
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi
print_step "Python $(python3 --version) détecté"
echo ""

# 2. Créer l'environnement virtuel
echo "2️⃣  Création de l'environnement virtuel..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    print_step "Environnement virtuel créé"
else
    print_warning "Environnement virtuel existe déjà"
fi
echo ""

# 3. Activer l'environnement virtuel
echo "3️⃣  Activation de l'environnement virtuel..."
source venv/bin/activate || {
    print_error "Impossible d'activer l'environnement virtuel"
    exit 1
}
print_step "Environnement virtuel activé"
echo ""

# 4. Installer les dépendances
echo "4️⃣  Installation des dépendances..."
pip install --upgrade pip
pip install -r requirements.txt
print_step "Dépendances installées"
echo ""

# 5. Créer le fichier .env s'il n'existe pas
echo "5️⃣  Configuration de l'environnement..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_step "Fichier .env créé"
    print_warning "⚠️  N'oubliez pas de configurer votre .env avec vos paramètres!"
else
    print_warning "Fichier .env existe déjà"
fi
echo ""

# 6. Créer le dossier media
echo "6️⃣  Création des dossiers nécessaires..."
mkdir -p media/avatars
mkdir -p staticfiles
print_step "Dossiers créés"
echo ""

# 7. Vérifier PostgreSQL
echo "7️⃣  Vérification de PostgreSQL..."
if command -v psql &> /dev/null; then
    print_step "PostgreSQL détecté"
    echo ""
    read -p "Voulez-vous créer la base de données maintenant? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Nom de la base de données [tatlight_db]: " DB_NAME
        DB_NAME=${DB_NAME:-tatlight_db}
        
        psql -U postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null && {
            print_step "Base de données $DB_NAME créée"
        } || {
            print_warning "La base de données existe peut-être déjà"
        }
    fi
else
    print_warning "PostgreSQL non détecté. Installez-le ou utilisez SQLite pour le développement."
fi
echo ""

# 8. Effectuer les migrations
echo "8️⃣  Application des migrations..."
python manage.py makemigrations
python manage.py migrate
print_step "Migrations appliquées"
echo ""

# 9. Créer un superutilisateur
echo "9️⃣  Création du superutilisateur..."
read -p "Voulez-vous créer un superutilisateur maintenant? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python manage.py createsuperuser
    print_step "Superutilisateur créé"
fi
echo ""

# 10. Tester l'API
echo "🔟  Test de l'API..."
echo ""
echo "Lancement du serveur de test..."
python manage.py runserver 0.0.0.0:8000 &
SERVER_PID=$!
sleep 3

echo "Test de l'API..."
python test_api.py

# Arrêter le serveur de test
kill $SERVER_PID 2>/dev/null

echo ""
echo "======================================"
echo -e "${GREEN}✅ INSTALLATION TERMINÉE !${NC}"
echo "======================================"
echo ""
echo "Pour démarrer le serveur:"
echo "  python manage.py runserver"
echo ""
echo "Documentation API:"
echo "  http://127.0.0.1:8000/api/docs/"
echo ""
echo "Admin Django:"
echo "  http://127.0.0.1:8000/admin/"
echo ""
echo "Test de l'API:"
echo "  python test_api.py"
echo ""