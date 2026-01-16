
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { INITIAL_PRODUCTS } from '../mockData';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const product = INITIAL_PRODUCTS.find(p => p.id === id);

  if (!product) {
    return <div className="p-20 text-center text-white">Produit introuvable.</div>;
  }

  const handleAddToCart = () => {
    addItem(product);
    // Optional: visual feedback or redirect
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex gap-2 mb-8 text-xs text-white/50 uppercase tracking-widest">
        <Link to="/" className="hover:text-primary">Accueil</Link>
        <span>/</span>
        <Link to="/category/all" className="hover:text-primary">Boutique</Link>
        <span>/</span>
        <span className="text-white">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Product Images */}
        <div className="flex flex-col gap-6">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
            <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden opacity-50 hover:opacity-100 cursor-pointer border-2 border-transparent hover:border-primary transition-all">
                <img src={`https://picsum.photos/seed/${product.id}-${i}/400/400`} className="w-full h-full object-cover" alt="Preview" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-white text-5xl font-bold font-serif mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
               <div className="flex text-primary">
                 {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-lg">star</span>)}
               </div>
               <span className="text-white/40 text-sm">(4.8 sur 15 avis)</span>
               <span className="text-primary text-xs font-bold uppercase bg-primary/10 px-3 py-1 rounded-full">{product.type}</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col gap-6">
             <div className="flex items-baseline gap-4">
               <span className="text-white text-4xl font-black">{product.price}€</span>
               <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                 <span className="material-symbols-outlined text-sm">verified</span>
                 Gagnez {(product.price * 10).toFixed(0)} crédits
               </span>
             </div>
             <div className="flex gap-4">
               <button 
                 onClick={handleAddToCart}
                 className="flex-1 bg-primary text-brand-dark py-4 rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
               >
                 <span className="material-symbols-outlined">shopping_cart</span>
                 Ajouter au panier
               </button>
               <button className="p-4 bg-white/5 text-white rounded-xl hover:bg-white/10 border border-white/10">
                 <span className="material-symbols-outlined">favorite</span>
               </button>
             </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-lg">Description</h3>
            <p className="text-white/70 leading-relaxed">
              {product.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">download</span>
              <div className="flex flex-col">
                <span className="text-white text-xs font-bold">Disponible</span>
                <span className="text-white/40 text-[10px]">Téléchargement instantané</span>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">security</span>
              <div className="flex flex-col">
                <span className="text-white text-xs font-bold">Paiement 100%</span>
                <span className="text-white/40 text-[10px]">Sécurisé par Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
