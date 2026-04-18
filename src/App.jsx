import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CompareFloatingButton from './components/CompareFloatingButton'
import CompareModal from './components/CompareModal'
import CompaniesPage from './components/CompaniesPage'
import GalleryPage from './components/GalleryPage'
import HomePage from './components/HomePage'
import AuthModal from './components/AuthModal'
import TourDetailModal from './components/TourDetailModal'
import companies from './data/companies.json'
import { tours } from './data/tours'

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
}

const MotionPage = motion.div
const DEFAULT_USD_TO_KGS_RATE = 89

const getBestValueTourId = (selectedTours) => {
  if (!selectedTours.length) return null

  return selectedTours.reduce((best, tour) => {
    const currentScore =
      tour.rating * 22 +
      (tour.includesGuide ? 10 : 0) +
      (tour.badge === 'bestSeller' ? 6 : 2) -
      tour.price / Math.max(tour.duration, 1)
    const bestScore =
      best.rating * 22 +
      (best.includesGuide ? 10 : 0) +
      (best.badge === 'bestSeller' ? 6 : 2) -
      best.price / Math.max(best.duration, 1)

    return currentScore > bestScore ? tour : best
  }).id
}

function App() {
  const { i18n } = useTranslation()
  const [activePage, setActivePage] = useState('home')
  const [currency, setCurrency] = useState('USD')
  const [usdToKgsRate, setUsdToKgsRate] = useState(DEFAULT_USD_TO_KGS_RATE)
  const [activeFilters, setActiveFilters] = useState({
    budget: 'all',
    duration: 'all',
    type: 'all',
    minPrice: '',
    maxPrice: '',
  })
  const [compareIds, setCompareIds] = useState([])
  const [isCompareOpen, setIsCompareOpen] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadExchangeRate = async () => {
      try {
        const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=KGS')
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rate')
        }

        const data = await response.json()
        const rate = Number(data?.rates?.KGS)

        if (isMounted && Number.isFinite(rate) && rate > 0) {
          setUsdToKgsRate(rate)
        }
      } catch (error) {
        // Keep default rate when API is unavailable.
      }
    }

    loadExchangeRate()
    const intervalId = setInterval(loadExchangeRate, 1000 * 60 * 60)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  const formatPrice = (kgsAmount) => {
    const numericAmount = Number(kgsAmount)
    if (!Number.isFinite(numericAmount)) return ''

    const amount =
      currency === 'USD'
        ? Math.round(numericAmount / usdToKgsRate)
        : Math.round(numericAmount)

    return new Intl.NumberFormat(i18n.language === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'KGS' ? 0 : 0,
    }).format(amount)
  }

  const toggleCurrency = () => {
    setCurrency((current) => (current === 'USD' ? 'KGS' : 'USD'))
  }

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const budgetMatch =
        activeFilters.budget === 'all' ||
        (activeFilters.budget === 'budget' && tour.price < 1500) ||
        (activeFilters.budget === 'premium' &&
          tour.price >= 1500 &&
          tour.price <= 2400) ||
        (activeFilters.budget === 'luxury' && tour.price > 2400)

      const durationMatch =
        activeFilters.duration === 'all' ||
        (activeFilters.duration === '1' && tour.duration === 1) ||
        (activeFilters.duration === '2-3' &&
          tour.duration >= 2 &&
          tour.duration <= 3) ||
        (activeFilters.duration === '4+' && tour.duration >= 4)

      const typeMatch =
        activeFilters.type === 'all' ||
        activeFilters.type === (tour.category || tour.type)

      const minMatch =
        activeFilters.minPrice === '' ||
        tour.price >= Number(activeFilters.minPrice)

      const maxMatch =
        activeFilters.maxPrice === '' ||
        tour.price <= Number(activeFilters.maxPrice)

      return budgetMatch && durationMatch && typeMatch && minMatch && maxMatch
    })
  }, [activeFilters])

  const selectedTours = useMemo(
    () => tours.filter((tour) => compareIds.includes(tour.id)),
    [compareIds],
  )
  const bestValueTourId = getBestValueTourId(selectedTours)

  const recommendation = useMemo(() => {
    if (!filteredTours.length) return null

    if (
      activeFilters.budget === 'budget' ||
      (activeFilters.maxPrice !== '' && Number(activeFilters.maxPrice) <= 1500)
    ) {
      return filteredTours.reduce((best, tour) =>
        tour.price < best.price ? tour : best,
      )
    }

    if (activeFilters.duration === '1') {
      const quickTours = filteredTours.filter((tour) => tour.duration === 1)
      if (quickTours.length) {
        return quickTours.reduce((best, tour) =>
          tour.rating > best.rating ? tour : best,
        )
      }
    }

    return filteredTours.reduce((best, tour) => {
      const score =
        tour.rating * 20 +
        (tour.includesGuide ? 8 : 0) +
        (tour.badge === 'popular' ? 3 : 5) -
        tour.price / 16
      const bestScore =
        best.rating * 20 +
        (best.includesGuide ? 8 : 0) +
        (best.badge === 'popular' ? 3 : 5) -
        best.price / 16

      return score > bestScore ? tour : best
    })
  }, [activeFilters, filteredTours])

  const handleToggleCompare = (tourId) => {
    setCompareIds((current) => {
      const normalizedCurrent = Array.from(
        new Set(
          current.filter((id) => typeof id === 'string' || typeof id === 'number'),
        ),
      )
      const normalizedTourId =
        typeof tourId === 'object' && tourId !== null ? tourId.id : tourId

      if (
        typeof normalizedTourId !== 'string' &&
        typeof normalizedTourId !== 'number'
      ) {
        return normalizedCurrent
      }

      if (normalizedCurrent.includes(normalizedTourId)) {
        return normalizedCurrent.filter((id) => id !== normalizedTourId)
      }

      if (normalizedCurrent.length >= 3) {
        return normalizedCurrent
      }

      return [...normalizedCurrent, normalizedTourId]
    })
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#FBFBF8_0%,_#F4F5EF_100%)] text-[var(--text-dark)]">
      <AnimatePresence mode="wait">
        <MotionPage
          key={activePage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {activePage === 'home' ? (
            <HomePage
              activePage={activePage}
              setActivePage={setActivePage}
              onOpenAuth={() => setIsAuthOpen(true)}
              currency={currency}
              onToggleCurrency={toggleCurrency}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
              filteredTours={filteredTours}
              compareIds={compareIds}
              onToggleCompare={handleToggleCompare}
              onOpenDetail={setSelectedTour}
              recommendation={recommendation}
              locale={i18n.language}
              formatPrice={formatPrice}
            />
          ) : null}

          {activePage === 'companies' ? (
            <CompaniesPage
              activePage={activePage}
              setActivePage={setActivePage}
              onOpenAuth={() => setIsAuthOpen(true)}
              currency={currency}
              onToggleCurrency={toggleCurrency}
              companies={companies}
            />
          ) : null}

          {activePage === 'gallery' ? (
            <GalleryPage
              activePage={activePage}
              setActivePage={setActivePage}
              onOpenAuth={() => setIsAuthOpen(true)}
              currency={currency}
              onToggleCurrency={toggleCurrency}
              tours={tours}
            />
          ) : null}

          {selectedTour ? (
            <TourDetailModal
              tour={selectedTour}
              onClose={() => setSelectedTour(null)}
            />
          ) : null}
        </MotionPage>
      </AnimatePresence>

      <CompareFloatingButton
        count={selectedTours.length}
        onClick={() => setIsCompareOpen(true)}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        selectedTours={selectedTours}
        bestValueTourId={bestValueTourId}
        locale={i18n.language}
        formatPrice={formatPrice}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  )
}

export default App
