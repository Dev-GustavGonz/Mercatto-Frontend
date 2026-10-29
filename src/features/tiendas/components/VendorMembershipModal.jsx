import React, { useState, useEffect } from 'react'
import { Sparkles, Check, Zap, Crown, ArrowRight, X } from 'lucide-react'
import { vendedorService } from '@/features/tiendas'
import { useToast } from '@/hooks/useToast'
import { formatCurrency } from '@/utils/formatCurrency'

export const VendorMembershipModal = ({ perfil, onClose, onActualizado }) => {
  const [procesando, setProcesando] = useState(false)
  const { success, error } = useToast()

  // Cerrar al presionar la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const planes = [
    {
      id: 'STARTER',
      nombre: 'Plan Starter',
      precio: 0,
      periodo: 'Gratis siempre',
      color: 'slate',
      icono: Sparkles,
      descripcion: 'Ideal para personas naturales o tiendas que están comenzando.',
      comision: '10% de comisión por venta',
      beneficios: [
        'Hasta 10 productos en catálogo',
        'Vitrina básica de tienda oficial',
        'Soporte estándar vía tickets',
        'Chat directo con compradores'
      ],
      destacado: false,
    },
    {
      id: 'PRO',
      nombre: 'Plan Profesional',
      precio: 49000,
      periodo: 'COP / mes',
      color: 'indigo',
      icono: Zap,
      descripcion: 'Para negocios en crecimiento que buscan mayor visibilidad y menos comisión.',
      comision: 'Solo 5% de comisión por venta',
      beneficios: [
        'Hasta 50 productos en catálogo',
        'Insignia Verificado Mercatto',
        'Comisión reducida al 5%',
        'Prioridad intermedia en catálogo',
        'Soporte prioritario 24/7'
      ],
      destacado: true,
    },
    {
      id: 'ELITE',
      nombre: 'Plan Elite Premium',
      precio: 99000,
      periodo: 'COP / mes',
      color: 'amber',
      icono: Crown,
      descripcion: 'Para marcas y distribuidores que exigen máxima facturación e impacto.',
      comision: 'Solo 2% de comisión por venta',
      beneficios: [
        'Productos ilimitados sin restricciones',
        'Insignia dorada ELITE oficial',
        'Comisión mínima del 2%',
        'Aparición prioritaria en catálogo',
        'Vitrina en Selección Exclusiva Élite'
      ],
      destacado: false,
    }
  ]

  const handleCambiarPlan = async (planId) => {
    if (planId === perfil?.tipoSuscripcion) {
      if (onClose) onClose()
      return
    }

    setProcesando(true)
    try {
      await vendedorService.actualizarSuscripcion(planId)
      success(`¡Membresía actualizada con éxito al ${planId}!`)
      if (onActualizado) onActualizado()
      if (onClose) onClose()
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al procesar el cambio de membresía')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div 
      onClick={() => onClose && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-4xl lg:max-w-5xl flex flex-col rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[96vh]"
      >
        {/* Encabezado Neutral Compacto */}
        <div className="relative px-5 sm:px-6 py-3.5 sm:py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="relative z-10 space-y-1 pr-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 text-[11px] font-bold border border-violet-200 dark:border-violet-800/60">
              <Sparkles size={12} className="text-violet-600 dark:text-violet-400" />
              <span>Planes & Membresías de Tienda</span>
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Elige el Plan para potenciar tus Ventas
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-normal">
              Elige el nivel de suscripción ideal para tu negocio. Disfruta de menor comisión por venta y máxima visibilidad en el catálogo frente a los compradores.
            </p>
          </div>
          
          {/* Botón de cierre superior (X funcional) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (onClose) onClose()
            }}
            className="absolute top-4 right-4 z-30 p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Cerrar modal"
            title="Cerrar"
          >
            <X size={19} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Tarjetas de Planes (Ajustado para eliminar overflow vertical en desktop) */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 overflow-y-auto lg:overflow-visible">
          {planes.map((p) => {
            const Icono = p.icono
            const esPlanActual = perfil?.tipoSuscripcion === p.id

            return (
              <div
                key={p.id}
                className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-4.5 border flex flex-col justify-between transition-all duration-300 ${
                  p.destacado
                    ? 'border-violet-600 bg-violet-50/20 dark:bg-violet-950/20 ring-2 ring-violet-500 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                {p.destacado && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-violet-600 text-white font-extrabold text-[9px] uppercase tracking-wider shadow">
                    Más Popular
                  </span>
                )}

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      p.id === 'ELITE'
                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60'
                        : p.id === 'PRO'
                        ? 'bg-violet-100 text-violet-600 dark:bg-violet-950/60'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                    }`}>
                      <Icono size={16} />
                    </div>

                    {esPlanActual && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold text-[9px] uppercase tracking-wide">
                        Plan Activo
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {p.nombre}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug min-h-[26px]">
                      {p.descripcion}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        {p.precio === 0 ? 'Gratis' : formatCurrency(p.precio)}
                      </span>
                      {p.precio > 0 && (
                        <span className="text-[10px] text-slate-400 font-semibold">/{p.periodo}</span>
                      )}
                    </div>
                    <span className="inline-block mt-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-400">
                      {p.comision}
                    </span>
                  </div>

                  {/* Beneficios */}
                  <ul className="space-y-1 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    {p.beneficios.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                        <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botón de Selección */}
                <div className="pt-3.5">
                  <button
                    type="button"
                    onClick={() => handleCambiarPlan(p.id)}
                    disabled={procesando || esPlanActual}
                    className={`w-full py-2 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      esPlanActual
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800'
                        : p.destacado
                        ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/30'
                        : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                    }`}
                  >
                    <span>{esPlanActual ? 'Tu Plan Actual' : `Elegir ${p.id}`}</span>
                    {!esPlanActual && <ArrowRight size={13} />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Informativo Compacto */}
        <div className="px-5 sm:px-6 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 shrink-0">
          <span className="text-[11px] text-center sm:text-left">
            El pago de suscripción mensual se liquida de forma segura y directa a la administración del Marketplace.
          </span>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (onClose) onClose()
            }} 
            className="font-semibold text-slate-700 dark:text-slate-300 hover:underline shrink-0 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default VendorMembershipModal
