import React, { useState } from 'react'
import { formatCurrency } from '@/utils/formatCurrency'
import { ESTADOS_PEDIDO } from '@/utils/constants'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import { pedidoService } from '@/features/pedidos'
import { useToast } from '@/hooks/useToast'
import {
  Eye,
  Truck,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  PackageCheck,
  XCircle,
  AlertTriangle,
  DollarSign,
  ShieldCheck,
  RotateCcw
} from 'lucide-react'

export const OrdersTable = ({ pedidos = [], onPedidoActualizado }) => {
  const [pedidoDetalle, setPedidoDetalle] = useState(null)
  const [modalEnvio, setModalEnvio] = useState(null)
  const [pedidoParaCancelar, setPedidoParaCancelar] = useState(null)
  const [cancelando, setCancelando] = useState(false)
  const [guia, setGuia] = useState('')
  const [empresa, setEmpresa] = useState('Servientrega')
  const [loading, setLoading] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [busqueda, setBusqueda] = useState('')
  const { success, error } = useToast()

  const handleActualizarEstado = async (id, estado, tracking = null, carrier = null) => {
    try {
      await pedidoService.actualizarEstado(id, { estado, guia: tracking, empresa: carrier })
      success('Estado del pedido actualizado exitosamente')
      if (onPedidoActualizado) onPedidoActualizado()
    } catch (err) {
      const msg = err.response?.data?.mensaje || err.response?.data?.message || 'Error al actualizar el estado del pedido'
      error(msg)
    }
  }

  const handleConfirmarCancelacion = async () => {
    if (!pedidoParaCancelar) return
    setCancelando(true)
    try {
      await pedidoService.cancelarPedido(pedidoParaCancelar.id)
      success(`Pedido ${pedidoParaCancelar.codigo} cancelado exitosamente. El inventario ha sido restablecido.`)
      setPedidoParaCancelar(null)
      if (onPedidoActualizado) onPedidoActualizado()
    } catch (err) {
      const msg = err.response?.data?.mensaje || err.response?.data?.message || 'Error al cancelar el pedido'
      error(msg)
    } finally {
      setCancelando(false)
    }
  }

  const handleEnviarPedido = async (e) => {
    e.preventDefault()
    if (!empresa.trim()) {
      error('Por favor ingresa o selecciona la empresa transportadora.')
      return
    }
    if (!guia.trim() || guia.trim().length < 3) {
      error('Por favor ingresa un número de guía válido (mínimo 3 caracteres).')
      return
    }
    setLoading(true)
    try {
      await handleActualizarEstado(modalEnvio.id, 'ENVIADO', guia.trim(), empresa.trim())
      setModalEnvio(null)
      setGuia('')
    } finally {
      setLoading(false)
    }
  }

  // Filtrado de pedidos
  const safePedidos = Array.isArray(pedidos) ? pedidos : []
  const pedidosFiltrados = safePedidos.filter((p) => {
    const coincideEstado =
      filtroEstado === 'TODOS' ||
      (filtroEstado === 'PENDIENTES' && (p.estado === 'PAGADO' || p.estado === 'PENDIENTE' || p.estado === 'EN_PREPARACION')) ||
      (filtroEstado === 'CANCELADOS' && p.estado === 'CANCELADO') ||
      p.estado === filtroEstado

    const q = busqueda.toLowerCase().trim()
    const coincideBusqueda =
      !q ||
      p.codigo?.toLowerCase().includes(q) ||
      p.comprador?.nombre?.toLowerCase().includes(q) ||
      p.direccion?.ciudad?.toLowerCase().includes(q)

    return coincideEstado && coincideBusqueda
  })

  return (
    <div className="space-y-4">
      {/* Controles de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Pestañas de Estado */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'TODOS', label: 'Todos', count: pedidos.length },
            { id: 'PENDIENTES', label: 'Por Despachar', count: pedidos.filter(p => p.estado === 'PAGADO' || p.estado === 'PENDIENTE' || p.estado === 'EN_PREPARACION').length },
            { id: 'ENVIADO', label: 'En Camino', count: pedidos.filter(p => p.estado === 'ENVIADO').length },
            { id: 'ENTREGADO', label: 'Entregados', count: pedidos.filter(p => p.estado === 'ENTREGADO').length },
            { id: 'CANCELADOS', label: 'Cancelados', count: pedidos.filter(p => p.estado === 'CANCELADO').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFiltroEstado(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                filtroEstado === tab.id
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  filtroEstado === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative max-w-xs w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por código o cliente..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Código</th>
                <th className="p-3.5">Cliente</th>
                <th className="p-3.5">Total Venta</th>
                <th className="p-3.5">Liquidación a Tienda</th>
                <th className="p-3.5">Estado Pedido</th>
                <th className="p-3.5">Fecha</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No se encontraron pedidos con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((p) => {
                  const infoEstado = ESTADOS_PEDIDO[p.estado] || { label: p.estado, color: 'gray' }
                  const netoCalculado = p.netoVendedor != null ? p.netoVendedor : (p.total * 0.95)
                  const esEntregado = p.estado === 'ENTREGADO'
                  const esCancelado = p.estado === 'CANCELADO'
                  const puedeCancelar = p.estado === 'PENDIENTE' || p.estado === 'PAGADO' || p.estado === 'EN_PREPARACION'

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{p.codigo}</td>
                      <td className="p-3.5">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{p.comprador?.nombre || 'Cliente'}</p>
                        <p className="text-[11px] text-slate-400">{p.direccion?.ciudad || 'Cartagena'}</p>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{formatCurrency(p.total)}</td>
                      
                      {/* Columna de Liquidación y Desembolso */}
                      <td className="p-3.5">
                        {esEntregado ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                              <CheckCircle2 size={11} className="text-emerald-500" />
                              <span>✓ Desembolsado</span>
                            </span>
                            <p className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400">
                              {formatCurrency(netoCalculado)}
                            </p>
                          </div>
                        ) : esCancelado ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                            <XCircle size={11} />
                            <span>Sin desembolso</span>
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                              <Clock size={11} className="text-amber-500" />
                              <span>En Custodia Wompi</span>
                            </span>
                            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                              {formatCurrency(netoCalculado)} <span className="text-[10px] text-slate-400 font-normal">(al entregar)</span>
                            </p>
                          </div>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {infoEstado.label}
                        </span>
                      </td>

                      <td className="p-3.5 text-slate-400">
                        {p.fechaCreacion ? new Date(p.fechaCreacion).toLocaleDateString('es-CO') : '-'}
                      </td>

                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setPedidoDetalle(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                          title="Ver Detalles y Liquidación"
                        >
                          <Eye size={15} />
                        </button>

                        {(p.estado === 'PAGADO' || p.estado === 'PENDIENTE') && (
                          <button
                            onClick={() => handleActualizarEstado(p.id, 'EN_PREPARACION')}
                            className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-[11px] font-bold hover:bg-violet-100 dark:bg-violet-950/50 dark:text-violet-300 cursor-pointer transition shadow-xs"
                          >
                            Preparar Pedido
                          </button>
                        )}

                        {p.estado === 'EN_PREPARACION' && (
                          <button
                            onClick={() => setModalEnvio(p)}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600 text-[11px] font-bold hover:bg-purple-100 dark:bg-purple-950/50 dark:text-purple-300 cursor-pointer transition shadow-xs flex items-center gap-1 inline-flex"
                          >
                            <Truck size={12} />
                            <span>Despachar / Guía</span>
                          </button>
                        )}

                        {p.estado === 'ENVIADO' && (
                          <button
                            onClick={() => handleActualizarEstado(p.id, 'ENTREGADO')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 cursor-pointer transition shadow-xs flex items-center gap-1 inline-flex"
                          >
                            <CheckCircle2 size={12} />
                            <span>Confirmar Entrega</span>
                          </button>
                        )}

                        {p.estado === 'ENTREGADO' && (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                            <CheckCircle2 size={13} />
                            <span>Completado</span>
                          </span>
                        )}

                        {puedeCancelar && (
                          <button
                            onClick={() => setPedidoParaCancelar(p)}
                            className="px-2 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 text-[11px] font-bold cursor-pointer transition inline-flex items-center gap-1"
                            title="Cancelar pedido y reintegrar inventario"
                          >
                            <XCircle size={12} />
                            <span>Cancelar</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalle Pedido y Auditoría de Liquidación */}
      {pedidoDetalle && (
        <Modal isOpen={true} onClose={() => setPedidoDetalle(null)} title={`Detalles de Pedido: ${pedidoDetalle.codigo}`}>
          <div className="space-y-4 text-xs font-sans">
            
            {/* Tarjeta de Liquidación de Fondos */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-violet-600 dark:text-violet-400" />
                  <span>Estado de Liquidación Wompi / Mercatto:</span>
                </span>

                {pedidoDetalle.estado === 'ENTREGADO' ? (
                  <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-flex items-center gap-1.5 border border-emerald-300/40">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>✓ Pago Transferido (Desembolsado)</span>
                  </span>
                ) : pedidoDetalle.estado === 'CANCELADO' ? (
                  <span className="px-3 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300/40">
                    Cancelado (Sin desembolso)
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 inline-flex items-center gap-1.5 border border-amber-300/40">
                    <Clock size={13} className="text-amber-600" />
                    <span>Fondos en Custodia Wompi</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-semibold">1. Venta Bruta</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {formatCurrency(pedidoDetalle.total)}
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-rose-500 block font-semibold">2. Comisión Mercatto</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                    -{formatCurrency(pedidoDetalle.montoComision || (pedidoDetalle.total * 0.05))}
                  </span>
                </div>
                <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block font-bold">3. Neto para Tienda</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatCurrency(pedidoDetalle.netoVendedor != null ? pedidoDetalle.netoVendedor : (pedidoDetalle.total * 0.95))}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                {pedidoDetalle.estado === 'ENTREGADO'
                  ? '✓ El desembolso ha sido acreditado de forma automática a la tienda tras confirmar la entrega satisfactoria del producto al cliente.'
                  : 'Los fondos pagados por el cliente a través de Wompi se mantienen en custodia segura de Mercatto. Al marcar el pedido como ENTREGADO, el dinero se distribuye y transfiere automáticamente a tu tienda restando el porcentaje de comisión de tu plan.'}
              </p>
            </div>

            {/* Dirección de Entrega */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <p className="font-bold text-slate-800 dark:text-white">Dirección de Entrega (Cartagena de Indias):</p>
              <p className="text-slate-700 dark:text-slate-300">
                {pedidoDetalle.direccion?.nombreCompleto || pedidoDetalle.comprador?.nombre} — Tel: {pedidoDetalle.direccion?.telefono || 'N/A'}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                {pedidoDetalle.direccion?.direccion}{pedidoDetalle.direccion?.barrio ? `, Barrio ${pedidoDetalle.direccion.barrio}` : ''}, Cartagena de Indias
              </p>
              {pedidoDetalle.direccion?.notasEntrega && (
                <p className="text-amber-600 dark:text-amber-400 italic text-[11px] pt-1">
                  Instrucciones del cliente: "{pedidoDetalle.direccion.notasEntrega}"
                </p>
              )}
            </div>

            {/* Artículos */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {pedidoDetalle.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2.5 items-center gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.imagenUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80'}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                      alt={item.nombreProducto}
                    />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{item.nombreProducto}</p>
                      {item.nombreVariante && <p className="text-[11px] text-slate-400">{item.nombreVariante}</p>}
                      {item.porcentajeComision != null && (
                        <p className="text-[10px] text-slate-400">Comisión del plan: {item.porcentajeComision}%</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-slate-500 font-medium">{item.cantidad} x {formatCurrency(item.precioUnitario)}</p>
                    <p className="font-bold text-violet-600 dark:text-violet-400">{formatCurrency(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm">
              <span>Total Pedido:</span>
              <span className="text-violet-600 dark:text-violet-400 font-black">{formatCurrency(pedidoDetalle.total)}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Confirmación de Cancelación */}
      {pedidoParaCancelar && (
        <Modal
          isOpen={true}
          onClose={() => setPedidoParaCancelar(null)}
          title={`¿Cancelar Pedido ${pedidoParaCancelar.codigo}?`}
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 flex items-start gap-3">
              <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <p className="font-bold text-rose-900 dark:text-rose-300">
                  Esta acción cancelará el pedido y devolverá las existencias al inventario.
                </p>
                <p className="text-rose-700 dark:text-rose-400 text-[11px] leading-relaxed">
                  Todos los productos y variantes comprados en esta orden serán reintegrados automáticamente a tu stock para que puedan volver a venderse.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl space-y-1 text-slate-700 dark:text-slate-300">
              <p><strong>Cliente:</strong> {pedidoParaCancelar.comprador?.nombre || 'Comprador'}</p>
              <p><strong>Total Orden:</strong> {formatCurrency(pedidoParaCancelar.total)}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setPedidoParaCancelar(null)} disabled={cancelando}>
                Volver
              </Button>
              <button
                onClick={handleConfirmarCancelacion}
                disabled={cancelando}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                {cancelando ? (
                  <span>Cancelando...</span>
                ) : (
                  <>
                    <XCircle size={14} />
                    <span>Confirmar Cancelación de Pedido</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Despachar Pedido */}
      {modalEnvio && (
        <Modal isOpen={true} onClose={() => setModalEnvio(null)} title={`Despachar Pedido: ${modalEnvio.codigo}`}>
          <form onSubmit={handleEnviarPedido} className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Destino de Entrega (Cartagena):</span>
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                {modalEnvio.direccion?.nombreCompleto || modalEnvio.comprador?.nombre} — Tel: {modalEnvio.direccion?.telefono || 'N/A'}
              </p>
              <p className="text-slate-500">
                {modalEnvio.direccion?.direccion}{modalEnvio.direccion?.barrio ? `, Barrio ${modalEnvio.direccion.barrio}` : ''}, Cartagena de Indias
              </p>
              {modalEnvio.direccion?.notasEntrega && (
                <p className="text-amber-600 dark:text-amber-400 italic text-[11px] pt-1">
                  Nota del cliente: "{modalEnvio.direccion.notasEntrega}"
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Empresa Transportadora / Repartidor
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                {['Servientrega', 'Coordinadora', 'Interrapidísimo', 'Mensajería Propia'].map((trans) => (
                  <button
                    key={trans}
                    type="button"
                    onClick={() => setEmpresa(trans)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                      empresa === trans
                        ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {trans}
                  </button>
                ))}
              </div>
              <Input
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="O escribe otra transportadora..."
                required
              />
            </div>

            <Input
              label="Número de Guía o Tracking de Envío"
              value={guia}
              onChange={(e) => setGuia(e.target.value)}
              placeholder="Ej: 1092837465 o GUIA-LOCAL-01"
              required
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModalEnvio(null)}>Cancelar</Button>
              <Button type="submit" variant="primary" loading={loading}>
                <Truck size={14} className="mr-1.5" />
                <span>Confirmar y Notificar Despacho</span>
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default OrdersTable
