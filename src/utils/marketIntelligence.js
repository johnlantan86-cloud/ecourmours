const DEFAULT_KIGALI_COORDINATES = { lat: -1.9441, lng: 30.0619 }

export const RWANDA_DISTRICTS = [
  {
    province: 'Kigali',
    district: 'Nyarugenge',
    lat: -1.9441,
    lng: 30.0619,
    sectors: {
      Gitega: { lat: -1.951, lng: 30.063 },
      Kanyinya: { lat: -1.889, lng: 30.011 },
      Kigali: { lat: -1.947, lng: 30.048 },
      Kimisagara: { lat: -1.954, lng: 30.052 },
      Mageragere: { lat: -2.013, lng: 30.017 },
      Muhima: { lat: -1.937, lng: 30.061 },
      Nyakabanda: { lat: -1.97, lng: 30.052 },
      Nyamirambo: { lat: -1.973, lng: 30.041 },
      Nyarugenge: { lat: -1.95, lng: 30.058 },
      Rwezamenyo: { lat: -1.959, lng: 30.049 }
    }
  },
  {
    province: 'Kigali',
    district: 'Gasabo',
    lat: -1.913,
    lng: 30.104,
    sectors: {
      Bumbogo: { lat: -1.847, lng: 30.117 },
      Gatsata: { lat: -1.9, lng: 30.073 },
      Gikomero: { lat: -1.836, lng: 30.215 },
      Gisozi: { lat: -1.92, lng: 30.081 },
      Jabana: { lat: -1.883, lng: 30.09 },
      Jali: { lat: -1.87, lng: 30.051 },
      Kacyiru: { lat: -1.944, lng: 30.092 },
      Kimihurura: { lat: -1.953, lng: 30.087 },
      Kimironko: { lat: -1.938, lng: 30.119 },
      Kinyinya: { lat: -1.902, lng: 30.106 },
      Ndera: { lat: -1.923, lng: 30.165 },
      Nduba: { lat: -1.855, lng: 30.15 },
      Remera: { lat: -1.955, lng: 30.117 },
      Rusororo: { lat: -1.94, lng: 30.204 },
      Rutunga: { lat: -1.85, lng: 30.142 }
    }
  },
  {
    province: 'Kigali',
    district: 'Kicukiro',
    lat: -1.971,
    lng: 30.111,
    sectors: {
      Gahanga: { lat: -2.028, lng: 30.11 },
      Gatenga: { lat: -1.99, lng: 30.096 },
      Gikondo: { lat: -1.97, lng: 30.08 },
      Kagarama: { lat: -1.956, lng: 30.099 },
      Kanombe: { lat: -1.969, lng: 30.14 },
      Kicukiro: { lat: -1.972, lng: 30.102 },
      Kigarama: { lat: -1.99, lng: 30.113 },
      Masaka: { lat: -2.004, lng: 30.168 },
      Nibagabaga: { lat: -1.954, lng: 30.119 },
      Nyarugunga: { lat: -1.979, lng: 30.165 }
    }
  },
  { province: 'Northern', district: 'Burera', lat: -1.43, lng: 29.913 },
  { province: 'Northern', district: 'Gakenke', lat: -1.682, lng: 29.874 },
  { province: 'Northern', district: 'Gicumbi', lat: -1.657, lng: 30.107 },
  { province: 'Northern', district: 'Musanze', lat: -1.499, lng: 29.635 },
  { province: 'Northern', district: 'Rulindo', lat: -1.591, lng: 30.079 },
  { province: 'Southern', district: 'Gisagara', lat: -2.6, lng: 29.85 },
  { province: 'Southern', district: 'Huye', lat: -2.596, lng: 29.739 },
  { province: 'Southern', district: 'Kamonyi', lat: -2.049, lng: 29.862 },
  { province: 'Southern', district: 'Muhanga', lat: -2.084, lng: 29.752 },
  { province: 'Southern', district: 'Nyamagabe', lat: -2.523, lng: 29.58 },
  { province: 'Southern', district: 'Nyanza', lat: -2.351, lng: 29.74 },
  { province: 'Southern', district: 'Nyaruguru', lat: -2.669, lng: 29.914 },
  { province: 'Southern', district: 'Ruhango', lat: -2.222, lng: 29.785 },
  { province: 'Eastern', district: 'Bugesera', lat: -2.164, lng: 30.164 },
  { province: 'Eastern', district: 'Gatsibo', lat: -1.759, lng: 30.455 },
  { province: 'Eastern', district: 'Kayonza', lat: -1.9, lng: 30.685 },
  { province: 'Eastern', district: 'Kirehe', lat: -2.239, lng: 30.811 },
  { province: 'Eastern', district: 'Ngoma', lat: -2.148, lng: 30.747 },
  { province: 'Eastern', district: 'Nyagatare', lat: -1.3, lng: 30.325 },
  { province: 'Eastern', district: 'Rwamagana', lat: -1.948, lng: 30.434 },
  { province: 'Western', district: 'Karongi', lat: -2.064, lng: 29.351 },
  { province: 'Western', district: 'Ngororero', lat: -1.969, lng: 29.573 },
  { province: 'Western', district: 'Nyabihu', lat: -1.683, lng: 29.532 },
  { province: 'Western', district: 'Nyamasheke', lat: -2.329, lng: 29.122 },
  { province: 'Western', district: 'Rubavu', lat: -1.677, lng: 29.222 },
  { province: 'Western', district: 'Rusizi', lat: -2.484, lng: 28.908 },
  { province: 'Western', district: 'Rutsiro', lat: -1.944, lng: 29.404 }
]

