import React, { useState } from "react"
import { Link } from 'react-router-dom'
import {Menu, X, Sparkles, User, ShoppingCart, LogOut} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { totalItems } = useCart()

  return (
    <header className="bg-[#0D1B2A] border-b border-[#D4AF37]/20 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-[#D4AF37] group-hover:glow-gold-strong transition-all" />
              <div className="absolute inset-0 bg-[#D4AF37]/20 blur-xl group-hover:blur-2xl transition-all"></div>
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
              Tatlight
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              Accueil
            </Link>
            <Link to="/categorie/ebooks" className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              Ebooks
            </Link>
            <Link to="/categorie/templates" className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              Templates
            </Link>
            <Link to="/categorie/formations" className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              Formations
            </Link>
            <Link to="/a-propos" className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              À Propos
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/panier" className="relative p-2 rounded-full hover:bg-[#D4AF37]/10 transition-colors">
              <ShoppingCart className="w-5 h-5 text-[#D4AF37]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-[#0D1B2A] text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/espace-utilisateur" className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full hover:bg-[#D4AF37]/20 transition-all">
                  <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center">
                    <span className="text-[#0D1B2A] text-xs font-bold">{user.first_name?.charAt(0) || user.email?.charAt(0)}</span>
                  </div>
                  <span className="text-white/90 text-sm font-medium">{user.first_name || 'Mon Compte'}</span>
                </Link>
                <button onClick={logout} className="p-2 rounded-full hover:bg-red-500/10 transition-colors" title="Déconnexion">
                  <LogOut className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 px-6 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all"
              >
                <User className="w-4 h-4" />
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-[#D4AF37]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              Accueil
            </Link>
            <Link to="/categorie/ebooks" onClick={() => setIsMenuOpen(false)} className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              Ebooks
            </Link>
            <Link to="/categorie/templates" onClick={() => setIsMenuOpen(false)} className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              Templates
            </Link>
            <Link to="/categorie/formations" onClick={() => setIsMenuOpen(false)} className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              Formations
            </Link>
            <Link to="/a-propos" onClick={() => setIsMenuOpen(false)} className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              À Propos
            </Link>
            {user ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-[#D4AF37]/20">
                <Link to="/espace-utilisateur" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
                  <User className="w-4 h-4" /> Mon Compte
                </Link>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-medium text-left">
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold"
              >
                <User className="w-4 h-4" />
                Connexion
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
