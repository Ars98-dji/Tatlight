import React, { useState, useEffect } from "react"
import { useParams, Link } from 'react-router-dom'
import {Filter, Grid, List, Star, TrendingUp, ArrowRight, Search} from 'lucide-react'
import { productService } from '../services/api'

interface Product { id: string; title: string; slug: string; short_description: string; price: string; image?: string; sales_count: number; rating: string; rating_count: number; }

const categoryTitles: Record<string, string> = { ebooks: 'Ebooks', templates: 'Templates Canva', formations: 'Formations' }

export default function Category() {
  const { type } = useParams()
  const categorySlug = type || 'ebooks'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('popularity')
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 12

  const loadProducts = (currentPage: number) => {
    setLoading(true)
    const fetchFn = ['ebooks', 'templates', 'formations'].includes(categorySlug)
      ? productService.getProductsByType(categorySlug === 'ebooks' ? 'ebook' : categorySlug === 'templates' ? 'template' : 'formation')
      : productService.getProductsByCategory(categorySlug)
    fetchFn.then((data) => {
      const results = Array.isArray(data) ? data : data.results || []
      setProducts(results)
      setTotalPages(data.total_pages || Math.ceil((data.count || results.length) / pageSize) || 1)
    }).catch(() => setProducts([])).finally(() => setLoading(false))
  }

  useEffect(() => {
    setPage(1)
    loadProducts(1)
  }, [categorySlug])

  useEffect(() => {
    loadProducts(page)
  }, [page])

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price)
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price)
    if (sortBy === 'rating') return Number(b.rating) - Number(a.rating)
    if (sortBy === 'newest') return 0
    return b.sales_count - a.sales_count
  })

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[#D4AF37]/60 text-base mb-4">
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-[#D4AF37]">{categoryTitles[categorySlug] || categorySlug}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{categoryTitles[categorySlug] || 'Catégorie'}</h1>
          <p className="text-gray-500 text-lg">Découvrez notre collection exclusive de contenus premium</p>
        </div>

        <div className="mb-8 p-6 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full px-4 py-2 bg-gray-50 border border-[#D4AF37]/30 rounded-lg text-gray-900 focus:outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-gray-900 font-medium">Trier par:</span>
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 bg-gray-50 border border-[#D4AF37]/30 rounded-lg text-gray-900 focus:outline-none focus:border-[#D4AF37] transition-colors">
                <option value="popularity">Popularité</option>
                <option value="price-low">Prix Croissant</option>
                <option value="price-high">Prix Décroissant</option>
                <option value="rating">Meilleures Notes</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 border border-[#D4AF37]/30 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#D4AF37] text-[#0D1B2A]' : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'}`}><Grid className="w-5 h-5" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#D4AF37] text-[#0D1B2A]' : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'}`}><List className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full" /></div>
        ) : sortedProducts.length === 0 ? (
          <div className="p-12 text-center bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun contenu trouvé</h3>
            <p className="text-gray-500">Cette catégorie sera bientôt disponible</p>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
              {sortedProducts.map((product) => (
                <Link key={product.id} to={`/produit/${product.slug}`} className={`group bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all hover:glow-gold-subtle ${viewMode === 'list' ? 'flex gap-6' : ''}`}>
                  <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-[4/3]'} overflow-hidden bg-[#D4AF37]/5`}>
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><TrendingUp className="w-8 h-8 text-[#D4AF37]/30" /></div>
                    )}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#D4AF37] text-[#0D1B2A] rounded-full text-sm font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />{product.sales_count}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2">{product.title}</h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.short_description}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < Math.floor(Number(product.rating)) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#D4AF37]/30'}`} />))}
                        </div>
                        <span className="text-gray-500 text-sm">{product.rating} ({product.rating_count} avis)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-[#D4AF37]">{product.price}€</div>
                        <div className="flex items-center gap-2 text-[#D4AF37] font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">Voir Détails <ArrowRight className="w-5 h-5" /></div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-[#D4AF37] font-semibold hover:bg-[#D4AF37]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Précédent</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-lg font-semibold transition-all ${page === p ? 'bg-[#D4AF37] text-[#0D1B2A]' : 'bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20'}`}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-[#D4AF37] font-semibold hover:bg-[#D4AF37]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Suivant</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
