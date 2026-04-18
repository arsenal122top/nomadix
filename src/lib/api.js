import { isSupabaseConfigured, supabase } from './supabase'

const ensureSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env',
    )
  }
  return supabase
}

const normalizeBadge = (badge) => {
  if (badge === 'bestseller') return 'bestSeller'
  if (badge === 'best_value') return 'best_value'
  return badge || 'popular'
}

const normalizeTour = (tour) => ({
  id: tour.id,
  title: {
    en: tour.title,
    ru: tour.title,
  },
  company: tour.operators?.name || 'Unknown',
  companyLogo: tour.operators?.logo_initials || '??',
  duration: tour.duration,
  price: tour.price,
  originalPrice: tour.original_price || tour.price,
  rating: Number(tour.rating ?? 4.5),
  reviews: tour.reviews_count ?? 0,
  difficulty: tour.difficulty,
  category: tour.category,
  type: tour.category,
  region: tour.region,
  location: tour.region,
  maxGroup: tour.max_group,
  image: tour.image_url,
  badge: normalizeBadge(tour.badge),
  highlights: tour.highlights || [],
  includes: tour.includes || [],
  includesGuide: (tour.includes || []).some((item) =>
    item.toLowerCase().includes('guide'),
  ),
  description: {
    en: tour.description || '',
    ru: tour.description || '',
  },
  languages: tour.languages || ['en'],
  operatorId: tour.operator_id,
})

export async function fetchTours() {
  try {
    const client = ensureSupabase()
    const { data, error } = await client
      .from('tours')
      .select(
        `
          *,
          operators (
            id,
            name,
            logo_initials
          )
        `,
      )
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(normalizeTour)
  } catch (error) {
    console.log('fetchTours error', error)
    throw error
  }
}

export async function createTour(tourData) {
  try {
    const client = ensureSupabase()
    const { data, error } = await client
      .from('tours')
      .insert([tourData])
      .select(
        `
          *,
          operators (
            id,
            name,
            logo_initials
          )
        `,
      )

    if (error) throw error
    return normalizeTour(data[0])
  } catch (error) {
    console.log('createTour error', error)
    throw error
  }
}

export async function signUpOperator({ email, password, name }) {
  try {
    const client = ensureSupabase()
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
    return data
  } catch (error) {
    console.log('signUpOperator error', error)
    throw error
  }
}

export async function signIn({ email, password }) {
  try {
    const client = ensureSupabase()
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  } catch (error) {
    console.log('signIn error', error)
    throw error
  }
}

export async function signOut() {
  try {
    const client = ensureSupabase()
    const { error } = await client.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.log('signOut error', error)
    throw error
  }
}

export async function getSession() {
  try {
    const client = ensureSupabase()
    const { data, error } = await client.auth.getSession()
    if (error) throw error
    return data.session
  } catch (error) {
    console.log('getSession error', error)
    throw error
  }
}

export async function fetchOperatorProfile(userId) {
  try {
    const client = ensureSupabase()
    const { data, error } = await client
      .from('operators')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error
    return data
  } catch (error) {
    console.log('fetchOperatorProfile error', error)
    throw error
  }
}

export async function fetchOperatorTours(operatorId) {
  try {
    const client = ensureSupabase()
    const { data, error } = await client
      .from('tours')
      .select(
        `
          *,
          operators (
            id,
            name,
            logo_initials
          )
        `,
      )
      .eq('operator_id', operatorId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(normalizeTour)
  } catch (error) {
    console.log('fetchOperatorTours error', error)
    throw error
  }
}
