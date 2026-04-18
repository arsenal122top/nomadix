import { useEffect, useMemo, useState } from 'react'
import { fetchTours } from '../lib/api'

export function useFilters() {
  const [allTours, setAllTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    budget: 'all',
    duration: 'all',
    type: 'all',
    minPrice: '',
    maxPrice: '',
  })

  useEffect(() => {
    let isMounted = true

    const loadTours = async () => {
      try {
        setLoading(true)
        setError(null)
        const tours = await fetchTours()
        if (isMounted) {
          setAllTours(tours)
        }
      } catch (fetchError) {
        console.log('useFilters loadTours error', fetchError)
        if (isMounted) {
          setError(fetchError)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTours()

    return () => {
      isMounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    return allTours.filter((tour) => {
      const budgetMatch =
        filters.budget === 'all' ||
        (filters.budget === 'budget' && tour.price < 120) ||
        (filters.budget === 'premium' && tour.price >= 120 && tour.price <= 220) ||
        (filters.budget === 'luxury' && tour.price > 220)

      const durationMatch =
        filters.duration === 'all' ||
        (filters.duration === '1' && tour.duration === 1) ||
        (filters.duration === '2-3' && tour.duration >= 2 && tour.duration <= 3) ||
        (filters.duration === '4+' && tour.duration >= 4)

      const typeMatch = filters.type === 'all' || tour.type === filters.type
      const minMatch =
        filters.minPrice === '' || tour.price >= Number(filters.minPrice)
      const maxMatch =
        filters.maxPrice === '' || tour.price <= Number(filters.maxPrice)

      return budgetMatch && durationMatch && typeMatch && minMatch && maxMatch
    })
  }, [allTours, filters])

  const reset = () => {
    setFilters({
      budget: 'all',
      duration: 'all',
      type: 'all',
      minPrice: '',
      maxPrice: '',
    })
  }

  const hasActiveFilters =
    filters.budget !== 'all' ||
    filters.duration !== 'all' ||
    filters.type !== 'all' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== ''

  return {
    filters,
    setFilters,
    filtered,
    allTours,
    reset,
    hasActiveFilters,
    loading,
    error,
  }
}

export function useCompare() {
  const [compareList, setCompareList] = useState([])
  const [showModal, setShowModal] = useState(false)

  const toggle = (tour) => {
    setCompareList((prev) => {
      const exists = prev.find((item) => item.id === tour.id)
      if (exists) return prev.filter((item) => item.id !== tour.id)
      if (prev.length >= 3) return prev
      return [...prev, tour]
    })
  }

  const isSelected = (id) => compareList.some((tour) => tour.id === id)
  const canAdd = compareList.length < 3
  const clear = () => setCompareList([])

  return { compareList, toggle, isSelected, canAdd, showModal, setShowModal, clear }
}
