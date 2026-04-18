import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const MotionButton = motion.button

function CompareFloatingButton({ count, onClick }) {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {count > 0 ? (
        <MotionButton
          type="button"
          onClick={onClick}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.92 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full border border-[var(--forest-light)] bg-[#1A1A1A] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.28)] ring-2 ring-[var(--forest-light)]/40"
        >
          <span className="rounded-full bg-[var(--forest-primary)] px-2.5 py-1 text-xs font-bold text-white">
            {count}
          </span>
          {t('compareFloating')}
        </MotionButton>
      ) : null}
    </AnimatePresence>
  )
}

export default CompareFloatingButton
