import React, { useState, useEffect } from "react"

import { useParams, Link } from 'react-router-dom'
import {Star, Download, Gift, ShoppingCart, ArrowRight, Check, Users, TrendingUp, Sparkles, Send, ChevronLeft, ChevronRight} from 'lucide-react'
import { productService } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import toast from 'react-hot-toast'

interface ProductData { id: string; category: any; type: string; title: string; slug: string; description: string; short_description: string; price: string; compare_price?: string; image?: string; file?: string; file_size: string; format: string; sales_count: number; rating: string; rating_count: number; is_featured: boolean; is_digital: boolean; features: string[]; feature_list: any[]; images: any[]; reviews: any[]; has_purchased?: boolean; created_at: string; }

export default function Product() {
  const { id: slug } = useParams()
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'description' | 'avis'>('description')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const { user } = useAuth()
  const isAuthenticated = !!user
  const { addItem } = useCart()

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Promise.all([
      productService.getProduct(slug),
      productService.getProductReviews(slug).catch(() => []),
    ]).then(([p, r]) => {
      setProduct(p)
      setReviews(Array.isArray(r) ? r : r.results || [])
    }).catch(() => setProduct(null)).finally(() => setLoading(false))
  }, [slug])

  const handleSubmitReview = async () => {
    if (!product || !reviewComment.trim()) return
    setSubmittingReview(true)
    try {
      const newReview = await productService.createReview(product.id, { rating: reviewRating, comment: reviewComment })
      setReviews(prev => [newReview, ...prev])
      setReviewComment('')
      setReviewRating(5)
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.response?.data?.non_field_errors?.[0] || 'Erreur lors de l\'envoi de l\'avis'
      toast.error(msg)
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#C9A227] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Produit introuvable</h1>
          <Link to="/" className="text-[#C9A227] hover:underline">Retour à l'accueil</Link>
        </div>
      </div>
    )
  }

  const allFeatures = product.features?.length ? product.features : product.feature_list?.map((f: any) => f.text) || []
  const avgRating = Number(product.rating) || 0
  const loyaltyPoints = Math.floor(Number(product.price) * 10)
  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(product.images || []).map((img: any) => img.image),
  ]

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-[#C9A227]/60 text-base mb-8">
          <Link to="/" className="hover:text-[#C9A227] transition-colors">Accueil</Link>
          <span>/</span>
          <Link to={`/categorie/${product.category?.slug || product.type}`} className="hover:text-[#C9A227] transition-colors">{product.category?.name || product.type}</Link>
          <span>/</span>
          <span className="text-[#C9A227]">{product.title}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#C9A227]/30 bg-[#C9A227]/5">
              {(() => {
                const currentSrc = allImages[activeImageIndex] ?? allImages[0]
                return (
                  <>
                    {currentSrc ? (
                      <img src={currentSrc} alt={product.title} className="w-full h-full object-cover transition-opacity" key={currentSrc} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Sparkles className="w-16 h-16 text-[#C9A227]/30" /></div>
                    )}
                    {allImages.length > 1 && (
                      <>
                        <button onClick={() => setActiveImageIndex(prev => (prev - 1 + allImages.length) % allImages.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all shadow">
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button onClick={() => setActiveImageIndex(prev => (prev + 1) % allImages.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all shadow">
                          <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                      </>
                    )}
                  </>
                )
              })()}
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                <div className="px-4 py-2 bg-[#C9A227] text-[#0D1B2A] rounded-full text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />{product.sales_count} ventes
                </div>
                {product.is_featured && (
                  <div className="px-4 py-2 bg-white/90 text-[#C9A227] rounded-full text-sm font-semibold flex items-center gap-2 border border-[#C9A227]/30">
                    <Sparkles className="w-4 h-4" /> Populaire
                  </div>
                )}
              </div>
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((src, idx) => (
                  <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-[#C9A227]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 text-[#C9A227] text-sm font-medium mb-3 uppercase">{product.category?.name || product.type}</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{product.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (<Star key={i} className={`w-5 h-5 ${i < Math.floor(avgRating) ? 'fill-[#C9A227] text-[#C9A227]' : 'text-[#C9A227]/30'}`} />))}
                </div>
                <span className="text-gray-900 font-semibold">{avgRating.toFixed(1)}</span>
              </div>
              <span className="text-gray-500">({product.rating_count} avis)</span>
              <div className="flex items-center gap-2 text-gray-500"><Users className="w-4 h-4" />{product.sales_count} membres</div>
            </div>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.short_description || product.description?.slice(0, 300)}</p>

            {allFeatures.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ce que vous obtenez :</h3>
                <div className="grid grid-cols-1 gap-3">
                  {allFeatures.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 text-gray-700">
                      <div className="w-6 h-6 bg-[#C9A227]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-[#C9A227]" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 bg-gradient-to-br from-[#C9A227]/10 to-transparent border border-[#C9A227]/30 rounded-2xl mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-4xl font-bold text-[#C9A227] mb-1">{product.price}€</div>
                  <div className="text-gray-500 text-sm">Accès immédiat après l'achat</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2 text-[#C9A227] mb-1">
                    <Gift className="w-5 h-5" />
                    <span className="font-bold text-lg">+{loyaltyPoints}</span>
                  </div>
                  <div className="text-gray-500 text-xs">Crédits fidélité</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to={isAuthenticated ? `/paiement/${product.slug}` : '/connexion'} className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all group">
                  <ShoppingCart className="w-5 h-5" /> Acheter <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button onClick={() => { addItem({ productId: product.id, slug: product.slug, title: product.title, price: product.price, image: product.image, quantity: 1 }); toast.success('Ajouté au panier !'); }} className="px-6 py-4 border-2 border-[#C9A227]/30 text-[#C9A227] rounded-full font-semibold hover:bg-[#C9A227]/10 transition-all whitespace-nowrap">
                  + Panier
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Download className="w-4 h-4" />
              Téléchargement instantané {product.format ? `• Format ${product.format}` : ''} {product.file_size ? `• ${product.file_size}` : ''}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex gap-4 mb-8 border-b border-[#C9A227]/20">
            <button onClick={() => setSelectedTab('description')} className={`px-6 py-3 font-semibold transition-colors relative ${selectedTab === 'description' ? 'text-[#C9A227]' : 'text-gray-500 hover:text-gray-900'}`}>
              Description Complète
              {selectedTab === 'description' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A227]"></div>}
            </button>
            <button onClick={() => setSelectedTab('avis')} className={`px-6 py-3 font-semibold transition-colors relative ${selectedTab === 'avis' ? 'text-[#C9A227]' : 'text-gray-500 hover:text-gray-900'}`}>
              Avis ({product.rating_count})
              {selectedTab === 'avis' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A227]"></div>}
            </button>
          </div>

          {selectedTab === 'description' ? (
            <div className="p-8 bg-gradient-to-br from-[#C9A227]/5 to-transparent border border-[#C9A227]/20 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos de ce contenu</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</div>
            </div>
          ) : (
            <div className="space-y-6">
              {isAuthenticated && product.has_purchased && !reviews.some((r: any) => r.user === (user as any)?.id) && (
                <div className="p-6 bg-gradient-to-br from-[#C9A227]/5 to-transparent border border-[#C9A227]/20 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Donner votre avis</h3>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <button key={i} onClick={() => setReviewRating(i)}>
                        <Star className={`w-6 h-6 ${i <= reviewRating ? 'fill-[#C9A227] text-[#C9A227]' : 'text-[#C9A227]/30'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Partagez votre expérience..." rows={3} className="w-full px-4 py-3 bg-gray-50 border border-[#C9A227]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C9A227] transition-colors mb-4" />
                  <button onClick={handleSubmitReview} disabled={submittingReview || !reviewComment.trim()} className="flex items-center gap-2 px-6 py-2 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all disabled:opacity-50">
                    <Send className="w-4 h-4" /> {submittingReview ? 'Envoi...' : 'Publier'}
                  </button>
                </div>
              )}
              {isAuthenticated && !product.has_purchased && (
                <div className="p-6 bg-gradient-to-br from-[#FBF7EF] to-transparent border border-[#C9A227]/30 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingCart className="w-5 h-5 text-[#A07C12]" />
                    <h3 className="text-lg font-bold text-gray-900">Achetez pour donner votre avis</h3>
                  </div>
                  <p className="text-gray-600">Vous devez acheter ce produit avant de pouvoir partager votre expérience.</p>
                </div>
              )}
              {isAuthenticated && product.has_purchased && reviews.some((r: any) => r.user === (user as any)?.id) && (
                <div className="p-6 bg-gradient-to-br from-green-50 to-transparent border border-green-200 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Vous avez déjà donné votre avis</h3>
                  </div>
                </div>
              )}
              {reviews.length > 0 ? reviews.map((review: any) => (
                <div key={review.id} className="p-6 bg-gradient-to-br from-[#C9A227]/5 to-transparent border border-[#C9A227]/20 rounded-2xl">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#C9A227]/20 flex items-center justify-center border-2 border-[#C9A227]/30">
                      <Users className="w-5 h-5 text-[#C9A227]" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div><div className="text-gray-900 font-semibold">{review.user_name || review.user?.email || 'Utilisateur'}</div><div className="text-gray-500 text-sm">{new Date(review.created_at).toLocaleDateString('fr-FR')}</div></div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-[#C9A227] text-[#C9A227]' : 'text-[#C9A227]/30'}`} />))}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center bg-gradient-to-br from-[#C9A227]/5 to-transparent border border-[#C9A227]/20 rounded-2xl">
                  <p className="text-gray-500">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
