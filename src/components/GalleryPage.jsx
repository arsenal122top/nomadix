import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import SectionHeading from './SectionHeading'

const MotionArticle = motion.article

function GalleryPage({
  activePage,
  setActivePage,
  onOpenAuth,
  currency,
  onToggleCurrency,
  tours,
}) {
  const { t, i18n } = useTranslation()
  const images = tours.slice(0, 6)

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
          eyebrow={t('galleryEyebrow')}
          title={t('galleryTitle')}
          description={t('galleryDescription')}
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {images.map((tour, index) => (
            <MotionArticle
              key={tour.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
            >
              <div
                className="h-80 bg-cover bg-center"
                style={{ backgroundImage: `url(${tour.image})` }}
              />
              <div className="p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--forest-primary)]">
                  {tour.location}
                </p>
                <h3 className="mt-2 font-display text-2xl text-[var(--text-dark)]">
                  {tour.title[i18n.language]}
                </h3>
              </div>
            </MotionArticle>
          ))}
        </div>
      </main>
    </div>
  )
}

export default GalleryPage
