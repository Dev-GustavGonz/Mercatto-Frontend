import axios from 'axios'
import { API_BASE_URL } from '@/utils/constants'
import { apiCache } from '@/utils/apiCache'

const api = axios.create({
  baseURL: API_BASE_URL,
  // Necesario para que el navegador mande/reciba la cookie httpOnly del refresh token.
  withCredentials: true,
  timeout: 30000, // 30s de tolerancia para soportar Cold Starts de la nube sin fallar
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach JWT Token and active language
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mercatto_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const idioma = (localStorage.getItem('mercatto_idioma') || 'es').toLowerCase()
    config.headers['Accept-Language'] = idioma
    if (config.data instanceof FormData) {
      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type')
      } else {
        delete config.headers['Content-Type']
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: si el access token expiró (401), pedimos uno nuevo
// usando la cookie httpOnly (no hace falta mandar nada en el body).
api.interceptors.response.use(
  (response) => {
    // Si fue una mutación exitosa (POST, PUT, PATCH, DELETE), invalidamos la caché asociada
    if (response.config?.method && response.config.method.toUpperCase() !== 'GET') {
      apiCache.invalidateOnMutation(response.config.method, response.config.url || '')
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
      originalRequest._retry = true

      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })
        if (res.data?.exito && res.data?.accessToken) {
          localStorage.setItem('mercatto_token', res.data.accessToken)
          if (res.data.usuario) localStorage.setItem('mercatto_user', JSON.stringify(res.data.usuario))
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('mercatto_token')
        localStorage.removeItem('mercatto_user')
        apiCache.clear()
        const rutaActual = window.location.pathname
        if (rutaActual.startsWith('/admin') || rutaActual.startsWith('/vendedor') || rutaActual.startsWith('/perfil') || rutaActual.startsWith('/panel-vendedor')) {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Wrapper transparente para peticiones GET con caché inteligente persistente (SWR) y deduplicación
const originalGet = api.get.bind(api)
api.get = async (url, config = {}) => {
  const { forceRefresh = false, ...axiosConfig } = config
  const reqConfig = { ...axiosConfig, url, method: 'GET' }

  // 1. Si la petición no es cacheable (rutas privadas, tokens, config.noCache), ejecutar directo a red
  if (!apiCache.isCacheable(reqConfig)) {
    return originalGet(url, axiosConfig)
  }

  // 2. Comprobar si existe en caché persistente o memoria (salvo que forceRefresh esté activo)
  const cachedEntry = forceRefresh ? null : apiCache.getEntry(reqConfig)
  if (cachedEntry) {
    // Si la caché está fresca (TTL no expirado), responder en 0ms
    if (!cachedEntry.isStale) {
      return Promise.resolve(cachedEntry.response)
    }

    // Stale-While-Revalidate: Si está expirada, responder con la caché en 0ms
    // y disparar una actualización silenciosa en segundo plano
    const key = apiCache.generateKey(reqConfig)
    if (!apiCache.inFlightRequests.has(key)) {
      const backgroundPromise = originalGet(url, axiosConfig)
        .then((freshResponse) => {
          apiCache.set(reqConfig, freshResponse)
          return freshResponse
        })
        .catch(() => {})
        .finally(() => {
          apiCache.inFlightRequests.delete(key)
        })
      apiCache.inFlightRequests.set(key, backgroundPromise)
    }

    return Promise.resolve(cachedEntry.response)
  }

  // 3. Deduplicación de peticiones concurrentes idénticas
  const key = apiCache.generateKey(reqConfig)
  if (!forceRefresh && apiCache.inFlightRequests.has(key)) {
    return apiCache.inFlightRequests.get(key)
  }

  // 4. Disparar petición real a la red y almacenar en caché
  const networkConfig = forceRefresh
    ? {
        ...axiosConfig,
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          ...axiosConfig.headers,
        },
      }
    : axiosConfig

  const requestPromise = originalGet(url, networkConfig)
    .then((response) => {
      apiCache.set(reqConfig, response)
      return response
    })
    .finally(() => {
      apiCache.inFlightRequests.delete(key)
    })

  apiCache.inFlightRequests.set(key, requestPromise)
  return requestPromise
}

// Método utilitario expuesto para invalidar caché manualmente
api.clearCache = (pattern) => {
  if (pattern) {
    apiCache.invalidateByPrefix(pattern)
  } else {
    apiCache.clear()
  }
}

export default api
