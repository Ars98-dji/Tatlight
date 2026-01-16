
import React from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_PRODUCTS } from '../mockData';

const Home: React.FC = () => {
  const featuredProduct = INITIAL_PRODUCTS[0];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/abstract-mystic/1920/1080" 
            className="w-full h-full object-cover opacity-40" 
            alt="Hero Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-white text-5xl md:text-7xl font-black font-serif leading-tight mb-6">
            Illuminez Vos Projets <br /><span className="text-primary italic">Créatifs</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Découvrez des outils digitaux uniques pour donner vie à vos idées. Tatlight est votre source d'inspiration pour créer sans limites.
          </p>
          <Link 
            to="/category/all" 
            className="inline-flex items-center gap-3 bg-primary text-brand-dark px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/20"
          >
            Découvrir nos créations
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto w-full px-4">
        <h2 className="text-white text-3xl font-bold font-serif text-center mb-12">Explorez nos univers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Ebooks', img: 'https://picsum.photos/seed/ebook/400/600', path: '/category/ebooks' },
            { label: 'Instrumentales', img: 'https://picsum.photos/seed/music/400/600', path: '/category/music' },
            { label: 'Templates Canva', img: 'https://picsum.photos/seed/tmpl/400/600', path: '/category/templates' },
            { label: 'Formations', img: 'https://picsum.photos/seed/form/400/600', path: '/category/formations' },
          ].map((cat, idx) => (
            <Link 
              key={idx} 
              to={cat.path}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl"
            >
              <img src={cat.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={cat.label} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <p className="text-white text-xl font-bold">{cat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Spotlight */}
      <section className="max-w-7xl mx-auto w-full px-4">
        <h2 className="text-white text-3xl font-bold font-serif text-center mb-12">Lumière du jour</h2>
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row p-6 md:p-12 gap-12 items-center">
          <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <img src={featuredProduct.image} className="w-full h-full object-cover" alt="Featured" />
          </div>
          <div className="flex-1 flex flex-col items-start gap-4">
             <span className="text-primary text-sm font-bold tracking-widest uppercase">Produit en vedette</span>
             <h3 className="text-white text-4xl font-bold font-serif">{featuredProduct.name}</h3>
             <p className="text-white/70 text-lg leading-relaxed mb-4">
               {featuredProduct.description}
             </p>
             <div className="flex items-center gap-6">
               <span className="text-white text-3xl font-black">{featuredProduct.price}€</span>
               <Link 
                 to={`/product/${featuredProduct.id}`}
                 className="bg-primary text-brand-dark px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all"
               >
                 Voir les détails
               </Link>
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto w-full px-4 text-center">
        <h2 className="text-white text-3xl font-bold font-serif mb-12">Ils ont été inspirés par Tatlight</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { author: "Clara M.", role: "Graphiste", text: "Les templates de Tatlight ont complètement transformé ma communication visuelle. C'est pro, simple et magnifique." },
            { author: "Léo D.", role: "Musicien", text: "Enfin des instrumentales de qualité qui ont une âme. J'ai trouvé le son parfait pour mon projet musical ici." },
            { author: "Sophie T.", role: "Entrepreneure", text: "La formation sur le marketing digital était claire, concise et pleine d'astuces. Un investissement rentable." },
          ].map((t, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col gap-4">
              <div className="flex justify-center text-primary">
                {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined">star</span>)}
              </div>
              <p className="text-white/80 italic text-sm leading-relaxed">"{t.text}"</p>
              <div className="mt-4">
                <p className="text-white font-bold">{t.author}</p>
                <p className="text-primary text-xs">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
