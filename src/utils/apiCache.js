/**
 * Sistema de Caché Inteligente en Memoria para Mercatto Frontend
 * 
 * Beneficios:
 * 1. Reduce los tiempos de carga a 0ms en navegación repetida.
 * 2. Deduplica peticiones concurrentes (In-Flight Request Deduplication).
 * 3. Invalida automáticamente la caché ante operaciones de mutación (POST, PUT, PATCH, DELETE).
 * 4. Evita sobrecargar la base de datos remota con consultas redundantes.
 */

class ApiCacheManager {
  constructor() {
    this.cache = new Map()
    this.inFlightRequests = new Map()

    // Reglas de TTL por prefijo de ruta (en milisegundos)
    this.ttlRules = [
      { pattern: /^\/categorias/, ttl: 15 * 60 * 1000 },      // 15 minutos
      { pattern: /^\/tiendas\/marcas/, ttl: 15 * 60 * 1000 }, // 15 minutos
      { pattern: /^\/tiendas/, ttl: 5 * 60 * 1000 },          // 5 minutos
      { pattern: /^\/productos\/(destacados|mas-vendidos|nuevos)/, ttl: 5 * 60 * 1000 }, // 5 minutos
      { pattern: /^\/productos\/slug\//, ttl: 5 * 60 * 1000 }, // 5 minutos
      { pattern: /^\/productos\/\d+$/, ttl: 5 * 60 * 1000 },  // 5 minutos
      { pattern: /^\/productos/, ttl: 3 * 60 * 1000 },        // 3 minutos
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
    return 2 * 60 * 1000 // 2 minutos por defecto
  }

  /**
   * Obtiene un elemento válido de la caché si no ha expirado.
   */
  get(config) {
    const key = this.generateKey(config)
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.response
  }

  /**
   * Almacena una respuesta en la caché.
   */
  set(config, response) {
    const key = this.generateKey(config)
    const ttl = this.getTTL(config)
    this.cache.set(key, {
      response: {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: response.config,
      },
      cachedAt: Date.now(),
      expiresAt: Date.now() + ttl,
    })
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
      }
    }
  }

  /**
   * Limpia toda la caché en memoria.
   */
  clear() {
    this.cache.clear()
    this.inFlightRequests.clear()
  }
}

export const apiCache = new ApiCacheManager()
