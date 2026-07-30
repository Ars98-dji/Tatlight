
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth'
import { CartProvider } from './hooks/useCart'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Home from '@/pages/Home'
import Category from '@/pages/Category'
import Product from '@/pages/Product'
import Payment from '@/pages/Payment'
import PaymentReturn from '@/pages/PaymentReturn'
import Dashboard from '@/pages/Dashboard'
import Admin from '@/pages/Admin'
import Auth from '@/pages/Auth'
import About from '@/pages/About'
import Offline from '@/pages/Offline'
import Cart from '@/pages/Cart'
import Privacy from '@/pages/Privacy'
import Terms from '@/pages/Terms'
import Security from '@/pages/Security'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
        <div className="min-h-screen bg-white text-gray-900">
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#fff',
                color: '#1a1a1a',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              },
              success: { iconTheme: { primary: '#D4AF37', secondary: '#fff' } },
            }}
          />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categorie/:type" element={<Category />} />
              <Route path="/produit/:id" element={<Product />} />
              <Route path="/paiement/retour" element={<PaymentReturn />} />
              <Route path="/paiement/:id" element={<Payment />} />
              <Route path="/espace-utilisateur" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/connexion" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/hors-connexion" element={<Offline />} />
              <Route path="/confidentialite" element={<Privacy />} />
              <Route path="/conditions" element={<Terms />} />
              <Route path="/securite" element={<Security />} />
            </Routes>
          </main>
          <Footer />
        </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
