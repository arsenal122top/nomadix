import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const icons = ['✓', '⛰', '★']
const MotionCard = motion.div

function TrustIndicators() {
  const { t } = useTranslation()
  const items = t('trustItems', { returnObjects: true })

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <MotionCard
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="rounded-[1.75rem] border border-[var(--snow-soft)] bg-white/85 p-5 shadow-[0_14px_50px_rgba(15,23,42,0.05)] backdrop-blur"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--snow)] text-lg text-[var(--forest-primary)]">
              {icons[index]}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[var(--text-dark)]">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{item.text}</p>
          </MotionCard>
        ))}
      </div>
    </section>
  )
}

export default TrustIndicators
