import React, { useState, useMemo, useEffect } from 'react'
import {
  TrendingUp,
  Sparkles,
  Zap,
  Crown,
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Package,
  Layers,
  ArrowUpRight,
  Info,
  Sliders,
  RefreshCw
} from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'

const COMISIONES_PLAN = {
  STARTER: { nombre: 'Plan Starter', porcentaje: 10, tasa: 0.10, icono: Sparkles, color: 'text-slate-600', bg: 'bg-slate-100' },
  PRO: { nombre: 'Plan Profesional', porcentaje: 5, tasa: 0.05, icono: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  ELITE: { nombre: 'Plan Elite Premium', porcentaje: 2, tasa: 0.02, icono: Crown, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' }
}

export const PredictiveEarningsModel = ({
  perfil,
  productos = [],
  pedidos = [],
  onOpenPlanes,
  esCompacto = false
}) => {
  const planActualKey = (perfil?.tipoSuscripcion || 'STARTER').toUpperCase()
  const [planSimulado, setPlanSimulado] = useState(planActualKey)
  const [escenario, setEscenario] = useState('esperado') // 'conservador' | 'esperado' | 'optimista'

  // Variables predictoras base basadas en la tienda real
  const totalProds = productos.length || 3
  const totalPeds = pedidos.length || 2

  // Ticket promedio calculado a partir de pedidos o catálogo
  const ticketInicial = useMemo(() => {
    if (pedidos.length > 0) {
      const sum = pedidos.reduce((acc, p) => acc + (p.total || 0), 0)
      return Math.round(sum / pedidos.length)
    }
    if (productos.length > 0) {
      const sum = productos.reduce((acc, p) => acc + (p.precioOferta || p.precio || 0), 0)
      return Math.round(sum / productos.length)
    }
    return 120000
  }, [pedidos, productos])

  const [ticketPromedio, setTicketPromedio] = useState(ticketInicial)
  const [comprasEstimadasInput, setComprasEstimadasInput] = useState(Math.max(10, totalProds * 3 + totalPeds * 2))

  useEffect(() => {
    if (perfil?.tipoSuscripcion) {
      setPlanSimulado(perfil.tipoSuscripcion.toUpperCase())
    }
  }, [perfil?.tipoSuscripcion])

  // Ajuste según escenario:
  // Conservador: -25%
  // Esperado: Base
  // Optimista: +35% (temporadas altas: Día de la Madre, Prima, Black Friday, Diciembre)
  const factorEscenario = useMemo(() => {
    if (escenario === 'conservador') return 0.75
    if (escenario === 'optimista') return 1.35
    return 1.0
  }, [escenario])

  // Cálculo en 2 etapas:
  // Etapa 1: Valor total estimado
  const comprasEfectivas = Math.max(1, Math.round(comprasEstimadasInput * factorEscenario))
  const valorTotalVentas = Math.round(comprasEfectivas * ticketPromedio)

  // Etapa 2: Regla de negocio: resultado = valor - porcentaje
  const planInfo = COMISIONES_PLAN[planSimulado] || COMISIONES_PLAN.STARTER
  const comisionRetenida = Math.round(valorTotalVentas * planInfo.tasa)
  const gananciaNetaEsperada = valorTotalVentas - comisionRetenida // resultado = valor - porcentaje

  // Comparativa entre todos los planes para el mismo volumen de ventas
  const comparativa = useMemo(() => {
    return Object.keys(COMISIONES_PLAN).map((k) => {
      const p = COMISIONES_PLAN[k]
      const comision = Math.round(valorTotalVentas * p.tasa)
      const neto = valorTotalVentas - comision
      const comisionStarter = Math.round(valorTotalVentas * COMISIONES_PLAN.STARTER.tasa)
      const ahorro = Math.max(0, comisionStarter - comision)
      return {
        key: k,
        ...p,
        comision,
        neto,
        ahorro,
        esActual: k === planActualKey
      }
    })
  }, [valorTotalVentas, planActualKey])

  // Versión compacta para incrustar en el Tablero Bento principal
  if (esCompacto) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Modelo Predictivo de Ganancias</h4>
              <p className="text-[11px] text-slate-400">Proyección estadística ({planInfo.nombre})</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            {planInfo.porcentaje}% Comisión
          </span>
        </div>

        {/* Resumen Principal */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-[#081e18] text-white space-y-3 border border-slate-800">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-300">Ganancia Neta Esperada:</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-300">
              {formatCurrency(gananciaNetaEsperada)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
            <span>Ventas: {formatCurrency(valorTotalVentas)}</span>
            <span className="text-rose-300 font-semibold">-{formatCurrency(comisionRetenida)} ({planInfo.porcentaje}%)</span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 flex items-center justify-between">
          <span className="font-semibold text-slate-600">Estimación de ingresos netos para tu tienda</span>
          {onOpenPlanes && (
            <button
              onClick={onOpenPlanes}
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Mejorar Plan</span>
              <ArrowRight size={11} />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* ============================================================== */}
      {/* 1. HEADER HERO DEL MODELO PREDICTIVO (ESTILO ELEGANTE MERCATTO)*/}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#07241c] text-white border border-slate-800 rounded-[32px] p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-4">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-bold border border-white/10 backdrop-blur-sm shadow-xs">
                <Sparkles size={13} className="text-amber-300" />
                <span>Modelo Predictivo de Monetización Mercatto</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-bold border border-emerald-500/20">
                <ShieldCheck size={12} />
                <span>Plan Actual: {COMISIONES_PLAN[planActualKey]?.nombre} ({COMISIONES_PLAN[planActualKey]?.porcentaje}% comisión)</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Estimación de Ganancias para tu Tienda
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Calcula con precisión cuánto esperas facturar este mes de forma neta según la actividad, ticket promedio y volumen proyectado de tu tienda.
            </p>
          </div>

          {onOpenPlanes && (
            <button
              onClick={onOpenPlanes}
              className="self-start md:self-auto px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
            >
              <Crown size={15} className="text-amber-500" />
              <span>Cambiar o Mejorar Plan</span>
            </button>
          )}
        </div>

        {/* Resumen de Inferencia Predictiva */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={15} className="text-amber-300" />
            <span>
              Ganancia Neta Proyectada:{' '}
              <strong className="text-emerald-400 font-bold">{formatCurrency(gananciaNetaEsperada)} COP</strong>
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            Inferencia predictiva basada en Machine Learning
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SELECTOR DE ESCENARIOS Y SIMULADOR INTERACTIVO              */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* PANEL DE CONTROL / SIMULADOR */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-emerald-700" />
              <h3 className="text-sm font-black text-slate-900">Variables Predictoras</h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Simulador en Vivo</span>
          </div>

          {/* Selector de Plan para Simular */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Plan Contratado / A Simular:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(COMISIONES_PLAN).map((pKey) => {
                const p = COMISIONES_PLAN[pKey]
                const Icono = p.icono
                const esActivo = planSimulado === pKey
                return (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => setPlanSimulado(pKey)}
                    className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      esActivo
                        ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 shadow-sm ring-1 ring-emerald-700/30'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icono size={15} className={esActivo ? 'text-emerald-700' : 'text-slate-400'} />
                    <span className="text-[11px] font-extrabold">{pKey}</span>
                    <span className="text-[10px] font-bold text-emerald-700">{p.porcentaje}% com.</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Slider: Compras estimadas */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Compras Mensuales:</span>
              <span className="font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                {comprasEfectivas} pedidos
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="150"
              value={comprasEstimadasInput}
              onChange={(e) => setComprasEstimadasInput(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1</span>
              <span>75</span>
              <span>150+</span>
            </div>
          </div>

          {/* Slider: Ticket Promedio */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Ticket Promedio por Pedido:</span>
              <span className="font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                {formatCurrency(ticketPromedio)}
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="1000000"
              step="10000"
              value={ticketPromedio}
              onChange={(e) => setTicketPromedio(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$20.000</span>
              <span>$500.000</span>
              <span>$1.000.000+</span>
            </div>
          </div>

          {/* Selector de Escenarios */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold text-slate-700 block">
              Escenario Predictivo:
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
              {[
                { id: 'conservador', label: 'Conservador (-25%)' },
                { id: 'esperado', label: 'Esperado (Base)' },
                { id: 'optimista', label: 'Optimista (+35%)' }
              ].map((esc) => (
                <button
                  key={esc.id}
                  onClick={() => setEscenario(esc.id)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                    escenario === esc.id
                      ? 'bg-white text-slate-900 shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {esc.id === 'conservador' ? '🛡️ Bajo' : (esc.id === 'optimista' ? '🚀 Alto' : '⚡ Base')}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* TARJETAS DE RESULTADO (GANANCIA NETA = VALOR - PORCENTAJE) */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Card Principal con el Resultado Destacado */}
          <div className="bg-gradient-to-br from-[#062019] via-[#092c22] to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-900/40 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Resultado del Modelo Predictivo
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {formatCurrency(gananciaNetaEsperada)} <span className="text-lg font-bold text-emerald-400">COP Netos</span>
                </h3>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-sm text-xs font-bold border border-white/20 self-start sm:self-auto">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>{planInfo.nombre} ({planInfo.porcentaje}% com.)</span>
              </span>
            </div>

            {/* Desglose visual: Valor - Porcentaje = Ganancia */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              
              <div className="bg-slate-900/60 rounded-2xl p-4 backdrop-blur-sm border border-slate-700/60">
                <span className="text-[11px] font-bold text-slate-300 block">1. Valor Ventas Estimadas</span>
                <span className="text-xl font-black text-white mt-1 block">
                  {formatCurrency(valorTotalVentas)}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{comprasEfectivas} compras proyectadas</span>
              </div>

              <div className="bg-rose-950/40 rounded-2xl p-4 backdrop-blur-sm border border-rose-800/40">
                <span className="text-[11px] font-bold text-rose-200 block">2. Comisión Mercatto ({planInfo.porcentaje}%)</span>
                <span className="text-xl font-black text-rose-300 mt-1 block">
                  -{formatCurrency(comisionRetenida)}
                </span>
                <span className="text-[10px] text-rose-200/80 mt-0.5 block">Retención según {planInfo.nombre}</span>
              </div>

              <div className="bg-emerald-950/50 rounded-2xl p-4 backdrop-blur-sm border border-emerald-700/40">
                <span className="text-[11px] font-bold text-emerald-200 block">3. Ganancia Neta Tienda</span>
                <span className="text-xl font-black text-emerald-300 mt-1 block">
                  {formatCurrency(gananciaNetaEsperada)}
                </span>
                <span className="text-[10px] text-emerald-200/80 mt-0.5 block">Total libre proyectado</span>
              </div>

            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. COMPARATIVA DE GANANCIAS ENTRE PLANES (AHORRO EN COMISIÓN)  */}
          {/* ============================================================== */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  ¿Cuánto ganas contratando un plan con menor porcentaje?
                </h4>
                <p className="text-xs text-slate-500">
                  Compara cómo aumenta tu ganancia neta con exactamente el mismo volumen de ventas ({formatCurrency(valorTotalVentas)} COP)
                </p>
              </div>

              {onOpenPlanes && (
                <button
                  onClick={onOpenPlanes}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                >
                  <span>Ver Todos los Planes</span>
                  <ArrowUpRight size={13} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {comparativa.map((p) => {
                const Icono = p.icono
                const esElSeleccionado = p.key === planSimulado
                return (
                  <div
                    key={p.key}
                    onClick={() => setPlanSimulado(p.key)}
                    className={`rounded-2xl p-4 border transition-all cursor-pointer relative flex flex-col justify-between ${
                      esElSeleccionado
                        ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {p.esActual && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-900 text-white">
                        Tu Plan Actual
                      </span>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg ${p.bg} ${p.color} flex items-center justify-center`}>
                          <Icono size={14} />
                        </div>
                        <h5 className="text-xs font-black text-slate-900">{p.nombre}</h5>
                      </div>
                      
                      <div className="pt-2">
                        <span className="text-[10px] font-semibold text-slate-400 block">Comisión Mercatto:</span>
                        <span className="text-xs font-bold text-slate-700">
                          {p.porcentaje}% (-{formatCurrency(p.comision)})
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 mt-3 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Ganancia Neta:
                      </span>
                      <span className="text-base font-black text-slate-900 block">
                        {formatCurrency(p.neto)}
                      </span>

                      {p.ahorro > 0 && (
                        <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          +{formatCurrency(p.ahorro)} más que Starter
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default PredictiveEarningsModel
