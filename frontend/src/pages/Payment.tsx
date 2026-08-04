import React, { useState, useEffect } from "react"

import { useParams, Link, useNavigate } from 'react-router-dom'
import {Smartphone, Lock, Check, Download, ArrowRight, ShieldCheck, Sparkles, Gift} from 'lucide-react'
import { productService, orderService } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface ProductData { id: string; title: string; price: string; image?: string; }

export default function Payment() {
  const { id } = useParams()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) navigate('/connexion', { replace: true })
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (!id) return
    productService.getProduct(id).then((p) => {
      setProduct({ id: p.id, title: p.title, price: p.price, image: p.image })
    }).catch(() => toast.error('Produit introuvable')).finally(() => setLoading(false))
  }, [id])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    setProcessing(true)
    try {
      const result = await orderService.fedapayInitialize({
        items: [{ product: product.id, quantity: 1 }],
        billing_email: user?.email || '',
      })
      if (result.payment_url) {
        window.location.href = result.payment_url
      } else {
        toast.error('Erreur : lien de paiement non reçu')
        setProcessing(false)
      }
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Erreur lors de l\'initialisation du paiement'
      toast.error(msg)
      setProcessing(false)
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
      <div className="min-h-screen bg-white py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Produit introuvable</h1>
        <Link to="/" className="text-[#C9A227]">Retour à l'accueil</Link>
      </div>
    )
  }

  const loyaltyPoints = Math.floor(Number(product.price) * 10)
  const total = Number(product.price) * 1.2

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Finaliser Votre <span className="text-[#C9A227]">Achat</span></h1>
            <p className="text-gray-500">Paiement 100% sécurisé • Téléchargement instantané</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1">
              <div className="p-8 bg-gradient-to-br from-[#C9A227]/5 to-transparent border border-[#C9A227]/20 rounded-3xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-[#C9A227]" /> Informations de Paiement
                </h2>

                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="p-4 bg-gradient-to-br from-[#C9A227]/5 to-transparent border border-[#C9A227]/20 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Smartphone className="w-6 h-6 text-[#C9A227]" />
                      <div>
                        <div className="text-gray-900 font-semibold">FedaPay / Mobile Money</div>
                        <div className="text-gray-500 text-sm">Payez avec votre téléphone</div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">Paiement sécurisé via FedaPay. Accepte MTN, Moov, Celtiis et carte bancaire.</p>
                  </div>
                  <button type="submit" disabled={processing} className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#C9A227] text-[#0D1B2A] rounded-full font-bold text-lg hover:glow-gold transition-all group disabled:opacity-50">
                    <Smartphone className="w-5 h-5" /> {processing ? 'Initialisation...' : `Payer ${total.toFixed(2)}€ avec FedaPay`} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-sm"><ShieldCheck className="w-4 h-4" /> Paiement 100% sécurisé</div>
                </form>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="p-8 bg-gradient-to-br from-[#C9A227]/10 to-transparent border border-[#C9A227]/30 rounded-3xl sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Récapitulatif</h2>
                <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex gap-4">
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-20 h-20 rounded-xl object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-[#C9A227]/10 flex items-center justify-center"><Sparkles className="w-8 h-8 text-[#C9A227]/50" /></div>
                    )}
                    <div className="flex-grow">
                      <h3 className="text-gray-900 font-semibold mb-2 leading-tight">{product.title}</h3>
                      <div className="text-[#C9A227] font-bold">{product.price}€</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-6 pb-6 border-b border-[#C9A227]/20">
                  <div className="flex items-center justify-between text-gray-600"><span>Sous-total</span><span>{product.price}€</span></div>
                  <div className="flex items-center justify-between text-gray-600"><span>TVA (20%)</span><span>{(Number(product.price) * 0.2).toFixed(2)}€</span></div>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-900 text-xl font-bold">Total</span>
                  <span className="text-[#C9A227] text-3xl font-bold">{total.toFixed(2)}€</span>
                </div>
                <div className="space-y-3 p-4 bg-[#C9A227]/5 rounded-2xl border border-[#C9A227]/20 mb-6">
                  <div className="flex items-center gap-3 text-gray-700"><Check className="w-5 h-5 text-[#C9A227]" /><span>Téléchargement instantané</span></div>
                  <div className="flex items-center gap-3 text-gray-700"><Check className="w-5 h-5 text-[#C9A227]" /><span>Accès illimité à vie</span></div>
                  <div className="flex items-center gap-3 text-gray-700"><Check className="w-5 h-5 text-[#C9A227]" /><span>Mises à jour gratuites</span></div>
                  <div className="flex items-center gap-3 text-gray-700"><Check className="w-5 h-5 text-[#C9A227]" /><span>Support client dédié</span></div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#C9A227]/20 to-[#C9A227]/5 rounded-2xl border border-[#C9A227]/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#C9A227] rounded-full flex items-center justify-center"><Gift className="w-5 h-5 text-[#0D1B2A]" /></div>
                    <div><div className="text-gray-700 text-sm">Vous gagnez</div><div className="text-gray-900 font-bold">+{loyaltyPoints} Crédits Fidélité</div></div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50/50 rounded-2xl">
                  <div className="flex items-start gap-3 text-gray-600 text-sm">
                    <Download className="w-5 h-5 text-[#C9A227] flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">Après votre achat, vous recevrez un email avec le lien de téléchargement. Vous pourrez également accéder à vos contenus depuis votre espace personnel.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