const uniqueSorted = (values = []) => {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
}

export const getProvinceOptions = () => {
  return uniqueSorted(RWANDA_DISTRICTS.map((item) => item.province))
}

export const getDistrictOptions = (province = '') => {
  const normalizedProvince = normalizeText(province)
  return uniqueSorted(
    RWANDA_DISTRICTS
      .filter((item) => !normalizedProvince || normalizeText(item.province) === normalizedProvince)
      .map((item) => item.district)
  )
}

export const getSectorOptions = (district = '') => {
  const normalizedDistrict = normalizeText(district)
  return uniqueSorted(
    RWANDA_DISTRICTS
      .filter((item) => !normalizedDistrict || normalizeText(item.district) === normalizedDistrict)
      .flatMap((item) => Object.keys(item.sectors || {}))
  )
}

export const getSavedLocationOptions = (records = [], field = '') => {
  return uniqueSorted(
    records.flatMap((record) => [
      record?.[field],
      record?.locationMeta?.[field]
    ])
  )
}

export const getAreaOptions = (records = []) => {
  const savedAreas = records
    .map((record) => {
      const location = record.locationMeta || record
      const label = formatLocation(location)
      if (!label) return null

      return {
        key: `saved-${record.id || label}`,
        label,
        shortLabel: location.sector || location.district || record.location || label,
        province: location.province || '',
        district: location.district || '',
        sector: location.sector || '',
        cell: location.cell || '',
        village: location.village || '',
        addressLine: location.addressLine || '',
        latitude: location.latitude || location.coordinates?.lat || '',
        longitude: location.longitude || location.coordinates?.lng || '',
        source: 'saved'
      }
    })
    .filter(Boolean)

  const sectorAreas = RWANDA_DISTRICTS.flatMap((district) => {
    return Object.entries(district.sectors || {}).map(([sector, coordinates]) => ({
      key: `sector-${district.district}-${sector}`,
      label: `${sector}, ${district.district} (${district.province})`,
      shortLabel: sector,
      province: district.province,
      district: district.district,
      sector,
      cell: '',
      village: '',
      addressLine: '',
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      source: 'known-sector'
    }))
  })

  const districtAreas = RWANDA_DISTRICTS.map((district) => ({
    key: `district-${district.district}`,
    label: `${district.district} District (${district.province})`,
    shortLabel: district.district,
    province: district.province,
    district: district.district,
    sector: '',
    cell: '',
    village: '',
    addressLine: '',
    latitude: district.lat,
    longitude: district.lng,
    source: 'known-district'
  }))

  const allAreas = [...savedAreas, ...sectorAreas, ...districtAreas]
  const seen = new Set()

  return allAreas
    .filter((area) => {
      const key = normalizeText(`${area.label}-${area.latitude}-${area.longitude}`)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => {
      if (a.source === 'saved' && b.source !== 'saved') return -1
      if (a.source !== 'saved' && b.source === 'saved') return 1
      if (a.province === 'Kigali' && b.province !== 'Kigali') return -1
      if (a.province !== 'Kigali' && b.province === 'Kigali') return 1
      return a.label.localeCompare(b.label)
    })
}

export const CATEGORY_RULES = [
  {
    label: 'Phones & Accessories',
    slug: 'phones',
    keywords: ['phone', 'smartphone', 'iphone', 'samsung', 'tecno', 'infinix', 'itel', 'charger', 'earphone', 'headphone', 'screen', 'case', 'sim', 'powerbank']
  },
  {
    label: 'Food & Groceries',
    slug: 'food',
    keywords: ['food', 'rice', 'beans', 'maize', 'meat', 'fish', 'milk', 'bread', 'fruit', 'vegetable', 'tomato', 'banana', 'sugar', 'oil', 'tea', 'coffee', 'restaurant', 'cafe']
  },
  {
    label: 'Clothes & Shoes',
    slug: 'clothes',
    keywords: ['cloth', 'clothes', 'shirt', 'dress', 'trouser', 'skirt', 'shoe', 'sneaker', 'jeans', 'jacket', 'fashion', 'belt', 'bag', 'uniform']
  },
  {
    label: 'Electronics & Electricity',
    slug: 'electronics',
    keywords: ['electric', 'electronics', 'tv', 'television', 'laptop', 'computer', 'radio', 'bulb', 'cable', 'wire', 'socket', 'battery', 'solar', 'generator', 'adapter', 'fridge', 'fan']
  },
  {
    label: 'Beauty & Personal Care',
    slug: 'beauty',
    keywords: ['beauty', 'cosmetic', 'makeup', 'hair', 'salon', 'perfume', 'lotion', 'cream', 'nails', 'braid', 'soap', 'shampoo', 'skin']
  },
  {
    label: 'Home & Furniture',
    slug: 'home',
    keywords: ['home', 'furniture', 'sofa', 'table', 'chair', 'bed', 'mattress', 'curtain', 'kitchen', 'cooker', 'dish', 'decor', 'carpet', 'wardrobe']
  },
  {
    label: 'Building & Hardware',
    slug: 'hardware',
    keywords: ['cement', 'paint', 'timber', 'tile', 'plumbing', 'pipe', 'hardware', 'tool', 'hammer', 'nail', 'roof', 'door', 'window', 'construction']
  },
  {
    label: 'Health & Pharmacy',
    slug: 'health',
    keywords: ['medicine', 'pharmacy', 'health', 'clinic', 'drug', 'vitamin', 'mask', 'sanitizer', 'medical']
  },
  {
    label: 'Agriculture',
    slug: 'agriculture',
    keywords: ['seed', 'fertilizer', 'farm', 'agriculture', 'cow', 'goat', 'chicken', 'feed', 'harvest', 'crop']
  },
  {
    label: 'Auto & Transport',
    slug: 'auto',
    keywords: ['car', 'moto', 'motorcycle', 'bike', 'spare', 'tyre', 'tire', 'oil', 'garage', 'vehicle', 'transport']
  },
  {
    label: 'Books & Stationery',
    slug: 'stationery',
    keywords: ['book', 'pen', 'paper', 'school', 'stationery', 'notebook', 'printing', 'copy', 'office']
  },
  {
    label: 'Services',
    slug: 'services',
    keywords: ['service', 'repair', 'cleaning', 'delivery', 'design', 'photo', 'wedding', 'tailor', 'training']
  }
]

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'by',
  'for',
  'from',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'the',
  'this',
  'to',
  'with'
])

