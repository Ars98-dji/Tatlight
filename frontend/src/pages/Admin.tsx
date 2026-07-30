import React, { useState, useEffect } from "react"
import { Navigate, useNavigate } from 'react-router-dom'
import {Package, TrendingUp, Users, DollarSign, Plus, Trash2, Edit, Image as ImageIcon, Tag, BarChart3, ShieldAlert, X, Search, Save, RefreshCw, Gift, MessageSquare, Star} from 'lucide-react'
import { productService, orderService, authService, adminService } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface AdminProduct {
  id: string; title: string; slug: string; type: string; price: string;
  sales_count: number; is_active: boolean; category_name?: string;
  category?: number; description?: string; short_description?: string;
  compare_price?: string; format?: string; file_size?: string; image?: string;
  is_featured?: boolean; is_digital?: boolean;
}

interface AdminCoupon {
  id: string; code: string; discount_type: string; discount_percent: number;
  discount_amount: string; used_count: number; max_uses: number;
  is_active: boolean; min_purchase?: string; valid_from?: string; valid_to?: string;
}

interface AdminUser {
  id: string; email: string; first_name: string; last_name: string;
  full_name: string; is_staff: boolean; is_superuser: boolean;
  is_active: boolean; is_verified: boolean; date_joined: string;
  total_purchases: number; loyalty_tier: string;
}

interface AdminOrder {
  id: string; order_number: string; status: string;
  total_amount: string; payment_method: string;
  items_count: number; created_at: string;
}

interface Category {
  id: number; name: string; slug: string; product_count: number;
}

type TabId = 'dashboard' | 'products' | 'users' | 'coupons' | 'categories' | 'reviews'

interface ProductFormData {
  category: string; type: string; title: string; slug: string;
  description: string; short_description: string; price: string;
  compare_price: string; format: string; file_size: string;
  is_featured: boolean; is_active: boolean; is_digital: boolean;
  features: string;
}

const emptyProductForm: ProductFormData = {
  category: '', type: 'ebook', title: '', slug: '', description: '',
  short_description: '', price: '', compare_price: '', format: '',
  file_size: '', is_featured: false, is_active: true, is_digital: true, features: ''
}

interface CouponFormData {
  code: string; discount_type: string; discount_percent: string;
  discount_amount: string; min_purchase: string; max_uses: string;
  is_active: boolean; valid_from: string; valid_to: string;
}

