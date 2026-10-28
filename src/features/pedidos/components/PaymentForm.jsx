import React from 'react'
import { METODOS_PAGO } from '@/utils/constants'
import { CreditCard, Truck, CheckCircle, ShieldCheck, Lock, Sparkles, Building, Smartphone } from 'lucide-react'

export const PaymentForm = ({ metodoSeleccionado, onSelectMetodo }) => {
  return (
    <div className="space-y-4">
      {/* Banner de Garantía y Custodia de Fondos (Escrow Mercatto) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50 via-indigo-50 to-emerald-50 dark:from-slate-900 dark:via-violet-950/30 dark:to-slate-900 border border-violet-200/80 dark:border-violet-900/50 shadow-xs space-y-1.5 text-xs">
        <div className="flex items-center gap-2 font-extrabold text-violet-900 dark:text-violet-200">
          <ShieldCheck size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Custodia y Protección de Fondos Mercatto (Escrow)</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11.5px]">
          Tu pago digital ingresa seguro a la cuenta matriz de <strong>Mercatto vía Wompi</strong> en custodia protegida. El dinero se transfiere y liquida a la tienda oficial únicamente <strong>después de que tu pedido sea marcado como Entregado</strong> a tu satisfacción en Cartagena, descontando la comisión pactada según el plan de la tienda.
        </p>
      </div>

      {/* Selector de 2 opciones: Otras opciones de pago (Wompi) y Pago Contra Entrega */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {METODOS_PAGO.map((m) => {
          const isSelected =
            metodoSeleccionado === m.id ||
            (m.id === 'WOMPI' && metodoSeleccionado !== 'CONTRA_ENTREGA')

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMetodo(m.id)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition cursor-pointer relative ${
                isSelected
                  ? 'border-violet-600 bg-violet-50/60 dark:bg-violet-950/40 ring-2 ring-violet-500 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between w-full gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                    {m.id === 'WOMPI' ? (
                      <CreditCard size={18} />
                    ) : (
                      <Truck size={18} />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">
                      {m.nombre}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      {m.descripcion}
                    </span>
                  </div>
                </div>
                {isSelected && <CheckCircle size={18} className="text-violet-600 shrink-0 mt-0.5" />}
              </div>

              {/* Insignias visuales de métodos incluidos */}
              {m.id === 'WOMPI' ? (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      <CreditCard size={11} className="text-blue-600" />
                      <span>Tarjetas</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                      <Smartphone size={11} className="text-purple-600" />
                      <span>Nequi</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                      <Building size={11} className="text-blue-600" />
                      <span>PSE</span>
                    </span>
                  </div>
                  <span className="text-[9px] font-black tracking-tight text-slate-400 uppercase">
                    vía Wompi
                  </span>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 w-full">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                    <Truck size={11} className="text-amber-600" />
                    <span>Pago local en efectivo</span>
                  </span>
                  <span className="text-[9px] font-black tracking-tight text-emerald-600 uppercase">
                    Cartagena
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Detalle descriptivo según selección */}
      {metodoSeleccionado !== 'CONTRA_ENTREGA' ? (
        <div className="p-4 rounded-2xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-violet-900 dark:text-violet-300">
            <Lock size={15} className="text-violet-600" />
            <span>Pasarela Oficial Wompi (Bancolombia)</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11.5px]">
            Al hacer clic en <strong>"Confirmar Pedido"</strong>, se abrirá la pasarela segura de Wompi donde podrás elegir tu medio de pago favorito: <strong>Tarjeta de Crédito o Débito (Visa, Mastercard, Amex)</strong>, <strong>Nequi Directo</strong> o <strong>Débito Bancario PSE</strong>.
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
            <Truck size={15} className="text-amber-600" />
            <span>Pago Contra Entrega en Cartagena (Efectivo)</span>
          </div>
          <p className="text-amber-800 dark:text-amber-300 leading-relaxed text-[11.5px]">
            Pagas el valor total de tu orden en efectivo directamente al mensajero o repartidor local al momento de recibir tu paquete en tu puerta.
          </p>
        </div>
      )}
    </div>
  )
}

export default PaymentForm
