
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Chatbot from './Chatbot';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-brand-dark/80 backdrop-blur-md border-b border-white/10 px-4 md:px-10 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="material-symbols-outlined text-primary text-3xl transition-transform group-hover:rotate-12">auto_awesome</span>
            <span className="text-white text-2xl font-black font-serif tracking-tight">Tatlight</span>
          </Link>

          <div className="hidden lg:flex items-center gap-9 text-sm font-medium text-white/80">
            <Link to="/category/ebooks" className="hover:text-primary transition-colors">Ebooks</Link>
            <Link to="/category/music" className="hover:text-primary transition-colors">Musique</Link>
            <Link to="/category/templates" className="hover:text-primary transition-colors">Templates</Link>
            <Link to="/category/formations" className="hover:text-primary transition-colors">Formations</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/checkout" className="relative p-2 text-white/80 hover:text-white transition-colors">
              <span className="material-symbols-outlined">shopping_cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-brand-dark text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to={isAdmin ? "/admin" : "/dashboard"} className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-bold text-white leading-none">{user.name}</span>
                  <span className="text-[10px] text-primary">{user.role === 'admin' ? 'Administrateur' : 'Membre Premium'}</span>
                </Link>
                <div className="relative group">
                  <img src={user.avatar} className="h-10 w-10 rounded-full border border-primary/50 cursor-pointer" alt="Avatar" />
                  <div className="absolute right-0 mt-2 w-48 bg-brand-gray border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-50">
                    <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-md text-sm">
                      <span className="material-symbols-outlined text-sm">dashboard</span> {isAdmin ? 'Back-office' : 'Mon Espace'}
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 p-2 hover:bg-red-500/10 text-red-400 rounded-md text-sm">
                      <span className="material-symbols-outlined text-sm">logout</span> Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="px-6 py-2 bg-primary text-brand-dark font-bold rounded-lg hover:brightness-110 transition-all text-sm">
                Connexion
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-night border-t border-white/10 py-12 px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
             <div className="flex items-center gap-3 text-primary mb-4">
               <span className="material-symbols-outlined text-3xl">auto_awesome</span>
               <span className="text-white text-2xl font-black font-serif">Tatlight</span>
             </div>
             <p className="text-white/60 text-sm max-w-sm leading-relaxed">
               Tatlight est votre univers dédié à l'excellence créative digitale. Illuminez vos projets avec nos ressources exclusives.
             </p>
             <div className="flex gap-4 mt-6">
                <span className="material-symbols-outlined text-white/50 hover:text-primary cursor-pointer">public</span>
                <span className="material-symbols-outlined text-white/50 hover:text-primary cursor-pointer">mail</span>
                <span className="material-symbols-outlined text-white/50 hover:text-primary cursor-pointer">smart_display</span>
             </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Navigation</h4>
            <ul className="text-white/60 text-sm space-y-2">
              <li><Link to="/about" className="hover:text-primary">À propos</Link></li>
              <li><Link to="/about" className="hover:text-primary">Contact</Link></li>
              <li><Link to="/" className="hover:text-primary">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Légal</h4>
            <ul className="text-white/60 text-sm space-y-2">
              <li><Link to="/" className="hover:text-primary">CGV</Link></li>
              <li><Link to="/" className="hover:text-primary">Confidentialité</Link></li>
              <li><Link to="/" className="hover:text-primary">Mentions légales</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-white/30 text-xs">
          © 2024 Tatlight. Tous droits réservés.
        </div>
      </footer>

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Layout;
