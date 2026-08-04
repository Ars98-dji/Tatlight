import React, { useState, useEffect, useRef } from "react"

import { Link } from 'react-router-dom'
import {User, ShoppingBag, Download, Gift, Clock, ArrowRight, Award, Sparkles, Camera, FileText} from 'lucide-react'
import { authService, orderService, loyaltyService } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface UserData {
  id: string; email: string; first_name: string; last_name: string; full_name: string;
  avatar?: string; loyalty_points: number; loyalty_tier: string; total_purchases: number;
  date_joined: string;
}

interface Purchase { order_number: string; product_id: string; product_title: string; product_image: string | null; price: number; purchased_at: string; is_downloadable: boolean; }

interface LoyaltyData { total_points: number; lifetime_earned: number; lifetime_redeemed: number; tier: string; next_tier: string | null; progress_to_next_tier: number; recent_transactions: any[]; available_rewards: Reward[]; }
interface Reward { id: string; name: string; description: string; points_required: number; image?: string; stock: number; is_active: boolean; }

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [showRewards, setShowRewards] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { uploadAvatar } = useAuth()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [profile, purchasesData, loyaltyData, rewardsData] = await Promise.all([
        authService.getProfile(),
        orderService.getPurchases().catch(() => ({ purchases: [] })),
        loyaltyService.getSummary().catch(() => null),
        loyaltyService.getRewards().catch(() => []),
      ])
      setUser(profile)
      setPurchases(purchasesData.purchases || [])
      setLoyalty(loyaltyData)
      setRewards(Array.isArray(rewardsData) ? rewardsData : rewardsData.results || [])
    } catch (err) {
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const handleRedeem = async (rewardId: string) => {
    setRedeeming(rewardId)
    try {
      const result = await loyaltyService.redeemReward(rewardId)
      toast.success(result.message || 'Récompense échangée !')
      loadData()
    } catch {
      toast.error('Erreur lors de l\'échange')
    } finally {
      setRedeeming(null)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const result = await uploadAvatar(file)
      setUser(prev => prev ? { ...prev, avatar: result.user?.avatar || prev.avatar } : prev)
      toast.success('Photo de profil mise à jour !')
    } catch {
      toast.error("Erreur lors du téléchargement de l'avatar")
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (purchase: Purchase) => {
    try {
      const blob = await orderService.downloadProduct(purchase.product_id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = purchase.product_title || 'download'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Téléchargement lancé !')
    } catch {
      toast.error('Erreur lors du téléchargement du fichier')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#C9A227] border-t-transparent rounded-full" />
      </div>
    )
  }

  const stats = [
    { label: 'Achats Totaux', value: user?.total_purchases || 0, icon: ShoppingBag },
    { label: 'Crédits Fidélité', value: loyalty?.total_points || user?.loyalty_points || 0, icon: Gift },
    { label: 'Téléchargements', value: purchases.length, icon: Download },
    { label: 'Niveau', value: loyalty?.tier || user?.loyalty_tier || 'Bronze', icon: Award },
  ]

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Mon <span className="text-[#C9A227]">Espace</span>
          </h1>
        </div>

        <div className="mb-12 p-8 bg-gradient-to-br from-[#C9A227]/10 to-transparent border border-[#C9A227]/30 rounded-3xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.full_name} className="w-24 h-24 rounded-full object-cover border-4 border-[#C9A227]/30" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#C9A227]/10 border-4 border-[#C9A227]/30 flex items-center justify-center">
                  <User className="w-10 h-10 text-[#C9A227]" />
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploading} />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#C9A227] rounded-full flex items-center justify-center border-4 border-white">
                <Sparkles className="w-5 h-5 text-[#0D1B2A]" />
              </div>
            </div>
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.full_name || user?.email}</h2>
              <p className="text-gray-500 mb-1">{user?.email}</p>
              <p className="text-gray-500 text-sm">Membre depuis {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '-'}</p>
            </div>
            <div className="flex flex-col items-center gap-2 px-6 py-4 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-2xl">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C9A227]" />
                <span className="text-[#C9A227] font-bold text-lg">{loyalty?.tier || user?.loyalty_tier || 'Bronze'}</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#C9A227]">{loyalty?.total_points || user?.loyalty_points || 0}</div>
                <div className="text-gray-500 text-sm">Crédits Fidélité</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 bg-gradient-to-br from-[#C9A227]/5 to-transparent border border-[#C9A227]/20 rounded-2xl hover:border-[#C9A227]/40 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#C9A227]/20 rounded-full flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[#C9A227]" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {loyalty && loyalty.next_tier && (
          <div className="mb-8 p-4 bg-[#C9A227]/5 rounded-2xl border border-[#C9A227]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 text-sm">Progression vers <span className="text-[#C9A227] font-semibold">{loyalty.next_tier}</span></span>
              <span className="text-[#C9A227] text-sm font-semibold">{loyalty.progress_to_next_tier}%</span>
            </div>
            <div className="w-full bg-gray-50 rounded-full h-2 overflow-hidden">
              <div className="bg-[#C9A227] h-full rounded-full transition-all" style={{ width: `${loyalty.progress_to_next_tier}%` }} />
            </div>
          </div>
        )}

        {rewards.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Récompenses <span className="text-[#C9A227]">Fidélité</span></h2>
              <button onClick={() => setShowRewards(!showRewards)} className="text-[#C9A227] font-semibold hover:underline text-sm">
                {showRewards ? 'Masquer' : 'Voir tout'}
              </button>
            </div>
            {showRewards && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((reward) => {
                  const canAfford = (loyalty?.total_points || 0) >= reward.points_required
                  return (
                    <div key={reward.id} className={`p-6 rounded-2xl border transition-all ${canAfford ? 'bg-gradient-to-br from-[#C9A227]/10 to-transparent border-[#C9A227]/30' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{reward.name}</h3>
                      <p className="text-gray-500 text-sm mb-4">{reward.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-[#C9A227]" />
                          <span className="font-bold text-[#C9A227]">{reward.points_required} pts</span>
                        </div>
                        <button
                          onClick={() => handleRedeem(reward.id)}
                          disabled={!canAfford || redeeming === reward.id}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${canAfford ? 'bg-[#C9A227] text-[#0D1B2A] hover:glow-gold' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        >
                          {redeeming === reward.id ? '...' : 'Échanger'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Mes <span className="text-[#C9A227]">Achats</span></h2>
          </div>
          {purchases.length === 0 ? (
            <div className="p-12 text-center bg-gradient-to-br from-[#C9A227]/5 to-transparent border border-[#C9A227]/20 rounded-2xl">
              <ShoppingBag className="w-16 h-16 text-[#C9A227]/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun achat pour le moment</h3>
              <p className="text-gray-500 mb-6">Découvrez nos contenus premium et commencez votre voyage</p>
              <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
                Explorer les contenus <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase, idx) => (
                <div key={idx} className="p-6 bg-gradient-to-br from-[#C9A227]/5 to-transparent border border-[#C9A227]/20 rounded-2xl hover:border-[#C9A227]/40 transition-all group">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-48 flex-shrink-0">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#C9A227]/10">
                        {purchase.product_image ? (
                          <img src={purchase.product_image} alt={purchase.product_title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><FileText className="w-8 h-8 text-[#C9A227]/50" /></div>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#C9A227] transition-colors">{purchase.product_title}</h3>
                        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                          <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{new Date(purchase.purchased_at).toLocaleDateString('fr-FR')}</div>
                          <div className="text-[#C9A227] font-semibold">{purchase.price}€</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {purchase.is_downloadable && (
                          <button
                            onClick={() => handleDownload(purchase)}
                            className="flex items-center gap-2 px-6 py-2 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all"
                          >
                            <Download className="w-4 h-4" /> Télécharger
                          </button>
                        )}
                        <Link to={`/produit/${purchase.product_id}`} className="flex items-center gap-2 px-6 py-2 bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] rounded-full font-semibold hover:bg-[#C9A227]/20 transition-all">
                          Voir Détails
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