export const normalizeText = (value = '') => {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const titleCase = (value = '') => {
  return normalizeText(value)
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const tokenize = (value = '') => {
  return normalizeText(value)
    .split(' ')
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token))
}

const includesKeyword = (text, keyword) => {
  const cleanKeyword = normalizeText(keyword)
  return text === cleanKeyword || text.includes(` ${cleanKeyword} `) || text.startsWith(`${cleanKeyword} `) || text.endsWith(` ${cleanKeyword}`)
}

const keywordMatches = (text, keywords) => {
  return keywords.filter((keyword) => includesKeyword(` ${text} `, keyword))
}

export const classifyProduct = (product = {}) => {
  const name = product.name || product.productName || ''
  const description = product.description || ''
  const text = normalizeText(`${name} ${description}`)
  const nameText = normalizeText(name)

  const scored = CATEGORY_RULES.map((category) => {
    const matches = keywordMatches(text, category.keywords)
    const nameMatches = keywordMatches(nameText, category.keywords)
    return {
      ...category,
      matches,
      score: matches.length + nameMatches.length * 2
    }
  }).sort((a, b) => b.score - a.score)

  const best = scored[0]
  if (best?.score > 0) {
    return {
      category: best.label,
      categorySlug: best.slug,
      categoryConfidence: Math.min(0.98, 0.55 + best.score * 0.08),
      tags: [...new Set(best.matches)].slice(0, 6)
    }
  }

  const customToken = tokenize(name)[0] || tokenize(description)[0] || 'general'
  return {
    category: customToken === 'general' ? 'General Goods' : `${titleCase(customToken)} Goods`,
    categorySlug: customToken === 'general' ? 'general' : `custom-${customToken}`,
    categoryConfidence: customToken === 'general' ? 0.25 : 0.42,
    tags: customToken === 'general' ? [] : [customToken]
  }
}

