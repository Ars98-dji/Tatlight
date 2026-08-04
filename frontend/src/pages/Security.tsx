import { Link } from 'react-router-dom'

export default function Security() {
  return (
    <div className="min-h-screen py-20 px-4 bg-[#FBF7EF]">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-14">
          <p className="eyebrow block mb-4">Tatlight · Sécurité</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-[#0D1B2A] mb-5 leading-tight">
            Votre <span className="text-[#C9A227] glow-gold">sécurité</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600">Votre sécurité est notre priorité</p>
        </header>

        <div className="space-y-8">
          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Paiements sécurisés</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Tous les paiements effectués sur Tatlight sont traités via <strong className="text-[#0D1B2A]">Stripe</strong>,
              l'une des plateformes de paiement les plus sécurisées au monde. Stripe est certifié
              <strong className="text-[#0D1B2A]"> PCI DSS niveau 1</strong>, le plus haut niveau de certification en matière de
              sécurité des paiements. Vos informations bancaires ne sont jamais stockées sur nos serveurs.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Chiffrement des données</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Notre plateforme utilise le protocole <strong className="text-[#0D1B2A]">HTTPS</strong> avec chiffrement SSL/TLS
              de bout en bout. Toutes les données échangées entre votre navigateur et nos serveurs
              sont cryptées, garantissant que vos informations personnelles restent confidentielles
              pendant la transmission.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Protection des comptes</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Nous mettons en place plusieurs mesures pour protéger votre compte :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 leading-relaxed">
              <li>Authentification sécurisée par jetons JWT</li>
              <li>Protection contre les attaques par force brute</li>
              <li>Session sécurisée avec expiration automatique</li>
              <li>Validation des emails pour les inscriptions</li>
            </ul>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Sécurité des fichiers</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Les fichiers que vous téléchargez depuis Tatlight sont hébergés sur des serveurs sécurisés
              avec un accès restreint. Chaque fichier est associé à votre compte et ne peut être téléchargé
              que par vous après authentification. Nous surveillons en permanence les accès non autorisés.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Bonnes pratiques recommandées</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Pour renforcer votre sécurité, nous vous recommandons de :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 leading-relaxed">
              <li>Utiliser un mot de passe unique et complexe pour votre compte</li>
              <li>Ne pas partager vos identifiants de connexion</li>
              <li>Vous déconnecter après chaque session sur un appareil partagé</li>
              <li>Maintenir votre navigateur et système d'exploitation à jour</li>
            </ul>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Signalement d'un problème</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Si vous découvrez une vulnérabilité de sécurité ou suspectez une activité frauduleuse
              sur votre compte, veuillez nous contacter immédiatement à :
              <strong className="text-[#0D1B2A]"> contact@tatlight.com</strong>. Nous traitons chaque signalement avec la plus
              grande urgence.
            </p>
          </section>

          <div className="text-center pt-4">
            <Link to="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
