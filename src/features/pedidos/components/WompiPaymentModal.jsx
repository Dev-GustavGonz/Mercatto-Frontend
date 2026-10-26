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
  Check,
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
  const [terminosAceptados, setTerminosAceptados] = useState(true)
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
  const [tipoPersona, setTipoPersona] = useState('NATURAL')
  const [tipoDoc, setTipoDoc] = useState('CC')
  const [cedula, setCedula] = useState('1098765432')

  if (!isOpen || !pedido) return null

  // Detección visual de marca de tarjeta
  const digitoInicial = numeroTarjeta.replace(/\s+/g, '')[0]
  const esVisa = digitoInicial === '4'
  const esMastercard = digitoInicial === '5'
  const esAmex = digitoInicial === '3'

  const handlePagar = async (e) => {
    e.preventDefault()

    if (!terminosAceptados) {
      toastError('Debes aceptar los términos y condiciones para continuar.')
      return
    }

    setProcesando(true)

    try {
      // Simulación de respuesta bancaria autorizada de Wompi Bancolombia
      await new Promise((r) => setTimeout(r, 1500))

      const refTransaccion = `WPI-${metodo}-${Date.now().toString().slice(-8)}`

      if (esInvitado) {
        await pagoService.confirmarPagoInvitado(pedido.id, refTransaccion)
      } else {
        await pagoService.confirmarPago(pedido.id, refTransaccion)
      }

      success('¡Transacción autorizada con éxito por Wompi!')
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white text-slate-900 w-full max-w-[480px] rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* ============================================================== */}
        {/* 1. ENCABEZADO OFICIAL ESTILO WOMPI / GRUPO BANCOLOMBIA         */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 bg-white border-b border-slate-100 shrink-0 relative">
          <div className="flex items-center justify-between">
            {/* Logo Oficial Wompi */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#00D68F] bg-white shadow-xs">
                <span className="font-black text-slate-900 text-sm tracking-tighter select-none">W</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 select-none">wompi</span>
            </div>

            {/* Botón Cerrar */}
            <button
              onClick={() => setMostrarConfirmarCierre(true)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition flex items-center justify-center cursor-pointer"
              title="Cerrar ventana de pago"
            >
              <X size={16} />
            </button>
          </div>

          {/* Información del Comercio y Monto */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500 font-medium">Estás pagando en</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-extrabold text-sm text-slate-900">Mercatto</span>
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
                  ✓
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{pedido.codigo}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total a pagar</span>
              <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {formatCurrency(pedido.total)} <span className="text-xs font-bold text-slate-500">COP</span>
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. CONFIRMACIÓN DE CIERRE O FORMULARIO DE PAGO                 */}
        {/* ============================================================== */}
        {mostrarConfirmarCierre ? (
          <div className="p-6 space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-sm">
                <AlertTriangle size={17} className="text-amber-600" />
                <span>¿Deseas salir del proceso de pago?</span>
              </p>
              <p className="text-[11.5px] leading-relaxed text-amber-800">
                Tu orden <strong>{pedido.codigo}</strong> se encuentra registrada como <strong>"Pendiente de Pago"</strong>. Puedes continuar con la compra, dejarla guardada para pagarla luego desde <em>Mis Pedidos</em>, o cancelarla para liberar el stock de la tienda.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setMostrarConfirmarCierre(false)}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer transition text-xs shadow-sm"
              >
                Continuar con el Pago Seguro
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition text-xs"
              >
                Dejar Pendiente (Pagaré más tarde)
              </button>
              <button
                type="button"
                onClick={handleCancelarOrden}
                className="w-full py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold cursor-pointer transition text-xs"
              >
                Cancelar Pedido
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            
            {/* Selector de Medios de Pago (Estilo Oficial Wompi) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Selecciona tu medio de pago
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                {/* Opción Tarjeta */}
                <button
                  type="button"
                  onClick={() => setMetodo('TARJETA')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-xs font-bold ${
                    metodo === 'TARJETA'
                      ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 text-slate-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <CreditCard size={18} className={metodo === 'TARJETA' ? 'text-slate-900' : 'text-slate-500'} />
                  <span className="text-[11px]">Tarjeta</span>
                  <div className="flex items-center gap-1 opacity-70">
                    <span className="text-[9px] font-black italic tracking-tighter text-blue-700">VISA</span>
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block -mr-1" />
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  </div>
                </button>

                {/* Opción Nequi */}
                <button
                  type="button"
                  onClick={() => setMetodo('NEQUI')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-xs font-bold ${
                    metodo === 'NEQUI'
                      ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/15 text-purple-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <Smartphone size={18} className={metodo === 'NEQUI' ? 'text-purple-600' : 'text-slate-500'} />
                  <span className="text-[11px]">Nequi</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-bold">
                    Directo
                  </span>
                </button>

                {/* Opción PSE */}
                <button
                  type="button"
                  onClick={() => setMetodo('PSE')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-xs font-bold ${
                    metodo === 'PSE'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/15 text-blue-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <Building size={18} className={metodo === 'PSE' ? 'text-blue-600' : 'text-slate-500'} />
                  <span className="text-[11px]">PSE</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold">
                    Bancos
                  </span>
                </button>
              </div>
            </div>

            {/* Formulario Dinámico */}
            <form onSubmit={handlePagar} className="space-y-4 text-xs">
              
              {/* Formulario Tarjeta */}
              {metodo === 'TARJETA' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Número de tarjeta
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={numeroTarjeta}
                        onChange={(e) => setNumeroTarjeta(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        required
                        className="w-full pl-3.5 pr-14 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 focus:outline-none transition"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {esVisa && (
                          <span className="font-black italic text-xs tracking-tighter text-blue-700 bg-blue-50 px-1 py-0.5 rounded">
                            VISA
                          </span>
                        )}
                        {esMastercard && (
                          <span className="flex items-center -space-x-1">
                            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 inline-block" />
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 inline-block opacity-85" />
                          </span>
                        )}
                        {esAmex && (
                          <span className="font-black text-[10px] text-sky-700 bg-sky-50 px-1 py-0.5 rounded">
                            AMEX
                          </span>
                        )}
                        {!esVisa && !esMastercard && !esAmex && (
                          <CreditCard size={17} className="text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre en la tarjeta
                    </label>
                    <input
                      type="text"
                      value={nombreTitular}
                      onChange={(e) => setNombreTitular(e.target.value)}
                      placeholder="Como aparece en el plástico"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 focus:outline-none transition uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Expiración
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={vencimiento}
                        onChange={(e) => setVencimiento(e.target.value)}
                        placeholder="MM/AA"
                        required
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-mono text-center text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        required
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-mono text-center text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Cuotas
                      </label>
                      <select
                        value={cuotas}
                        onChange={(e) => setCuotas(e.target.value)}
                        className="w-full px-2 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 focus:outline-none transition cursor-pointer"
                      >
                        <option value="1">1 cuota</option>
                        <option value="2">2 cuotas</option>
                        <option value="3">3 cuotas</option>
                        <option value="6">6 cuotas</option>
                        <option value="12">12 cuotas</option>
                        <option value="24">24 cuotas</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario Nequi */}
              {metodo === 'NEQUI' && (
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-[11.5px] text-purple-950 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Smartphone size={14} className="text-purple-700" />
                      <span>Pago en línea con Nequi</span>
                    </p>
                    <p className="text-purple-800 leading-relaxed text-[11px]">
                      Te llegará una solicitud de cobro en tu app Nequi por <strong>{formatCurrency(pedido.total)} COP</strong>. Debes ingresar a tu aplicación para autorizarla.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Número de celular Nequi
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        maxLength={10}
                        value={celularNequi}
                        onChange={(e) => setCelularNequi(e.target.value)}
                        placeholder="300 123 4567"
                        required
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition"
                      />
                      <Smartphone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario PSE */}
              {metodo === 'PSE' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Banco
                    </label>
                    <select
                      value={banco}
                      onChange={(e) => setBanco(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 focus:outline-none transition cursor-pointer"
                    >
                      <option value="Bancolombia">Bancolombia</option>
                      <option value="Davivienda">Banco Davivienda</option>
                      <option value="Banco de Bogotá">Banco de Bogotá</option>
                      <option value="BBVA">BBVA Colombia</option>
                      <option value="Banco de Occidente">Banco de Occidente</option>
                      <option value="Scotiabank Colpatria">Scotiabank Colpatria</option>
                      <option value="Banco Falabella">Banco Falabella</option>
                      <option value="Lulo Bank">Lulo Bank</option>
                      <option value="Nu Colombia">Nu Colombia (Cuenta de Ahorros)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tipo de persona
                      </label>
                      <select
                        value={tipoPersona}
                        onChange={(e) => setTipoPersona(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 focus:outline-none transition cursor-pointer"
                      >
                        <option value="NATURAL">Persona Natural</option>
                        <option value="JURIDICA">Persona Jurídica</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Documento
                      </label>
                      <div className="flex gap-1.5">
                        <select
                          value={tipoDoc}
                          onChange={(e) => setTipoDoc(e.target.value)}
                          className="w-20 px-2 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 focus:outline-none transition"
                        >
                          <option value="CC">C.C.</option>
                          <option value="CE">C.E.</option>
                          <option value="NIT">NIT</option>
                          <option value="PP">Pas.</option>
                        </select>
                        <input
                          type="text"
                          value={cedula}
                          onChange={(e) => setCedula(e.target.value)}
                          placeholder="Número"
                          required
                          className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Aceptación de Términos Wompi */}
              <div className="pt-1 flex items-start gap-2.5">
                <input
                  id="terminosWompi"
                  type="checkbox"
                  checked={terminosAceptados}
                  onChange={(e) => setTerminosAceptados(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                />
                <label htmlFor="terminosWompi" className="text-[11px] text-slate-600 leading-snug cursor-pointer">
                  Acepto haber leído los <span className="font-semibold text-slate-900 underline">Términos y Condiciones</span> y la <span className="font-semibold text-slate-900 underline">Política de Privacidad</span> para compras con Wompi.
                </label>
              </div>

              {/* Botón Pagar Principal */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={procesando || !terminosAceptados}
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {procesando ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Procesando pago seguro con Wompi...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      <span>Pagar {formatCurrency(pedido.total)} COP</span>
                    </>
                  )}
                </button>
              </div>

              {/* Subtexto de Certificación y Seguridad */}
              <div className="text-center pt-1">
                <span className="text-[10px] text-slate-400 font-medium inline-flex items-center gap-1 justify-center">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  <span>Transacción cifrada SSL de 256 bits · Vigilado Superintendencia Financiera</span>
                </span>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. FOOTER OFICIAL WOMPI / GRUPO CIBEST (COMO EN EL SCREENSHOT)  */}
        {/* ============================================================== */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0 select-none">
          {/* Lado Izquierdo: Pagos Seguros por Wompi */}
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
              ✓
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-600">PAGOS SEGUROS POR</span>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full border border-[#00D68F] flex items-center justify-center font-black text-[9px] text-slate-900">
                W
              </span>
              <span className="font-black text-xs text-slate-900">Wompi</span>
            </div>
          </div>

          {/* Lado Derecho: Grupo Cibest */}
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-3.5 h-3.5 rounded-full border border-slate-400 flex items-center justify-center text-[8px] font-bold">
              ●
            </span>
            <span className="font-extrabold text-[11px] tracking-tight">Grupo Cibest</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default WompiPaymentModal
