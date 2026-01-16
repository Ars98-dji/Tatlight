
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { INITIAL_PRODUCTS } from '../mockData';

const Category: React.FC = () => {
  const { slug } = useParams();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(300);

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType.length === 0 || selectedType.includes(p.type);
      const matchesPrice = p.price <= priceRange;
      return matchesSearch && matchesType && matchesPrice;
    });
  }, [search, selectedType, priceRange]);

  const toggleType = (type: string) => {
    setSelectedType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex flex-col gap-8 shrink-0">
        <div>
          <h3 className="text-white font-bold mb-6 flex justify-between items-center">
            Filtres
            <button 
              onClick={() => { setSelectedType([]); setSearch(''); setPriceRange(300); }}
              className="text-xs text-primary font-medium hover:underline"
            >
              Réinitialiser
            </button>
          </h3>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Type de produit</p>
              {['ebook', 'instrumental', 'template', 'formation'].map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="form-checkbox bg-transparent border-white/20 rounded text-primary focus:ring-primary"
                    checked={selectedType.includes(type)}
                    onChange={() => toggleType(type)}
                  />
                  <span className="text-white/80 text-sm capitalize group-hover:text-primary transition-colors">{type}s</span>
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Gamme de prix</p>
              <input 
                type="range" 
                min="0" 
                max="300" 
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-white/50">
                <span>0€</span>
                <span className="text-primary font-bold">{priceRange}€+</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Grid */}
      <div className="flex-1 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-white text-4xl font-bold font-serif mb-2 capitalize">Explorez {slug === 'all' ? 'nos créations' : slug}</h1>
            <p className="text-white/50 text-sm">Trouvez l'inspiration parmi notre sélection exclusive.</p>
          </div>
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30">search</span>
            <input 
              type="text" 
              placeholder="Rechercher une création..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border-none rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group flex flex-col gap-4"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-2xl relative">
                  <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={product.name} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-primary text-brand-dark px-6 py-2 rounded-full font-bold">Voir détails</button>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-white/50 text-xs capitalize">{product.type}</p>
                    <p className="text-primary font-bold">{product.price}€</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-white/20 text-6xl mb-4">sentiment_dissatisfied</span>
            <p className="text-white/50">Aucun produit ne correspond à vos filtres.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
