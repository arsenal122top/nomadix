import { useTranslation } from 'react-i18next'
import FilterBar from './FilterBar'
import Navbar from './Navbar'
import RecommendationBanner from './RecommendationBanner'
import SectionHeading from './SectionHeading'
import ToursSection from './ToursSection'
import TrustIndicators from './TrustIndicators'

function HomePage({
  activePage,
  setActivePage,
  onOpenAuth,
  currency,
  onToggleCurrency,
  activeFilters,
  setActiveFilters,
  filteredTours,
  compareIds,
  onToggleCompare,
  onOpenDetail,
  recommendation,
  locale,
  formatPrice,
  loading,
  error,
}) {
  const { t } = useTranslation()
  const popularTours = filteredTours.filter(
    (tour) => tour.badge === 'bestSeller' || tour.badge === 'popular',
  )

  return (
    <div>
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenAuth={onOpenAuth}
        currency={currency}
        onToggleCurrency={onToggleCurrency}
      />

      <main>
        <section className="relative min-h-[100svh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(53,90,40,0.78) 0%, rgba(90,150,68,0.58) 48%, rgba(155,203,132,0.42) 100%), url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80')",
            }}
          />
          <div className="hero-gradient absolute inset-0 opacity-70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(199,226,169,0.18),_transparent_26%),radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.16),_transparent_24%)]" />

          <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pb-14 pt-28 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-[var(--leaf)]/55 bg-[rgba(247,248,243,0.12)] px-4 py-2 text-sm font-medium text-[var(--snow)] backdrop-blur">
                {t('heroEyebrow')}
              </div>
              <h1 className="mt-6 max-w-3xl font-display text-5xl leading-tight text-white sm:text-6xl lg:text-7xl">
                {t('heroTitle')}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
                {t('heroSubtitle')}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#tours-section"
                  className="rounded-full bg-[var(--forest-dark)] px-6 py-3 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[var(--forest-deep)]"
                >
                  {t('heroCta')}
                </a>
                <button
                  type="button"
                  onClick={() => setActivePage('gallery')}
                  className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >
                  {t('gallery')}
                </button>
              </div>
            </div>

            <div className="mt-10">
              <FilterBar
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
              />
            </div>
          </div>
        </section>

        <TrustIndicators />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <RecommendationBanner
            recommendation={recommendation}
            locale={locale}
            formatPrice={formatPrice}
          />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t('popularEyebrow')}
            title={t('popularTitle')}
            description={t('popularDescription')}
          />
        </section>

        <ToursSection
          id="popular-tours"
          tours={popularTours.length ? popularTours : filteredTours.slice(0, 3)}
          compareIds={compareIds}
          onToggleCompare={onToggleCompare}
          onOpenDetail={onOpenDetail}
          formatPrice={formatPrice}
          compact
          loading={loading}
          error={error}
        />

        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t('toursEyebrow')}
            title={t('toursTitle')}
            description={t('toursDescription')}
          />
        </section>

        <ToursSection
          id="tours-section"
          tours={filteredTours}
          compareIds={compareIds}
          onToggleCompare={onToggleCompare}
          onOpenDetail={onOpenDetail}
          formatPrice={formatPrice}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  )
}

export default HomePage
