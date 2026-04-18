import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const budgetOptions = ['all', 'budget', 'premium', 'luxury']
const durationOptions = ['all', '1', '2-3', '4+']
const typeOptions = ['all', 'nature', 'trekking', 'cultural', 'adventure']
const MotionPanel = motion.div
const MotionButton = motion.button

function FilterBar({ activeFilters, setActiveFilters }) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(activeFilters)

  const handleApply = () => {
    setActiveFilters(draft)
    const toursSection = document.getElementById('tours-section')
    if (toursSection) {
      toursSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <MotionPanel
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15 }}
      className="rounded-[2rem] border border-white/40 bg-white/15 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-5"
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr_1.2fr_auto]">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--leaf)]">
            {t('budget')}
          </label>
          <select
            value={draft.budget}
            onChange={(event) =>
              setDraft((current) => ({ ...current, budget: event.target.value }))
            }
            className="w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm text-[var(--text-dark)] outline-none backdrop-blur transition hover:border-[var(--leaf)] focus:ring-2 focus:ring-green-200"
          >
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {t(`budgetOptions.${option}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--leaf)]">
            {t('duration')}
          </label>
          <select
            value={draft.duration}
            onChange={(event) =>
              setDraft((current) => ({ ...current, duration: event.target.value }))
            }
            className="w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm text-[var(--text-dark)] outline-none transition hover:border-[var(--leaf)] focus:ring-2 focus:ring-green-200"
          >
            {durationOptions.map((option) => (
              <option key={option} value={option}>
                {t(`durationOptions.${option}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--leaf)]">
            {t('tourType')}
          </label>
          <select
            value={draft.type}
            onChange={(event) =>
              setDraft((current) => ({ ...current, type: event.target.value }))
            }
            className="w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm text-[var(--text-dark)] outline-none transition hover:border-[var(--leaf)] focus:ring-2 focus:ring-green-200"
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {t(`tourTypes.${option}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--leaf)]">
              {t('minPrice')}
            </label>
            <input
              type="number"
              min="0"
              value={draft.minPrice}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  minPrice: event.target.value,
                }))
              }
              placeholder="50"
              className="w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm text-[var(--text-dark)] outline-none transition hover:border-[var(--leaf)] focus:ring-2 focus:ring-green-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--leaf)]">
              {t('maxPrice')}
            </label>
            <input
              type="number"
              min="0"
              value={draft.maxPrice}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  maxPrice: event.target.value,
                }))
              }
              placeholder="250"
              className="w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm text-[var(--text-dark)] outline-none transition hover:border-[var(--leaf)] focus:ring-2 focus:ring-green-200"
            />
          </div>
        </div>

        <div className="flex items-end">
          <MotionButton
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApply}
            className="w-full rounded-2xl bg-[var(--forest-dark)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(45,90,27,0.24)] transition hover:bg-[var(--forest-deep)]"
          >
            {t('findTours')}
          </MotionButton>
        </div>
      </div>
    </MotionPanel>
  )
}

export default FilterBar
