/**
 * Sistema de Caché Inteligente Persistente (SWR) para Mercatto Frontend
 * 
 * Beneficios:
 * 1. Reduce los tiempos de carga a 0ms en navegación repetida y refresco de página.
 * 2. Persistencia en localStorage: Al volver a abrir la web en móvil o escritorio,
 *    el contenido se muestra al instante sin pantalla blanca ni spinner bloqueante.
 * 3. Stale-While-Revalidate (SWR): Muestra datos en caché de inmediato y revalida
 *    silenciosamente en segundo plano si la caché ya expiró.
 * 4. Deduplica peticiones concurrentes (In-Flight Request Deduplication).
 * 5. Invalida automáticamente la caché ante operaciones de mutación (POST, PUT, PATCH, DELETE).
 */

const STORAGE_PREFIX = 'mercatto_cache:v2:'
const MAX_STALE_AGE = 24 * 60 * 60 * 1000 // Permitir datos en caché de hasta 24 horas como fallback instantáneo

class ApiCacheManager {
  constructor() {
    this.cache = new Map()
    this.inFlightRequests = new Map()

    // Reglas de TTL fresco (en milisegundos)
    this.ttlRules = [
      { pattern: /^\/categorias/, ttl: 30 * 60 * 1000 },      // 30 minutos
      { pattern: /^\/tiendas\/marcas/, ttl: 30 * 60 * 1000 }, // 30 minutos
      { pattern: /^\/tiendas/, ttl: 10 * 60 * 1000 },          // 10 minutos
      { pattern: /^\/productos\/(destacados|mas-vendidos|nuevos)/, ttl: 10 * 60 * 1000 }, // 10 minutos
      { pattern: /^\/productos\/slug\//, ttl: 10 * 60 * 1000 }, // 10 minutos
      { pattern: /^\/productos\/\d+$/, ttl: 10 * 60 * 1000 },  // 10 minutos
      { pattern: /^\/productos/, ttl: 5 * 60 * 1000 },        // 5 minutos
    ]

    // Rutas que SIEMPRE deben ser frescas y nunca guardarse en caché
    this.bypassPatterns = [
      /^\/auth\//,
      /^\/carrito/,
      /^\/pedidos/,
      /^\/perfil/,
      /^\/mensajes/,
      /^\/admin\/stats/,
      /^\/admin\/pedidos/,
      /^\/panel-vendedor/
    ]

    // Cargar caché previa de localStorage a memoria de manera perezosa
    this.initFromStorage()
  }

  /**
   * Carga llaves activas de localStorage a la memoria RAM.
   */
  initFromStorage() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return
      const now = Date.now()
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(STORAGE_PREFIX)) {
          try {
            const raw = localStorage.getItem(key)
            if (!raw) continue
            const parsed = JSON.parse(raw)
            // Descartar si excede el límite máximo de 24 horas
            if (now - (parsed.cachedAt || 0) > MAX_STALE_AGE) {
              localStorage.removeItem(key)
            } else {
              const memKey = key.slice(STORAGE_PREFIX.length)
              this.cache.set(memKey, parsed)
            }
          } catch (e) {
            localStorage.removeItem(key)
          }
        }
      }
    } catch (e) {
      // Ignorar si localStorage está deshabilitado por modo incógnito
    }
  }

  /**
   * Genera una clave única para la petición basada en método, URL, parámetros e idioma.
   */
  generateKey(config) {
    const url = config.url || ''
    const params = config.params ? JSON.stringify(config.params) : ''
    const lang = config.headers?.['Accept-Language'] || localStorage.getItem('mercatto_idioma') || 'es'
    return `${config.method?.toUpperCase() || 'GET'}:${url}?${params}:${lang}`
  }

  /**
   * Determina si una petición es elegible para caché.
   */
  isCacheable(config) {
    if (config.method && config.method.toUpperCase() !== 'GET') {
      return false
    }
    if (config.cache === false || config.noCache === true) {
      return false
    }
    const url = config.url || ''
    return !this.bypassPatterns.some((pattern) => pattern.test(url))
  }

  /**
   * Obtiene el TTL correspondiente para una URL.
   */
  getTTL(config) {
    if (typeof config.cacheTTL === 'number') {
      return config.cacheTTL
    }
    const url = config.url || ''
    for (const rule of this.ttlRules) {
      if (rule.pattern.test(url)) {
        return rule.ttl
      }
    }
    return 3 * 60 * 1000 // 3 minutos por defecto
  }

  /**
   * Obtiene un elemento de la caché, evaluando si está fresco o stale.
   * Retorna { response, isStale } o null si no existe.
   */
  getEntry(config) {
    const key = this.generateKey(config)
    let entry = this.cache.get(key)

    // Si no está en memoria, intentar buscar en localStorage
    if (!entry) {
      try {
        const raw = localStorage.getItem(STORAGE_PREFIX + key)
        if (raw) {
          entry = JSON.parse(raw)
          this.cache.set(key, entry)
        }
      } catch (e) {}
    }

    if (!entry) return null

    const now = Date.now()
    const age = now - (entry.cachedAt || 0)

    // Si superó el tiempo máximo de 24 horas, eliminarlo
    if (age > MAX_STALE_AGE) {
      this.cache.delete(key)
      try { localStorage.removeItem(STORAGE_PREFIX + key) } catch (e) {}
      return null
    }

    const isStale = now > entry.expiresAt
    return {
      response: entry.response,
      isStale,
      cachedAt: entry.cachedAt
    }
  }

  /**
   * Método de compatibilidad para lecturas directas (retorna response o null)
   */
  get(config) {
    const result = this.getEntry(config)
    return result ? result.response : null
  }

  /**
   * Permite inspeccionar síncronamente datos cacheados para inicializar estado en 0ms
   */
  peekData(urlPattern) {
    try {
      // 1. Revisar en memoria
      for (const [key, entry] of this.cache.entries()) {
        if (key.includes(urlPattern) && entry?.response?.data) {
          return entry.response.data
        }
      }
      // 2. Revisar en localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i)
          if (k && k.startsWith(STORAGE_PREFIX) && k.includes(urlPattern)) {
            const raw = localStorage.getItem(k)
            if (raw) {
              const entry = JSON.parse(raw)
              if (entry?.response?.data) return entry.response.data
            }
          }
        }
      }
    } catch (e) {}

    // Fallback inicial ultrarrápido para categorías estándar
    if (urlPattern && urlPattern.includes('/categorias')) {
      return [
        { id: 1, nombre: 'Hogar & Muebles', slug: 'hogar-muebles', icono: 'Home' },
        { id: 2, nombre: 'Tecnología & Electrónica', slug: 'tecnologia-electronica', icono: 'Laptop' },
        { id: 3, nombre: 'Moda & Calzado', slug: 'moda-calzado', icono: 'Shirt' },
        { id: 4, nombre: 'Deportes & Fitness', slug: 'deportes-fitness', icono: 'Activity' },
        { id: 5, nombre: 'Belleza & Cuidado Personal', slug: 'belleza-cuidado', icono: 'Sparkles' }
      ]
    }

    return null
  }

  /**
   * Almacena una respuesta en la caché en memoria y persistente.
   */
  set(config, response) {
    const key = this.generateKey(config)
    const ttl = this.getTTL(config)
    const entry = {
      response: {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      },
      cachedAt: Date.now(),
      expiresAt: Date.now() + ttl,
    }

    this.cache.set(key, entry)

    // Persistir en localStorage
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry))
    } catch (e) {
      // Quota excedida: limpiar entradas antiguas de mercatto_cache y reintentar
      this.pruneStorage()
      try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry))
      } catch (err) {}
    }
  }

  /**
   * Libera espacio eliminando entradas antiguas de localStorage.
   */
  pruneStorage() {
    try {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(k)
        }
      }
      // Eliminar la mitad más vieja o todas si es necesario
      keysToRemove.forEach((k) => localStorage.removeItem(k))
    } catch (e) {}
  }

  /**
   * Invalida selectivamente entradas de la caché cuando ocurre una mutación.
   */
  invalidateOnMutation(method, url) {
    const m = (method || '').toUpperCase()
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(m)) return

    if (url.includes('/productos')) {
      this.invalidateByPrefix('/productos')
      this.invalidateByPrefix('/tiendas')
    } else if (url.includes('/tiendas') || url.includes('/vendedor')) {
      this.invalidateByPrefix('/tiendas')
    } else if (url.includes('/categorias')) {
      this.invalidateByPrefix('/categorias')
    } else if (url.includes('/auth/logout')) {
      this.clear()
    }
  }

  /**
   * Invalida todas las claves que contengan un prefijo o coincidan con una expresión.
   */
  invalidateByPrefix(prefix) {
    for (const key of this.cache.keys()) {
      if (key.includes(prefix)) {
        this.cache.delete(key)
        try { localStorage.removeItem(STORAGE_PREFIX + key) } catch (e) {}
      }
    }
    try {
      const toRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith(STORAGE_PREFIX) && k.includes(prefix)) {
          toRemove.push(k)
        }
      }
      toRemove.forEach((k) => localStorage.removeItem(k))
    } catch (e) {}
  }

  /**
   * Limpia toda la caché en memoria y persistente.
   */
  clear() {
    this.cache.clear()
    this.inFlightRequests.clear()
    try {
      const toRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith(STORAGE_PREFIX)) {
          toRemove.push(k)
        }
      }
      toRemove.forEach((k) => localStorage.removeItem(k))
    } catch (e) {}
  }
}

export const apiCache = new ApiCacheManager()
