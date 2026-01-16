
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout: React.FC = () => {
  const { items, total, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'cart' | 'payment'>('cart');

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-white text-3xl font-bold mb-8">Votre panier est vide</h1>
        <Link to="/category/all" className="bg-primary text-brand-dark px-8 py-3 rounded-xl font-bold">
          Continuer mes achats
        </Link>
      </div>
    );
  }

  const handlePayment = () => {
    // Simulate payment
    setTimeout(() => {
      clearCart();
      alert("Paiement réussi ! Vous allez être redirigé vers votre espace.");
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-white text-4xl font-bold font-serif mb-12 text-center">Finaliser ma commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Cart / Form */}
        <div className="lg:col-span-2 space-y-8">
          {step === 'cart' ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-white font-bold">Récapitulatif des articles</h3>
              </div>
              <div className="divide-y divide-white/5">
                {items.map(item => (
                  <div key={item.id} className="p-6 flex items-center gap-6">
                    <img src={item.image} className="h-20 w-16 object-cover rounded-lg" alt="" />
                    <div className="flex-1">
                      <h4 className="text-white font-bold">{item.name}</h4>
                      <p className="text-white/40 text-xs capitalize">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{item.price}€</p>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 text-[10px] uppercase font-bold hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-white/5">
                 <button 
                  onClick={() => setStep('payment')}
                  className="w-full bg-primary text-brand-dark py-4 rounded-xl font-bold hover:brightness-110"
                 >
                   Passer au paiement
                 </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                 <h3 className="text-white font-bold mb-6">Informations de paiement</h3>
                 <div className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="flex flex-col gap-2">
                       <label className="text-white/60 text-xs font-bold uppercase">Numéro de carte</label>
                       <input type="text" placeholder="**** **** **** ****" className="bg-white/5 border-none rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-primary" />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-white/60 text-xs font-bold uppercase">Titulaire</label>
                        <input type="text" placeholder="NOM COMPLET" className="bg-white/5 border-none rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-primary" />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-white/60 text-xs font-bold uppercase">Expiration</label>
                        <input type="text" placeholder="MM/AA" className="bg-white/5 border-none rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-primary" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-white/60 text-xs font-bold uppercase">CVC</label>
                        <input type="text" placeholder="123" className="bg-white/5 border-none rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-primary" />
                      </div>
                   </div>
                 </div>
                 <button 
                  onClick={handlePayment}
                  className="w-full mt-8 bg-primary text-brand-dark py-4 rounded-xl font-bold hover:brightness-110 flex items-center justify-center gap-3"
                 >
                   <span className="material-symbols-outlined">lock</span>
                   Payer {total.toFixed(2)}€
                 </button>
                 <button 
                   onClick={() => setStep('cart')}
                   className="w-full mt-4 text-white/40 text-sm hover:text-white transition-colors"
                 >
                   Retour au panier
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
           <div className="bg-brand-night border border-white/10 p-8 rounded-2xl sticky top-28">
             <h3 className="text-white font-bold mb-6">Résumé</h3>
             <div className="space-y-4 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Sous-total</span>
                  <span className="text-white">{total.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>TVA (20%)</span>
                  <span className="text-white">{(total * 0.2).toFixed(2)}€</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-primary">{(total * 1.2).toFixed(2)}€</span>
                </div>
             </div>
             <div className="mt-8 flex items-center gap-3 p-4 bg-primary/10 rounded-xl text-primary text-xs">
                <span className="material-symbols-outlined">verified</span>
                <span>Paiement sécurisé par cryptage SSL</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