export const enrichProduct = (product = {}) => {
  const classification = classifyProduct(product)
  return {
    ...product,
    category: classification.category,
    categorySlug: classification.categorySlug,
    categoryConfidence: classification.categoryConfidence,
    tags: [...new Set([...(product.tags || []), ...classification.tags])]
  }
}

export const classifyQuery = (query = '') => {
  const normalized = normalizeText(query)
  const tokens = tokenize(query)
  const categoryMatches = CATEGORY_RULES.map((category) => {
    const matches = keywordMatches(normalized, category.keywords)
    const tokenHits = tokens.filter((token) => category.keywords.some((keyword) => normalizeText(keyword).includes(token) || token.includes(normalizeText(keyword))))
    return {
      ...category,
      score: matches.length * 3 + tokenHits.length
    }
  })
    .filter((category) => category.score > 0)
    .sort((a, b) => b.score - a.score)

  return {
    raw: query,
    normalized,
    tokens,
    topCategory: categoryMatches[0] || null,
    categoryMatches
  }
}

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

const validCoordinatePair = (lat, lng) => {
  return lat !== null && lng !== null && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
}

export const parseCoordinateText = (value = '') => {
  const text = String(value)
  const atMatch = text.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/)
  const queryMatch = text.match(/[?&](?:q|ll)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/)
  const plainMatch = text.match(/(-?\d{1,2}(?:\.\d+)?)[,\s]+(-?\d{1,3}(?:\.\d+)?)/)
  const match = atMatch || queryMatch || plainMatch

  if (!match) return null

  const lat = toNumber(match[1])
  const lng = toNumber(match[2])
  return validCoordinatePair(lat, lng) ? { lat, lng } : null
}

const findDistrictByName = (districtName = '') => {
  const normalizedDistrict = normalizeText(districtName)
  if (!normalizedDistrict) return null
  return RWANDA_DISTRICTS.find((item) => normalizeText(item.district) === normalizedDistrict) || null
}

const findDistrictInText = (text = '') => {
  const normalized = normalizeText(text)
  if (!normalized) return null
  return RWANDA_DISTRICTS.find((item) => normalized.includes(normalizeText(item.district))) || null
}

const findSector = (district, sectorName = '') => {
  const normalizedSector = normalizeText(sectorName)
  if (!normalizedSector) return null

  const districts = district ? [findDistrictByName(district)].filter(Boolean) : RWANDA_DISTRICTS
  for (const districtItem of districts) {
    const sectors = districtItem.sectors || {}
    const sectorKey = Object.keys(sectors).find((key) => normalizeText(key) === normalizedSector)
    if (sectorKey) {
      return {
        province: districtItem.province,
        district: districtItem.district,
        sector: sectorKey,
        ...sectors[sectorKey]
      }
    }
  }
  return null
}

