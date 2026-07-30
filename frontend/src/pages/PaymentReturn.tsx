import { useEffect, useState } from 'react'
import { useSearchParams, useLocation, Link } from 'react-router-dom'
import { Check, X, Loader } from 'lucide-react'
import { orderService } from '../services/api'

export default function PaymentReturn() {
  const [params] = useSearchParams()
  const location = useLocation()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const transaction_id = params.get('id') || params.get('transaction_id')
    const tx_status = params.get('status')

    if (!transaction_id) {
      setStatus('error')
      setMessage('Paramètres de paiement manquants.')
      return
    }

    if (tx_status === 'approved') {
      setStatus('success')
      setMessage('Paiement confirmé avec succès !')
      return
    }

    orderService.fedapayVerify(transaction_id)
      .then(() => {
        setStatus('success')
        setMessage('Paiement confirmé avec succès !')
      })
      .catch((err: any) => {
        setStatus('error')
        setMessage(err?.response?.data?.error || 'Erreur lors de la vérification du paiement.')
      })
  }, [])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="space-y-6">
            <Loader className="w-16 h-16 text-[#D4AF37] animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Vérification du paiement...</h1>
            <p className="text-gray-500">Veuillez patienter pendant la confirmation.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Paiement réussi !</h1>
            <p className="text-gray-600">{message}</p>
            <div className="flex flex-col gap-3 pt-4">
              <Link to="/espace-utilisateur" className="px-8 py-4 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
                Accéder à mes achats
              </Link>
              <Link to="/" className="text-[#D4AF37] hover:underline">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <X className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Paiement échoué</h1>
            <p className="text-gray-600">{message}</p>
            <div className="flex flex-col gap-3 pt-4">
              <Link to="/" className="px-8 py-4 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
