import { Link } from 'react-router-dom'

export default function Security() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#2d5a52' }}>
            Sécurité
          </h1>
          <p className="text-xl text-gray-900">Votre sécurité est notre priorité</p>
        </div>

        <div className="space-y-12">
          <section className="bg-white rounded-2xl p-8 border border-[#D4AF37]/20 shadow">
            <h2 className="text-3xl font-bold mb-4 text-[#2d5a52]">Paiements sécurisés</h2>
            <p className="text-gray-700 leading-relaxed">
              Tous les paiements effectués sur Tatlight sont traités via <strong>Stripe</strong>,
              l'une des plateformes de paiement les plus sécurisées au monde. Stripe est certifié
              <strong> PCI DSS niveau 1</strong>, le plus haut niveau de certification en matière de
              sécurité des paiements. Vos informations bancaires ne sont jamais stockées sur nos serveurs.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-[#D4AF37]/20 shadow">
            <h2 className="text-3xl font-bold mb-4 text-[#2d5a52]">Chiffrement des données</h2>
            <p className="text-gray-700 leading-relaxed">
              Notre plateforme utilise le protocole <strong>HTTPS</strong> avec chiffrement SSL/TLS
              de bout en bout. Toutes les données échangées entre votre navigateur et nos serveurs
              sont cryptées, garantissant que vos informations personnelles restent confidentielles
              pendant la transmission.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-[#D4AF37]/20 shadow">
            <h2 className="text-3xl font-bold mb-4 text-[#2d5a52]">Protection des comptes</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous mettons en place plusieurs mesures pour protéger votre compte :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Authentification sécurisée par jetons JWT</li>
              <li>Protection contre les attaques par force brute</li>
              <li>Session sécurisée avec expiration automatique</li>
              <li>Validation des emails pour les inscriptions</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-[#D4AF37]/20 shadow">
            <h2 className="text-3xl font-bold mb-4 text-[#2d5a52]">Sécurité des fichiers</h2>
            <p className="text-gray-700 leading-relaxed">
              Les fichiers que vous téléchargez depuis Tatlight sont hébergés sur des serveurs sécurisés
              avec un accès restreint. Chaque fichier est associé à votre compte et ne peut être téléchargé
              que par vous après authentification. Nous surveillons en permanence les accès non autorisés.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-[#D4AF37]/20 shadow">
            <h2 className="text-3xl font-bold mb-4 text-[#2d5a52]">Bonnes pratiques recommandées</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Pour renforcer votre sécurité, nous vous recommandons de :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Utiliser un mot de passe unique et complexe pour votre compte</li>
              <li>Ne pas partager vos identifiants de connexion</li>
              <li>Vous déconnecter après chaque session sur un appareil partagé</li>
              <li>Maintenir votre navigateur et système d'exploitation à jour</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-[#D4AF37]/20 shadow">
            <h2 className="text-3xl font-bold mb-4 text-[#2d5a52]">Signalement d'un problème</h2>
            <p className="text-gray-700 leading-relaxed">
              Si vous découvrez une vulnérabilité de sécurité ou suspectez une activité frauduleuse
              sur votre compte, veuillez nous contacter immédiatement à :
              <strong> contact@tatlight.com</strong>. Nous traitons chaque signalement avec la plus
              grande urgence.
            </p>
          </section>

          <div className="text-center">
            <Link to="/" className="text-[#D4AF37] hover:underline font-semibold">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
