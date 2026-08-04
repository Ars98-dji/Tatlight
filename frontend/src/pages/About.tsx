import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen py-20 px-4 bg-[#FBF7EF]">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-14">
          <p className="eyebrow block mb-4">Tatlight · À propos</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-[#0D1B2A] mb-5 leading-tight">
            À propos de <span className="text-[#C9A227] glow-gold">Tatlight</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600">Illuminez votre chemin vers l'excellence</p>
        </header>

        <div className="space-y-8">
          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Notre Mission</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Tatlight est né d'une vision : démocratiser l'accès aux contenus digitaux de qualité premium. 
              Nous croyons que chaque personne mérite d'avoir accès aux outils et connaissances nécessaires 
              pour élever son potentiel créatif et professionnel.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Nos Valeurs</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#C9A227] to-[#A07C12] rounded-full flex items-center justify-center glow-gold">
                  <svg className="w-8 h-8 text-[#0D1B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-gray-900 font-bold mb-2">Qualité</h3>
                <p className="text-sm text-gray-500">Contenus vérifiés et premium</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#C9A227] to-[#A07C12] rounded-full flex items-center justify-center glow-gold">
                  <svg className="w-8 h-8 text-[#0D1B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-display text-gray-900 font-bold mb-2">Innovation</h3>
                <p className="text-sm text-gray-500">Toujours à la pointe</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#C9A227] to-[#A07C12] rounded-full flex items-center justify-center glow-gold">
                  <svg className="w-8 h-8 text-[#0D1B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-gray-900 font-bold mb-2">Communauté</h3>
                <p className="text-sm text-gray-500">Ensemble vers le succès</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Notre Histoire</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Née à Cotonou, au Bénin, Tatlight est la réponse à une conviction simple : les talents qui
              nous entourent méritent mieux que des contenus génériques. Chaque ebook, template ou formation
              est sélectionné et vérifié à la main pour offrir un niveau d'exigence que l'on trouve rarement ailleurs.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Depuis notre lancement, nous accompagnons des créateurs, des entrepreneurs et des apprenants dans
              leur montée en compétence — avec la même exigence de qualité à chaque étape de leur parcours.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Pourquoi nous choisir</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Nous pensons qu'un achat en ligne doit être simple, sûr et immédiat. C'est pourquoi :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 leading-relaxed">
              <li>Téléchargement immédiat après paiement, 24h/24 et 7j/7</li>
              <li>Paiements 100% sécurisés via Stripe, Flutterwave et FedaPay</li>
              <li>Contenus vérifiés et soigneusement sélectionnés avant publication</li>
              <li>Vos fichiers accessibles à vie depuis votre espace membre</li>
              <li>Support réactif par email et WhatsApp</li>
            </ul>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Nos Engagements</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 leading-relaxed">
              <li><strong className="text-[#0D1B2A]">Qualité premium</strong> : chaque contenu passe une vérification stricte avant publication</li>
              <li><strong className="text-[#0D1B2A]">Transparence</strong> : des prix clairs, sans frais cachés</li>
              <li><strong className="text-[#0D1B2A]">Communauté</strong> : une équipe à l'écoute, engagée à vos côtés</li>
              <li><strong className="text-[#0D1B2A]">Accessibilité</strong> : des contenus digitaux pensés pour tous les budgets et tous les niveaux</li>
            </ul>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#C9A227]/20 glow-gold-subtle">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-3">Contactez-nous</h2>
            <div className="w-12 h-[3px] bg-[#C9A227] rounded-full mb-6"></div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#C9A227] to-[#A07C12] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#0D1B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">Email</p>
                  <p className="text-gray-500">contact@tatlight.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#C9A227] to-[#A07C12] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#0D1B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">Adresse</p>
                  <p className="text-gray-500">Cotonou, Bénin</p>
                </div>
              </div>
            </div>
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