const emptyCouponForm: CouponFormData = {
  code: '', discount_type: 'percent', discount_percent: '10',
  discount_amount: '0', min_purchase: '0', max_uses: '0',
  is_active: true, valid_from: '', valid_to: ''
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')

  const [products, setProducts] = useState<AdminProduct[]>([])
  const [coupons, setCoupons] = useState<AdminCoupon[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [userSearch, setUserSearch] = useState('')

  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [productForm, setProductForm] = useState<ProductFormData>(emptyProductForm)

  const [showCouponModal, setShowCouponModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null)
  const [couponForm, setCouponForm] = useState<CouponFormData>(emptyCouponForm)

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')

  const [mainImage, setMainImage] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string>('')
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [existingGallery, setExistingGallery] = useState<any[]>([])

  useEffect(() => {
    if (activeTab === 'dashboard') { loadProducts(); loadUsers(); loadOrders(); }
    if (activeTab === 'products') loadProducts()
    if (activeTab === 'users') loadUsers()
    if (activeTab === 'coupons') loadCoupons()
    if (activeTab === 'categories') loadCategories()
    if (activeTab === 'reviews') loadReviews()
  }, [activeTab])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await productService.adminGetProducts()
      setProducts(Array.isArray(data) ? data : data.results || [])
    } catch { toast.error('Erreur chargement produits') }
    finally { setLoading(false) }
  }

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await adminService.getUsers()
      if (data && Array.isArray(data.results)) setUsers(data.results)
      else if (Array.isArray(data)) setUsers(data)
      else console.warn('Users API: format inattendu', data)
    } catch (e) { console.error('Erreur chargement utilisateurs', e) }
    finally { setLoading(false) }
  }

  const loadCoupons = async () => {
    setLoading(true)
    try {
      const data = await orderService.getCoupons()
      setCoupons(Array.isArray(data) ? data : data.results || [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  const loadOrders = async () => {
    try {
      const data = await orderService.adminGetOrders()
      setOrders(Array.isArray(data) ? data : data.results || [])
    } catch { /* ignore */ }
  }

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await productService.getCategories()
      setCategories(Array.isArray(data) ? data : data.results || [])
    } catch { toast.error('Erreur chargement catégories') }
    finally { setLoading(false) }
  }

  const loadReviews = async () => {
    setLoading(true)
    try {
      const data = await productService.adminGetReviews()
      setReviews(Array.isArray(data) ? data : data.results || [])
    } catch { toast.error('Erreur chargement avis') }
    finally { setLoading(false) }
  }

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Supprimer cet avis ?')) return
    try {
      await productService.adminDeleteReview(id)
      toast.success('Avis supprimé')
      loadReviews()
    } catch { toast.error('Erreur suppression avis') }
  }

  const handleDeleteProduct = async (slug: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    try {
      await productService.adminDeleteProduct(slug)
      toast.success('Produit supprimé')
      loadProducts()
    } catch { toast.error('Erreur lors de la suppression') }
  }

  const openProductModal = async (product?: AdminProduct) => {
    setMainImage(null)
    setMainImagePreview('')
    setGalleryFiles([])
    setGalleryPreviews([])
    setExistingGallery([])

    if (product) {
      setEditingProduct(product)
      setProductForm({
        category: product.category?.toString() || '',
        type: product.type, title: product.title, slug: product.slug,
        description: product.description || '', short_description: product.short_description || '',
        price: product.price, compare_price: product.compare_price || '',
        format: product.format || '', file_size: product.file_size || '',
        is_featured: product.is_featured || false, is_active: product.is_active,
        is_digital: product.is_digital ?? true, features: ''
      })
      if (product.image) setMainImagePreview(product.image)
      try {
        const gallery = await productService.adminGetProductGallery(product.slug)
        setExistingGallery(Array.isArray(gallery) ? gallery : gallery.results || [])
      } catch {}
    } else {
      setEditingProduct(null)
      setProductForm(emptyProductForm)
    }
    setShowProductModal(true)
  }

  const handleSaveProduct = async () => {
    if (!productForm.title || !productForm.price) {
      toast.error('Titre et prix requis')
      return
    }
    try {
      const data: any = {
        category: productForm.category, type: productForm.type,
        title: productForm.title, slug: productForm.slug,
        description: productForm.description, short_description: productForm.short_description,
        price: productForm.price, compare_price: productForm.compare_price || null,
        format: productForm.format, file_size: productForm.file_size,
        is_featured: productForm.is_featured, is_active: productForm.is_active,
        is_digital: productForm.is_digital,
      }

      const hasFiles = mainImage || galleryFiles.length > 0
      if (hasFiles) {
        const fd = new FormData()
        Object.entries(data).forEach(([k, v]) => { if (v !== '' && v !== null) fd.append(k, v) })
        if (mainImage) fd.append('image', mainImage)
        galleryFiles.forEach(f => fd.append('gallery', f))
        data.__formData = fd
      }

      if (editingProduct) {
        const payload = hasFiles ? data.__formData : data
        await productService.adminUpdateProduct(editingProduct.slug, payload)
        toast.success('Produit mis à jour')
      } else {
        const payload = hasFiles ? data.__formData : data
        await productService.adminCreateProduct(payload)
        toast.success('Produit créé')
      }
      setShowProductModal(false)
      loadProducts()
    } catch (e: any) {
      const err = e.response?.data
      if (typeof err === 'string') toast.error(err)
      else if (err?.detail) toast.error(err.detail)
      else if (err?.title) toast.error(`Titre: ${err.title.join?.(', ') || err.title}`)
      else if (err?.price) toast.error(`Prix: ${err.price.join?.(', ') || err.price}`)
      else if (err?.slug) toast.error(`Slug: ${err.slug.join?.(', ') || err.slug}`)
      else if (err?.category) toast.error(`Catégorie: ${err.category.join?.(', ') || err.category}`)
      else {
        const msg = err ? Object.values(err).flat().join(', ') : 'Erreur lors de la sauvegarde'
        toast.error(msg)
      }
    }
  }

  const openCouponModal = (coupon?: AdminCoupon) => {
    if (coupon) {
      setEditingCoupon(coupon)
      setCouponForm({
        code: coupon.code, discount_type: coupon.discount_type,
        discount_percent: coupon.discount_percent.toString(),
        discount_amount: coupon.discount_amount,
        min_purchase: coupon.min_purchase || '0',
        max_uses: coupon.max_uses.toString(),
        is_active: coupon.is_active,
        valid_from: coupon.valid_from ? coupon.valid_from.slice(0, 16) : '',
        valid_to: coupon.valid_to ? coupon.valid_to.slice(0, 16) : '',
      })
    } else {
      setEditingCoupon(null)
      setCouponForm(emptyCouponForm)
    }
    setShowCouponModal(true)
  }

  const handleSaveCoupon = async () => {
    if (!couponForm.code || !couponForm.valid_to) {
      toast.error('Code et date de fin requis')
      return
    }
    try {
      const data: any = {
        code: couponForm.code.toUpperCase(), discount_type: couponForm.discount_type,
        discount_percent: parseInt(couponForm.discount_percent) || 0,
        discount_amount: couponForm.discount_amount,
        min_purchase: couponForm.min_purchase || '0',
        max_uses: parseInt(couponForm.max_uses) || 0,
        is_active: couponForm.is_active,
        valid_from: couponForm.valid_from || new Date().toISOString().slice(0, 16),
        valid_to: couponForm.valid_to,
      }
      if (editingCoupon) {
        await orderService.updateCoupon(editingCoupon.id, data)
        toast.success('Coupon mis à jour')
      } else {
        await orderService.createCoupon(data)
        toast.success('Coupon créé')
      }
      setShowCouponModal(false)
      loadCoupons()
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Erreur lors de la sauvegarde')
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Supprimer ce coupon ?')) return
    try {
      await orderService.deleteCoupon(id)
      toast.success('Coupon supprimé')
      loadCoupons()
    } catch { toast.error('Erreur lors de la suppression') }
  }

  const handleToggleUserStatus = async (u: AdminUser) => {
    try {
      await adminService.updateUser(u.id, { is_active: !u.is_active })
      toast.success(`Utilisateur ${u.is_active ? 'désactivé' : 'activé'}`)
      loadUsers()
    } catch { toast.error('Erreur') }
  }

  const handleToggleUserStaff = async (u: AdminUser) => {
    try {
      await adminService.updateUser(u.id, { is_staff: !u.is_staff })
      toast.success(`Rôle ${u.is_staff ? 'retiré' : 'attribué'}`)
      loadUsers()
    } catch { toast.error('Erreur') }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Supprimer définitivement cet utilisateur ?')) return
    try {
      await adminService.deleteUser(id)
      toast.success('Utilisateur supprimé')
      loadUsers()
    } catch { toast.error('Erreur lors de la suppression') }
  }

  const handleCreateCategory = async () => {
    if (!categoryName) { toast.error('Nom requis'); return }
    try {
      await productService.adminCreateCategory({ name: categoryName, description: categoryDescription })
      toast.success('Catégorie créée')
      setShowCategoryModal(false); setCategoryName(''); setCategoryDescription('')
      loadCategories()
    } catch (e: any) { toast.error(e.response?.data?.detail || 'Erreur') }
  }

  const handleDeleteCategory = async (slug: string) => {
    if (!confirm('Supprimer cette catégorie ? Les produits ne seront pas supprimés.')) return
    try {
      await productService.adminDeleteCategory(slug)
      toast.success('Catégorie supprimée')
      loadCategories()
    } catch { toast.error('Erreur') }
  }

  const totalSales = products.reduce((s, p) => s + p.sales_count, 0)
  const activeProducts = products.filter(p => p.is_active).length
  const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.total_amount || '0'), 0)
  const completedOrders = orders.filter(o => o.status === 'completed')

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.full_name.toLowerCase().includes(userSearch.toLowerCase())
  )

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (!user.is_staff && !user.is_superuser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <ShieldAlert className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Accès <span className="text-red-400">Refusé</span></h1>
          <p className="text-gray-500 mb-8">Vous n'avez pas les droits d'administration nécessaires.</p>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard' as TabId, label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'products' as TabId, label: 'Produits', icon: Package },
    { id: 'categories' as TabId, label: 'Catégories', icon: Tag },
    { id: 'users' as TabId, label: 'Utilisateurs', icon: Users },
    { id: 'coupons' as TabId, label: 'Coupons', icon: Gift },
    { id: 'reviews' as TabId, label: 'Avis', icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Tableau de <span className="text-[#D4AF37]">Bord</span>
          </h1>
          <p className="text-gray-500">Gérez votre plateforme Tatlight</p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#D4AF37] text-[#0D1B2A]'
                  : 'bg-[#D4AF37]/10 text-gray-600 hover:bg-[#D4AF37]/20 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* === DASHBOARD === */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Produits', value: products.length.toString(), change: `${activeProducts} actifs`, icon: Package, color: 'from-[#D4AF37]/20 to-[#D4AF37]/5' },
                { label: 'Ventes', value: totalSales.toString(), change: `${completedOrders.length} commandes`, icon: TrendingUp, color: 'from-green-500/20 to-green-500/5' },
                { label: 'Revenus', value: `${totalRevenue.toFixed(0)}€`, change: `${orders.length} commandes`, icon: DollarSign, color: 'from-blue-500/20 to-blue-500/5' },
                { label: 'Utilisateurs', value: users.length.toString(), change: `${users.filter(u => u.is_active).length} actifs`, icon: Users, color: 'from-purple-500/20 to-purple-500/5' },
              ].map((stat, i) => (
                <div key={i} className={`p-6 bg-gradient-to-br ${stat.color} border border-[#D4AF37]/20 rounded-2xl`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Top <span className="text-[#D4AF37]">Produits</span>
                </h2>
                <button onClick={() => setActiveTab('products')} className="text-[#D4AF37] hover:text-gray-900 transition-colors">Gérer</button>
              </div>
              <div className="space-y-4">
                {[...products].sort((a, b) => b.sales_count - a.sales_count).slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                    <div className="flex-grow">
                      <h3 className="text-gray-900 font-semibold mb-1">{p.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{p.sales_count} ventes</span>
                        <span className="text-[#D4AF37]">{p.price}€</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {p.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                ))}
                {products.length === 0 && <p className="text-gray-500 text-center py-4">Aucun produit</p>}
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Dernières <span className="text-[#D4AF37]">Commandes</span>
                </h2>
                <button onClick={() => setActiveTab('coupons')} className="text-[#D4AF37] hover:text-gray-900 transition-colors">Voir tout</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-[#D4AF37]/20">
                      <th className="text-left py-3 px-2">N°</th>
                      <th className="text-left py-3 px-2">Statut</th>
                      <th className="text-right py-3 px-2">Montant</th>
                      <th className="text-right py-3 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className="border-b border-gray-100">
                        <td className="py-3 px-2 font-medium text-gray-900">{o.order_number}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            o.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                            o.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-500'
                          }`}>{o.status}</span>
                        </td>
                        <td className="py-3 px-2 text-right text-gray-900">{o.total_amount}€</td>
                        <td className="py-3 px-2 text-right text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-gray-500">Aucune commande</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* === PRODUCTS === */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Gestion des <span className="text-[#D4AF37]">Produits</span>
              </h2>
              <button onClick={() => openProductModal()} className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
                <Plus className="w-4 h-4" /> Ajouter un Produit
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full" /></div>
            ) : (
              <div className="grid gap-4">
                {products.map(p => (
                  <div key={p.id} className="p-6 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl">
                    <div className="flex items-center gap-6">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="w-24 h-24 object-cover rounded-xl" />
                      ) : (
                        <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                          <Package className="w-8 h-8 text-[#D4AF37]" />
                        </div>
                      )}
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                          <span>Type: {p.type}</span><span>•</span>
                          <span>Prix: <span className="text-[#D4AF37] font-semibold">{p.price}€</span></span>
                          {p.compare_price && <span className="line-through text-gray-400">{p.compare_price}€</span>}<span>•</span>
                          <span>{p.sales_count} ventes</span><span>•</span>
                          <span className={p.is_active ? 'text-green-500' : 'text-red-400'}>{p.is_active ? 'Actif' : 'Inactif'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openProductModal(p)} className="p-3 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 rounded-xl transition-colors">
                          <Edit className="w-4 h-4 text-[#D4AF37]" />
                        </button>
                        <button onClick={() => handleDeleteProduct(p.slug)} className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === CATEGORIES === */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Gestion des <span className="text-[#D4AF37]">Catégories</span>
              </h2>
              <button onClick={() => { setEditingCategory(null); setCategoryName(''); setCategoryDescription(''); setShowCategoryModal(true); }}
                className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
                <Plus className="w-4 h-4" /> Nouvelle Catégorie
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full" /></div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(c => (
                  <div key={c.id} className="p-6 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                      <button onClick={() => handleDeleteCategory(c.slug)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                    <p className="text-gray-500 text-sm">{c.product_count} produit(s)</p>
                  </div>
                ))}
              </div>
            )}
            {showCategoryModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCategoryModal(false)}>
                <div className="bg-white rounded-3xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{editingCategory ? 'Modifier' : 'Nouvelle'} Catégorie</h3>
                    <button onClick={() => setShowCategoryModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="space-y-4">
                    <input value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="Nom de la catégorie"
                      className="w-full px-4 py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]" />
                    <textarea value={categoryDescription} onChange={e => setCategoryDescription(e.target.value)} placeholder="Description (optionnelle)"
                      className="w-full px-4 py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] resize-none h-24" />
                    <button onClick={handleCreateCategory} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
                      <Save className="w-4 h-4" /> {editingCategory ? 'Mettre à jour' : 'Créer'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === USERS === */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Gestion des <span className="text-[#D4AF37]">Utilisateurs</span>
              </h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-[#D4AF37]/30 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]" />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-[#D4AF37]/20">
                      <th className="text-left py-3 px-3">Utilisateur</th>
                      <th className="text-left py-3 px-3">Email</th>
                      <th className="text-center py-3 px-3">Statut</th>
                      <th className="text-center py-3 px-3">Rôle</th>
                      <th className="text-center py-3 px-3">Achats</th>
                      <th className="text-center py-3 px-3">Fidélité</th>
                      <th className="text-right py-3 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-4 px-3">
                          <div className="font-semibold text-gray-900">{u.full_name}</div>
                        </td>
                        <td className="py-4 px-3 text-gray-500">{u.email}</td>
                        <td className="py-4 px-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            u.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-400'
                          }`}>{u.is_active ? 'Actif' : 'Inactif'}</span>
                        </td>
                        <td className="py-4 px-3 text-center">
                          {u.is_superuser ? (
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-500 rounded-full text-xs font-semibold">Super Admin</span>
                          ) : u.is_staff ? (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs font-semibold">Staff</span>
                          ) : <span className="text-gray-400 text-xs">Client</span>}
                        </td>
                        <td className="py-4 px-3 text-center text-gray-900">{u.total_purchases}</td>
                        <td className="py-4 px-3 text-center">
                          <span className={`text-xs font-semibold ${
                            u.loyalty_tier === 'platinum' ? 'text-purple-500' :
                            u.loyalty_tier === 'gold' ? 'text-[#D4AF37]' :
                            u.loyalty_tier === 'silver' ? 'text-gray-400' : 'text-amber-600'
                          }`}>{u.loyalty_tier}</span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleToggleUserStatus(u)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title={u.is_active ? 'Désactiver' : 'Activer'}>
                              <RefreshCw className="w-4 h-4 text-gray-500" />
                            </button>
                            <button onClick={() => handleToggleUserStaff(u)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title={u.is_staff ? 'Retirer staff' : 'Ajouter staff'}>
                              <ShieldAlert className="w-4 h-4 text-gray-500" />
                            </button>
                            <button onClick={() => handleDeleteUser(u.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && <p className="text-center py-12 text-gray-500">Aucun utilisateur trouvé</p>}
              </div>
            )}
          </div>
        )}

        {/* === COUPONS === */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Gestion des <span className="text-[#D4AF37]">Coupons</span>
              </h2>
              <button onClick={() => openCouponModal()} className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
                <Plus className="w-4 h-4" /> Créer un Coupon
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full" /></div>
            ) : coupons.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {coupons.map(coupon => {
                  const discount = coupon.discount_type === 'percent' ? `${coupon.discount_percent}%` : `${coupon.discount_amount}€`
                  const usage = Math.min(100, coupon.max_uses > 0 ? (coupon.used_count / coupon.max_uses) * 100 : 0)
                  return (
                    <div key={coupon.id} className="p-6 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-2xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center">
                            <Tag className="w-6 h-6 text-[#0D1B2A]" />
                          </div>
                          <div>
                            <div className="text-xl font-bold text-gray-900">{coupon.code}</div>
                            <div className="text-[#D4AF37] font-semibold">{discount} de réduction</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => openCouponModal(coupon)} className="p-2 hover:bg-[#D4AF37]/10 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                          <button onClick={() => handleDeleteCoupon(coupon.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Utilisations</span>
                          <span className="text-gray-900 font-semibold">{coupon.used_count} / {coupon.max_uses || '∞'}</span>
                        </div>
                        {coupon.max_uses > 0 && (
                          <div className="w-full bg-gray-50 rounded-full h-2 overflow-hidden">
                            <div className="bg-[#D4AF37] h-full rounded-full transition-all" style={{ width: `${usage}%` }} />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center py-12 text-gray-500">Aucun coupon pour le moment</p>
            )}
          </div>
        )}

        {/* === AVIS === */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Gestion des <span className="text-[#D4AF37]">Avis</span>
              </h2>
              <span className="text-sm text-gray-500">{reviews.length} avis</span>
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full" /></div>
            ) : reviews.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-[#D4AF37]/20">
                      <th className="text-left py-3 px-3">Produit</th>
                      <th className="text-left py-3 px-3">Utilisateur</th>
                      <th className="text-center py-3 px-3">Note</th>
                      <th className="text-left py-3 px-3">Commentaire</th>
                      <th className="text-center py-3 px-3">Date</th>
                      <th className="text-right py-3 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((r: any) => (
                      <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-4 px-3">
                          <a href={`/produit/${r.product_slug}`} target="_blank" className="text-gray-900 font-semibold hover:text-[#D4AF37]">{r.product_title}</a>
                        </td>
                        <td className="py-4 px-3">
                          <div className="font-semibold text-gray-900">{r.user_name}</div>
                          <div className="text-gray-400 text-xs">{r.user_email}</div>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <div className="flex items-center justify-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-3 max-w-xs">
                          <p className="text-gray-600 truncate">{r.comment || <span className="text-gray-400 italic">Aucun commentaire</span>}</p>
                        </td>
                        <td className="py-4 px-3 text-center text-gray-500 text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                        <td className="py-4 px-3 text-right">
                          <button onClick={() => handleDeleteReview(r.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-12 text-gray-500">Aucun avis pour le moment</p>
            )}
          </div>
        )}

        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto" onClick={() => setShowProductModal(false)}>
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-2xl w-full my-4 sm:my-8" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  {editingProduct ? 'Modifier' : 'Ajouter'} un Produit
                </h3>
                <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2 space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm text-gray-500 font-medium">Titre *</label>
                  <input value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} placeholder="Titre du produit"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]" />
                </div>

                {/* Image principale */}
                <div className="sm:col-span-2 space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm text-gray-500 font-medium">Image de couverture</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-shrink-0 cursor-pointer">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 border-2 border-dashed border-[#D4AF37]/30 rounded-xl flex items-center justify-center hover:border-[#D4AF37] transition-colors overflow-hidden">
                        {mainImagePreview ? (
                          <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                        )}
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) { setMainImage(f); setMainImagePreview(URL.createObjectURL(f)) }
                      }} />
                    </label>
                    <span className="text-xs text-gray-400">Cliquez pour ajouter une image de couverture</span>
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm text-gray-500 font-medium">Type</label>
                  <select value={productForm.type} onChange={e => setProductForm({...productForm, type: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 focus:outline-none focus:border-[#D4AF37]">
                    <option value="ebook">Ebook</option>
                    <option value="template">Template</option>
                    <option value="formation">Formation</option>
                  </select>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm text-gray-500 font-medium">Catégorie</label>
                  <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 focus:outline-none focus:border-[#D4AF37]">
                    <option value="">Sélectionner</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm text-gray-500 font-medium">Prix (€) *</label>
                  <input type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} placeholder="29.99"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm text-gray-500 font-medium">Prix barre (€)</label>
                  <input type="number" step="0.01" value={productForm.compare_price} onChange={e => setProductForm({...productForm, compare_price: e.target.value})} placeholder="49.99"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm text-gray-500 font-medium">Format</label>
                  <input value={productForm.format} onChange={e => setProductForm({...productForm, format: e.target.value})} placeholder="PDF, MP4, ZIP..."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm text-gray-500 font-medium">Taille fichier</label>
                  <input value={productForm.file_size} onChange={e => setProductForm({...productForm, file_size: e.target.value})} placeholder="10 MB"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="sm:col-span-2 space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm text-gray-500 font-medium">Description courte</label>
                  <textarea value={productForm.short_description} onChange={e => setProductForm({...productForm, short_description: e.target.value})} placeholder="Brève description..."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] resize-none h-16 sm:h-12" />
                </div>
                <div className="sm:col-span-2 space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm text-gray-500 font-medium">Description complète</label>
                  <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} placeholder="Description détaillée..."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] resize-none h-20 sm:h-24" />
                </div>

                {/* Galerie d'images */}
                <div className="sm:col-span-2 space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm text-gray-500 font-medium">Galerie d'images</label>
                  <div className="flex flex-wrap gap-3">
                    {existingGallery.map((img: any) => (
                      <div key={img.id} className="relative group w-16 h-16 sm:w-20 sm:h-20">
                        <img src={img.image} alt="" className="w-full h-full object-cover rounded-lg border border-[#D4AF37]/20" />
                        <button onClick={async () => {
                          if (!editingProduct) return
                          try {
                            await productService.adminDeleteGalleryImage(editingProduct.slug, img.id)
                            setExistingGallery(prev => prev.filter(i => i.id !== img.id))
                            toast.success('Image supprimée')
                          } catch { toast.error('Erreur') }
                        }} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {galleryPreviews.map((url, idx) => (
                      <div key={idx} className="relative group w-16 h-16 sm:w-20 sm:h-20">
                        <img src={url} alt="" className="w-full h-full object-cover rounded-lg border border-[#D4AF37]/20" />
                        <button onClick={() => {
                          setGalleryFiles(prev => prev.filter((_, i) => i !== idx))
                          setGalleryPreviews(prev => prev.filter((_, i) => i !== idx))
                        }} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <label className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 border-2 border-dashed border-[#D4AF37]/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#D4AF37] transition-colors">
                      <Plus className="w-5 h-5 text-gray-300" />
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const files = Array.from(e.target.files || [])
                        setGalleryFiles(prev => [...prev, ...files])
                        setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
                      }} />
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2 flex flex-wrap items-center gap-3 sm:gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={productForm.is_active} onChange={e => setProductForm({...productForm, is_active: e.target.checked})}
                      className="w-4 h-4 accent-[#D4AF37]" />
                    <span className="text-xs sm:text-sm text-gray-600">Actif</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={productForm.is_featured} onChange={e => setProductForm({...productForm, is_featured: e.target.checked})}
                      className="w-4 h-4 accent-[#D4AF37]" />
                    <span className="text-xs sm:text-sm text-gray-600">Mis en avant</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={productForm.is_digital} onChange={e => setProductForm({...productForm, is_digital: e.target.checked})}
                      className="w-4 h-4 accent-[#D4AF37]" />
                    <span className="text-xs sm:text-sm text-gray-600">Digital</span>
                  </label>
                </div>
              </div>

              <button onClick={handleSaveProduct} className="mt-4 sm:mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
                <Save className="w-4 h-4" /> {editingProduct ? 'Mettre à jour' : 'Créer le produit'}
              </button>
            </div>
          </div>
        )}

        {/* Coupon Modal */}
        {showCouponModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCouponModal(false)}>
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCoupon ? 'Modifier' : 'Créer'} un Coupon
                </h3>
                <button onClick={() => setShowCouponModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 font-medium">Code *</label>
                  <input value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} placeholder="PROMO10"
                    className="w-full px-4 py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 font-medium">Type</label>
                  <select value={couponForm.discount_type} onChange={e => setCouponForm({...couponForm, discount_type: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 focus:outline-none focus:border-[#D4AF37]">
                    <option value="percent">Pourcentage</option>
                    <option value="fixed">Montant fixe</option>
                  </select>
                </div>
                {couponForm.discount_type === 'percent' ? (
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500 font-medium">Réduction (%)</label>
                    <input type="number" value={couponForm.discount_percent} onChange={e => setCouponForm({...couponForm, discount_percent: e.target.value})} placeholder="10"
                      className="w-full px-4 py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500 font-medium">Réduction (€)</label>
                    <input type="number" step="0.01" value={couponForm.discount_amount} onChange={e => setCouponForm({...couponForm, discount_amount: e.target.value})} placeholder="5.00"
                      className="w-full px-4 py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]" />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 font-medium">Achat minimum (€)</label>
                  <input type="number" step="0.01" value={couponForm.min_purchase} onChange={e => setCouponForm({...couponForm, min_purchase: e.target.value})} placeholder="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 font-medium">Utilisations max</label>
                  <input type="number" value={couponForm.max_uses} onChange={e => setCouponForm({...couponForm, max_uses: e.target.value})} placeholder="0 = illimité"
                    className="w-full px-4 py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 font-medium">Valable du</label>
                  <input type="datetime-local" value={couponForm.valid_from} onChange={e => setCouponForm({...couponForm, valid_from: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 font-medium">Valable au *</label>
                  <input type="datetime-local" value={couponForm.valid_to} onChange={e => setCouponForm({...couponForm, valid_to: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl text-gray-900 focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={couponForm.is_active} onChange={e => setCouponForm({...couponForm, is_active: e.target.checked})}
                      className="w-4 h-4 accent-[#D4AF37]" />
                    <span className="text-sm text-gray-600">Actif</span>
                  </label>
                </div>
              </div>

              <button onClick={handleSaveCoupon} className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
                <Save className="w-4 h-4" /> {editingCoupon ? 'Mettre à jour' : 'Créer le coupon'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}