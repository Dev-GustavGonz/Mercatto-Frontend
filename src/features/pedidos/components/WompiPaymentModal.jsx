import React, { useState } from 'react'
import { formatCurrency } from '@/utils/formatCurrency'
import {
  CreditCard,
  Building,
  Smartphone,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Info
} from 'lucide-react'
import pagoService from '../services/pagoService'
import pedidoService from '../services/pedidoService'
import { useToast } from '@/hooks/useToast'

export const WompiPaymentModal = ({
  isOpen,
  onClose,
  pedido,
  metodoInicial = 'WOMPI',
  onPagoCompletado,
  esInvitado = false,
  onCancelarPedido = null
}) => {
  const [metodo, setMetodo] = useState(
    metodoInicial === 'NEQUI' ? 'NEQUI' : metodoInicial === 'PSE' ? 'PSE' : 'TARJETA'
  )
  const [procesando, setProcesando] = useState(false)
  const [mostrarConfirmarCierre, setMostrarConfirmarCierre] = useState(false)
  const { success, error: toastError } = useToast()

  // Form states para Tarjeta
  const [numeroTarjeta, setNumeroTarjeta] = useState('4242 4242 4242 4242')
  const [nombreTitular, setNombreTitular] = useState(pedido?.direccion?.nombreCompleto || 'Comprador Mercatto')
  const [vencimiento, setVencimiento] = useState('12/28')
  const [cvv, setCvv] = useState('123')
  const [cuotas, setCuotas] = useState('1')

  // Form states para Nequi
  const [celularNequi, setCelularNequi] = useState(pedido?.direccion?.telefono || '3001234567')

  // Form states para PSE
  const [banco, setBanco] = useState('Bancolombia')
  const [cedula, setCedula] = useState('1098765432')

  if (!isOpen || !pedido) return null

  const handlePagar = async (e) => {
    e.preventDefault()
    setProcesando(true)

    try {
      // Simulación de respuesta bancaria autorizada de Wompi Bancolombia
      await new Promise((r) => setTimeout(r, 1400))

      const refTransaccion = `WPI-${metodo}-${Date.now().toString().slice(-8)}`

      if (esInvitado) {
        await pagoService.confirmarPagoInvitado(pedido.id, refTransaccion)
      } else {
        await pagoService.confirmarPago(pedido.id, refTransaccion)
      }

      success('¡Pago aprobado por Wompi Bancolombia! Tu pedido fue pagado exitosamente.')
      if (onPagoCompletado) {
        onPagoCompletado(refTransaccion)
      }
    } catch (err) {
      const msg = err.response?.data?.mensaje || err.response?.data?.message || 'Error al procesar el pago con la pasarela'
      toastError(msg)
    } finally {
      setProcesando(false)
    }
  }

  const handleCancelarOrden = async () => {
    try {
      await pedidoService.cancelarPedido(pedido.id)
      success('Pedido cancelado e inventario devuelto al catálogo.')
      if (onCancelarPedido) onCancelarPedido(pedido.id)
      onClose()
    } catch (err) {
      toastError(err.response?.data?.mensaje || 'Error al cancelar el pedido')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Encabezado Seguro Wompi */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shrink-0 relative">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white backdrop-blur-xs">
                <ShieldCheck size={18} />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-wider uppercase">Wompi</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-md font-bold">Bancolombia</span>
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-md font-extrabold uppercase">Sandbox</span>
                </div>
                <p className="text-[11px] text-violet-100">Pasarela oficial y custodia segura Mercatto</p>
              </div>
            </div>

            <button
              onClick={() => setMostrarConfirmarCierre(true)}
              className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Resumen del Monto */}
          <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-violet-200 uppercase font-bold tracking-wide">Orden a Pagar</span>
              <p className="text-xs font-extrabold">{pedido.codigo}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-violet-200 uppercase font-bold tracking-wide">Total COP</span>
              <p className="text-xl font-black text-amber-300">{formatCurrency(pedido.total)}</p>
            </div>
          </div>
        </div>

        {/* Modal de Confirmación de Cierre */}
        {mostrarConfirmarCierre ? (
          <div className="p-6 space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5 text-sm">
                <AlertTriangle size={16} className="text-amber-600" />
                <span>¿Deseas salir del pago?</span>
              </p>
              <p className="text-[11.5px] leading-relaxed">
                Tu pedido <strong>{pedido.codigo}</strong> se encuentra registrado como <strong>"Pendiente de Pago"</strong>. Puedes cancelarlo para liberar el producto o dejarlo guardado para pagarlo en cualquier momento desde <em>Mis Pedidos</em>.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setMostrarConfirmarCierre(false)}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold cursor-pointer transition"
              >
                Continuar con el Pago Seguro
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold cursor-pointer transition"
              >
                Dejar Pendiente (Pagaré más tarde)
              </button>
              <button
                type="button"
                onClick={handleCancelarOrden}
                className="w-full py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold cursor-pointer transition"
              >
                Cancelar Pedido y Devolver Stock
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            
            {/* Selector de Medios Wompi */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'TARJETA', label: 'Tarjeta', icon: CreditCard },
                { id: 'NEQUI', label: 'Nequi', icon: Smartphone },
                { id: 'PSE', label: 'PSE', icon: Building },
              ].map((tab) => {
                const Icon = tab.icon
                const activo = metodo === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMetodo(tab.id)}
                    className={`py-2.5 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer text-xs font-bold ${
                      activo
                        ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 ring-2 ring-violet-500/40'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-[11px]">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            <form onSubmit={handlePagar} className="space-y-4 text-xs">
              
              {/* Formulario Tarjeta */}
              {metodo === 'TARJETA' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Número de Tarjeta de Crédito / Débito
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={numeroTarjeta}
                        onChange={(e) => setNumeroTarjeta(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        required
                        className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none"
                      />
                      <CreditCard size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre del Titular
                    </label>
                    <input
                      type="text"
                      value={nombreTitular}
                      onChange={(e) => setNombreTitular(e.target.value)}
                      placeholder="Como aparece en la tarjeta"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Vence (MM/AA)
                      </label>
                      <input
                        type="text"
                        value={vencimiento}
                        onChange={(e) => setVencimiento(e.target.value)}
                        placeholder="MM/AA"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono focus:ring-2 focus:ring-violet-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono focus:ring-2 focus:ring-violet-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Cuotas
                      </label>
                      <select
                        value={cuotas}
                        onChange={(e) => setCuotas(e.target.value)}
                        className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none"
                      >
                        <option value="1">1 cuota</option>
                        <option value="3">3 cuotas</option>
                        <option value="6">6 cuotas</option>
                        <option value="12">12 cuotas</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario Nequi */}
              {metodo === 'NEQUI' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-300">
                    <p className="font-bold flex items-center gap-1">
                      <Smartphone size={13} />
                      <span>Pago Express Nequi Bancolombia</span>
                    </p>
                    <p className="mt-0.5 text-purple-700 dark:text-purple-400">
                      Recibirás una solicitud de pago en tu app Nequi para confirmar la transacción con tu clave o huella.
                    </p>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Número de Teléfono Nequi
                    </label>
                    <input
                      type="tel"
                      value={celularNequi}
                      onChange={(e) => setCelularNequi(e.target.value)}
                      placeholder="300 000 0000"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Formulario PSE */}
              {metodo === 'PSE' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Selecciona tu Banco
                    </label>
                    <select
                      value={banco}
                      onChange={(e) => setBanco(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    >
                      <option value="Bancolombia">Bancolombia</option>
                      <option value="Davivienda">Banco Davivienda</option>
                      <option value="Banco de Bogotá">Banco de Bogotá</option>
                      <option value="BBVA">BBVA Colombia</option>
                      <option value="Scotiabank">Scotiabank Colpatria</option>
                      <option value="Banco Falabella">Banco Falabella</option>
                      <option value="Lulo Bank">Lulo Bank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Número de Cédula o NIT
                    </label>
                    <input
                      type="text"
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)}
                      placeholder="C.C. / C.E. / NIT"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Custodia Escrow Mercatto */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-slate-400">
                <Lock size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Custodia Mercatto:</strong> El valor de tu compra queda retenido por Wompi Bancolombia y solo se distribuirá a la tienda cuando el pedido sea marcado como <strong>Entregado</strong> a tu satisfacción en Cartagena.
                </p>
              </div>

              {/* Botón Pagar */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={procesando}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {procesando ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Conectando con red bancaria Wompi...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>Pagar {formatCurrency(pedido.total)} COP con Wompi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default WompiPaymentModal
