import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import SectionHeading from './SectionHeading'

const MotionArticle = motion.article

function CompaniesPage({
  activePage,
  setActivePage,
  onOpenAuth,
  currency,
  onToggleCurrency,
  companies,
}) {
  const { t } = useTranslation()
  const company = companies[0]

  return (
    <div>
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenAuth={onOpenAuth}
        currency={currency}
        onToggleCurrency={onToggleCurrency}
      />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('companiesEyebrow')}
          title={t('companiesTitle')}
          description={t('companiesDescription')}
        />

        <div className="mt-10">
          {company ? (
            <MotionArticle
              key={company.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45 }}
              whileHover={{ y: -8 }}
              className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--forest-primary)]">
                    Official Partner
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-[var(--text-dark)]">
                    {company.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-[var(--forest-dark)]">
                    {company.tagline}
                  </p>
                </div>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[var(--forest-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--forest-dark)]"
                >
                  Visit website
                </a>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
                {company.description}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-[var(--snow)] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Experience
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text-dark)]">
                    {company.experience}
                  </p>
                </div>
                <div className="rounded-2xl bg-[var(--snow)] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Address
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text-dark)]">
                    {company.address}
                  </p>
                </div>
                <div className="rounded-2xl bg-[var(--snow)] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Monthly
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text-dark)]">
                    {company.monthly}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[var(--snow)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Tour types
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {company.types?.map((type) => (
                    <span
                      key={type}
                      className="rounded-full border border-[var(--leaf)] bg-white px-3 py-1 text-sm font-medium text-[var(--forest-dark)]"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 text-sm text-[var(--text-muted)]">
                <p>{company.instagram}</p>
              </div>
            </MotionArticle>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default CompaniesPage
