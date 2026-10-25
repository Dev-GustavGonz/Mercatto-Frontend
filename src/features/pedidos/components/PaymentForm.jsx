import React from 'react'
import { METODOS_PAGO } from '@/utils/constants'
import { CreditCard, Building, Smartphone, Truck, CheckCircle, ShieldCheck, Lock } from 'lucide-react'

export const PaymentForm = ({ metodoSeleccionado, onSelectMetodo }) => {
  const getIcon = (id) => {
    switch (id) {
      case 'WOMPI':
        return <CreditCard className="text-violet-600" size={20} />
      case 'NEQUI':
        return <Smartphone className="text-purple-600" size={20} />
      case 'PSE':
        return <Building className="text-emerald-600" size={20} />
      case 'CONTRA_ENTREGA':
        return <Truck className="text-amber-600" size={20} />
      default:
        return <CreditCard size={20} />
    }
  }

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {METODOS_PAGO.map((m) => {
          const isSelected = metodoSeleccionado === m.id
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMetodo(m.id)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition cursor-pointer ${
                isSelected
                  ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/40 ring-2 ring-violet-500 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  {getIcon(m.id)}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{m.nombre}</span>
                </div>
                {isSelected && <CheckCircle size={16} className="text-violet-600 shrink-0" />}
              </div>
            </button>
          )
        })}
      </div>

      {metodoSeleccionado === 'WOMPI' && (
        <div className="p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-violet-900 dark:text-violet-300">
            <Lock size={15} className="text-violet-600" />
            <span>Pago Seguro En Línea con Tarjeta de Crédito o Débito (Wompi)</span>
          </div>
          <p className="text-violet-800 dark:text-violet-300 leading-relaxed">
            Aceptamos Visa, MasterCard y American Express. Transacción encriptada con estándar bancario PCI-DSS de 256 bits procesada en tiempo real.
          </p>
        </div>
      )}

      {metodoSeleccionado === 'NEQUI' && (
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs space-y-2">
          <p className="font-bold text-purple-900 dark:text-purple-300">
            Transferencia Directa Nequi / Bancolombia (Vía Wompi)
          </p>
          <p className="text-purple-700 dark:text-purple-400">
            Paga directo desde tu app Nequi con notificación push o código dinámico mediante la pasarela segura oficial de Wompi.
          </p>
        </div>
      )}

      {metodoSeleccionado === 'PSE' && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
          <p className="font-bold text-emerald-900 dark:text-emerald-300">
            Débito Bancario PSE (Vía Wompi)
          </p>
          <p className="text-emerald-700 dark:text-emerald-400">
            Débito automático en línea de tu cuenta bancaria de ahorros o corriente en cualquier banco colombiano.
          </p>
        </div>
      )}

      {metodoSeleccionado === 'CONTRA_ENTREGA' && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs space-y-2">
          <p className="font-bold text-amber-900 dark:text-amber-300">
            Pago Contra Entrega en Cartagena (Efectivo)
          </p>
          <p className="text-amber-700 dark:text-amber-400">
            Pagas el valor total de tu orden en efectivo directamente al mensajero local al momento de recibir tu paquete en tu puerta.
          </p>
        </div>
      )}
    </div>
  )
}

export default PaymentForm
