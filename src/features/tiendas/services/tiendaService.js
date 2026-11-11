import api from '@/utils/api'

export const tiendaService = {
  listarTiendas: async () => {
    const res = await api.get('/tiendas')
    return res.data
  },

  obtenerTienda: async (id) => {
    const res = await api.get(`/tiendas/${id}`)
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
