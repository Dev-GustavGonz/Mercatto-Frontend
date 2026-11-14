import api from '@/utils/api'

export const tiendaService = {
  listarTiendas: async (config = {}) => {
    const res = await api.get('/tiendas', { forceRefresh: true, ...config })
    return res.data
  },

  obtenerTienda: async (id, config = {}) => {
    const res = await api.get(`/tiendas/${id}`, { forceRefresh: true, ...config })
    return res.data
  },

  obtenerProductosTienda: async (id, params = {}, config = {}) => {
    const res = await api.get(`/tiendas/${id}/productos`, { forceRefresh: true, ...config, params })
    return res.data
  },

  listarMarcas: async (config = {}) => {
    const res = await api.get('/tiendas/marcas', { forceRefresh: true, ...config })
    return res.data
  },
}

export default tiendaService
