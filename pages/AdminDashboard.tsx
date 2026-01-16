
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_PRODUCTS } from '../mockData';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <div className="p-20 text-center text-white">Accès refusé.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-white text-4xl font-bold font-serif mb-2">Back-office Administrateur</h1>
          <p className="text-white/50 text-sm">Gestion des performances et du catalogue Tatlight.</p>
        </div>
        <button className="bg-primary text-brand-dark px-6 py-3 rounded-xl font-bold hover:brightness-110 flex items-center gap-2">
           <span className="material-symbols-outlined">add</span>
           Ajouter un contenu
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Chiffre d'affaires", value: "€12,450", trend: "+5.2%", color: "text-green-400" },
          { label: "Ventes du mois", value: "1,820", trend: "+12.1%", color: "text-green-400" },
          { label: "Utilisateurs actifs", value: "4,530", trend: "+8.0%", color: "text-green-400" },
        ].map((s, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col gap-2">
            <p className="text-white/50 text-xs font-bold uppercase">{s.label}</p>
            <p className="text-white text-3xl font-black">{s.value}</p>
            <p className={`${s.color} text-xs font-bold`}>{s.trend} depuis le mois dernier</p>
          </div>
        ))}
      </div>

      {/* Product Management Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
           <h3 className="text-white font-bold">Catalogue produits</h3>
           <div className="flex gap-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">search</span>
                <input type="text" placeholder="Rechercher..." className="bg-brand-night border-none rounded-lg pl-9 pr-4 py-2 text-xs text-white" />
              </div>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-white/30 text-[10px] uppercase font-bold border-b border-white/5">
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Prix</th>
                <th className="px-6 py-4">Ventes</th>
                <th className="px-6 py-4">Note</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-white/80 divide-y divide-white/5">
              {INITIAL_PRODUCTS.map(p => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img src={p.image} className="h-10 w-8 object-cover rounded" alt="" />
                    <span className="font-bold">{p.name}</span>
                  </td>
                  <td className="px-6 py-4 capitalize">{p.type}</td>
                  <td className="px-6 py-4 font-bold">{p.price}€</td>
                  <td className="px-6 py-4">{p.sales}</td>
                  <td className="px-6 py-4 text-primary">★ {p.rating}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg text-white/50 hover:text-red-400">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
