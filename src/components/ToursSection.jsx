import { useTranslation } from 'react-i18next'
import TourCard from './TourCard'

function ToursSection({
  id,
  tours,
  compareIds,
  onToggleCompare,
  onOpenDetail,
  formatPrice,
  compact = false,
  loading = false,
  error = null,
}) {
  const { t, i18n } = useTranslation()
  const normalizedCompareIds = Array.from(
    new Set(compareIds.filter((id) => typeof id === 'string' || typeof id === 'number')),
  )
  const compareLimitReached = normalizedCompareIds.length >= 3

  return (
    <section id={id} className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: compact ? 3 : 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            >
              <div className="h-64 animate-pulse bg-[var(--snow-soft)]" />
              <div className="space-y-4 p-5">
                <div className="h-4 w-1/3 animate-pulse rounded-full bg-[var(--snow-soft)]" />
                <div className="h-8 w-3/4 animate-pulse rounded-2xl bg-[var(--snow-soft)]" />
                <div className="h-16 animate-pulse rounded-2xl bg-[var(--snow-soft)]" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-red-100 bg-red-50 px-6 py-12 text-center">
          <p className="font-display text-2xl text-red-700">{t('loadErrorTitle')}</p>
          <p className="mt-3 text-red-600">{t('loadErrorText')}</p>
        </div>
      ) : tours.length ? (
        <div
          className={`grid gap-6 ${
            compact ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3'
          }`}
        >
          {tours.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              locale={i18n.language}
              isSelected={normalizedCompareIds.includes(tour.id)}
              disableAdd={compareLimitReached && !normalizedCompareIds.includes(tour.id)}
              onToggleCompare={onToggleCompare}
              onOpenDetail={onOpenDetail}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-[var(--leaf)] bg-white/80 px-6 py-12 text-center">
          <p className="font-display text-2xl text-[var(--text-dark)]">{t('noResultsTitle')}</p>
          <p className="mt-3 text-[var(--text-muted)]">{t('noResultsText')}</p>
        </div>
      )}
    </section>
  )
}

export default ToursSection