const findSectorInText = (text = '') => {
  const normalized = normalizeText(text)
  if (!normalized) return null

  for (const districtItem of RWANDA_DISTRICTS) {
    const sectors = districtItem.sectors || {}
    const sectorKey = Object.keys(sectors).find((key) => normalized.includes(normalizeText(key)))
    if (sectorKey) {
      return {
        province: districtItem.province,
        district: districtItem.district,
        sector: sectorKey,
        ...sectors[sectorKey]
      }
    }
  }
  return null
}

const locationParts = (input = {}) => {
  const structuredParts = [
    input.addressLine,
    input.village,
    input.cell,
    input.sector,
    input.district,
    input.province
  ].filter(Boolean)

  return structuredParts.length ? structuredParts : [input.location].filter(Boolean)
}

export const resolveLocation = (input = {}) => {
  const source = input.locationMeta || input
  const combinedText = [
    source.location,
    source.addressLine,
    source.village,
    source.cell,
    source.sector,
    source.district,
    source.province,
    source.mapUrl,
    source.googleMapsUrl
  ]
    .filter(Boolean)
    .join(' ')

  const coordinates = source.coordinates || {}
  const manualLat = toNumber(source.latitude ?? source.lat ?? coordinates.lat)
  const manualLng = toNumber(source.longitude ?? source.lng ?? coordinates.lng)

  if (validCoordinatePair(manualLat, manualLng)) {
    return {
      lat: manualLat,
      lng: manualLng,
      precision: source.precision || 'exact',
      source: source.source || 'manual',
      summary: formatLocation(source)
    }
  }

  const parsed = parseCoordinateText(combinedText)
  if (parsed) {
    return {
      ...parsed,
      precision: 'google-map-link',
      source: 'map-url',
      summary: formatLocation(source)
    }
  }

  const sector = findSector(source.district, source.sector) || findSectorInText(combinedText)
  if (sector) {
    return {
      lat: sector.lat,
      lng: sector.lng,
      precision: 'sector',
      source: 'rwanda-sector-estimate',
      summary: formatLocation({
        ...source,
        province: source.province || sector.province,
        district: source.district || sector.district,
        sector: source.sector || sector.sector
      })
    }
  }

  const district = findDistrictByName(source.district) || findDistrictInText(combinedText)
  if (district) {
    return {
      lat: district.lat,
      lng: district.lng,
      precision: 'district',
      source: 'rwanda-district-estimate',
      summary: formatLocation({
        ...source,
        province: source.province || district.province,
        district: source.district || district.district
      })
    }
  }

  return {
    ...DEFAULT_KIGALI_COORDINATES,
    precision: 'city-estimate',
    source: 'kigali-default',
    summary: formatLocation(source) || 'Kigali, Rwanda'
  }
}

export const buildLocationMeta = (form = {}) => {
  const resolved = resolveLocation(form)
  const location = formatLocation(form) || form.location || 'Kigali, Rwanda'

  return {
    province: form.province || '',
    district: form.district || '',
    sector: form.sector || '',
    cell: form.cell || '',
    village: form.village || '',
    addressLine: form.addressLine || '',
    googlePlaceId: form.googlePlaceId || '',
    googleMapsUrl: form.googleMapsUrl || form.mapUrl || '',
    latitude: resolved.lat,
    longitude: resolved.lng,
    coordinates: { lat: resolved.lat, lng: resolved.lng },
    precision: resolved.precision,
    source: resolved.source,
    location
  }
}

export const formatLocation = (input = {}) => {
  if (typeof input === 'string') return input
  const parts = locationParts(input)
  return [...new Set(parts.map((part) => String(part).trim()).filter(Boolean))].join(', ')
}

