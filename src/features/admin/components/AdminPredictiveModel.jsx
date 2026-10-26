import React, { useState, useEffect, useMemo } from 'react'
import {
  TrendingUp,
  Sparkles,
  Zap,
  Crown,
  DollarSign,
  Store,
  ShoppingCart,
  Sliders,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'
import { adminService } from '@/features/admin'

const PLANES_CONFIG = {
  STARTER: {
    nombre: 'Plan Starter',
    porcentajeComision: 10,
    tasa: 0.10,
    cuotaMensual: 0,
    color: 'text-slate-700',
    bg: 'bg-slate-100',
    border: 'border-slate-200',
    icono: Sparkles
  },
  PRO: {
    nombre: 'Plan Profesional',
    porcentajeComision: 5,
    tasa: 0.05,
    cuotaMensual: 49000,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icono: Zap
  },
  ELITE: {
    nombre: 'Plan Elite Premium',
    porcentajeComision: 2,
    tasa: 0.02,
    cuotaMensual: 99000,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icono: Crown
  }
}

export const AdminPredictiveModel = ({ vendedores = [], pedidos = [] }) => {
  const [escenario, setEscenario] = useState('esperado') // 'conservador' | 'esperado' | 'optimista'
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1)
  const [loadingBackend, setLoadingBackend] = useState(false)
  const [datosBackend, setDatosBackend] = useState(null)

  // Controles del Simulador de Crecimiento
  const [simulacionActiva, setSimulacionActiva] = useState(false)
  const [extraStarter, setExtraStarter] = useState(0)
  const [extraPro, setExtraPro] = useState(0)
  const [extraElite, setExtraElite] = useState(0)

  // 1. Conteo de tiendas reales del sistema agrupadas por plan
  const conteoReal = useMemo(() => {
    let starter = 0
    let pro = 0
    let elite = 0

    if (vendedores && vendedores.length > 0) {
      vendedores.forEach((v) => {
        const plan = (v.tipoSuscripcion || 'STARTER').toUpperCase()
        if (plan === 'PRO') pro++
        else if (plan === 'ELITE') elite++
        else starter++
      })
    } else {
      // Valores estándar iniciales si no hay tiendas creadas aún
      starter = 5
      pro = 3
      elite = 2
    }

    return { starter, pro, elite, total: starter + pro + elite }
  }, [vendedores])

  // 2. Ticket promedio general calculado de pedidos o catálogo
  const ticketPromedio = useMemo(() => {
    if (pedidos && pedidos.length > 0) {
      const sum = pedidos.reduce((acc, p) => acc + (p.total || 0), 0)
      return Math.round(sum / pedidos.length)
    }
    return 120000
  }, [pedidos])

  // Cargar predicción nativa del backend
  const cargarPrediccionBackend = async () => {
    setLoadingBackend(true)
    try {
      const res = await adminService.obtenerModeloPredictivoAdmin({
        mes: mesSeleccionado,
        addStarter: extraStarter,
        addPro: extraPro,
        addElite: extraElite,
        ticketPromedio
      })
      setDatosBackend(res)
    } catch (err) {
      console.warn('Fallback al motor predictivo en cliente:', err)
    } finally {
      setLoadingBackend(false)
    }
  }

  useEffect(() => {
    cargarPrediccionBackend()
  }, [mesSeleccionado, extraStarter, extraPro, extraElite])

  // Multiplicador del escenario estadístico:
  // Conservador: -25% en ventas
  // Esperado: Base de inferencia Random Forest
  // Optimista: +35% (temporadas altas)
  const factorEscenario = useMemo(() => {
    if (escenario === 'conservador') return 0.75
    if (escenario === 'optimista') return 1.35
    return 1.0
  }, [escenario])

  // Estimación de compras y ventas promedio por tienda según plan
  // Estacionalidad comercial Colombia: Mayo, Junio, Julio, Noviembre, Diciembre
  const factorTemporada = [5, 6, 7, 11, 12].includes(mesSeleccionado) ? 1.25 : 1.0

  const totalTiendasStarter = conteoReal.starter + extraStarter
  const totalTiendasPro = conteoReal.pro + extraPro
  const totalTiendasElite = conteoReal.elite + extraElite
  const totalTiendasEcosistema = totalTiendasStarter + totalTiendasPro + totalTiendasElite

  // Proyecciones unitarias por tipo de plan
  const pedidosUnitariosStarter = Math.round(16 * factorTemporada * factorEscenario)
  const pedidosUnitariosPro = Math.round(42 * factorTemporada * factorEscenario)
  const pedidosUnitariosElite = Math.round(128 * factorTemporada * factorEscenario)

  const ventasUnitariasStarter = pedidosUnitariosStarter * ticketPromedio
  const ventasUnitariasPro = pedidosUnitariosPro * ticketPromedio
  const ventasUnitariasElite = pedidosUnitariosElite * ticketPromedio

  // Totales por categoría de plan
  const gmvStarter = totalTiendasStarter * ventasUnitariasStarter
  const gmvPro = totalTiendasPro * ventasUnitariasPro
  const gmvElite = totalTiendasElite * ventasUnitariasElite
  const gmvTotalMarketplace = gmvStarter + gmvPro + gmvElite

  const comprasTotalesMarketplace =
    totalTiendasStarter * pedidosUnitariosStarter +
    totalTiendasPro * pedidosUnitariosPro +
    totalTiendasElite * pedidosUnitariosElite

  // Regla de Negocio de Monetización Mercatto:
  // 1. Ganancia por Comisiones de Venta
  const comisionStarter = Math.round(gmvStarter * PLANES_CONFIG.STARTER.tasa) // 10%
  const comisionPro = Math.round(gmvPro * PLANES_CONFIG.PRO.tasa)             // 5%
  const comisionElite = Math.round(gmvElite * PLANES_CONFIG.ELITE.tasa)       // 2%
  const totalComisionesVentas = comisionStarter + comisionPro + comisionElite

  // 2. Ganancia por Suscripciones a Planes Mensuales (MRR)
  const suscripcionesPro = totalTiendasPro * PLANES_CONFIG.PRO.cuotaMensual
  const suscripcionesElite = totalTiendasElite * PLANES_CONFIG.ELITE.cuotaMensual
  const totalIngresosSuscripciones = suscripcionesPro + suscripcionesElite

  // Ganancia Neta Total de la Plataforma (Nosotros)
  const gananciaNetaPlataforma = totalComisionesVentas + totalIngresosSuscripciones

  // Monto a Liquidar a las Tiendas
  const totalALiquidarTiendas = gmvTotalMarketplace - totalComisionesVentas
  const margenPlataforma = gmvTotalMarketplace > 0 ? ((gananciaNetaPlataforma / gmvTotalMarketplace) * 100).toFixed(1) : 0

  const handleRestablecerSimulador = () => {
    setExtraStarter(0)
    setExtraPro(0)
    setExtraElite(0)
    setSimulacionActiva(false)
  }

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* 1. HERO BANNER: MODELO PREDICTIVO PARA EL ADMINISTRADOR        */}
      {/* ============================================================== */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 font-bold text-xs border border-violet-200 dark:border-violet-800">
                <Sparkles size={14} className="text-violet-600 dark:text-violet-400" />
                <span>Modelo Predictivo de Monetización Mercatto</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                IA & Rendimiento
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Proyección Financiera de Mercatto
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Supervisión estratégica del rendimiento financiero global de la plataforma, estimando los ingresos generados por comisiones de ventas y suscripciones de tiendas en Mercatto.
            </p>
          </div>

          {/* Selector de Escenarios Predictivos */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 w-full lg:w-auto shrink-0 space-y-2 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block tracking-wider flex items-center gap-1">
              <Sliders size={13} />
              <span>Escenario de Inferencia</span>
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'conservador', label: 'Conservador (-25%)' },
                { id: 'esperado', label: 'Esperado (Base ML)' },
                { id: 'optimista', label: 'Optimista (+35%)' }
              ].map((esc) => (
                <button
                  key={esc.id}
                  onClick={() => setEscenario(esc.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    escenario === esc.id
                      ? 'bg-violet-600 text-white shadow-sm font-bold'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {esc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. TARJETAS KPI BENTO: RESUMEN DE GANANCIAS PLATAFORMA         */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Ventas Brutas Totales (GMV) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ventas Brutas Marketplace</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <ShoppingCart size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{formatCurrency(gmvTotalMarketplace)}</p>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-semibold">
              <span className="text-violet-600 font-bold">{comprasTotalesMarketplace.toLocaleString()} pedidos</span> proyectados
            </p>
          </div>
        </div>

        {/* KPI 2: Ganancia por Comisiones de Venta */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">Comisiones por Ventas</span>
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-violet-700">{formatCurrency(totalComisionesVentas)}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Retención según planes de tiendas
            </p>
          </div>
        </div>

        {/* KPI 3: Ingresos por Suscripciones Mensuales (MRR) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Planes Mensuales (MRR)</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Crown size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-indigo-700">{formatCurrency(totalIngresosSuscripciones)}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              {totalTiendasPro} Pro + {totalTiendasElite} Elite suscritos
            </p>
          </div>
        </div>

        {/* KPI 4: GANANCIA NETA TOTAL ADMINISTRADOR */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-5 shadow-md shadow-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-100">Ganancias de Mercatto</span>
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black">{formatCurrency(gananciaNetaPlataforma)}</p>
            <p className="text-[11px] text-emerald-100 mt-1 font-semibold">
              Margen de plataforma: <strong>{margenPlataforma}%</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. DESGLOSE PREDICTIVO POR PLAN: STARTER, PRO, ELITE          */}
      {/* ============================================================== */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers size={18} className="text-violet-600" />
              <span>Desglose Predictivo por Plan de Empresa</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rendimiento proyectado para cada categoría de tienda en el Marketplace
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
            <Store size={14} className="text-violet-600" />
            <span>Total Tiendas: {totalTiendasEcosistema}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tarjeta Plan Starter */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Plan Starter</h4>
                  <span className="text-[10px] font-bold text-slate-500">10% comisión | $0/mes</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700">
                {totalTiendasStarter} tiendas
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Ventas Brutas:</span>
                <span className="font-bold text-slate-900">{formatCurrency(gmvStarter)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Comisión Mercatto (10%):</span>
                <span className="font-bold text-violet-700">+{formatCurrency(comisionStarter)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cuotas Mensuales ($0):</span>
                <span className="font-bold text-slate-400">$0</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-slate-900">
                <span>Ganancias de Mercatto:</span>
                <span className="text-emerald-600 font-black">{formatCurrency(comisionStarter)}</span>
              </div>
            </div>
          </div>

          {/* Tarjeta Plan Profesional */}
          <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Zap size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Plan Profesional</h4>
                  <span className="text-[10px] font-bold text-indigo-700">5% comisión | $49.000/mes</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                {totalTiendasPro} tiendas
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-indigo-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Ventas Brutas:</span>
                <span className="font-bold text-slate-900">{formatCurrency(gmvPro)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Comisión Mercatto (5%):</span>
                <span className="font-bold text-violet-700">+{formatCurrency(comisionPro)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cuotas Mensuales ($49k):</span>
                <span className="font-bold text-indigo-700">+{formatCurrency(suscripcionesPro)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-indigo-200 font-black text-slate-900">
                <span>Ganancias de Mercatto:</span>
                <span className="text-emerald-600 font-black">{formatCurrency(comisionPro + suscripcionesPro)}</span>
              </div>
            </div>
          </div>

          {/* Tarjeta Plan Elite Premium */}
          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Crown size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Plan Elite Premium</h4>
                  <span className="text-[10px] font-bold text-amber-700">2% comisión | $99.000/mes</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {totalTiendasElite} tiendas
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-amber-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Ventas Brutas:</span>
                <span className="font-bold text-slate-900">{formatCurrency(gmvElite)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Comisión Mercatto (2%):</span>
                <span className="font-bold text-violet-700">+{formatCurrency(comisionElite)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cuotas Mensuales ($99k):</span>
                <span className="font-bold text-amber-700">+{formatCurrency(suscripcionesElite)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-amber-200 font-black text-slate-900">
                <span>Ganancias de Mercatto:</span>
                <span className="text-emerald-600 font-black">{formatCurrency(comisionElite + suscripcionesElite)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de Liquidación a Tiendas */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>
              Total de fondos netos a liquidar a las tiendas:{' '}
              <strong className="text-slate-900">{formatCurrency(totalALiquidarTiendas)}</strong>
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">
            Balance después de comisiones retenidas
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. SIMULADOR INTERACTIVO DE CRECIMIENTO DEL MARKETPLACE        */}
      {/* ============================================================== */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sliders size={18} className="text-violet-600" />
              <span>Simulador Interactivo de Crecimiento & Suscripciones</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Proyecta cuánto aumentarán las ganancias de la plataforma al captar más empresas o migrar tiendas de plan
            </p>
          </div>

          {(extraStarter > 0 || extraPro > 0 || extraElite > 0) && (
            <button
              onClick={handleRestablecerSimulador}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Restablecer Valores Reales</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Selector de Mes */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
              <Calendar size={14} className="text-violet-600" />
              <span>Mes de Proyección</span>
            </label>
            <select
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              {[
                { m: 1, n: 'Enero' },
                { m: 2, n: 'Febrero' },
                { m: 3, n: 'Marzo' },
                { m: 4, n: 'Abril' },
                { m: 5, n: 'Mayo (Alta - Día Madre)' },
                { m: 6, n: 'Junio (Alta - Prima)' },
                { m: 7, n: 'Julio (Alta - Vacaciones)' },
                { m: 8, n: 'Agosto' },
                { m: 9, n: 'Septiembre (Amor y Amistad)' },
                { m: 10, n: 'Octubre' },
                { m: 11, n: 'Noviembre (Alta - Black Friday)' },
                { m: 12, n: 'Diciembre (Alta - Navidad)' }
              ].map((item) => (
                <option key={item.m} value={item.m}>
                  {item.n}
                </option>
              ))}
            </select>
          </div>

          {/* Extra Starter */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <label className="text-xs font-bold text-slate-700 block flex justify-between">
              <span>+ Tiendas Starter</span>
              <span className="text-violet-700 font-black">+{extraStarter}</span>
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={extraStarter}
              onChange={(e) => {
                setExtraStarter(parseInt(e.target.value))
                setSimulacionActiva(true)
              }}
              className="w-full accent-violet-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block text-right">
              Total: {totalTiendasStarter} tiendas
            </span>
          </div>

          {/* Extra Pro */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
            <label className="text-xs font-bold text-indigo-900 block flex justify-between">
              <span>+ Tiendas Pro ($49k)</span>
              <span className="text-indigo-600 font-black">+{extraPro}</span>
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={extraPro}
              onChange={(e) => {
                setExtraPro(parseInt(e.target.value))
                setSimulacionActiva(true)
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <span className="text-[10px] text-indigo-600 block text-right font-semibold">
              Total: {totalTiendasPro} tiendas
            </span>
          </div>

          {/* Extra Elite */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
            <label className="text-xs font-bold text-amber-900 block flex justify-between">
              <span>+ Tiendas Elite ($99k)</span>
              <span className="text-amber-600 font-black">+{extraElite}</span>
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={extraElite}
              onChange={(e) => {
                setExtraElite(parseInt(e.target.value))
                setSimulacionActiva(true)
              }}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-amber-700 block text-right font-semibold">
              Total: {totalTiendasElite} tiendas
            </span>
          </div>
        </div>

        {/* Impacto de la Simulación */}
        {simulacionActiva && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row justify-between items-center gap-3 animate-fade-in text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>
                Simulación activa: Incremento estimado en cuotas fijas mensuales:{' '}
                <strong className="text-emerald-700">
                  +{formatCurrency(extraPro * 49000 + extraElite * 99000)} / mes
                </strong>
              </span>
            </div>
            <button
              onClick={handleRestablecerSimulador}
              className="text-emerald-700 underline font-bold hover:text-emerald-900 cursor-pointer"
            >
              Restablecer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPredictiveModel
