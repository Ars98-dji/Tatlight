import React, { useState, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { authService } from '../services/api'
import toast from 'react-hot-toast'

type Mode = 'connexion' | 'inscription' | 'reset'

interface FormData {
  email: string
  password: string
  passwordConfirm: string
  firstName: string
  lastName: string
  terms: boolean
}

type FormErrors = Partial<Record<keyof FormData, string>>

const initialForm: FormData = {
  email: '',
  password: '',
  passwordConfirm: '',
  firstName: '',
  lastName: '',
  terms: false,
}

function validate(form: FormData, mode: Mode): FormErrors {
  const errors: FormErrors = {}

  if (mode === 'reset') {
    if (!form.email) errors.email = 'L\'email est requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email invalide'
    return errors
  }

  if (!form.email) errors.email = 'L\'email est requis'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email invalide'

  if (!form.password) errors.password = 'Le mot de passe est requis'
  else if (form.password.length < 8) errors.password = '8 caractères minimum'

  if (mode === 'inscription') {
    if (!form.firstName.trim()) errors.firstName = 'Le prénom est requis'
    if (!form.passwordConfirm) errors.passwordConfirm = 'Confirmation requise'
    else if (form.password !== form.passwordConfirm) errors.passwordConfirm = 'Les mots de passe ne correspondent pas'
    if (!form.terms) errors.terms = 'Vous devez accepter les conditions d\'utilisation'
  }

  return errors
}

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

function InputField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function Auth() {
  const location = useLocation()
  const [mode, setMode] = useState<Mode>(location.pathname === '/register' ? 'inscription' : 'connexion')
  const [form, setForm] = useState<FormData>(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({})
  const [resetSent, setResetSent] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [resending, setResending] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const emailRef = useRef<HTMLInputElement>(null)

  function updateField(field: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))
    if (errors[field]) {
      const next = { ...errors }
      delete next[field]
      setErrors(next)
    }
  }

  function switchMode(m: Mode) {
    setMode(m)
    setForm(initialForm)
    setErrors({})
    setTouched({})
    setShowPassword(false)
    setShowConfirm(false)
    setResetSent(false)
    setShowVerify(false)
  }

  async function handleResend() {
    setResending(true)
    try {
      await authService.resendVerification(form.email)
      toast.success('Email de vérification renvoyé !')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'envoi de l\'email')
    } finally {
      setResending(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validation = validate(form, mode)
    setErrors(validation)
    setTouched({ email: true, password: true, passwordConfirm: true, firstName: true, terms: true })

    if (Object.keys(validation).length > 0) return

    setLoading(true)
    try {
      if (mode === 'reset') {
        await authService.resetPassword(form.email)
        setResetSent(true)
        toast.success('Email de réinitialisation envoyé !')
        return
      }
      if (mode === 'connexion') {
        await login(form.email, form.password, rememberMe)
        toast.success('Connexion réussie !')
        navigate('/espace-utilisateur')
      } else {
        await register({
          email: form.email,
          password: form.password,
          password_confirm: form.passwordConfirm,
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
        })
        setShowVerify(true)
        toast.success('Inscription réussie ! Vérifiez votre email pour activer votre compte.')
      }
    } catch (error: any) {
      const data = error.response?.data
      let msg = 'Une erreur est survenue'
      if (typeof data === 'string') msg = data
      else if (data?.error) msg = data.error
      else if (data?.detail) msg = data.detail
      else if (data && typeof data === 'object') msg = Object.values(data).flat().join('. ')
      else if (error.message) msg = error.message
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 bg-white border border-[#0D1B2A]/15 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 transition-all'
  const inputErrorClass = 'w-full px-4 py-3 bg-red-50 border border-red-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all'

  if (mode === 'reset') {
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
              Mot de passe <span className="text-[#C9A227] glow-gold">oublié</span>
            </h1>
            <p className="text-gray-500">Recevez un lien pour réinitialiser votre mot de passe</p>
          </div>
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-[#C9A227]/20">
            <ResetPassword onBack={() => switchMode('connexion')} />
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'inscription' && showVerify) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden bg-[#FBF7EF]">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute left-1/2 -top-40 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(ellipse at center, rgba(201,162,39,0.12), transparent 60%)' }}
          />
        </div>
        <div className="max-w-md w-full relative">
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-[#C9A227]/20">
            <div className="text-center py-6">
              <div className="relative inline-flex mb-5">
                <div className="absolute inset-0 bg-[#C9A227]/25 blur-xl"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-[#C9A227] to-[#A07C12] rounded-full flex items-center justify-center glow-gold">
                  <svg className="w-8 h-8 text-[#0D1B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="eyebrow block mb-3">Inscription</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-3">
                Vérifiez votre <span className="text-[#C9A227] glow-gold">email</span>
              </h1>
              <p className="text-gray-500 leading-relaxed mb-6">
                Un email de confirmation a été envoyé à{' '}
                <strong className="text-[#0D1B2A]">{form.email}</strong>.<br />
                Cliquez sur le lien pour activer votre compte, puis connectez-vous.
              </p>
              <button
                onClick={() => { switchMode('connexion'); navigate('/login'); }}
                className="w-full py-3.5 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all"
              >
                Aller à la connexion
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Vous n'avez rien reçu ?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-[#C9A227] font-semibold hover:underline disabled:opacity-50"
                >
                  {resending ? 'Envoi…' : "Renvoyer l'email"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
          <div className="relative inline-flex mb-5">
            <div className="absolute inset-0 bg-[#C9A227]/25 blur-xl"></div>
            <div className="relative w-16 h-16 bg-gradient-to-br from-[#C9A227] to-[#A07C12] rounded-2xl flex items-center justify-center glow-gold">
              <svg className="w-8 h-8 text-[#0D1B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <p className="eyebrow block mb-3">Votre portail vers l'excellence</p>
          <h1 className="font-display text-4xl font-bold text-[#0D1B2A] mb-2">
            Bienvenue sur <span className="text-[#C9A227] glow-gold">Tatlight</span>
          </h1>
          <p className="text-gray-500">Connectez-vous pour retrouver vos contenus et votre espace</p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-[#C9A227]/20">
          <div className="flex gap-2 mb-8 bg-[#FBF7EF] p-1 rounded-full border border-[#C9A227]/15">
            {(['connexion', 'inscription'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { switchMode(m); navigate(m === 'connexion' ? '/login' : '/register'); }}
                className={`flex-1 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  mode === m ? 'bg-[#C9A227] text-[#0D1B2A] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {m === 'connexion' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'inscription' && (
              <div className="flex gap-3">
                <InputField label="Nom">
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={e => updateField('lastName', e.target.value)}
                    className={inputClass}
                    placeholder="DJIVOEDO"
                    disabled={loading}
                  />
                </InputField>
                <InputField label="Prénom" error={touched.firstName ? errors.firstName : undefined}>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={e => updateField('firstName', e.target.value)}
                    className={errors.firstName && touched.firstName ? inputErrorClass : inputClass}
                    placeholder="Arsène"
                    disabled={loading}
                  />
                </InputField>
              </div>
            )}

            <InputField label="Adresse email" error={touched.email ? errors.email : undefined}>
              <input
                ref={emailRef}
                type="email"
                value={form.email}
                onChange={e => updateField('email', e.target.value)}
                className={errors.email && touched.email ? inputErrorClass : inputClass}
                placeholder="vous@exemple.com"
                disabled={loading}
                autoComplete="email"
              />
            </InputField>

            <InputField label="Mot de passe" error={touched.password ? errors.password : undefined}>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => updateField('password', e.target.value)}
                  className={`${errors.password && touched.password ? inputErrorClass : inputClass} pr-12`}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete={mode === 'connexion' ? 'current-password' : 'new-password'}
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

              {mode === 'inscription' && form.password && (() => {
                const strength = passwordStrength(form.password)
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
            </InputField>

            {mode === 'inscription' && (
              <InputField label="Confirmer le mot de passe" error={touched.passwordConfirm ? errors.passwordConfirm : undefined}>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={form.passwordConfirm}
                    onChange={e => updateField('passwordConfirm', e.target.value)}
                    className={`${errors.passwordConfirm && touched.passwordConfirm ? inputErrorClass : inputClass} pr-12`}
                    placeholder="••••••••"
                    disabled={loading}
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
              </InputField>
            )}

            {mode === 'connexion' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#C9A227]"
                  />
                  <span className="text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <button type="button" onClick={() => switchMode('reset')} className="text-sm text-[#C9A227] hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {mode === 'inscription' && (
              <div>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={e => updateField('terms', e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#C9A227]"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    J'accepte les{' '}
                    <Link to="/conditions" className="text-[#C9A227] font-semibold hover:underline">
                      conditions générales
                    </Link>{' '}
                    d'utilisation et de vente de Tatlight
                  </span>
                </label>
                {errors.terms && <p className="text-red-500 text-xs mt-1 ml-7">{errors.terms}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold text-base hover:glow-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  {mode === 'connexion' ? 'Connexion...' : 'Inscription...'}
                </span>
              ) : (
                mode === 'connexion' ? 'Se connecter' : "S'inscrire"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function ResetPassword({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.resetPassword(email)
      setSent(true)
      toast.success('Email de réinitialisation envoyé !')
    } catch {
      toast.error('Erreur lors de l\'envoi de l\'email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-[#C9A227]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Email envoyé !</h2>
        <p className="text-gray-500 mb-6">Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation.</p>
        <button onClick={onBack} className="text-[#C9A227] font-semibold hover:underline">Retour à la connexion</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField label="Adresse email">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white border border-[#0D1B2A]/15 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 transition-all" placeholder="vous@exemple.com" required />
      </InputField>
      <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all disabled:opacity-50">
        {loading ? 'Envoi...' : 'Envoyer le lien'}
      </button>
      <button type="button" onClick={onBack} className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour à la connexion
      </button>
    </form>
  )
}
