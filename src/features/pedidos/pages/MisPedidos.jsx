import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { pedidoService } from '@/features/pedidos'
import { formatCurrency } from '@/utils/formatCurrency'
import { ESTADOS_PEDIDO } from '@/utils/constants'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { useLanguage } from '@/hooks/useLanguage'
import { useToast } from '@/hooks/useToast'
import { Package, Truck, Calendar, XCircle, CreditCard } from 'lucide-react'
import WompiPaymentModal from '../components/WompiPaymentModal'

export const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelandoId, setCancelandoId] = useState(null)
  const [pedidoParaPagar, setPedidoParaPagar] = useState(null)
  const { t, idioma } = useLanguage()
  const { success, error } = useToast()

  const cargarPedidos = () => {
    pedidoService
      .misPedidos()
      .then((data) => setPedidos(data.content || []))
      .catch(() => setPedidos([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    cargarPedidos()
  }, [])

  const handleCancelar = async (pedido) => {
    if (!window.confirm(`¿Estás seguro de que deseas cancelar el pedido ${pedido.codigo}? Se devolverá el stock y se cancelará el cargo.`)) {
      return
    }
    setCancelandoId(pedido.id)
    try {
      await pedidoService.cancelarPedido(pedido.id)
      success(`Pedido ${pedido.codigo} cancelado correctamente.`)
      cargarPedidos()
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al cancelar el pedido')
    } finally {
      setCancelandoId(null)
    }
  }

  if (loading) {
    return <Spinner size="lg" className="py-24" />
  }

  if (pedidos.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title={idioma === 'EN' ? 'No orders registered yet' : 'Aún no tienes pedidos registrados'}
        description={idioma === 'EN' ? 'Explore our catalog and place your first order with secure payment.' : 'Explora nuestro catálogo y haz tu primer pedido con pago seguro.'}
        actionLabel={t('ver_todo_catalogo')}
        onAction={() => window.location.href = '/catalogo'}
      />
    )
  }

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto font-sans">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t('mis_pedidos')}</h1>
        <p className="text-xs text-slate-500 mt-1">{idioma === 'EN' ? 'Purchase history and delivery tracking' : 'Historial de compras y estado de envíos'}</p>
      </div>

      <div className="space-y-4">
        {pedidos.map((p) => {
          const infoEstado = ESTADOS_PEDIDO[p.estado] || { label: p.estado, color: 'gray' }

          return (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{idioma === 'EN' ? 'Order Code' : 'Código de Orden'}</span>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">{p.codigo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar size={13} />
                    {p.fechaCreacion ? new Date(p.fechaCreacion).toLocaleDateString(idioma === 'EN' ? 'en-US' : 'es-CO') : '-'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                    {infoEstado.label}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {p.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imagenUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                        alt={item.nombreProducto}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800"
                      />
                      <div>
                        <Link to={`/producto/${item.productoId}`} className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600">
                          {item.nombreProducto}
                        </Link>
                        {item.nombreVariante && (
                          <p className="text-[11px] text-slate-400">{item.nombreVariante}</p>
                        )}
                        <p className="text-[11px] text-slate-500">
                          {t('vendido_por')}: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.nombreTienda}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs space-y-1">
                      <p className="font-medium text-slate-500">{item.cantidad} x {formatCurrency(item.precioUnitario)}</p>
                      <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(item.subtotal)}</p>
                      <Link
                        to={`/producto/${item.productoId}#reviews`}
                        className="inline-block text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline pt-1"
                      >
                        ⭐ {idioma === 'EN' ? 'Rate Product' : 'Calificar Producto'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tracking if available */}
              {p.guiaSeguimiento && (
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 flex items-center gap-2 text-xs text-purple-900 dark:text-purple-300">
                  <Truck size={16} />
                  <span>
                    {idioma === 'EN' ? 'Dispatched via' : 'Despachado por'} <strong>{p.empresaEnvio || 'Transportadora'}</strong> — {idioma === 'EN' ? 'Tracking Number' : 'Número de Guía'}: <strong>{p.guiaSeguimiento}</strong>
                  </span>
                </div>
              )}

              {/* Footer Total & Acciones */}
              <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-slate-500">{t('metodo_pago')}: <strong className="text-slate-700 dark:text-slate-300">{p.metodoPago || 'WOMPI'}</strong></span>
                  
                  {p.estado === 'PENDIENTE' && (
                    <button
                      onClick={() => setPedidoParaPagar(p)}
                      className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-[11px] inline-flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <CreditCard size={13} />
                      <span>{idioma === 'EN' ? 'Pay Now with Card / Wompi' : 'Pagar Ahora (Tarjeta / Wompi)'}</span>
                    </button>
                  )}

                  {(p.estado === 'PENDIENTE' || p.estado === 'PAGADO') && (
                    <button
                      onClick={() => handleCancelar(p)}
                      disabled={cancelandoId === p.id}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-bold text-[11px] inline-flex items-center gap-1 transition cursor-pointer"
                    >
                      <XCircle size={12} />
                      <span>{cancelandoId === p.id ? 'Cancelando...' : (idioma === 'EN' ? 'Cancel Order' : 'Cancelar Pedido')}</span>
                    </button>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-500">
                    {p.estado === 'PENDIENTE'
                      ? (idioma === 'EN' ? 'Total to pay:' : 'Total a pagar:')
                      : (idioma === 'EN' ? 'Total paid:' : 'Total pagado:')}
                  </span>
                  <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(p.total)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de Pago Wompi para Pedidos Pendientes */}
      <WompiPaymentModal
        isOpen={!!pedidoParaPagar}
        onClose={() => setPedidoParaPagar(null)}
        pedido={pedidoParaPagar}
        metodoInicial={pedidoParaPagar?.metodoPago || 'WOMPI'}
        onPagoCompletado={() => {
          setPedidoParaPagar(null)
          cargarPedidos()
        }}
        onCancelarPedido={() => {
          setPedidoParaPagar(null)
          cargarPedidos()
        }}
      />
    </div>
  )
}

export default MisPedidos
