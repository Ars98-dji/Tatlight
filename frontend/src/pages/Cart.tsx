import React from "react"
import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import toast from 'react-hot-toast'

export default function Cart() {
  const { items, removeItem, clearCart, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-20 h-20 text-[#D4AF37]/50 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Panier <span className="text-[#D4AF37]">Vide</span></h1>
          <p className="text-gray-500 mb-8">Découvrez nos contenus premium</p>
          <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
            Explorer <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Mon <span className="text-[#D4AF37]">Panier</span></h1>
          <button onClick={() => { clearCart(); toast.success('Panier vidé'); }} className="text-red-400 hover:text-red-500 font-semibold text-sm">Tout supprimer</button>
        </div>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.productId} className="p-6 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl flex items-center gap-6">
              <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-xl" /> : <Sparkles className="w-8 h-8 text-[#D4AF37]/50" />}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                <div className="text-[#D4AF37] font-bold">{item.price}€ x {item.quantity}</div>
              </div>
              <button onClick={() => { removeItem(item.productId); toast.success('Retiré du panier'); }} className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-3xl font-bold text-[#D4AF37]">{totalPrice.toFixed(2)}€</span>
          </div>
          <Link to={`/paiement/${items[0]?.slug || items[0]?.productId}`} className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-bold hover:glow-gold transition-all">
            Commander <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
