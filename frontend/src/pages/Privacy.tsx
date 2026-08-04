import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="min-h-screen py-20 px-4 bg-[#FBF7EF]">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-14">
          <p className="eyebrow block mb-4">Tatlight · Confidentialité</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-[#0D1B2A] mb-5 leading-tight">
            Politique de <span className="text-[#C9A227] glow-gold">confidentialité</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600">Protection de vos données personnelles</p>
        </header>

        <div className="space-y-8">
          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Introduction</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Chez Tatlight, nous accordons une importance capitale à la protection de vos données personnelles.
              La présente politique vous informe de la manière dont nous collectons, utilisons et protégeons
              vos informations lorsque vous utilisez notre plateforme de vente de contenus digitaux.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Données collectées</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Nous collectons les données suivantes lors de votre inscription et de vos achats :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 leading-relaxed">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Informations de facturation</li>
              <li>Historique des commandes et téléchargements</li>
              <li>Données de navigation sur notre plateforme</li>
            </ul>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Utilisation des données</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 leading-relaxed">
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Traiter vos commandes et assurer la livraison des produits digitaux</li>
              <li>Vous envoyer des informations relatives à vos achats</li>
              <li>Améliorer notre plateforme et votre expérience utilisateur</li>
              <li>Vous informer des offres et nouveautés (avec votre consentement)</li>
            </ul>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Protection des données</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées
              pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.
              Vos informations de paiement sont traitées de manière sécurisée via Stripe, un leader mondial
              des paiements en ligne conforme aux normes PCI DSS.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Cookies</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Notre plateforme utilise des cookies essentiels au fonctionnement du site, notamment pour
              la gestion de votre session et de votre panier d'achat. Nous utilisons également des cookies
              analytiques pour comprendre comment vous interagissez avec notre site et l'améliorer.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Vos droits</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 leading-relaxed">
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit à l'effacement (droit à l'oubli)</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition au traitement</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Pour exercer vos droits, contactez-nous à : <strong className="text-[#0D1B2A]">contact@tatlight.com</strong>
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Contact</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Pour toute question relative à la présente politique de confidentialité, vous pouvez nous contacter
              par email à <strong className="text-[#0D1B2A]">contact@tatlight.com</strong>.
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
