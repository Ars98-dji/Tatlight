import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#2d5a52' }}>
            Politique de confidentialité
          </h1>
          <p className="text-xl text-gray-900">Protection de vos données personnelles</p>
        </div>

        <div className="space-y-12">
          <section className="bg-white rounded-2xl p-8 border border-[#D4AF37]/20 shadow">
            <h2 className="text-3xl font-bold mb-4 text-[#2d5a52]">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Chez Tatlight, nous accordons une importance capitale à la protection de vos données personnelles.
              La présente politique vous informe de la manière dont nous collectons, utilisons et protégeons
              vos informations lorsque vous utilisez notre plateforme de vente de contenus digitaux.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-[#D4AF37]/20 shadow">
            <h2 className="text-3xl font-bold mb-4 text-[#2d5a52]">Données collectées</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous collectons les données suivantes lors de votre inscription et de vos achats :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Informations de facturation</li>
              <li>Historique des commandes et téléchargements</li>
              <li>Données de navigation sur notre plateforme</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-[#D4AF37]/20 shadow">
            <h2 className="text-3xl font-bold mb-4 text-[#2d5a52]">Utilisation des données</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Traiter vos commandes et assurer la livraison des produits digitaux</li>
              <li>Vous envoyer des informations relatives à vos achats</li>
              <li>Améliorer notre plateforme et votre expérience utilisateur</li>
              <li>Vous informer des offres et nouveautés (avec votre consentement)</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-[#D4AF37]/20 shadow">
            <h2 className="text-3xl font-bold mb-4 text-[#2d5a52]">Protection des données</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées
              pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.
              Vos informations de paiement sont traitées de manière sécurisée via Stripe, un leader mondial
              des paiements en ligne conforme aux normes PCI DSS.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-[#D4AF37]/20 shadow">
            <h2 className="text-3xl font-bold mb-4 text-[#2d5a52]">Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Notre plateforme utilise des cookies essentiels au fonctionnement du site, notamment pour
              la gestion de votre session et de votre panier d'achat. Nous utilisons également des cookies
              analytiques pour comprendre comment vous interagissez avec notre site et l'améliorer.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-[#D4AF37]/20 shadow">
            <h2 className="text-3xl font-bold mb-4 text-[#2d5a52]">Vos droits</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit à l'effacement (droit à l'oubli)</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition au traitement</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Pour exercer vos droits, contactez-nous à : <strong>contact@tatlight.com</strong>
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-[#D4AF37]/20 shadow">
            <h2 className="text-3xl font-bold mb-4 text-[#2d5a52]">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question relative à la présente politique de confidentialité, vous pouvez nous contacter
              par email à <strong>contact@tatlight.com</strong>.
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
