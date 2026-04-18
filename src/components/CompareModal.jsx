import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const MotionOverlay = motion.div
const MotionPanel = motion.div

function CompareModal({
  isOpen,
  onClose,
  selectedTours,
  bestValueTourId,
  locale,
  formatPrice,
}) {
  const { t } = useTranslation()
  const getTitle = (tour) =>
    typeof tour.title === 'string'
      ? tour.title
      : tour.title?.[locale] || tour.title?.en || ''

  return (
    <AnimatePresence>
      {isOpen ? (
        <MotionOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-md"
        >
          <MotionPanel
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--snow-soft)] bg-[linear-gradient(135deg,_#F0F4EC_0%,_#E8F0E0_100%)] px-5 py-4 sm:px-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--forest-primary)]">
                  {t('compareTitle')}
                </p>
                <h3 className="mt-2 font-display text-2xl text-[var(--text-dark)]">
                  {t('compareSubtitle')}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--snow)]"
              >
                {t('close')}
              </button>
            </div>

            <div className="overflow-x-auto p-5 sm:p-8">
              {selectedTours.length ? (
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th className="rounded-l-3xl border border-[var(--snow-soft)] bg-[var(--snow)] px-4 py-4 text-left text-sm font-semibold text-[var(--text-muted)]">
                        {t('compareField')}
                      </th>
                      {selectedTours.map((tour, index) => (
                        <th
                          key={tour.id}
                          className={`border border-[var(--snow-soft)] px-4 py-4 text-left ${
                            index === selectedTours.length - 1 ? 'rounded-r-3xl' : ''
                          } ${tour.id === bestValueTourId ? 'bg-[var(--snow-soft)]' : 'bg-[var(--snow)]/70'}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[var(--text-dark)]">
                              {getTitle(tour)}
                            </span>
                            {tour.id === bestValueTourId ? (
                              <span className="rounded-full bg-[var(--leaf)] px-2.5 py-1 text-xs font-semibold text-[var(--forest-deep)]">
                                {t('bestOption')}
                              </span>
                            ) : null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'price', label: t('price') },
                      { key: 'duration', label: t('duration') },
                      { key: 'guide', label: t('guideIncluded') },
                      { key: 'rating', label: t('rating') },
                    ].map((row) => (
                      <tr key={row.key}>
                        <td className="border border-[var(--snow-soft)] px-4 py-4 font-medium text-[var(--text-muted)]">
                          {row.label}
                        </td>
                        {selectedTours.map((tour) => (
                          <td
                            key={`${tour.id}-${row.key}`}
                            className={`border border-[var(--snow-soft)] px-4 py-4 text-[var(--text-dark)] ${
                              tour.id === bestValueTourId ? 'bg-[var(--snow)]' : 'bg-white'
                            }`}
                          >
                            {row.key === 'price' ? formatPrice(tour.price) : null}
                            {row.key === 'duration'
                              ? `${tour.duration} ${tour.duration === 1 ? t('day') : t('days')}`
                              : null}
                            {row.key === 'guide'
                              ? tour.includesGuide ||
                                tour.includes?.some((item) => /гид|guide/i.test(item))
                                ? t('yes')
                                : t('no')
                              : null}
                            {row.key === 'rating' ? tour.rating : null}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-[var(--leaf)] bg-[var(--snow)]/90 px-6 py-12 text-center">
                  <p className="font-display text-2xl text-[var(--text-dark)]">
                    {t('compareEmptyTitle')}
                  </p>
                  <p className="mt-3 text-[var(--text-muted)]">{t('compareEmptyText')}</p>
                </div>
              )}
            </div>
          </MotionPanel>
        </MotionOverlay>
      ) : null}
    </AnimatePresence>
  )
}

export default CompareModal
