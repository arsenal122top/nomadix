import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  X,
  Clock,
  Users,
  MapPin,
  Star,
  Check,
  XCircle,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Backpack,
} from 'lucide-react'

export default function TourDetailModal({ tour, onClose }) {
  const { t, i18n } = useTranslation()
  if (!tour) return null
  const localizedTitle =
    typeof tour.title === 'string'
      ? tour.title
      : tour.title?.[i18n.language] || tour.title?.en || ''
  const localizedDescription =
    typeof tour.description === 'string'
      ? tour.description
      : tour.description?.[i18n.language] || tour.description?.en || ''

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const difficultyLabel = {
    easy: t('detailModal.difficulty.easy'),
    moderate: t('detailModal.difficulty.moderate'),
    hard: t('detailModal.difficulty.hard'),
  }

  const difficultyColor = {
    easy: 'bg-emerald-100 text-emerald-700',
    moderate: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700',
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0 md:items-center md:p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl md:max-w-2xl md:rounded-2xl"
        >
          <div className="relative h-64 shrink-0 overflow-hidden md:h-80">
            <img src={tour.image} alt={localizedTitle} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <X size={18} />
            </button>

            <div className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
              {tour.company || 'Kettik.kg'}
            </div>

            <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  difficultyColor[tour.difficulty] || 'bg-slate-100 text-slate-700'
                }`}
              >
                {difficultyLabel[tour.difficulty] || tour.difficulty}
              </span>
              <span className="flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-sm">
                <MapPin size={11} />
                {tour.region}
              </span>
            </div>

            <div className="absolute bottom-14 left-4 right-12">
              <h2 className="font-display text-2xl font-black leading-tight text-white drop-shadow-lg md:text-3xl">
                {localizedTitle}
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pb-24">
            <div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
              {[
                {
                  icon: <Clock size={16} />,
                  label: t('detailModal.duration'),
                  value:
                    tour.duration < 1
                      ? t('detailModal.halfDay')
                      : `${tour.duration} ${t('detailModal.daysShort')}`,
                },
                {
                  icon: <Users size={16} />,
                  label: t('detailModal.group'),
                  value: t('detailModal.upToGroup', { count: tour.maxGroup }),
                },
                {
                  icon: <Star size={16} />,
                  label: t('rating'),
                  value: `${tour.rating} (${tour.reviews})`,
                },
                { icon: <MapPin size={16} />, label: t('detailModal.region'), value: tour.region },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center gap-0.5 px-2 py-3"
                >
                  <span className="text-green-600">{s.icon}</span>
                  <span className="text-center text-xs leading-tight text-slate-400">{s.label}</span>
                  <span className="text-center text-xs font-semibold leading-tight text-slate-800">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-6 px-5 py-5">
              <section>
                <h3 className="mb-2 text-base font-semibold text-green-800">
                  {t('detailModal.aboutTour')}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{localizedDescription}</p>
              </section>

              {tour.meetingPoint && (
                <section>
                  <h3 className="mb-2 text-base font-semibold text-green-800">
                    📍 {t('detailModal.meetingPoint')}
                  </h3>
                  <a
                    href={tour.meetingPointUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-2 text-sm text-green-700 underline underline-offset-2 hover:text-green-900"
                  >
                    <ExternalLink size={14} className="mt-0.5 shrink-0" />
                    {tour.meetingPoint}
                  </a>
                </section>
              )}

              {tour.highlights?.length > 0 && (
                <section>
                  <h3 className="mb-3 text-base font-semibold text-green-800">
                    🗓 {t('detailModal.program')}
                  </h3>
                  <div className="space-y-2">
                    {tour.highlights.map((step, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl bg-green-50 px-4 py-2.5"
                      >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                          {i + 1}
                        </div>
                        <span className="text-sm text-slate-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {tour.includes?.length > 0 && (
                <section>
                  <h3 className="mb-3 text-base font-semibold text-green-800">
                    ✅ {t('detailModal.included')}
                  </h3>
                  <div className="space-y-2">
                    {tour.includes.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <Check size={15} className="shrink-0 text-green-600" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {tour.notIncluded?.length > 0 && (
                <section>
                  <h3 className="mb-3 text-base font-semibold text-green-800">
                    ❌ {t('detailModal.notIncluded')}
                  </h3>
                  <div className="space-y-2">
                    {tour.notIncluded.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <XCircle size={15} className="shrink-0 text-red-400" />
                        <span className="text-sm text-slate-500">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {tour.whatToBring?.length > 0 && (
                <section>
                  <h3 className="mb-3 text-base font-semibold text-green-800">
                    🎒 {t('detailModal.whatToBring')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tour.whatToBring.map((item, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
                      >
                        <Backpack size={11} />
                        {item}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {(tour.distance || tour.elevationGain) && (
                <section className="flex gap-4">
                  {tour.distance && (
                    <div className="flex-1 rounded-xl bg-slate-50 px-4 py-3">
                      <div className="mb-1 text-xs text-slate-400">{t('detailModal.distance')}</div>
                      <div className="text-sm font-semibold text-slate-800">{tour.distance}</div>
                    </div>
                  )}
                  {tour.elevationGain && (
                    <div className="flex-1 rounded-xl bg-slate-50 px-4 py-3">
                      <div className="mb-1 text-xs text-slate-400">
                        {t('detailModal.elevationGain')}
                      </div>
                      <div className="text-sm font-semibold text-slate-800">
                        {tour.elevationGain}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {tour.insurance?.available && (
                <section className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-blue-600" />
                    <h3 className="text-sm font-semibold text-blue-800">
                      {t('detailModal.insuranceOptional')}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-blue-600">
                    {tour.insurance.price} {tour.insurance.currency} - {tour.insurance.provider}.{' '}
                    {tour.insurance.note}
                  </p>
                </section>
              )}

              {tour.startDates?.length > 0 && (
                <section>
                  <h3 className="mb-3 text-base font-semibold text-green-800">
                    <Calendar size={15} className="mr-1.5 inline" />
                    {t('detailModal.schedule')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tour.startDates.map((d, i) => (
                      <span
                        key={i}
                        className="cursor-pointer rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-slate-100 bg-white px-5 py-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
            <div>
              <div className="text-xs text-slate-400">{t('detailModal.priceLabel')}</div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-black text-green-700">
                  {tour.price.toLocaleString()}
                </span>
                <span className="text-sm text-slate-500">
                  {tour.currency} / {t('detailModal.perPerson')}
                </span>
              </div>
            </div>

            <motion.a
              href="https://kettik.kg"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              {t('detailModal.bookOnKettik')}
              <ExternalLink size={14} />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
