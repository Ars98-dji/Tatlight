import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import toast from 'react-hot-toast'

type Status = 'loading' | 'success' | 'already' | 'error'

const COUNTDOWN_SECONDS = 3

export default function VerifyEmail() {
  const { uid, token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const [resendEmail, setResendEmail] = useState('')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  async function handleResend(e: React.FormEvent) {
    e.preventDefault()
    if (!resendEmail.trim()) return
    setResending(true)
    try {
      await authService.resendVerification(resendEmail.trim())
      setResent(true)
      toast.success('Email de vérification renvoyé !')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'envoi de l\'email')
    } finally {
      setResending(false)
    }
  }

  useEffect(() => {
    let mounted = true
    async function verify() {
      if (!uid || !token) {
        setStatus('error')
        setMessage('Lien de vérification invalide.')
        return
      }
      try {
        const data = await authService.verifyEmail(uid, token)
        if (!mounted) return
        const msg = data.message || 'Email vérifié avec succès !'
        if (msg.includes('déjà vérifié')) {
          setStatus('already')
        } else {
          setStatus('success')
        }
        setMessage(msg)
      } catch (error: any) {
        if (!mounted) return
        setStatus('error')
        const data = error.response?.data
        setMessage(data?.error || data?.message || 'Ce lien est invalide ou expiré.')
      }
    }
    verify()
    return () => { mounted = false }
  }, [uid, token])

  useEffect(() => {
    if (status !== 'success') return
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          navigate('/login', { replace: true })
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [status, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden bg-[#FBF7EF]">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute left-1/2 -top-40 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(201,162,39,0.12), transparent 60%)' }}
        />
      </div>
      <div className="max-w-md w-full relative">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-[#C9A227]/20 animate-fade-in">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-8 flex items-center justify-center">
              <span className="text-2xl font-black tracking-widest text-[#0D1B2A]">TAT<span className="text-[#C9A227]">LIGHT</span></span>
            </div>

            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${
                status === 'loading' ? 'bg-[#C9A227]/10'
                : status === 'success' ? 'bg-[#C9A227]/15 shadow-[0_0_40px_rgba(212,175,55,0.35)]'
                : status === 'already' ? 'bg-[#C9A227]/10'
                : 'bg-red-50'
              }`}
            >
              {status === 'loading' ? (
                <div className="w-10 h-10 border-4 border-[#C9A227]/20 border-t-[#C9A227] rounded-full animate-spin" />
              ) : status === 'success' ? (
                <svg className="w-10 h-10 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path className="check-draw" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : status === 'already' ? (
                <svg className="w-10 h-10 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path className="check-draw" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v3.5m0 3.5h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                </svg>
              )}
            </div>

            {status === 'loading' && (
              <>
                <h1 className="text-2xl font-bold text-[#0D1B2A] mb-2">Vérification en cours…</h1>
                <p className="text-gray-500">Nous confirmons votre adresse email.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <h1 className="text-2xl font-bold text-[#0D1B2A] mb-2">Adresse email vérifiée</h1>
                <p className="text-gray-500 mb-2">Votre compte Tatlight est maintenant pleinement actif.</p>
                <p className="text-sm text-gray-400 mb-8">Redirection vers la connexion dans {countdown} s…</p>
                <Link
                  to="/login"
                  className="inline-block w-full py-3.5 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all"
                >
                  Se connecter maintenant
                </Link>
                <p className="mt-6 text-xs text-gray-400">
                  🔒 Votre email est vérifié. Seul le propriétaire du compte peut accéder à cette confirmation.
                </p>
              </>
            )}

            {status === 'already' && (
              <>
                <h1 className="text-2xl font-bold text-[#0D1B2A] mb-2">Email déjà vérifié</h1>
                <p className="text-gray-500 mb-8">Votre adresse était déjà confirmée. Vous pouvez vous connecter.</p>
                <Link
                  to="/login"
                  className="inline-block w-full py-3.5 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all"
                >
                  Se connecter
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <h1 className="text-2xl font-bold text-[#0D1B2A] mb-2">Lien invalide ou expiré</h1>
                <p className="text-gray-500 mb-6">{message}</p>
                {resent ? (
                  <>
                    <div className="bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-xl p-4 mb-6 text-sm text-gray-700">
                      Un nouvel email de vérification a été envoyé. Cliquez sur le lien qu'il contient pour activer votre compte.
                    </div>
                    <Link
                      to="/connexion"
                      className="inline-block w-full py-3.5 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all"
                    >
                      Se connecter
                    </Link>
                  </>
                ) : (
                  <form onSubmit={handleResend} className="space-y-4 mb-4">
                    <input
                      type="email"
                      required
                      value={resendEmail}
                      onChange={e => setResendEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      className="w-full px-4 py-3 bg-white border border-[#0D1B2A]/15 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={resending}
                      className="w-full py-3.5 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resending ? 'Envoi…' : "Renvoyer l'email de vérification"}
                    </button>
                  </form>
                )}
                <p className="text-xs text-gray-400">
                  Si le problème persiste, contactez notre support à contact@tatlight.com.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
