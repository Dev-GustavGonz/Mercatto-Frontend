import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/utils/formatCurrency'
import { ArrowRight, Clock, ShieldCheck, Sparkles, Flame, Zap } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { resolveProductImage } from '@/utils/productUtils'

export const PromotionalBento = ({ productos = [], onAddToCart }) => {
  const navigate = useNavigate()
  const { t, idioma } = useLanguage()
  const isEn = idioma === 'EN'

  // Cronómetro regresivo en tiempo real (Días, Horas, Minutos, Segundos)
  const [timeLeft, setTimeLeft] = useState({
    dias: '02',
    horas: '08',
    minutos: '32',
    segundos: '45'
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const ahora = new Date()
      const finDelDia = new Date()
      finDelDia.setHours(23, 59, 59, 999)
      const diff = Math.max(0, finDelDia - ahora)

      const horas = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0')
      const minutos = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0')
      const segundos = String(Math.floor((diff / 1000) % 60)).padStart(2, '0')

      setTimeLeft({ dias: '02', horas, minutos, segundos })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Productos dinámicos desde props exclusivamente de la base de datos
  const pOferta = productos[0]
  const pNovedad = productos[1]
  const pTemporada = productos[2]

  // Si no hay productos en la base de datos para esta sección, no mostrar elementos estáticos
  if (!pOferta && !pNovedad && !pTemporada) {
    return null
  }

  const imgOferta = pOferta ? resolveProductImage(pOferta) : null
  const imgNovedad = pNovedad ? resolveProductImage(pNovedad) : null
  const imgTemporada = pTemporada ? resolveProductImage(pTemporada) : null

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
      
      {/* ============================================================== */}
      {/* TARJETA 1: OFERTA DEL MES CON CRONÓMETRO REGRESIVO DE URGENCIA */}
      {/* ============================================================== */}
      {pOferta && (
        <div 
          onClick={() => navigate(`/producto/${pOferta.id}`)}
          className="group relative rounded-[30px] sm:rounded-[34px] p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[410px] cursor-pointer overflow-hidden"
        >
          {/* Glow sutil en verde esmeralda */}
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-120 transition-transform duration-500" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Encabezado con Timer de Urgencia */}
          <div className="relative z-10 space-y-3 text-center">
            
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-[11px] font-extrabold tracking-wider uppercase">
                <Flame size={13} className="text-emerald-600 fill-emerald-600" />
                <span>{t('oferta_del_mes')}</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
              {t('oferta_del_mes')} <span className="text-emerald-600 dark:text-emerald-400">Especial</span>
            </h3>

            {/* Reloj Digital Funcional (DD : HH : MM : SS) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs font-mono font-black shadow-xs">
              <Clock size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="flex items-center gap-1.5">
                <div>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{timeLeft.dias}</span>
                  <small className="text-[8px] font-sans font-bold text-slate-500 dark:text-slate-400 block tracking-wider uppercase">{t('dias')}</small>
                </div>
                <span className="text-emerald-600 font-bold">:</span>
                <div>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{timeLeft.horas}</span>
                  <small className="text-[8px] font-sans font-bold text-slate-500 dark:text-slate-400 block tracking-wider uppercase">{t('hrs')}</small>
                </div>
                <span className="text-emerald-600 font-bold">:</span>
                <div>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{timeLeft.minutos}</span>
                  <small className="text-[8px] font-sans font-bold text-slate-500 dark:text-slate-400 block tracking-wider uppercase">{t('min')}</small>
                </div>
                <span className="text-emerald-600 font-bold">:</span>
                <div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{timeLeft.segundos}</span>
                  <small className="text-[8px] font-sans font-bold text-slate-500 dark:text-slate-400 block tracking-wider uppercase">{t('seg')}</small>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <span>{t('comprar_ahora')}</span>
                <ArrowRight size={14} className="stroke-[2.5]" />
              </span>
            </div>
          </div>

          {/* Imagen Flotante del Producto */}
          <div className="relative z-10 w-full h-40 flex items-center justify-center pt-3">
            <img
              src={imgOferta}
              alt={pOferta?.titulo || t('oferta_del_mes')}
              className="max-h-36 w-auto object-contain filter drop-shadow-[0_16px_20px_rgba(0,0,0,0.12)] group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500"
            />
          </div>

          {/* Nombre del Producto en la base */}
          <div className="relative z-10 px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center text-xs text-slate-800 dark:text-slate-200 font-bold truncate">
            {pOferta?.titulo}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TARJETA 2: DESTACADO EN ESTILO BENTO VIOLETA                    */}
      {/* ============================================================== */}
      {pNovedad && (
        <div 
          onClick={() => navigate(`/producto/${pNovedad.id}`)}
          className="group relative rounded-[30px] sm:rounded-[34px] p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[410px] cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-56 h-56 bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-120 transition-transform duration-500" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3 text-center">
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800/80 text-[11px] font-extrabold tracking-wider uppercase">
                <Sparkles size={13} className="text-violet-600 fill-violet-600" />
                <span>{t('audio_pro_titulo')}</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight truncate">
              {pNovedad?.titulo || t('audio_pro_titulo')}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {t('precio_oficial')}:{' '}
              <span className="text-slate-900 dark:text-white font-black text-sm">
                {formatCurrency(pNovedad?.precioOferta || pNovedad?.precio || 0)} COP
              </span>
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm group-hover:scale-105 transition-all">
                <span>{t('explorar_pro')}</span>
                <ArrowRight size={14} className="stroke-[2.5]" />
              </span>
            </div>
          </div>

          {/* Imagen Flotante */}
          <div className="relative z-10 w-full h-40 flex items-center justify-center pt-3">
            <img
              src={imgNovedad}
              alt={pNovedad?.titulo || t('audio_pro_titulo')}
              className="max-h-36 w-auto object-contain filter drop-shadow-[0_16px_20px_rgba(0,0,0,0.12)] group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500"
            />
          </div>

          <div className="relative z-10 px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center text-xs text-slate-800 dark:text-slate-200 font-bold truncate">
            {pNovedad?.marca ? `${t('distribuidor_oficial')} ${pNovedad.marca}` : (pNovedad?.vendedor?.nombreTienda || t('garantia_oficial_colombia'))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TARJETA 3: EQUIPAMIENTO & RENDIMIENTO                          */}
      {/* ============================================================== */}
      {pTemporada && (
        <div 
          onClick={() => navigate(`/producto/${pTemporada.id}`)}
          className="group relative rounded-[30px] sm:rounded-[34px] p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[410px] cursor-pointer overflow-hidden"
        >
          <div className="absolute -top-10 -left-10 w-52 h-52 bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-120 transition-transform duration-500" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3 text-center">
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/80 text-[11px] font-extrabold tracking-wider uppercase">
                <Zap size={13} className="text-sky-600 fill-sky-600" />
                <span>{t('equipamiento_pro')}</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight truncate">
              {pTemporada?.marca || t('equipamiento_pro')}{' '}
              <span className="text-sky-600 dark:text-sky-400">Oficial</span>
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate">
              {t('stock_verificado')}
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm group-hover:scale-105 group-hover:bg-sky-600 group-hover:text-white transition-all">
                <span>{t('ver_coleccion')}</span>
                <ArrowRight size={14} className="stroke-[2.5]" />
              </span>
            </div>
          </div>

          {/* Imagen del Producto */}
          <div className="relative z-10 w-full h-40 flex items-center justify-center pt-3">
            <img
              src={imgTemporada}
              alt={pTemporada?.titulo || t('equipamiento_pro')}
              className="max-h-36 w-auto object-contain filter drop-shadow-[0_16px_20px_rgba(0,0,0,0.12)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500"
            />
          </div>

          <div className="relative z-10 px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center text-xs text-slate-800 dark:text-slate-200 font-bold truncate">
            {pTemporada?.titulo || t('calzado_deportes_accesorios')}
          </div>
        </div>
      )}

    </section>
  )
}

export default PromotionalBento
