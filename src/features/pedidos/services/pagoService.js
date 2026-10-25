import api from '@/utils/api'

export const pagoService = {
  iniciar: async (payloadOrId, metodo = 'WOMPI') => {
    let pedidoId = payloadOrId
    let metodoPago = metodo
    if (typeof payloadOrId === 'object' && payloadOrId !== null) {
      pedidoId = payloadOrId.pedidoId || payloadOrId.id
      metodoPago = payloadOrId.metodoPago || payloadOrId.metodo || 'WOMPI'
    }
    const res = await api.post('/pagos/iniciar', { pedidoId, metodo: metodoPago })
    return res.data
  },

  iniciarInvitado: async (payloadOrId, metodo = 'WOMPI') => {
    let pedidoId = payloadOrId
    let metodoPago = metodo
    if (typeof payloadOrId === 'object' && payloadOrId !== null) {
      pedidoId = payloadOrId.pedidoId || payloadOrId.id
      metodoPago = payloadOrId.metodoPago || payloadOrId.metodo || 'WOMPI'
    }
    const res = await api.post('/pagos/iniciar-invitado', { pedidoId, metodo: metodoPago })
    return res.data
  },

  iniciarPago: async (pedidoId, metodo = 'WOMPI') => {
    const res = await api.post('/pagos/iniciar', { pedidoId, metodo })
    return res.data
  },

  iniciarPagoInvitado: async (pedidoId, metodo = 'WOMPI') => {
    const res = await api.post('/pagos/iniciar-invitado', { pedidoId, metodo })
    return res.data
  },

  confirmarPago: async (pedidoId, transaccionId) => {
    const res = await api.post('/pagos/confirmar', { pedidoId, transaccionId })
    return res.data
  },

  confirmarPagoInvitado: async (pedidoId, transaccionId) => {
    const res = await api.post('/pagos/confirmar-invitado', { pedidoId, transaccionId })
    return res.data
  },

  confirmar: async (pedidoId, transaccionId) => {
    const res = await api.post('/pagos/confirmar', { pedidoId, transaccionId })
    return res.data
  },
}

export default pagoService
