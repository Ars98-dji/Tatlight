
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginSignup: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email);
      // Determine destination based on simulated role
      if (email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      alert("Erreur d'authentification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
           <h1 className="text-white text-3xl font-bold font-serif mb-2">
             {isLogin ? 'Bon retour parmi nous' : 'Créez votre compte'}
           </h1>
           <p className="text-white/50 text-sm">
             {isLogin ? 'Connectez-vous pour accéder à votre espace.' : 'Rejoignez-nous et illuminez votre créativité.'}
           </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="flex mb-8 bg-brand-night/50 p-1 rounded-xl">
             <button 
               onClick={() => setIsLogin(true)}
               className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-primary text-brand-dark' : 'text-white/50'}`}
             >
               Connexion
             </button>
             <button 
               onClick={() => setIsLogin(false)}
               className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-primary text-brand-dark' : 'text-white/50'}`}
             >
               Inscription
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="text-white/60 text-xs font-bold uppercase tracking-widest">Nom complet</label>
                <input required type="text" placeholder="Jean Dupont" className="bg-white/5 border-none rounded-xl py-3 px-5 text-white focus:ring-1 focus:ring-primary" />
              </div>
            )}
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
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-white/60 text-xs font-bold uppercase tracking-widest">Mot de passe</label>
                {isLogin && (
                  // Fixed: size prop is not valid on Link, moved styling to className
                  <Link to="/forgot-password" className="text-[10px] text-primary hover:underline">Oublié ?</Link>
                )}
              </div>
              <input 
                required 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="bg-white/5 border-none rounded-xl py-3 px-5 text-white focus:ring-1 focus:ring-primary" 
              />
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-primary text-brand-dark py-4 rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="h-5 w-5 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></span>
              ) : (
                isLogin ? 'Se connecter' : "S'inscrire"
              )}
            </button>
          </form>

          <div className="mt-8 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <span className="relative bg-brand-night px-4 text-xs text-white/30 uppercase font-bold tracking-widest">Ou</span>
          </div>

          <button className="w-full mt-8 flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-3 rounded-xl hover:bg-white/10 transition-all text-sm font-bold">
            {/* Fixed: Replaced escaped quotes in image URL with URL encoded %22 to prevent JSX parsing errors */}
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="h-5 w-5" alt="Google" />
            Continuer avec Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
