import React, { useState, useEffect, useRef } from "react"
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {BookOpen, Layout, GraduationCap, Star, TrendingUp, Sparkles, ArrowRight, Users, ChevronRight} from 'lucide-react'
import { productService } from '../services/api'

interface Category { name: string; slug: string; description: string; icon?: string; product_count: number; }
interface Product { id: string; type: string; title: string; slug: string; short_description: string; price: string; compare_price?: string; image?: string; category_name: string; category_slug: string; sales_count: number; rating: string; rating_count: number; is_featured: boolean; }

const iconMap: Record<string, any> = { ebook: BookOpen, template: Layout, formation: GraduationCap }

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
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    Promise.all([
      productService.getCategories(),
      productService.getFeaturedProducts(),
    ]).then(([cats, prods]) => {
      setCategories(cats || [])
      setFeaturedProducts(prods || [])
    }).catch(() => {}).finally(() => {})
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % heroPhrases.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const displayCategories = categories.length > 0 ? categories : [
    { name: 'Ebooks', slug: 'ebooks', description: 'Découvrez des savoirs qui transforment', product_count: 0 },
    { name: 'Templates', slug: 'templates', description: 'Designs prêts à illuminer vos projets', product_count: 0 },
    { name: 'Formations', slug: 'formations', description: 'Maîtrisez de nouvelles compétences', product_count: 0 },
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
        <div className="absolute inset-0 bg-gradient-radial from-amber-50 via-transparent to-transparent" />
        <motion.div
          className="container mx-auto px-6 md:px-4 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 md:mb-8" style={{ backgroundColor: 'rgba(45, 90, 82, 0.1)', border: '1px solid rgba(45, 90, 82, 0.2)' }}>
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium tracking-wide" style={{ color: '#2d5a52' }}>Votre portail vers l'excellence</span>
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
                  <span className="text-[#D4AF37] glow-gold">{heroPhrases[phraseIndex].highlight}</span>
                </motion.h1>
              </AnimatePresence>
            </motion.div>

            <motion.p variants={itemVariants} className="text-base md:text-xl text-gray-600 mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto">
              Découvrez une collection soigneusement sélectionnée d'ebooks, instrumentales, templates et formations conçus pour élever votre créativité et vos compétences.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <Link to="/categorie/ebooks" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all flex items-center justify-center gap-2 group text-sm md:text-base">
                Explorer les Contenus <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/a-propos" className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-5 bg-transparent border-2 border-[#2d5a52] text-gray-900 rounded-full font-semibold hover:bg-[#2d5a52]/5 transition-all group flex items-center justify-center gap-2 text-sm md:text-lg">
                <span className="relative z-10">En Savoir Plus</span>
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37] relative z-10 group-hover:translate-x-1 transition-transform" />
                <span className="absolute -inset-1 rounded-full border-2 border-[#2d5a52] animate-ping opacity-20" />
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explorez Nos Catégories</h2>
            <p className="text-gray-500 text-lg">Chaque catégorie est une porte vers de nouvelles possibilités</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
            {displayCategories.map((cat, idx) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.08, y: -8 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="group"
              >
                <Link to={`/categorie/${cat.slug}`} className="relative p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#D4AF37] transition-colors duration-300 hover:shadow-2xl block" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="relative">
                    <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/20 transition-all group-hover:-translate-y-1 group-hover:scale-110 duration-300">
                      {React.createElement(iconMap[cat.slug === 'ebooks' ? 'ebook' : cat.slug === 'templates' ? 'template' : 'formation'] || BookOpen, { className: 'w-7 h-7', style: { color: '#2d5a52' } })}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#D4AF37] transition-colors group-hover:-translate-y-0.5 duration-300">{cat.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">{cat.description || `Découvrez nos ${cat.name.toLowerCase()}`}</p>
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#2d5a52' }}>
                      <TrendingUp className="w-4 h-4" /> <CountUp end={cat.product_count || 0} duration={1500} /> contenus
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {featured && (
        <section className="py-16 md:py-24 bg-gradient-to-b from-amber-50/50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#D4AF37] text-sm font-medium">Sélection du jour</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">La <span className="text-[#D4AF37] glow-gold">Lumière du Jour</span></h2>
              <p className="text-gray-500 text-lg">Notre recommandation spéciale pour vous</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Link to={`/produit/${featured.slug}`} className="group block bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-8 p-8">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                    {featured.image ? (
                      <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-16 h-16 text-gray-300" /></div>
                    )}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#D4AF37] text-white rounded-full text-sm font-semibold">Recommandé</div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-medium mb-3 uppercase tracking-wide">{featured.category_name}</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#D4AF37] transition-colors">{featured.title}</h3>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < Math.floor(Number(featured.rating)) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'}`} />))}
                      </div>
                      <span className="text-gray-500 text-sm">{featured.rating} ({featured.rating_count} avis)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-[#D4AF37]">{featured.price}€</div>
                      <div className="flex items-center gap-2 text-[#D4AF37] font-semibold group-hover:translate-x-2 transition-transform">Découvrir <ArrowRight className="w-5 h-5" /></div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ce Que Disent Nos Membres</h2>
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
                className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#D4AF37] transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">{[...Array(t.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />))}</div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]/30" />
                  <div><div className="text-gray-900 font-semibold">{t.name}</div><div className="text-gray-500 text-sm">{t.role}</div></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: '#2d5a52' }}>
        <div className="container mx-auto px-4" data-animate>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div className="text-center"><div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2"><CountUp end={5000} suffix="+" /></div><div className="text-gray-300">Membres Actifs</div></div>
            <div className="text-center"><div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2"><CountUp end={600} suffix="+" /></div><div className="text-gray-300">Contenus Premium</div></div>
            <div className="text-center"><div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2"><CountUp end={98} suffix="%" /></div><div className="text-gray-300">Satisfaction</div></div>
            <div className="text-center"><div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2"><CountUp end={24} suffix="/7" /></div><div className="text-gray-300">Support</div></div>
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
            className="max-w-3xl mx-auto text-center bg-white border-2 border-gray-200 rounded-3xl p-12 hover:border-[#D4AF37] transition-all duration-300"
          >
            <Users className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Rejoignez Notre Communauté</h2>
            <p className="text-gray-600 text-lg mb-8">Commencez votre voyage vers l'excellence dès aujourd'hui et profitez de contenus exclusifs</p>
            <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
              Créer Mon Compte Gratuit <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
