import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import logoPhoto from '../../img/IMG_1340.PNG'

const pages = ['home', 'companies', 'gallery']
const MotionButton = motion.button

function Navbar({
  activePage,
  setActivePage,
  currency,
  onToggleCurrency,
  onOpenAuth,
}) {
  const { t, i18n } = useTranslation()
  const location = useLocation()

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-full border border-white/45 bg-white/70 px-4 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3"
          >
            <img
              src={logoPhoto}
              alt="Nomadix mountain logo"
              className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
            />
            <div className="text-left">
              <p className="font-display text-lg font-bold uppercase tracking-[0.18em] text-[var(--forest-dark)]">
                NOMADIX
              </p>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                Kyrgyz Tours
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-2 lg:flex">
            {pages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setActivePage(page)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activePage === page
                    ? 'text-[var(--forest-primary)] underline decoration-[var(--forest-primary)] decoration-2 underline-offset-8'
                    : 'text-[var(--text-muted)] hover:bg-[var(--snow)]'
                }`}
              >
                {t(page)}
              </button>
            ))}

            <Link
              to="/operator"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                location.pathname === '/operator'
                  ? 'text-[var(--forest-primary)] underline decoration-[var(--forest-primary)] decoration-2 underline-offset-8'
                  : 'text-[var(--text-muted)] hover:bg-[var(--snow)]'
              }`}
            >
              {t('forOperators')}
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-full bg-[var(--snow)] px-3 py-2 text-xs font-semibold text-[var(--forest-dark)] sm:text-sm"
            >
              {i18n.language === 'en' ? 'RU' : 'EN'}
            </button>
            <button
              type="button"
              onClick={onToggleCurrency}
              className="hidden rounded-full bg-[var(--snow)] px-3 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-white sm:block"
            >
              {currency}
            </button>
            <MotionButton
              type="button"
              onClick={onOpenAuth}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-[var(--forest-dark)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--forest-deep)]"
            >
              {t('signIn')}
            </MotionButton>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
