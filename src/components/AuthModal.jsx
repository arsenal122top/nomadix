import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { signIn, signUpOperator } from '../lib/api'

const MotionOverlay = motion.div
const MotionPanel = motion.div

export default function AuthModal({ isOpen, onClose }) {
  const { t } = useTranslation()
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'signin') {
        await signIn({ email: form.email, password: form.password })
        setSuccess(t('auth.signedIn'))
        setTimeout(onClose, 700)
      } else {
        await signUpOperator({
          email: form.email,
          password: form.password,
          name: form.name,
        })
        setSuccess(t('auth.signedUp'))
      }
    } catch (err) {
      setError(err?.message || t('auth.failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <MotionOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <MotionPanel
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-white/60 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)]"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-2xl text-[var(--text-dark)]">
                {mode === 'signin' ? t('auth.signInTitle') : t('auth.signUpTitle')}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-[var(--snow)] px-3 py-1.5 text-sm text-[var(--text-muted)]"
              >
                {t('close')}
              </button>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-[var(--snow)] p-1">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                  mode === 'signin'
                    ? 'bg-white text-[var(--forest-dark)] shadow'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {t('auth.signInTab')}
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                  mode === 'signup'
                    ? 'bg-white text-[var(--forest-dark)] shadow'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {t('auth.signUpTab')}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'signup' ? (
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder={t('auth.name')}
                  className="w-full rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-200"
                />
              ) : null}

              <input
                type="email"
                required
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                placeholder={t('auth.email')}
                className="w-full rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-200"
              />

              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
                placeholder={t('auth.password')}
                className="w-full rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-200"
              />

              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {success ? <p className="text-sm text-green-700">{success}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[var(--forest-dark)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-deep)] disabled:opacity-70"
              >
                {loading
                  ? t('auth.loading')
                  : mode === 'signin'
                    ? t('auth.signInAction')
                    : t('auth.signUpAction')}
              </button>
            </form>
          </MotionPanel>
        </MotionOverlay>
      ) : null}
    </AnimatePresence>
  )
}
