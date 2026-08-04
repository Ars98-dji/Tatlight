import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="min-h-screen py-20 px-4 bg-[#FBF7EF]">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-14">
          <p className="eyebrow block mb-4">Tatlight · Conditions</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-[#0D1B2A] mb-5 leading-tight">
            Termes et <span className="text-[#C9A227] glow-gold">conditions</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600">Conditions générales d'utilisation et de vente</p>
        </header>

        <div className="space-y-8">
          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Acceptation des conditions</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              En accédant et en utilisant la plateforme Tatlight, vous acceptez d'être lié par les présentes
              conditions générales. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Description du service</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Tatlight est une plateforme de vente de contenus digitaux incluant des ebooks, templates,
              formations et autres ressources numériques. Les produits sont fournis sous forme de
              téléchargements accessibles immédiatement après l'achat.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Inscription et compte</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Pour effectuer un achat, vous devez créer un compte. Vous êtes responsable de :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 leading-relaxed">
              <li>La confidentialité de vos identifiants de connexion</li>
              <li>Toutes les activités effectuées depuis votre compte</li>
              <li>L'exactitude des informations fournies lors de l'inscription</li>
            </ul>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Achats et paiements</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Les transactions sur Tatlight sont sécurisées et traitées par Stripe. En effectuant un achat,
              vous acceptez les conditions suivantes :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 leading-relaxed">
              <li>Les prix sont affichés en euros (€) toutes taxes comprises</li>
              <li>Le paiement est exigible immédiatement au moment de l'achat</li>
              <li>L'accès au produit digital est accordé après confirmation du paiement</li>
              <li>Les codes promo et réductions sont soumis aux conditions spécifiques de chaque offre</li>
            </ul>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Livraison des produits digitaux</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Après validation de votre paiement, vous recevez un accès immédiat au téléchargement de votre
              produit dans votre espace utilisateur. Un email de confirmation vous est également envoyé
              avec les détails de votre commande. En cas de problème de téléchargement, notre service client
              est disponible pour vous assister.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Droit de rétractation et remboursements</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Conformément à la législation en vigueur concernant les biens numériques, le droit de
              rétractation ne s'applique pas aux produits téléchargés dès lors que le téléchargement
              a été effectué. Chaque demande de remboursement est étudiée au cas par cas par notre
              équipe support.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Propriété intellectuelle</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Tous les contenus vendus sur Tatlight sont protégés par le droit d'auteur. L'achat d'un
              produit vous accorde une licence d'utilisation personnelle et non transférable. Il est
              interdit de revendre, distribuer ou partager les fichiers téléchargés sans autorisation
              explicite.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Limitation de responsabilité</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Tatlight s'efforce de fournir des produits de qualité, mais ne peut garantir que les
              contenus répondent à toutes les attentes spécifiques. Notre responsabilité est limitée
              au montant de l'achat effectué.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Modification des conditions</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Nous nous réservons le droit de modifier les présentes conditions à tout moment. Les
              modifications prennent effet dès leur publication sur la plateforme. Il vous incombe
              de consulter régulièrement les conditions.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Contact</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Pour toute question relative aux conditions générales, contactez-nous à :
              <strong className="text-[#0D1B2A]"> contact@tatlight.com</strong>
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
