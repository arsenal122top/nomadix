import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createTour,
  fetchOperatorProfile,
  fetchOperatorTours,
  getSession,
  signIn,
  signOut,
} from '../lib/api'

const initialForm = {
  title: '',
  description: '',
  price: '',
  original_price: '',
  duration: '',
  difficulty: 'easy',
  category: 'nature',
  region: '',
  max_group: '12',
  image_url: '',
  badge: '',
  highlights: '',
  includes: '',
}

const MotionForm = motion.form

function OperatorDashboard() {
  const [session, setSession] = useState(null)
  const [operator, setOperator] = useState(null)
  const [tours, setTours] = useState([])
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [form, setForm] = useState(initialForm)
  const [loadingSession, setLoadingSession] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSession = async () => {
      try {
        const currentSession = await getSession()
        setSession(currentSession)

        if (currentSession?.user?.id) {
          const [profile, operatorTours] = await Promise.all([
            fetchOperatorProfile(currentSession.user.id),
            fetchOperatorTours(currentSession.user.id),
          ])

          setOperator(profile)
          setTours(operatorTours)
        }
      } catch (sessionError) {
        console.log('OperatorDashboard loadSession error', sessionError)
        setError('Could not load your operator session right now.')
      } finally {
        setLoadingSession(false)
      }
    }

    loadSession()
  }, [])

  const handleSignIn = async (event) => {
    event.preventDefault()
    setAuthLoading(true)
    setError('')
    setMessage('')

    try {
      const data = await signIn(authForm)
      setSession(data.session)

      if (data.session?.user?.id) {
        const [profile, operatorTours] = await Promise.all([
          fetchOperatorProfile(data.session.user.id),
          fetchOperatorTours(data.session.user.id),
        ])

        setOperator(profile)
        setTours(operatorTours)
      }

      setMessage('Signed in successfully.')
    } catch (authError) {
      console.log('OperatorDashboard handleSignIn error', authError)
      setError('Wrong email or password. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    setError('')
    setMessage('')

    try {
      await signOut()
      setSession(null)
      setOperator(null)
      setTours([])
      setAuthForm({ email: '', password: '' })
      setMessage('Signed out successfully.')
    } catch (signOutError) {
      console.log('OperatorDashboard handleSignOut error', signOutError)
      setError('Could not sign out right now.')
    }
  }

  const handlePublish = async (event) => {
    event.preventDefault()
    if (!session?.user?.id) return

    setPublishing(true)
    setError('')
    setMessage('')

    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        duration: Number(form.duration),
        difficulty: form.difficulty,
        category: form.category,
        region: form.region,
        max_group: Number(form.max_group || 12),
        image_url: form.image_url,
        badge: form.badge || null,
        highlights: form.highlights
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        includes: form.includes
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        operator_id: session.user.id,
      }

      const newTour = await createTour(payload)
      setTours((current) => [newTour, ...current])
      setForm(initialForm)
      setMessage('Tour published successfully.')
    } catch (publishError) {
      console.log('OperatorDashboard handlePublish error', publishError)
      setError('Could not publish the tour. Check the data and try again.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#FBFBF8_0%,_#F4F5EF_100%)] px-4 py-10 text-[var(--text-dark)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--forest-primary)]">
              Nomadix Operator Hub
            </p>
            <h1 className="mt-2 font-display text-4xl text-[var(--text-dark)]">
              Operator Dashboard
            </h1>
          </div>

          <Link
            to="/"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--forest-dark)] shadow-[0_14px_35px_rgba(15,23,42,0.08)]"
          >
            Back to Nomadix
          </Link>
        </div>

        {loadingSession ? (
          <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <p className="text-[var(--text-muted)]">Loading operator dashboard...</p>
          </div>
        ) : !session ? (
          <MotionForm
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSignIn}
            className="mx-auto max-w-xl rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
          >
            <h2 className="font-display text-2xl text-[var(--text-dark)]">
              Sign in as operator
            </h2>
            <p className="mt-3 text-[var(--text-muted)]">
              Use your operator account to manage tours in real time.
            </p>

            <div className="mt-6 space-y-4">
              <input
                type="email"
                required
                value={authForm.email}
                onChange={(event) =>
                  setAuthForm((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="Email"
                className="w-full rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
              />
              <input
                type="password"
                required
                value={authForm.password}
                onChange={(event) =>
                  setAuthForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                placeholder="Password"
                className="w-full rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>

            {error ? (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="mt-4 rounded-2xl bg-[var(--snow)] px-4 py-3 text-sm text-[var(--forest-dark)]">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={authLoading}
              className="mt-6 w-full rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </MotionForm>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Welcome</p>
                <h2 className="mt-1 font-display text-3xl text-[var(--text-dark)]">
                  {operator?.name || session.user.user_metadata?.name || session.user.email}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Sign Out
              </button>
            </div>

            <form
              onSubmit={handlePublish}
              className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            >
              <h3 className="font-display text-2xl text-[var(--text-dark)]">
                Add New Tour
              </h3>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input required placeholder="Tour title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" />
                <input required type="number" placeholder="Price" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} className="rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" />
                <input type="number" placeholder="Original price" value={form.original_price} onChange={(event) => setForm((current) => ({ ...current, original_price: event.target.value }))} className="rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" />
                <input required type="number" placeholder="Duration (days)" value={form.duration} onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))} className="rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" />
                <select value={form.difficulty} onChange={(event) => setForm((current) => ({ ...current, difficulty: event.target.value }))} className="rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200">
                  <option value="easy">easy</option>
                  <option value="moderate">moderate</option>
                  <option value="hard">hard</option>
                </select>
                <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200">
                  <option value="nature">nature</option>
                  <option value="trekking">trekking</option>
                  <option value="cultural">cultural</option>
                  <option value="adventure">adventure</option>
                </select>
                <input placeholder="Region" value={form.region} onChange={(event) => setForm((current) => ({ ...current, region: event.target.value }))} className="rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" />
                <input type="number" placeholder="Max group" value={form.max_group} onChange={(event) => setForm((current) => ({ ...current, max_group: event.target.value }))} className="rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" />
                <input placeholder="Image URL" value={form.image_url} onChange={(event) => setForm((current) => ({ ...current, image_url: event.target.value }))} className="rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200 md:col-span-2" />
                <select value={form.badge} onChange={(event) => setForm((current) => ({ ...current, badge: event.target.value }))} className="rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200">
                  <option value="">none</option>
                  <option value="bestseller">bestseller</option>
                  <option value="popular">popular</option>
                  <option value="best_value">best_value</option>
                  <option value="new">new</option>
                </select>
                <textarea placeholder="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="min-h-28 rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200 md:col-span-2" />
                <textarea placeholder="Highlights (comma separated)" value={form.highlights} onChange={(event) => setForm((current) => ({ ...current, highlights: event.target.value }))} className="min-h-28 rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" />
                <textarea placeholder="Includes (comma separated)" value={form.includes} onChange={(event) => setForm((current) => ({ ...current, includes: event.target.value }))} className="min-h-28 rounded-2xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" />
              </div>

              {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
              {message ? <p className="mt-4 rounded-2xl bg-[var(--snow)] px-4 py-3 text-sm text-[var(--forest-dark)]">{message}</p> : null}

              <button type="submit" disabled={publishing} className="mt-6 rounded-2xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">
                {publishing ? 'Publishing...' : 'Publish Tour'}
              </button>
            </form>

            <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h3 className="font-display text-2xl text-[var(--text-dark)]">Your tours</h3>
              <div className="mt-6 space-y-4">
                {tours.length ? (
                  tours.map((tour) => (
                    <div key={tour.id} className="rounded-[1.5rem] border border-[var(--snow-soft)] bg-[var(--snow)] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h4 className="text-xl font-semibold text-[var(--text-dark)]">{tour.title.en}</h4>
                          <p className="mt-2 text-sm text-[var(--text-muted)]">
                            {tour.region} • {tour.duration} days • ${tour.price}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[var(--forest-dark)]">
                          {tour.badge || 'standard'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[var(--text-muted)]">No tours yet. Publish your first one above.</p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

export default OperatorDashboard
