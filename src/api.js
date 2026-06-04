const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const getToken = () => localStorage.getItem('authToken')

const fieldLabels = {
  businessName: 'Business name',
  email: 'Email',
  idnumber: 'National ID number',
  idphoto: 'ID photo',
  location: 'Location',
  name: 'Full name',
  password: 'Password',
  phone: 'Phone number'
}

const formatFieldName = (path) => {
  const field = String(path || '').split('.').pop()
  if (!field) return 'Field'

  return fieldLabels[field] || field
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (letter) => letter.toUpperCase())
}

const formatApiError = (data) => {
  if (Array.isArray(data.details) && data.details.length > 0) {
    const details = data.details
      .map((detail) => `${formatFieldName(detail.path)}: ${detail.message}`)
      .join('\n')

    return `Please fix these fields:\n${details}`
  }

  return data.error || 'Request failed'
}

export const saveSession = ({ token, currentUser }) => {
  if (token) localStorage.setItem('authToken', token)
  if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser))
}

export const clearSession = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('currentUser')
}

export const apiRequest = async (path, options = {}) => {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {})
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    })
  } catch {
    throw new Error('Cannot reach the backend API. Start the full app with npm run dev, or start the API with npm run server, then try again.')
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(formatApiError(data))
  }

  return data
}

export const authApi = {
  registerBuyer: (payload) => apiRequest('/auth/register/buyer', { method: 'POST', body: payload }),
  registerSeller: (payload) => apiRequest('/auth/register/seller', { method: 'POST', body: payload }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: payload }),
  me: () => apiRequest('/auth/me')
}

export const buyerApi = {
  me: () => apiRequest('/buyers/me'),
  updateMe: (payload) => apiRequest('/buyers/me', { method: 'PUT', body: payload })
}

export const sellersApi = {
  list: () => apiRequest('/sellers'),
  get: (sellerId) => apiRequest(`/sellers/${sellerId}`),
  insights: (sellerId) => apiRequest(`/sellers/${sellerId}/insights`),
  addProduct: (sellerId, payload) => apiRequest(`/sellers/${sellerId}/products`, { method: 'POST', body: payload }),
  updateProduct: (sellerId, productId, payload) => apiRequest(`/sellers/${sellerId}/products/${productId}`, { method: 'PUT', body: payload }),
  deleteProduct: (sellerId, productId) => apiRequest(`/sellers/${sellerId}/products/${productId}`, { method: 'DELETE' }),
  favorite: (sellerId) => apiRequest(`/sellers/${sellerId}/favorite`, { method: 'POST' }),
  rate: (sellerId, rating) => apiRequest(`/sellers/${sellerId}/rating`, { method: 'POST', body: { rating } }),
  comment: (sellerId, text) => apiRequest(`/sellers/${sellerId}/comments`, { method: 'POST', body: { text } }),
  likeProduct: (sellerId, productId) => apiRequest(`/sellers/${sellerId}/products/${productId}/like`, { method: 'POST' }),
  wishlistProduct: (sellerId, productId) => apiRequest(`/sellers/${sellerId}/products/${productId}/wishlist`, { method: 'POST' }),
  commentProduct: (sellerId, productId, text) => apiRequest(`/sellers/${sellerId}/products/${productId}/comments`, { method: 'POST', body: { text } })
}

export const reportsApi = {
  reportProduct: (payload) => apiRequest('/reports/products', { method: 'POST', body: payload })
}

export const adminApi = {
  overview: () => apiRequest('/admin/overview'),
  deleteUser: (type, id) => apiRequest(`/admin/users/${type}/${id}`, { method: 'DELETE' }),
  deleteReport: (id) => apiRequest(`/admin/reports/${id}`, { method: 'DELETE' })
}
