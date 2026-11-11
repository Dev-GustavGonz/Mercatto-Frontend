import api from '@/utils/api'

export const tiendaService = {
  listarTiendas: async (config = {}) => {
    const res = await api.get('/tiendas', config)
    return res.data
  },

  obtenerTienda: async (id, config = {}) => {
    const res = await api.get(`/tiendas/${id}`, config)
    return res.data
  },

  obtenerProductosTienda: async (id, params = {}) => {
    const res = await api.get(`/tiendas/${id}/productos`, { params })
    return res.data
  },

  listarMarcas: async (config = {}) => {
    const res = await api.get('/tiendas/marcas', config)
    return res.data
  },
}

export default tiendaService
