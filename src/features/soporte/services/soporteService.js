import api from '@/utils/api'

export const soporteService = {
  crearTicket: async (datos) => {
    const res = await api.post('/soporte/ticket', datos)
    return res.data
  },

  obtenerMisTickets: async () => {
    const res = await api.get('/soporte/mis-tickets')
    return res.data
  }
}

export default soporteService
