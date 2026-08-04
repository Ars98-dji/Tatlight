import { useEffect, useState } from 'react'
import { useSearchParams, useLocation, Link, useNavigate } from 'react-router-dom'
import { Check, X, Loader } from 'lucide-react'
import { orderService } from '../services/api'

export default function PaymentReturn() {
  const [params] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const transaction_id = params.get('id') || params.get('transaction_id')
    const tx_status = params.get('status')

    if (tx_status === 'cancelled' || tx_status === 'canceled' || params.get('close') === 'true') {
      navigate('/', { replace: true })
      return
    }

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
        const txStatus = err?.response?.data?.status
        if (txStatus === 'cancelled' || txStatus === 'canceled' || txStatus === 'pending') {
          navigate('/', { replace: true })
          return
        }
        setStatus('error')
        setMessage(err?.response?.data?.error || 'Erreur lors de la vérification du paiement.')
      })
  }, [])

  return (
    <div className="min-h-screen bg-[#FBF7EF] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute left-1/2 -top-40 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(201,162,39,0.12), transparent 60%)' }}
        />
      </div>
      <div className="max-w-md w-full text-center relative">
        {status === 'loading' && (
          <div className="space-y-6">
            <Loader className="w-16 h-16 text-[#C9A227] animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Vérification du paiement...</h1>
            <p className="text-gray-500">Veuillez patienter pendant la confirmation.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-[#C9A227]/15 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(212,175,55,0.35)]">
              <Check className="w-10 h-10 text-[#C9A227]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Paiement réussi !</h1>
            <p className="text-gray-600">{message}</p>
            <div className="flex flex-col gap-3 pt-4">
              <Link to="/espace-utilisateur" className="px-8 py-4 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
                Accéder à mes achats
              </Link>
              <Link to="/" className="text-[#C9A227] hover:underline">
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
              <Link to="/" className="px-8 py-4 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
