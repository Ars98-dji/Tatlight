import React, { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
}

type FormErrors = Partial<Record<keyof FormData, string>>

const initialForm: FormData = {
  email: '',
  password: '',
  passwordConfirm: '',
  firstName: '',
  lastName: '',
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
  }

  return errors
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
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const emailRef = useRef<HTMLInputElement>(null)

  function updateField(field: keyof FormData, value: string) {
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
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validation = validate(form, mode)
    setErrors(validation)
    setTouched({ email: true, password: true, passwordConfirm: true, firstName: true })

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
        await login(form.email, form.password)
        toast.success('Connexion réussie !')
      } else {
        await register({
          email: form.email,
          password: form.password,
          password_confirm: form.passwordConfirm,
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
        })
        toast.success('Inscription réussie ! Bienvenue sur Tatlight.')
      }
      navigate('/espace-utilisateur')
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

  const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-colors'
  const inputErrorClass = 'w-full px-4 py-3 bg-red-50 border border-red-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors'

  if (mode === 'reset') {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mot de passe <span className="text-[#D4AF37]">oublié</span></h1>
            <p className="text-gray-500">Recevez un lien pour réinitialiser votre mot de passe</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <ResetPassword onBack={() => switchMode('connexion')} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-2xl mb-4">
            <svg className="w-8 h-8 text-[#0D1B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenue sur Tatlight</h1>
          <p className="text-gray-500">Votre portail vers l'excellence</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
            {(['connexion', 'inscription'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { switchMode(m); navigate(m === 'connexion' ? '/login' : '/register'); }}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  mode === m ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#0D1B2A] shadow-sm' : 'text-gray-500 hover:text-gray-900'
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
              <div className="text-right">
                <button type="button" onClick={() => switchMode('reset')} className="text-sm text-[#D4AF37] hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#0D1B2A] rounded-xl font-bold text-base hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Email envoyé !</h2>
        <p className="text-gray-500 mb-6">Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation.</p>
        <button onClick={onBack} className="text-[#D4AF37] font-semibold hover:underline">Retour à la connexion</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField label="Adresse email">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="vous@exemple.com" required />
      </InputField>
      <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#0D1B2A] rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50">
        {loading ? 'Envoi...' : 'Envoyer le lien'}
      </button>
      <button type="button" onClick={onBack} className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour à la connexion
      </button>
    </form>
  )
}
