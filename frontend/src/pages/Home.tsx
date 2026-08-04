import React, { useState, useEffect, useRef } from "react"
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {BookOpen, Layout, GraduationCap, Star, TrendingUp, Sparkles, ArrowRight, Users, ChevronRight, Mail, ChevronDown, ShieldCheck, Zap, Headphones} from 'lucide-react'
import { productService } from '../services/api'

interface Product { id: string; type: string; title: string; slug: string; short_description: string; price: string; compare_price?: string; image?: string; category_name: string; category_slug: string; sales_count: number; rating: string; rating_count: number; is_featured: boolean; }

const iconMap: Record<string, any> = { ebook: BookOpen, template: Layout, formation: GraduationCap }

const categoryImages: Record<string, string> = {
  ebooks: '/images/ebooks.jpg',
  templates: '/images/templates.jpg',
  formations: '/images/formations.jpg',
}

const faqItems = [
  { q: 'Comment reçois-je mon contenu après l\'achat ?', a: 'Dès que votre paiement est confirmé, le contenu est immédiatement disponible au téléchargement dans votre espace personnel, section "Mes achats". Aucune attente !' },
  { q: 'Quels moyens de paiement acceptez-vous ?', a: 'Nous acceptons le paiement mobile Money (MTN, Moov), les cartes bancaires Visa/Mastercard ainsi que FedaPay. Toutes les transactions sont sécurisées.' },
  { q: 'Les contenus sont-ils accessibles à vie ?', a: 'Oui. Une fois achetés, vos ebooks, templates et formations vous appartiennent et restent accessibles à vie, y compris les mises à jour futures.' },
  { q: 'Puis-je être remboursé si le contenu ne me convient pas ?', a: 'Chaque contenu est décrit en détail avant l\'achat. Si un problème survient, notre support est disponible 24h/24 pour vous accompagner.' },
  { q: 'Comment fonctionne le programme de fidélité ?', a: 'Chaque achat vous fait gagner des points échangeables contre des réductions et des contenus exclusifs. Consultez votre tableau de bord pour suivre vos points.' },
]

