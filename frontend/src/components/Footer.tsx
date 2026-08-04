
import { Link } from 'react-router-dom'
import {Sparkles, Mail} from 'lucide-react'
import { FaWhatsapp, FaTiktok, FaInstagram } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className="bg-[#0D1B2A] border-t border-[#C9A227]/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-[#C9A227]" />
              <span className="font-display text-xl font-bold text-white">Tatlight</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Illuminez votre parcours avec des contenus digitaux d'exception. Chaque produit est une porte vers l'excellence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[#C9A227] font-semibold mb-4">Navigation</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-white/60 hover:text-[#C9A227] transition-colors text-sm">
                Accueil
              </Link>
              <Link to="/categorie/ebooks" className="text-white/60 hover:text-[#C9A227] transition-colors text-sm">
                Ebooks
              </Link>
             
              <Link to="/categorie/templates" className="text-white/60 hover:text-[#C9A227] transition-colors text-sm">
                Templates
              </Link>
              <Link to="/categorie/formations" className="text-white/60 hover:text-[#C9A227] transition-colors text-sm">
                Formations
              </Link>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-[#C9A227] font-semibold mb-4">Réseaux</h3>
            <div className="flex flex-col gap-3">
              <a href="https://wa.me/22943448619" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-[#25D366] transition-colors text-sm">
                <FaWhatsapp className="w-4 h-4" />
                WhatsApp
              </a>
              <a href="https://www.tiktok.com/search?q=contenus%20digitaux" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-[#25F4EE] transition-colors text-sm">
                <FaTiktok className="w-4 h-4" />
                TikTok
              </a>
              <a href="https://www.instagram.com/explore/tags/contenudigital/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-[#E4405F] transition-colors text-sm">
                <FaInstagram className="w-4 h-4" />
                Instagram
              </a>
            </div>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-[#C9A227] font-semibold mb-4">Légal</h3>
            <div className="flex flex-col gap-2">
              <Link to="/confidentialite" className="text-white/60 hover:text-[#C9A227] transition-colors text-sm">
                Politique de confidentialité
              </Link>
              <Link to="/conditions" className="text-white/60 hover:text-[#C9A227] transition-colors text-sm">
                Termes et conditions
              </Link>
              <Link to="/securite" className="text-white/60 hover:text-[#C9A227] transition-colors text-sm">
                Sécurité
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#C9A227] font-semibold mb-4">Contact</h3>
            <div className="flex flex-col gap-3">
              <a href="mailto:contact@tatlight.com" className="flex items-center gap-2 text-white/60 hover:text-[#C9A227] transition-colors text-sm">
                <Mail className="w-4 h-4" />
                contact@tatlight.com
              </a>
              <p className="text-white/60 text-sm">
                Du lundi au vendredi<br />
                9h00 - 18h00
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#C9A227]/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2026 Tatlight. Tous droits réservés.
          </p>
          <p className="flex items-center gap-2 text-white/40 text-sm">
            Réalisé par Arsène DJIVOEDO
          </p>
        </div>
      </div>
    </footer>
  )
}
