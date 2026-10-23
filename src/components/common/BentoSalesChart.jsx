import React, { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils/formatCurrency'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export const BentoSalesChart = ({
  titulo = 'Rendimiento de Ventas',
  baseTotal = 48500000,
  pedidos = [],
  timeRange = '1M',
  onTimeRangeChange,
  gradientId = 'bentoSalesChartGrad'
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null)

  const chartData = useMemo(() => {
    const ahora = new Date()
    const mesActual = MESES[ahora.getMonth()]
    let etiquetas = []
    let factorEscala = 1.0
    let cambioPeriodo = '+16.8% este mes'
    let pesos = []

    switch (timeRange) {
      case '1D': {
        etiquetas = ['04:00', '08:00', '12:00', '16:00', '20:00', 'Ahora']
        factorEscala = 0.045
        cambioPeriodo = '+8.4% vs ayer'
        pesos = [0.08, 0.15, 0.24, 0.27, 0.18, 0.08]
        break
      }
      case '1S': {
        etiquetas = Array.from({ length: 7 }, (_, i) => {
          const d = new Date()
          d.setDate(ahora.getDate() - (6 - i))
          return i === 6 ? 'Hoy' : `${DIAS_SEMANA[d.getDay()]} ${d.getDate()}`
        })
        factorEscala = 0.28
        cambioPeriodo = '+14.2% esta semana'
        pesos = [0.11, 0.13, 0.12, 0.16, 0.18, 0.17, 0.13]
        break
      }
      case '1M': {
        etiquetas = [`1 ${mesActual}`, `7 ${mesActual}`, `14 ${mesActual}`, `21 ${mesActual}`, `28 ${mesActual}`, 'Hoy']
        factorEscala = 1.0
        cambioPeriodo = '+16.8% este mes'
        pesos = [0.12, 0.15, 0.18, 0.17, 0.21, 0.17]
        break
      }
      case '3M': {
        const m1 = MESES[(ahora.getMonth() + 10) % 12]
        const m2 = MESES[(ahora.getMonth() + 11) % 12]
        etiquetas = [`1 ${m1}`, `15 ${m1}`, `1 ${m2}`, `15 ${m2}`, `1 ${mesActual}`, 'Hoy']
        factorEscala = 2.85
        cambioPeriodo = '+22.5% este trimestre'
        pesos = [0.13, 0.14, 0.16, 0.17, 0.19, 0.21]
        break
      }
      case '6M': {
        etiquetas = Array.from({ length: 6 }, (_, i) => {
          const d = new Date()
          d.setMonth(ahora.getMonth() - (5 - i))
          return MESES[d.getMonth()]
        })
        factorEscala = 5.6
        cambioPeriodo = '+28.4% semestral'
        pesos = [0.12, 0.14, 0.15, 0.18, 0.20, 0.21]
        break
      }
      case '1A': {
        etiquetas = Array.from({ length: 6 }, (_, i) => {
          const d = new Date()
          d.setMonth(ahora.getMonth() - (5 - i) * 2)
          return `${MESES[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`
        })
        factorEscala = 11.4
        cambioPeriodo = '+34.5% interanual'
        pesos = [0.11, 0.13, 0.15, 0.18, 0.20, 0.23]
        break
      }
      default: {
        etiquetas = [`1 ${mesActual}`, `7 ${mesActual}`, `14 ${mesActual}`, `21 ${mesActual}`, `28 ${mesActual}`, 'Hoy']
        factorEscala = 1.0
        cambioPeriodo = '+16.8% este mes'
        pesos = [0.12, 0.15, 0.18, 0.17, 0.21, 0.17]
      }
    }

    // Volumen monetario del período seleccionado
    const totalPeriodo = Math.max(100000, Math.round(baseTotal * factorEscala))

    // Asignación de valores proporcionales a cada hito temporal
    const numPuntos = etiquetas.length
    const valores = pesos.map((w) => Math.round(totalPeriodo * w))

    const maxValor = Math.max(...valores, 1) * 1.15
    const width = 600
    const baseY = 135
    const alturaGrafica = 95
    const xInicio = 35
    const xFin = 565
    const stepX = (xFin - xInicio) / (numPuntos - 1)

    const puntos = valores.map((val, i) => {
      const x = Math.round(xInicio + i * stepX)
      const ratio = Math.min(1, Math.max(0.1, val / maxValor))
      const y = Math.round(baseY - ratio * alturaGrafica)
      return {
        x,
        y,
        valor: val,
        etiqueta: etiquetas[i]
      }
    })

    // Construcción de la curva cúbica Bézier continua
    let pathLinea = `M ${puntos[0].x} ${puntos[0].y}`
    for (let i = 0; i < puntos.length - 1; i++) {
      const p0 = puntos[i]
      const p1 = puntos[i + 1]
      const cpx1 = Math.round(p0.x + (p1.x - p0.x) / 2)
      const cpy1 = p0.y
      const cpx2 = Math.round(p0.x + (p1.x - p0.x) / 2)
      const cpy2 = p1.y
      pathLinea += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${p1.x} ${p1.y}`
    }

    const pathArea = `${pathLinea} L ${puntos[puntos.length - 1].x} 145 L ${puntos[0].x} 145 Z`

    // Generación de 24 barras de volumen base proporcionales
    const numBarras = 24
    const stepBarra = (xFin - xInicio) / (numBarras - 1)
    const barras = Array.from({ length: numBarras }, (_, idx) => {
      const bx = Math.round(xInicio + idx * stepBarra)
      // Interpolación aproximada de altura basada en los puntos
      const t = idx / (numBarras - 1)
      const indexPt = Math.min(numPuntos - 2, Math.floor(t * (numPuntos - 1)))
      const localT = (t * (numPuntos - 1)) - indexPt
      const v0 = valores[indexPt]
      const v1 = valores[indexPt + 1] || v0
      const interpolatedVal = v0 + (v1 - v0) * localT
      const ratio = interpolatedVal / maxValor
      // Altura entre 18 y 85 px
      const h = Math.round(18 + ratio * 60)
      const opacidad = +(0.25 + ratio * 0.45).toFixed(2)
      return { x: bx - 4, h, opacidad }
    })

    return {
      totalPeriodo,
      cambioPeriodo,
      etiquetas,
      puntos,
      pathLinea,
      pathArea,
      barras
    }
  }, [baseTotal, timeRange])

  return (
    <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white rounded-[32px] p-6 sm:p-8 shadow-xl shadow-violet-500/15 space-y-6 relative overflow-hidden">
      {/* Header de la tarjeta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-violet-100">{titulo}</h3>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {formatCurrency(chartData.totalPeriodo)}
            </span>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
              {chartData.cambioPeriodo}
            </span>
          </div>
        </div>

        {/* Selector de periodo temporal */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full self-start sm:self-auto border border-white/15 text-xs font-bold">
          {['1D', '1S', '1M', '3M', '6M', '1A'].map((filtro) => (
            <button
              key={filtro}
              onClick={() => onTimeRangeChange && onTimeRangeChange(filtro)}
              className={`px-3 py-1 rounded-full transition cursor-pointer ${
                timeRange === filtro
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-violet-200 hover:text-white'
              }`}
            >
              {filtro}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico Vectorial Spline & Barras */}
      <div className="h-52 w-full relative pt-4 select-none">
        {/* Tooltip flotante interactivo */}
        {hoveredPoint && (
          <div
            className="absolute top-0 transform -translate-x-1/2 bg-slate-950/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-white/20 pointer-events-none z-30 transition-all flex items-center gap-2"
            style={{ left: `${(hoveredPoint.x / 600) * 100}%` }}
          >
            <span className="text-violet-300 font-mono">{hoveredPoint.etiqueta}:</span>
            <span className="text-emerald-400 font-black">{formatCurrency(hoveredPoint.valor)}</span>
          </div>
        )}

        <svg className="w-full h-full overflow-visible" viewBox="0 0 600 170" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Barras de volumen dinámicas y proporcionadas */}
          {chartData.barras.map((bar, idx) => (
            <rect
              key={idx}
              x={bar.x}
              y={140 - bar.h}
              width="8"
              height={bar.h}
              rx="4"
              fill="#FFFFFF"
              opacity={bar.opacidad}
              className="transition-all duration-300"
            />
          ))}

          {/* Área sombreada con degradado bajo la curva */}
          <path
            d={chartData.pathArea}
            fill={`url(#${gradientId})`}
            className="transition-all duration-300"
          />

          {/* Línea continua Bézier suave */}
          <path
            d={chartData.pathLinea}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* Hitos interactivos en la curva */}
          {chartData.puntos.map((pt, idx) => (
            <g
              key={idx}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r="12"
                fill="transparent"
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#FFFFFF"
                className="transition-transform group-hover:scale-125"
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r="2"
                fill="#7C3AED"
              />
            </g>
          ))}
        </svg>

        {/* Etiquetas dinámicas de fechas en la base */}
        <div className="flex justify-between text-[11px] text-violet-200 font-mono pt-2">
          {chartData.etiquetas.map((etiq, idx) => (
            <span key={idx}>{etiq}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BentoSalesChart
