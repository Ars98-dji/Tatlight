
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_PRODUCTS } from '../mockData';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const lastOrders = INITIAL_PRODUCTS.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-white text-4xl font-bold font-serif mb-2">Votre Espace Tatlight</h1>
          <p className="text-white/50 text-sm">Bonjour {user.name} ! Bienvenue sur votre tableau de bord.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-white/50 text-[10px] font-bold uppercase">Vos Crédits</span>
            <span className="text-primary text-2xl font-black">{user.credits} pts</span>
          </div>
          <button className="bg-primary text-brand-dark px-4 py-2 rounded-lg font-bold text-xs hover:brightness-110">Utiliser</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Purchases Grid */}
        <div className="lg:col-span-2 space-y-8">
           <h2 className="text-white text-2xl font-bold font-serif">Mes Derniers Achats</h2>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             {lastOrders.map(p => (
               <div key={p.id} className="group flex flex-col gap-3">
                 <div className="aspect-[3/4] overflow-hidden rounded-xl relative">
                    <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                       <button className="bg-white text-brand-dark px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2">
                         <span className="material-symbols-outlined text-sm">download</span> Accéder
                       </button>
                    </div>
                 </div>
                 <div>
                    <h4 className="text-white text-sm font-bold truncate">{p.name}</h4>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{p.type}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-6">
              <h3 className="text-white font-bold">Menu</h3>
              <ul className="space-y-2">
                {['Mes Achats', 'Téléchargements', 'Favoris', 'Paramètres', 'Aide'].map(item => (
                  <li key={item} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white cursor-pointer transition-colors group">
                    <span className="material-symbols-outlined text-sm group-hover:text-primary transition-colors">circle</span>
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
           </div>

           <div className="bg-brand-night border border-white/10 p-6 rounded-2xl">
              <h3 className="text-white font-bold mb-4">Besoin d'aide ?</h3>
              <p className="text-white/50 text-xs leading-relaxed mb-6">
                Notre assistant mystique De-tatchegnon est à votre disposition 24/7.
              </p>
              <button className="w-full flex items-center justify-center gap-2 bg-white/5 text-white py-3 rounded-xl border border-white/10 hover:bg-white/10">
                 <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                 Ouvrir le chat
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
