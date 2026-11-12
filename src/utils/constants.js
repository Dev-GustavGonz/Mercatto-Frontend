export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085/api'
export const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '')

export const getMediaUrl = (url, fallback) => {
  if (!url || typeof url !== 'string') return fallback || ''
  const trimmed = url.trim()
  if (!trimmed || trimmed.startsWith('blob:')) return fallback || ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('/images/')) {
    return trimmed
  }
  const cleanPath = (trimmed.startsWith('/') ? trimmed : `/${trimmed}`).replace(/\\/g, '/')
  return `${SERVER_URL}${cleanPath}`
}

// Debe coincidir EXACTAMENTE con google.client-id en application.properties del backend
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export const ROLES = {
  COMPRADOR: 'COMPRADOR',
  VENDEDOR: 'VENDEDOR',
  ADMIN: 'ADMIN',
}

export const ESTADOS_PEDIDO = {
  PENDIENTE: { label: 'Pendiente de Pago', color: 'yellow' },
  PAGADO: { label: 'Pagado / Confirmado', color: 'blue' },
  EN_PREPARACION: { label: 'En Preparación', color: 'indigo' },
  ENVIADO: { label: 'En Camino', color: 'purple' },
  ENTREGADO: { label: 'Entregado', color: 'green' },
  CANCELADO: { label: 'Cancelado', color: 'red' },
  REEMBOLSADO: { label: 'Reembolsado', color: 'gray' },
}

export const METODOS_PAGO = [
  {
    id: 'WOMPI',
    nombre: 'Otras opciones de pago',
    descripcion: 'Tarjeta de Crédito / Débito, Nequi y PSE',
    icono: 'CreditCard',
  },
  {
    id: 'CONTRA_ENTREGA',
    nombre: 'Pago Contra Entrega (Efectivo)',
    descripcion: 'Pagas al recibir tu paquete en tu puerta',
    icono: 'Truck',
  },
]