export const distanceKm = (from, to) => {
  if (!from || !to) return null
  const fromLat = toNumber(from.lat)
  const fromLng = toNumber(from.lng)
  const toLat = toNumber(to.lat)
  const toLng = toNumber(to.lng)

  if (!validCoordinatePair(fromLat, fromLng) || !validCoordinatePair(toLat, toLng)) return null

  const earthRadiusKm = 6371
  const dLat = ((toLat - fromLat) * Math.PI) / 180
  const dLng = ((toLng - fromLng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((fromLat * Math.PI) / 180) *
      Math.cos((toLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

export const formatDistance = (km) => {
  if (km === null || km === undefined || !Number.isFinite(km)) return 'Distance unknown'
  if (km < 1) return `${Math.round(km * 1000)} m away`
  if (km < 10) return `${km.toFixed(1)} km away`
  return `${Math.round(km)} km away`
}

const sellerReportCount = (seller, productReports = []) => {
  return productReports.filter((report) => report.sellerId === seller.id).length
}

export const productLikeCount = (product = {}) => (product.likes || []).length
export const productCommentCount = (product = {}) => (product.comments || []).length

export const productPopularityScore = (product = {}) => {
  return productLikeCount(product) * 4 + productCommentCount(product) * 2
}

const profileCompletionScore = (seller = {}) => {
  const location = seller.locationMeta || {}
  const products = seller.products || []
  const checks = [
    seller.businessName,
    seller.name,
    seller.email,
    seller.phone,
    seller.idnumber,
    seller.idphoto,
    seller.location || location.location,
    location.district,
    location.sector,
    location.coordinates || location.latitude,
    products.length > 0,
    products.some((product) => product.image),
    products.some((product) => product.description),
    products.every((product) => enrichProduct(product).categorySlug)
  ]

  const completed = checks.filter(Boolean).length
  return Math.round((completed / checks.length) * 100)
}

export const calculateSellerTrust = (seller = {}, buyers = [], productReports = []) => {
  const reactions = seller.reactions || {}
  const good = (reactions.good || []).length
  const bad = (reactions.bad || []).length
  const ratingTotal = good + bad
  const googleRating = Math.max(0, Math.min(5, Number(seller.googleRating || 0)))
  const products = seller.products || []
  const productLikes = products.reduce((total, product) => total + productLikeCount(product), 0)
  const productComments = products.reduce((total, product) => total + productCommentCount(product), 0)
  const favorites = buyers.filter((buyer) => (buyer.favoriteSellers || []).includes(seller.id)).length
  const wishlists = buyers.reduce((total, buyer) => {
    return total + (buyer.wishlist || []).filter((item) => item.sellerId === seller.id).length
  }, 0)
  const reports = sellerReportCount(seller, productReports)

  const buyerRatingScore = ratingTotal ? (good / ratingTotal) * 100 : 72
  const googleScore = googleRating ? (googleRating / 5) * 100 : 72
  const engagementScore = Math.min(100, productLikes * 6 + productComments * 4 + favorites * 9 + wishlists * 7)
  const reportScore = Math.max(0, 100 - reports * 22 - bad * 7)
  const profileScore = profileCompletionScore(seller)

  const score = Math.round(
    buyerRatingScore * 0.24 +
      googleScore * 0.15 +
      engagementScore * 0.17 +
      reportScore * 0.24 +
      profileScore * 0.2
  )

  const stars = Math.max(1, Math.min(5, Math.round(score / 20)))
  const grade = score >= 90 ? 'Excellent' : score >= 78 ? 'Strong' : score >= 62 ? 'Good' : score >= 45 ? 'Needs review' : 'High risk'

  return {
    score,
    percent: `${score}%`,
    stars,
    grade,
    googleRating,
    good,
    bad,
    reports,
    productLikes,
    productComments,
    favorites,
    wishlists,
    profileScore
  }
}

export const starString = (stars = 0) => {
  return '★★★★★'.slice(0, stars) + '☆☆☆☆☆'.slice(0, Math.max(0, 5 - stars))
}

export const matchProduct = (product = {}, queryInfo = classifyQuery('')) => {
  if (!queryInfo.normalized) return productPopularityScore(product)

  const enriched = enrichProduct(product)
  const text = normalizeText(`${enriched.name} ${enriched.description} ${enriched.category} ${(enriched.tags || []).join(' ')}`)
  let score = 0

  if (text.includes(queryInfo.normalized)) score += 18

  queryInfo.tokens.forEach((token) => {
    if (text.includes(token)) score += 4
  })

  if (queryInfo.topCategory && enriched.categorySlug === queryInfo.topCategory.slug) {
    score += 14
  }

  queryInfo.categoryMatches.forEach((category) => {
    if (enriched.categorySlug === category.slug) score += category.score * 3
  })

  if (score === 0) return 0

  return score + Math.min(8, productPopularityScore(product))
}

export const buildSellerSearchResults = ({
  sellers = [],
  buyer = null,
  buyers = [],
  productReports = [],
  query = '',
  includeAll = false
} = {}) => {
  const queryInfo = classifyQuery(query)
  const buyerLocation = buyer ? resolveLocation(buyer.locationMeta || buyer) : null

  return sellers
    .map((seller) => {
      const sellerLocation = resolveLocation(seller.locationMeta || seller)
      const km = buyerLocation ? distanceKm(buyerLocation, sellerLocation) : null
      const products = (seller.products || []).map(enrichProduct)
      const scoredProducts = products
        .map((product) => ({ ...product, searchScore: matchProduct(product, queryInfo) }))
        .sort((a, b) => {
          if (b.searchScore !== a.searchScore) return b.searchScore - a.searchScore
          return productPopularityScore(b) - productPopularityScore(a)
        })

      const matchedProducts = queryInfo.normalized ? scoredProducts.filter((product) => product.searchScore > 0) : scoredProducts
      const sellerText = normalizeText(`${seller.businessName} ${seller.name} ${seller.location} ${sellerLocation.summary}`)
      const sellerSearchScore = queryInfo.normalized
        ? queryInfo.tokens.reduce((total, token) => total + (sellerText.includes(token) ? 3 : 0), 0)
        : 0
      const hasSearchMatch = !queryInfo.normalized || matchedProducts.length > 0 || sellerSearchScore > 0
      const trust = calculateSellerTrust({ ...seller, products }, buyers, productReports)
      const topProducts = matchedProducts.length ? matchedProducts : scoredProducts
      const allProductLikes = products.reduce((total, product) => total + productLikeCount(product), 0)

      return {
        ...seller,
        products,
        locationMeta: {
          ...(seller.locationMeta || {}),
          coordinates: { lat: sellerLocation.lat, lng: sellerLocation.lng },
          precision: sellerLocation.precision,
          source: sellerLocation.source
        },
        resolvedLocation: sellerLocation,
        locationLabel: sellerLocation.summary || seller.location || 'Kigali, Rwanda',
        distanceKm: km,
        distanceLabel: formatDistance(km),
        trust,
        matchedProducts: includeAll ? topProducts : topProducts.slice(0, 3),
        totalMatchedProducts: topProducts.length,
        searchScore: (matchedProducts[0]?.searchScore || 0) + sellerSearchScore,
        hasSearchMatch,
        allProductLikes
      }
    })
    .filter((seller) => seller.hasSearchMatch)
    .sort((a, b) => {
      const aDistance = a.distanceKm ?? Number.POSITIVE_INFINITY
      const bDistance = b.distanceKm ?? Number.POSITIVE_INFINITY
      if (Math.abs(aDistance - bDistance) > 0.25) return aDistance - bDistance
      if (b.searchScore !== a.searchScore) return b.searchScore - a.searchScore
      if (b.trust.score !== a.trust.score) return b.trust.score - a.trust.score
      return b.allProductLikes - a.allProductLikes
    })
}

export const rankedProductsForSeller = (seller = {}, buyers = []) => {
  const wishlistCount = (productId) => {
    return buyers.reduce((total, buyer) => {
      return total + (buyer.wishlist || []).filter((item) => item.sellerId === seller.id && item.productId === productId).length
    }, 0)
  }

  return (seller.products || [])
    .map((product) => ({
      ...enrichProduct(product),
      wishlistCount: wishlistCount(product.id)
    }))
    .sort((a, b) => {
      if (productLikeCount(b) !== productLikeCount(a)) return productLikeCount(b) - productLikeCount(a)
      if (b.wishlistCount !== a.wishlistCount) return b.wishlistCount - a.wishlistCount
      return productCommentCount(b) - productCommentCount(a)
    })
}
