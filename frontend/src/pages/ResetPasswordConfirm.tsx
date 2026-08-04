import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { authService } from '../services/api'
import toast from 'react-hot-toast'

type Status = 'form' | 'loading' | 'success' | 'error'

function passwordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  const labels = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Excellent']
  const colors = ['#EF4444', '#F97316', '#C9A227', '#84CC16', '#22C55E']
  return { score, label: labels[score], color: colors[score] }
}

export default function ResetPasswordConfirm() {
  const { uid, token } = useParams()
  const navigate = useNavigate()

  const [status, setStatus] = useState<Status>('form')
  const [errorMsg, setErrorMsg] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (newPassword.length < 8) {
      toast.error('8 caractères minimum')
      return
    }
    if (newPassword !== newPasswordConfirm) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    setStatus('loading')
    try {
      await authService.confirmResetPassword({
        uid: uid || '',
        token: token || '',
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      })
      setStatus('success')
      toast.success('Mot de passe réinitialisé avec succès !')
    } catch (error: any) {
      const data = error.response?.data
      setErrorMsg(data?.error || 'Ce lien est invalide ou expiré.')
      setStatus('error')
    }
  }

  const inputClass = 'w-full px-4 py-3 bg-white border border-[#0D1B2A]/15 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 transition-all'

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden bg-[#FBF7EF]">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute left-1/2 -top-40 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(201,162,39,0.12), transparent 60%)' }}
        />
      </div>
      <div className="max-w-md w-full relative">
        <div className="text-center mb-8">
          <p className="eyebrow block mb-3">Récupération de compte</p>
          <h1 className="font-display text-4xl font-bold text-[#0D1B2A] mb-2">
            Nouveau <span className="text-[#C9A227] glow-gold">mot de passe</span>
          </h1>
          <p className="text-gray-500">Choisissez un nouveau mot de passe pour votre compte</p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-[#C9A227]/20">
          {status === 'success' ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-[#C9A227]/15 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(212,175,55,0.35)]">
                <svg className="w-10 h-10 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path className="check-draw" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#0D1B2A] mb-2">Mot de passe modifié</h2>
              <p className="text-gray-500 mb-8">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3.5 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all"
              >
                Se connecter
              </button>
            </div>
          ) : status === 'error' ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v3.5m0 3.5h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#0D1B2A] mb-2">Réinitialisation impossible</h2>
              <p className="text-gray-500 mb-8">{errorMsg}</p>
              <Link
                to="/connexion"
                className="inline-block w-full py-3.5 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all"
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className={`${inputClass} pr-12`}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {newPassword && (() => {
                    const strength = passwordStrength(newPassword)
                    return (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex-1 flex gap-1">
                          {[0, 1, 2, 3, 4].map(i => (
                            <div
                              key={i}
                              className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                              style={{ backgroundColor: i < strength.score ? strength.color : '#EDEDF0' }}
                            />
                          ))}
                        </div>
                        <p className="text-xs font-medium whitespace-nowrap" style={{ color: strength.color }}>
                          {strength.label}
                        </p>
                      </div>
                    )
                  })()}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Confirmer le mot de passe</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={newPasswordConfirm}
                      onChange={e => setNewPasswordConfirm(e.target.value)}
                      className={`${inputClass} pr-12`}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3.5 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {status === 'loading' ? 'Enregistrement…' : 'Réinitialiser le mot de passe'}
                </button>
              </form>
              <button
                type="button"
                onClick={() => navigate('/connexion')}
                className="mt-4 w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Retour à la connexion
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
