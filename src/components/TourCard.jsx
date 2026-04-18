import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const MotionArticle = motion.article
const MotionImage = motion.div

const formatTourType = (tourType) =>
  String(tourType || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())

function TourCard({
  tour,
  locale,
  isSelected,
  disableAdd,
  onToggleCompare,
  onOpenDetail,
  formatPrice,
}) {
  const { t } = useTranslation()
  const title =
    typeof tour.title === 'string'
      ? tour.title
      : tour.title?.[locale] || tour.title?.en || ''
  const description =
    typeof tour.description === 'string'
      ? tour.description
      : tour.description?.[locale] || tour.description?.en || ''
  const hasGuide =
    Boolean(tour.includesGuide) ||
    Boolean(tour.includes?.some((item) => /гид|guide/i.test(item)))
  const badgeKey = tour.badge === 'bestseller' ? 'bestSeller' : tour.badge

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -8, scale: 1.01 }}
      onClick={() => onOpenDetail(tour)}
      className="group cursor-pointer overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:rounded-2xl sm:h-auto md:h-auto"
    >
      <div className="relative h-64 overflow-hidden sm:h-48 md:h-56">
        <MotionImage
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url('${tour.image}')` }}
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold shadow ${
              badgeKey === 'bestSeller'
                ? 'border-[var(--leaf)] bg-[var(--leaf)] text-[var(--forest-deep)]'
                : badgeKey === 'best_value'
                  ? 'border-[var(--forest-dark)] bg-[var(--forest-dark)] text-white'
                  : 'border-[var(--forest-primary)] bg-[var(--forest-primary)] text-white'
            }`}
          >
            {t(`badges.${badgeKey}`, { defaultValue: badgeKey })}
          </span>
          <span className="rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {tour.rating} ★
          </span>
        </div>
        {/* Название тур-компании поверх фото для мобильных */}
        <div className="absolute left-4 bottom-4 bg-white/80 rounded-full px-3 py-1 text-xs font-bold text-[var(--forest-dark)] shadow sm:static sm:bg-transparent sm:rounded-none sm:p-0 sm:text-sm">
          {tour.company}
        </div>
      </div>

      <div className="p-5 sm:p-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] sm:tracking-[0.24em] text-[var(--forest-primary)]">
              {tour.location || tour.region}
            </p>
            <h3 className="mt-1 sm:mt-2 font-display text-lg sm:text-2xl text-[var(--text-dark)]">
              {title}
            </h3>
          </div>
          <div className="text-left sm:text-right mt-2 sm:mt-0">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('from')}
            </p>
            <p className="mt-1 sm:mt-2 text-lg sm:text-xl font-semibold text-[var(--text-dark)]">
              {formatPrice(tour.price)}
            </p>
          </div>
        </div>

        <p className="mt-2 sm:mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-[var(--text-muted)]">
          {description}
        </p>

        <div className="mt-4 sm:mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-2xl border border-[var(--leaf)] bg-[var(--snow)] p-2 sm:p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('duration')}
            </p>
            <p className="mt-1 sm:mt-2 font-semibold text-[var(--forest-dark)]">
              {tour.duration} {tour.duration === 1 ? t('day') : t('days')}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--leaf)] bg-[var(--snow)] p-2 sm:p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('guide')}
            </p>
            <p className="mt-1 sm:mt-2 font-semibold text-[var(--forest-dark)]">
              {hasGuide ? t('yes') : t('no')}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--leaf)] bg-[var(--snow)] p-2 sm:p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('type')}
            </p>
            <p className="mt-1 sm:mt-2 font-semibold text-[var(--forest-dark)]">
              {t(`tourTypes.${tour.category}`, {
                defaultValue: formatTourType(tour.category),
              })}
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onToggleCompare(tour.id)
            }}
            disabled={disableAdd}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isSelected
                ? 'border border-[var(--forest-primary)] bg-[var(--forest-primary)] text-white'
                : disableAdd
                  ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                  : 'bg-[var(--forest-primary)] text-white hover:bg-[var(--forest-dark)]'
            }`}
          >
            {isSelected ? t('selected') : t('compare')}
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onOpenDetail(tour)
            }}
            className="rounded-full border border-[var(--forest-primary)] px-4 py-2 text-sm font-semibold text-[var(--forest-primary)] transition hover:bg-[var(--snow)]"
          >
            {t('viewDetails')}
          </button>
          <a
            href="https://kettik.kg"
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="rounded-full bg-[var(--forest-dark)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--forest-deep)]"
          >
            {t('book')}
          </a>
        </div>
      </div>
    </MotionArticle>
  )
}

export default TourCard
