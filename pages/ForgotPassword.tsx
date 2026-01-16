
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  if (isSent) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl">
           <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/20">
             <span className="material-symbols-outlined text-4xl text-primary animate-pulse">mark_email_read</span>
           </div>
           <h2 className="text-white text-3xl font-bold font-serif mb-4">Vérifiez votre boîte mail</h2>
           <p className="text-white/60 text-sm leading-relaxed mb-8">
             Un lien de réinitialisation a été envoyé à <span className="text-white font-bold">{email}</span>. N'oubliez pas de vérifier vos spams.
           </p>
           <Link to="/login" className="inline-block w-full bg-primary text-brand-dark py-4 rounded-xl font-bold hover:brightness-110">
             Retour à la connexion
           </Link>
           <button onClick={() => setIsSent(false)} className="mt-6 text-primary text-xs hover:underline">
             Renvoyer l'email
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
           <h1 className="text-white text-3xl font-bold font-serif mb-2">Mot de passe oublié ?</h1>
           <p className="text-white/50 text-sm">Saisissez votre email pour recevoir les instructions.</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-white/60 text-xs font-bold uppercase tracking-widest">Email</label>
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com" 
                  className="bg-white/5 border-none rounded-xl py-3 px-5 text-white focus:ring-1 focus:ring-primary" 
                />
              </div>
              <button className="w-full bg-primary text-brand-dark py-4 rounded-xl font-bold hover:brightness-110">
                Envoyer le lien
              </button>
           </form>
           <Link to="/login" className="block text-center mt-6 text-white/30 text-xs hover:text-white">
             Annuler et revenir
           </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