function CountUp({ end, suffix, duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current?.closest('section') || ref.current?.closest('[data-animate]')
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true
        const start = performance.now()
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * end))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const heroPhrases = [
  { line: "Illuminez Votre Parcours", highlight: "avec des Contenus d'Exception" },
  { line: "Élevez Votre Potentiel", highlight: "avec des Ressources Premium" },
  { line: "Transformez Votre Vision", highlight: "avec des Créations Uniques" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [products, setProducts] = useState<{ newest: Product[]; bestsellers: Product[] }>({ newest: [], bestsellers: [] })
  const [productTab, setProductTab] = useState<'newest' | 'bestsellers'>('newest')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    Promise.all([
      productService.getFeaturedProducts(),
      productService.getProducts({ ordering: '-created_at' }),
      productService.getProducts({ ordering: '-sales_count' }),
      productService.getProductsByType('ebook'),
      productService.getProductsByType('template'),
      productService.getProductsByType('formation'),
    ]).then(([prods, newest, bestsellers, ebookRes, templateRes, formationRes]) => {
      const toList = (data: any) => Array.isArray(data) ? data : data?.results || []
      const countOf = (data: any) => (data && typeof data === 'object' && 'count' in data) ? data.count : toList(data).length
      setFeaturedProducts(toList(prods))
      setProducts({
        newest: toList(newest).slice(0, 2),
        bestsellers: toList(bestsellers).slice(0, 2),
      })
      setCategoryCounts({
        ebooks: countOf(ebookRes),
        templates: countOf(templateRes),
        formations: countOf(formationRes),
      })
    }).catch(() => {}).finally(() => {})
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % heroPhrases.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const displayCategories = [
    { name: 'Ebooks', slug: 'ebooks', description: 'Découvrez des savoirs qui transforment', count: categoryCounts.ebooks ?? 0 },
    { name: 'Templates', slug: 'templates', description: 'Designs prêts à illuminer vos projets', count: categoryCounts.templates ?? 0 },
    { name: 'Formations', slug: 'formations', description: 'Maîtrisez de nouvelles compétences', count: categoryCounts.formations ?? 0 },
  ]

  const featured = featuredProducts.length > 0 ? featuredProducts[0] : null

  const testimonials = [
    { id: 1, name: 'DJIVOEDO Aurole', role: 'Créatrice de contenu', content: 'Tatlight a transformé ma façon de créer du contenu. Les templates sont exceptionnels !', rating: 5, avatar: '/images/ECQP9469.JPG' },
    { id: 2, name: 'Aristofane LOKO', role: 'Développeur web', content: "Les instrumentales sont d'une qualité professionnelle. Je recommande vivement.", rating: 5, avatar: '/images/aristofane.png' },
    { id: 3, name: 'Mirco SOUNOUVOU', role: 'Technicien Supérieur', content: "Une plateforme inspirante qui m'accompagne dans mon évolution créative.", rating: 5, avatar: '/images/WhatsApp Image 2026-02-14 at 12.48.19.jpeg' },
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <section className="relative overflow-hidden py-16 md:py-40">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1400px] max-w-none h-[900px]" style={{ background: 'conic-gradient(from 90deg at 50% 0%, transparent 0deg, rgba(201,162,39,0.07) 8deg, transparent 16deg, rgba(201,162,39,0.05) 24deg, transparent 32deg, rgba(201,162,39,0.06) 40deg, transparent 48deg, rgba(201,162,39,0.05) 56deg, transparent 64deg, rgba(201,162,39,0.07) 72deg, transparent 80deg)' }} />
          <div className="absolute left-1/2 -top-72 -translate-x-1/2 w-[900px] h-[700px] rounded-full" style={{ background: 'radial-gradient(ellipse at center, rgba(201,162,39,0.14), transparent 60%)' }} />
        </div>
        <motion.div
          className="container mx-auto px-6 md:px-4 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 md:mb-8 bg-[#C9A227]/10 border border-[#C9A227]/25">
              <Sparkles className="w-4 h-4 text-[#C9A227]" />
              <span className="text-sm font-medium tracking-wide text-[#A07C12]">Ebooks · Templates · Formations</span>
            </motion.div>

            <motion.div variants={itemVariants} className="h-[140px] md:h-[210px] flex items-center justify-center mb-8 md:mb-6">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="text-3xl md:text-6xl font-bold text-gray-900 leading-tight"
                >
                  {heroPhrases[phraseIndex].line}<br />
                  <span className="text-[#C9A227] glow-gold">{heroPhrases[phraseIndex].highlight}</span>
                </motion.h1>
              </AnimatePresence>
            </motion.div>

            <motion.p variants={itemVariants} className="text-base md:text-xl text-gray-600 mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto">
              Des ebooks, instrumentales, templates et formations sélectionnés avec soin pour éclairer votre parcours — téléchargez-les immédiatement après l'achat.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <Link to="/categorie/ebooks" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all flex items-center justify-center gap-2 group text-sm md:text-base">
                Explorer les contenus <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/a-propos" className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-4 bg-transparent border-2 border-[#C9A227] text-[#A07C12] rounded-full font-semibold hover:bg-[#C9A227]/10 transition-all group flex items-center justify-center gap-2 text-sm md:text-lg">
                En savoir plus <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-[#C9A227] group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>


          </div>
        </motion.div>

        <div className="absolute -bottom-1 left-0 right-0 h-24 md:h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="eyebrow block mb-3">Nos univers</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Explorez nos contenus</h2>
            <p className="text-gray-500 text-lg">Trois univers, une même exigence de qualité</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCategories.map((cat, idx) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group h-full"
              >
                <Link to={`/categorie/${cat.slug}`} className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#C9A227] transition-all duration-300 hover:shadow-xl block h-full">
                  {categoryImages[cat.slug] && (
                    <div className="relative h-44 overflow-hidden">
                      <img src={categoryImages[cat.slug]} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/70 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-4 w-12 h-12 bg-white/95 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-[#C9A227] transition-colors duration-300">
                        {React.createElement(iconMap[cat.slug === 'ebooks' ? 'ebook' : cat.slug === 'templates' ? 'template' : 'formation'] || BookOpen, { className: 'w-6 h-6 transition-colors', style: { color: '#A07C12' } })}
                      </div>
                    </div>
                  )}
                  <div className="relative p-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#C9A227] transition-colors duration-300">{cat.name}</h3>
                      <ArrowRight className="w-5 h-5 text-[#C9A227] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <p className="text-gray-500 text-sm mb-4">{cat.description || `Découvrez nos ${cat.name.toLowerCase()}`}</p>
                    <div className="flex items-center gap-2 text-sm font-medium text-[#A07C12]">
                      <TrendingUp className="w-4 h-4" /> <CountUp end={cat.count} duration={1500} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {featured && (
        <section className="py-16 md:py-24 bg-[#FBF7EF]/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="eyebrow block mb-3">Sélection du jour</span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">La <span className="text-[#C9A227] glow-gold">Lumière du Jour</span></h2>
              <p className="text-gray-500 text-lg">Notre recommandation spéciale pour vous</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Link to={`/produit/${featured.slug}`} className="group block bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:border-[#C9A227] hover:shadow-xl transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-8 p-8">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                    {featured.image ? (
                      <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-16 h-16 text-gray-300" /></div>
                    )}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#C9A227] text-[#0D1B2A] rounded-full text-sm font-semibold">Recommandé</div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 text-[#C9A227] text-sm font-medium mb-3 uppercase tracking-wide">{featured.category_name}</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#C9A227] transition-colors">{featured.title}</h3>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < Math.floor(Number(featured.rating)) ? 'fill-[#C9A227] text-[#C9A227]' : 'text-gray-300'}`} />))}
                      </div>
                      <span className="text-gray-500 text-sm">{featured.rating} ({featured.rating_count} avis)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-[#C9A227]">{featured.price}€</div>
                      <div className="flex items-center gap-2 text-[#C9A227] font-semibold group-hover:translate-x-2 transition-transform">Découvrir <ArrowRight className="w-5 h-5" /></div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-[#FBF7EF]/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="eyebrow block mb-3">Le choix de la communauté</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Nos contenus <span className="text-[#C9A227] glow-gold">populaires</span></h2>
            <p className="text-gray-500 text-lg mb-8">Les créations les plus appréciées de notre communauté</p>
            <div className="inline-flex bg-white border border-[#C9A227]/30 rounded-full p-1">
              {(['newest', 'bestsellers'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setProductTab(tab)}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all ${productTab === tab ? 'bg-[#C9A227] text-[#0D1B2A] shadow-md' : 'text-[#A07C12] hover:bg-[#C9A227]/10'}`}
                >
                  {tab === 'newest' ? 'Nouveautés' : 'Meilleures Ventes'}
                </button>
              ))}
            </div>
          </motion.div>

          {products[productTab].length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products[productTab].map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/produit/${product.slug}`} className="group block bg-white border border-[#C9A227]/20 rounded-2xl overflow-hidden hover:border-[#C9A227]/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#C9A227]/5">
                      {product.image ? (
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><TrendingUp className="w-10 h-10 text-[#C9A227]/30" /></div>
                      )}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-[#C9A227] text-[#0D1B2A] rounded-full text-sm font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />{product.sales_count}
                      </div>
                      {product.compare_price && Number(product.compare_price) > Number(product.price) && (
                        <div className="absolute bottom-4 left-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
                          -{Math.round((1 - Number(product.price) / Number(product.compare_price)) * 100)}%
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="text-[#A07C12] text-xs font-semibold uppercase tracking-wide mb-1">{product.category_name}</div>
                      <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#C9A227] transition-colors">{product.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (<Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(Number(product.rating)) ? 'fill-[#C9A227] text-[#C9A227]' : 'text-[#C9A227]/30'}`} />))}
                        </div>
                        <span className="text-gray-500 text-xs">({product.rating_count})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-[#C9A227]">{product.price}€</div>
                        <div className="flex items-center gap-1 text-[#C9A227] font-semibold text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">Voir <ArrowRight className="w-4 h-4" /></div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/categorie/tous" className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border border-[#C9A227] text-[#A07C12] rounded-full font-semibold hover:bg-[#C9A227] hover:text-[#0D1B2A] transition-all">
              Voir tous les contenus <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="eyebrow block mb-3">Ils nous font confiance</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Ce que disent nos membres</h2>
            <p className="text-gray-500 text-lg">Des milliers de créateurs nous font confiance</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#C9A227] transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">{[...Array(t.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />))}</div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#C9A227]/30" />
                  <div><div className="text-gray-900 font-semibold">{t.name}</div><div className="text-gray-500 text-sm">{t.role}</div></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0D1B2A]">
        <div className="container mx-auto px-4" data-animate>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div className="text-center"><div className="text-4xl md:text-5xl font-bold text-[#C9A227] mb-2"><CountUp end={5000} suffix="+" /></div><div className="text-gray-300">Membres Actifs</div></div>
            <div className="text-center"><div className="text-4xl md:text-5xl font-bold text-[#C9A227] mb-2"><CountUp end={600} suffix="+" /></div><div className="text-gray-300">Contenus Premium</div></div>
            <div className="text-center"><div className="text-4xl md:text-5xl font-bold text-[#C9A227] mb-2"><CountUp end={98} suffix="%" /></div><div className="text-gray-300">Satisfaction</div></div>
            <div className="text-center"><div className="text-4xl md:text-5xl font-bold text-[#C9A227] mb-2"><CountUp end={24} suffix="/7" /></div><div className="text-gray-300">Support</div></div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-b from-[#FBF7EF]/50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-[#16283D] to-[#0D1B2A] rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#C9A227]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl" />
            <Mail className="w-14 h-14 text-[#C9A227] mx-auto mb-6 relative z-10" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">Rejoignez Notre Newsletter</h2>
            <p className="text-gray-300 text-lg mb-8 relative z-10">Recevez chaque semaine nos nouveautés, offres exclusives et contenus gratuits. Zéro spam, promis.</p>
            {subscribed ? (
              <div className="relative z-10 inline-flex items-center gap-2 px-6 py-4 bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] rounded-full font-semibold">
                <Sparkles className="w-5 h-5" /> Merci ! Votre inscription a bien été prise en compte.
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubscribed(true) }}
                className="relative z-10 flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-gray-400 focus:outline-none focus:border-[#C9A227] focus:bg-white/15 transition-all"
                />
                <button type="submit" className="px-8 py-4 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all flex items-center justify-center gap-2">
                  S'inscrire <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="eyebrow block mb-3">Besoin d'aide</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Questions <span className="text-[#C9A227] glow-gold">fréquentes</span></h2>
            <p className="text-gray-500 text-lg">Tout ce que vous devez savoir avant de commencer</p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                viewport={{ once: true }}
                className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === idx ? 'border-[#C9A227] bg-[#C9A227]/5 shadow-md' : 'border-gray-200 bg-white hover:border-[#C9A227]/40'}`}
              >
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="text-lg font-semibold text-gray-900">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#C9A227] flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-gray-600 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 p-4 bg-white border border-[#C9A227]/20 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-[#C9A227] flex-shrink-0" />
              <div><div className="text-gray-900 font-semibold text-sm">Paiement Sécurisé</div><div className="text-gray-500 text-xs">FedaPay & Mobile Money</div></div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white border border-[#C9A227]/20 rounded-xl">
              <Zap className="w-8 h-8 text-[#C9A227] flex-shrink-0" />
              <div><div className="text-gray-900 font-semibold text-sm">Accès Instantané</div><div className="text-gray-500 text-xs">Téléchargement immédiat</div></div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white border border-[#C9A227]/20 rounded-xl">
              <Headphones className="w-8 h-8 text-[#C9A227] flex-shrink-0" />
              <div><div className="text-gray-900 font-semibold text-sm">Support 24/7</div><div className="text-gray-500 text-xs">À votre écoute</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center bg-white border-2 border-gray-200 rounded-3xl p-12 hover:border-[#C9A227] transition-all duration-300"
          >
            <Users className="w-16 h-16 text-[#C9A227] mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Rejoignez notre communauté</h2>
            <p className="text-gray-600 text-lg mb-8">Commencez votre voyage vers l'excellence dès aujourd'hui et profitez de contenus exclusifs</p>
            <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
              Créer Mon Compte Gratuit <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
