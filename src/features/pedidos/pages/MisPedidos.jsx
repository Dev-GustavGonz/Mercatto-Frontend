import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { pedidoService } from '@/features/pedidos'
import { formatCurrency } from '@/utils/formatCurrency'
import { ESTADOS_PEDIDO } from '@/utils/constants'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { useLanguage } from '@/hooks/useLanguage'
import { useToast } from '@/hooks/useToast'
import {
  Package,
  Truck,
  Calendar,
  XCircle,
  CreditCard,
  Search,
  X,
  Trash2,
  RotateCcw,
  Clock,
  CheckCircle2,
  Box,
  AlertTriangle
} from 'lucide-react'
import WompiPaymentModal from '../components/WompiPaymentModal'

const STORAGE_OCULTOS_KEY = 'mercatto_pedidos_cancelados_ocultos'

export const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelandoId, setCancelandoId] = useState(null)
  const [pedidoParaPagar, setPedidoParaPagar] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [tabEstado, setTabEstado] = useState('TODOS')

  // Cargar pedidos cancelados que el usuario decidió borrar / ocultar de su vista
  const [pedidosOcultos, setPedidosOcultos] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_OCULTOS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

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
    if (
      !window.confirm(
        `¿Estás seguro de que deseas cancelar el pedido ${pedido.codigo}? Se devolverá el stock y se cancelará el cargo.`
      )
    ) {
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

  // Ocultar / Borrar un pedido cancelado específico del historial visual
  const handleOcultarPedido = (pedidoId, codigo) => {
    const nuevos = Array.from(new Set([...pedidosOcultos, pedidoId]))
    setPedidosOcultos(nuevos)
    try {
      localStorage.setItem(STORAGE_OCULTOS_KEY, JSON.stringify(nuevos))
    } catch (e) {
      console.warn('Error guardando pedidos ocultos:', e)
    }
    success(
      idioma === 'EN'
        ? `Order ${codigo} removed from your history.`
        : `Pedido ${codigo} eliminado de tu lista de pedidos.`
    )
  }

  // Ocultar / Borrar todos los pedidos cancelados visibles
  const handleLimpiarTodosCancelados = () => {
    const idsCancelados = pedidos
      .filter((p) => p.estado === 'CANCELADO' || p.estado === 'REEMBOLSADO')
      .map((p) => p.id)

    if (idsCancelados.length === 0) return

    const confirmMsg =
      idioma === 'EN'
        ? 'Do you want to clear all cancelled orders from this list?'
        : '¿Deseas borrar del listado todos los pedidos cancelados?'

    if (!window.confirm(confirmMsg)) return

    const nuevos = Array.from(new Set([...pedidosOcultos, ...idsCancelados]))
    setPedidosOcultos(nuevos)
    try {
      localStorage.setItem(STORAGE_OCULTOS_KEY, JSON.stringify(nuevos))
    } catch (e) {
      console.warn('Error guardando pedidos ocultos:', e)
    }
    success(
      idioma === 'EN'
        ? 'All cancelled orders removed from your view.'
        : 'Todos los pedidos cancelados fueron retirados de tu lista.'
    )
  }

  // Restaurar pedidos cancelados ocultados
  const handleRestaurarOcultos = () => {
    setPedidosOcultos([])
    try {
      localStorage.removeItem(STORAGE_OCULTOS_KEY)
    } catch (e) {
      console.warn('Error limpiando pedidos ocultos:', e)
    }
    success(
      idioma === 'EN'
        ? 'Hidden orders restored to history.'
        : 'Pedidos cancelados restaurados en la lista.'
    )
  }

  // 1. Filtrar los que no estén en la lista de ocultos
  const pedidosVisibles = useMemo(() => {
    return pedidos.filter((p) => !pedidosOcultos.includes(p.id))
  }, [pedidos, pedidosOcultos])

  // 2. Contadores para las secciones / tabs
  const conteos = useMemo(() => {
    return {
      TODOS: pedidosVisibles.length,
      PENDIENTE: pedidosVisibles.filter((p) => p.estado === 'PENDIENTE').length,
      EN_PROCESO: pedidosVisibles.filter(
        (p) => p.estado === 'PAGADO' || p.estado === 'EN_PREPARACION'
      ).length,
      ENVIADO: pedidosVisibles.filter((p) => p.estado === 'ENVIADO').length,
      ENTREGADO: pedidosVisibles.filter((p) => p.estado === 'ENTREGADO').length,
      CANCELADO: pedidosVisibles.filter(
        (p) => p.estado === 'CANCELADO' || p.estado === 'REEMBOLSADO'
      ).length,
    }
  }, [pedidosVisibles])

  // 3. Filtrar según tab y buscador por referencia / código
  const pedidosFiltrados = useMemo(() => {
    let res = pedidosVisibles.filter((p) => {
      if (tabEstado === 'TODOS') return true
      if (tabEstado === 'PENDIENTE') return p.estado === 'PENDIENTE'
      if (tabEstado === 'EN_PROCESO') {
        return p.estado === 'PAGADO' || p.estado === 'EN_PREPARACION'
      }
      if (tabEstado === 'ENVIADO') return p.estado === 'ENVIADO'
      if (tabEstado === 'ENTREGADO') return p.estado === 'ENTREGADO'
      if (tabEstado === 'CANCELADO') {
        return p.estado === 'CANCELADO' || p.estado === 'REEMBOLSADO'
      }
      return true
    })

    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase()
      res = res.filter((p) => {
        const matchCodigo = p.codigo?.toLowerCase().includes(q)
        const matchId = String(p.id).includes(q)
        const matchGuia = p.guiaSeguimiento?.toLowerCase().includes(q)
        const matchEmpresa = p.empresaEnvio?.toLowerCase().includes(q)
        const matchItems = p.items?.some(
          (it) =>
            it.nombreProducto?.toLowerCase().includes(q) ||
            it.nombreTienda?.toLowerCase().includes(q)
        )
        return matchCodigo || matchId || matchGuia || matchEmpresa || matchItems
      })
    }

    return res
  }, [pedidosVisibles, tabEstado, busqueda])

  const obtenerColorBadge = (color) => {
    switch (color) {
      case 'yellow':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50'
      case 'blue':
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/50'
      case 'indigo':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50'
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50'
      case 'green':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50'
      case 'red':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
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
        description={
          idioma === 'EN'
            ? 'Explore our catalog and place your first order with secure payment.'
            : 'Explora nuestro catálogo y haz tu primer pedido con pago seguro.'
        }
        actionLabel={t('ver_todo_catalogo')}
        onAction={() => (window.location.href = '/catalogo')}
      />
    )
  }

  const hayCanceladosVisibles = conteos.CANCELADO > 0
  const hayOcultos = pedidosOcultos.length > 0

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t('mis_pedidos')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {idioma === 'EN'
              ? 'Purchase history, shipment tracking and order status'
              : 'Historial de compras, estados de envío y referencias de pago'}
          </p>
        </div>

        {/* Acciones de limpieza o restauración de cancelados */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {hayCanceladosVisibles && (
            <button
              type="button"
              onClick={handleLimpiarTodosCancelados}
              className="text-[11px] font-bold text-slate-500 hover:text-rose-600 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Borrar todos los pedidos cancelados de esta lista"
            >
              <Trash2 size={13} className="text-rose-500" />
              <span>{idioma === 'EN' ? 'Clear Cancelled' : 'Borrar cancelados'}</span>
            </button>
          )}

          {hayOcultos && (
            <button
              type="button"
              onClick={handleRestaurarOcultos}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Volver a mostrar los pedidos cancelados que habías borrado"
            >
              <RotateCcw size={13} />
              <span>
                {idioma === 'EN'
                  ? `Restore hidden (${pedidosOcultos.length})`
                  : `Restaurar ocultos (${pedidosOcultos.length})`}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtros: Buscador por referencia + Secciones de estado */}
      <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Buscador de Pedido por Referencia o Producto */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder={
              idioma === 'EN'
                ? 'Search by order reference (e.g. PED-2026...), tracking number or product...'
                : 'Buscar por referencia de pedido (ej. PED-2026...), guía de envío o producto...'
            }
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
              title="Borrar búsqueda"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Secciones / Tabs por Estado */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          {/* Tab: Todos */}
          <button
            type="button"
            onClick={() => setTabEstado('TODOS')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 text-xs ${
              tabEstado === 'TODOS'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            <span>{idioma === 'EN' ? 'All' : 'Todos'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                tabEstado === 'TODOS'
                  ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                  : 'bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {conteos.TODOS}
            </span>
          </button>

          {/* Tab: Pendientes */}
          <button
            type="button"
            onClick={() => setTabEstado('PENDIENTE')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 text-xs ${
              tabEstado === 'PENDIENTE'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            <Clock size={13} />
            <span>{idioma === 'EN' ? 'Pending' : 'Pendientes'}</span>
            {conteos.PENDIENTE > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  tabEstado === 'PENDIENTE'
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {conteos.PENDIENTE}
              </span>
            )}
          </button>

          {/* Tab: En Proceso */}
          <button
            type="button"
            onClick={() => setTabEstado('EN_PROCESO')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 text-xs ${
              tabEstado === 'EN_PROCESO'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            <Box size={13} />
            <span>{idioma === 'EN' ? 'In Progress' : 'En Preparación'}</span>
            {conteos.EN_PROCESO > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  tabEstado === 'EN_PROCESO'
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                }`}
              >
                {conteos.EN_PROCESO}
              </span>
            )}
          </button>

          {/* Tab: En Camino */}
          <button
            type="button"
            onClick={() => setTabEstado('ENVIADO')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 text-xs ${
              tabEstado === 'ENVIADO'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            <Truck size={13} />
            <span>{idioma === 'EN' ? 'Shipped' : 'En Camino'}</span>
            {conteos.ENVIADO > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  tabEstado === 'ENVIADO'
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                }`}
              >
                {conteos.ENVIADO}
              </span>
            )}
          </button>

          {/* Tab: Entregados */}
          <button
            type="button"
            onClick={() => setTabEstado('ENTREGADO')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 text-xs ${
              tabEstado === 'ENTREGADO'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 size={13} />
            <span>{idioma === 'EN' ? 'Delivered' : 'Entregados'}</span>
            {conteos.ENTREGADO > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  tabEstado === 'ENTREGADO'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {conteos.ENTREGADO}
              </span>
            )}
          </button>

          {/* Tab: Cancelados */}
          <button
            type="button"
            onClick={() => setTabEstado('CANCELADO')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 text-xs ${
              tabEstado === 'CANCELADO'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            <XCircle size={13} />
            <span>{idioma === 'EN' ? 'Cancelled' : 'Cancelados'}</span>
            {conteos.CANCELADO > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  tabEstado === 'CANCELADO'
                    ? 'bg-white/20 text-white'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {conteos.CANCELADO}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search size={22} />
          </div>
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
            {idioma === 'EN'
              ? 'No orders found matching this filter'
              : 'No se encontraron pedidos con este filtro o referencia'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {busqueda
              ? (idioma === 'EN'
                  ? `No results for "${busqueda}". Check the reference or clear your search.`
                  : `No hay coincidencias para "${busqueda}". Verifica el código o limpia la búsqueda.`)
              : (idioma === 'EN'
                  ? 'There are no orders registered in this status section.'
                  : 'No tienes pedidos registrados en esta sección de estado.')}
          </p>
          <button
            type="button"
            onClick={() => {
              setBusqueda('')
              setTabEstado('TODOS')
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-bold transition cursor-pointer shadow-xs"
          >
            {idioma === 'EN' ? 'Show All Orders' : 'Ver todos los pedidos'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidosFiltrados.map((p) => {
            const infoEstado = ESTADOS_PEDIDO[p.estado] || { label: p.estado, color: 'gray' }
            const badgeClasses = obtenerColorBadge(infoEstado.color)
            const esCancelado = p.estado === 'CANCELADO' || p.estado === 'REEMBOLSADO'

            return (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4 transition hover:border-slate-300 dark:hover:border-slate-700"
              >
                {/* Header de la tarjeta */}
                <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        {idioma === 'EN' ? 'Order Reference' : 'Referencia de Pedido'}
                      </span>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                        {p.codigo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar size={13} />
                      {p.fechaCreacion
                        ? new Date(p.fechaCreacion).toLocaleDateString(
                            idioma === 'EN' ? 'en-US' : 'es-CO'
                          )
                        : '-'}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold border ${badgeClasses}`}
                    >
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
                          src={
                            item.imagenUrl ||
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'
                          }
                          alt={item.nombreProducto}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                        />
                        <div>
                          <Link
                            to={`/producto/${item.productoId}`}
                            className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition"
                          >
                            {item.nombreProducto}
                          </Link>
                          {item.nombreVariante && (
                            <p className="text-[11px] text-slate-400">{item.nombreVariante}</p>
                          )}
                          <p className="text-[11px] text-slate-500">
                            {t('vendido_por')}:{' '}
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {item.nombreTienda}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-xs space-y-0.5 shrink-0">
                        <p className="font-medium text-slate-500">
                          {item.cantidad} x {formatCurrency(item.precioUnitario)}
                        </p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(item.subtotal)}
                        </p>
                        <Link
                          to={`/producto/${item.productoId}#reviews`}
                          className="inline-block text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline pt-0.5"
                        >
                          ⭐ {idioma === 'EN' ? 'Rate Product' : 'Calificar'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking si fue despachado */}
                {p.guiaSeguimiento && (
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 flex items-center gap-2 text-xs text-purple-900 dark:text-purple-300">
                    <Truck size={16} className="shrink-0 text-purple-600 dark:text-purple-400" />
                    <span>
                      {idioma === 'EN' ? 'Dispatched via' : 'Despachado por'}{' '}
                      <strong>{p.empresaEnvio || 'Transportadora local'}</strong> —{' '}
                      {idioma === 'EN' ? 'Tracking Number' : 'Número de Guía'}:{' '}
                      <strong className="font-mono">{p.guiaSeguimiento}</strong>
                    </span>
                  </div>
                )}

                {/* Footer Total & Acciones */}
                <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-slate-500">
                      {t('metodo_pago')}:{' '}
                      <strong className="text-slate-700 dark:text-slate-300">
                        {p.metodoPago === 'CONTRA_ENTREGA'
                          ? 'Contra Entrega (Efectivo)'
                          : p.metodoPago || 'WOMPI'}
                      </strong>
                    </span>

                    {/* Botón Pagar si está PENDIENTE */}
                    {p.estado === 'PENDIENTE' && (
                      <button
                        type="button"
                        onClick={() => setPedidoParaPagar(p)}
                        className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-[11px] inline-flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                      >
                        <CreditCard size={13} />
                        <span>
                          {idioma === 'EN' ? 'Pay with Wompi' : 'Pagar Ahora (Wompi)'}
                        </span>
                      </button>
                    )}

                    {/* Botón Cancelar si está PENDIENTE o PAGADO */}
                    {(p.estado === 'PENDIENTE' || p.estado === 'PAGADO') && (
                      <button
                        type="button"
                        onClick={() => handleCancelar(p)}
                        disabled={cancelandoId === p.id}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-bold text-[11px] inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <XCircle size={12} />
                        <span>
                          {cancelandoId === p.id
                            ? 'Cancelando...'
                            : idioma === 'EN'
                            ? 'Cancel Order'
                            : 'Cancelar Pedido'}
                        </span>
                      </button>
                    )}

                    {/* Botón para Borrar / Descartar del listado si ya está CANCELADO */}
                    {esCancelado && (
                      <button
                        type="button"
                        onClick={() => handleOcultarPedido(p.id, p.codigo)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:text-slate-300 dark:hover:text-rose-300 font-bold text-[11px] inline-flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                        title={
                          idioma === 'EN'
                            ? 'Remove this cancelled order from list'
                            : 'Borrar este pedido cancelado de tu lista'
                        }
                      >
                        <Trash2 size={12} className="text-slate-400 hover:text-rose-600" />
                        <span>{idioma === 'EN' ? 'Remove from list' : 'Borrar de la lista'}</span>
                      </button>
                    )}
                  </div>

                  {/* Total del Pedido */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-500">
                      {p.estado === 'PENDIENTE'
                        ? idioma === 'EN'
                          ? 'Total to pay:'
                          : 'Total a pagar:'
                        : idioma === 'EN'
                        ? 'Total:'
                        : 'Total:'}
                    </span>
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(p.total)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

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
        onDejarPendiente={() => {
          setPedidoParaPagar(null)
        }}
      />
    </div>
  )
}

export default MisPedidos
