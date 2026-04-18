import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const MotionSection = motion.section

function RecommendationBanner({ recommendation, locale, formatPrice }) {
  const { t } = useTranslation()

  return (
    <MotionSection
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45 }}
      className="rounded-[2rem] border border-[var(--snow-soft)] bg-[linear-gradient(135deg,_#1A3A0F_0%,_#2D5A1B_45%,_#4E9A30_100%)] p-6 text-white shadow-[0_26px_80px_rgba(45,90,27,0.22)] sm:p-8"
    >
      {recommendation ? (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--leaf)]">
              {t('recommendationEyebrow')}
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl sm:text-4xl">
              {t('bestChoice', { tour: recommendation.title[locale] })}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/88">
              {recommendation.description[locale]}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--leaf)]">
                {t('price')}
              </p>
              <p className="mt-2 text-lg font-semibold">
                {formatPrice(recommendation.price)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--leaf)]">
                {t('duration')}
              </p>
              <p className="mt-2 text-lg font-semibold">
                {recommendation.duration}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--leaf)]">
                {t('rating')}
              </p>
              <p className="mt-2 text-lg font-semibold">{recommendation.rating}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--leaf)]">
            {t('recommendationEyebrow')}
          </p>
          <h2 className="mt-3 font-display text-3xl">{t('noResultsTitle')}</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/88">
            {t('noResultsText')}
          </p>
        </div>
      )}
    </MotionSection>
  )
}

export default RecommendationBanner
