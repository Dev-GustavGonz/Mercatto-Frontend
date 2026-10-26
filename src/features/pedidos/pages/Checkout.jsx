import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useLanguage } from '@/hooks/useLanguage'
import AddressForm from '../components/AddressForm'
import PaymentForm from '../components/PaymentForm'
import CartSummary from '../components/CartSummary'
import OrderSuccess from '../components/OrderSuccess'
import WompiPaymentModal from '../components/WompiPaymentModal'
import Button from '@/components/common/Button'
import pedidoService from '../services/pedidoService'
import pagoService from '../services/pagoService'
import { Lock, MapPin, CreditCard, ShieldCheck } from 'lucide-react'

export const Checkout = () => {
  const { items, cupon, limpiarCarrito, total } = useCart()
  const { autenticado, usuario } = useAuth()
  const { error: toastError } = useToast()
  const { t, idioma } = useLanguage()
  const navigate = useNavigate()

  const STORAGE_KEY_CHECKOUT = 'mercatto_checkout_draft'

  // Evitar envíos duplicados concurrentes
  const procesandoRef = useRef(false)

  // Recuperar borrador previo si existe
  const draftPrevio = (() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CHECKOUT)
      return data ? JSON.parse(data) : {}
    } catch {
      return {}
    }
  })()

  const [emailInvitado, setEmailInvitado] = useState(draftPrevio.emailInvitado || '')
  const [direccion, setDireccion] = useState({
    nombreCompleto: draftPrevio.direccion?.nombreCompleto || '',
    telefono: draftPrevio.direccion?.telefono || '',
    direccion: draftPrevio.direccion?.direccion || '',
    barrio: draftPrevio.direccion?.barrio || '',
    ciudad: 'Cartagena de Indias',
    departamento: 'Bolívar',
    notasEntrega: draftPrevio.direccion?.notasEntrega || '',
  })
  const [metodoPago, setMetodoPago] = useState(draftPrevio.metodoPago || 'WOMPI')
  const [loading, setLoading] = useState(false)
  const [pedidoCreado, setPedidoCreado] = useState(null)
  const [pedidoParaWompi, setPedidoParaWompi] = useState(null)
  const [mostrarModalWompi, setMostrarModalWompi] = useState(false)

  // Guardar en tiempo real cualquier cambio en el borrador (tanto para invitado como registrado)
  React.useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_CHECKOUT,
        JSON.stringify({
          emailInvitado,
          direccion,
          metodoPago,
        })
      )
    } catch (e) {
      console.warn('No se pudo guardar borrador de checkout:', e)
    }
  }, [emailInvitado, direccion, metodoPago])

  // Función para limpiar el borrador una vez la compra sea exitosa
  const limpiarBorradorCheckout = () => {
    localStorage.removeItem(STORAGE_KEY_CHECKOUT)
  }

  // Si el usuario ya está autenticado, precargar sus datos de perfil si los campos están vacíos
  React.useEffect(() => {
    if (autenticado && usuario) {
      setDireccion((prev) => ({
        ...prev,
        nombreCompleto: prev.nombreCompleto || usuario.nombre || '',
        telefono: prev.telefono || usuario.telefono || '',
        ciudad: 'Cartagena de Indias',
        departamento: 'Bolívar',
      }))
    }
  }, [autenticado, usuario])

  if (pedidoCreado) {
    return <OrderSuccess pedido={pedidoCreado} />
  }

  if (items.length === 0) {
    navigate('/carrito')
    return null
  }

  const handleProcesarCompra = async (e) => {
    e.preventDefault()

    if (procesandoRef.current || loading) return

    // 1. Validaciones
    if (!autenticado) {
      if (!emailInvitado.trim()) {
        toastError(idioma === 'EN' ? 'Please enter your email to receive invoice and tracking.' : 'Por favor ingresa tu correo electrónico para enviarte la factura y confirmación.')
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(emailInvitado.trim())) {
        toastError(idioma === 'EN' ? 'Invalid email format' : 'El correo electrónico ingresado no tiene un formato válido (ejemplo: usuario@correo.com).')
        return
      }
    }

    if (!direccion.nombreCompleto.trim()) {
      toastError(idioma === 'EN' ? 'Please enter recipient name' : 'Por favor ingresa el nombre de quien recibe el pedido.')
      return
    }

    const telLimpio = direccion.telefono.replace(/\D/g, '')
    if (!telLimpio || telLimpio.length < 7 || telLimpio.length > 10) {
      toastError(idioma === 'EN' ? 'Valid Colombian phone number required (7-10 digits)' : 'El teléfono de contacto debe tener entre 7 y 10 dígitos numéricos en Colombia.')
      return
    }

    if (!direccion.direccion.trim() || direccion.direccion.trim().length < 5) {
      toastError(idioma === 'EN' ? 'Full street address required' : 'Por favor ingresa una dirección de entrega completa en Cartagena.')
      return
    }

    if (!direccion.barrio.trim()) {
      toastError(idioma === 'EN' ? 'Please specify your neighborhood in Cartagena' : 'Por favor indica la ubicación de tu barrio en Cartagena de Indias.')
      return
    }

    procesandoRef.current = true
    setLoading(true)

    try {
      const itemsPayload = items.map((i) => ({
        productoId: i.producto.id,
        varianteId: i.variante?.id || null,
        cantidad: i.cantidad,
      }))

      const payloadDireccion = {
        nombre: direccion.nombreCompleto.trim(),
        telefono: telLimpio,
        direccion: direccion.direccion.trim(),
        barrio: direccion.barrio.trim(),
        ciudad: 'Cartagena de Indias',
        departamento: 'Bolívar',
        pais: 'Colombia',
        notas: direccion.notasEntrega.trim(),
      }

      let pedidoRes

      if (autenticado) {
        pedidoRes = await pedidoService.crear({
          items: itemsPayload,
          direccionEntrega: payloadDireccion,
          metodoPago,
          codigoCupon: cupon?.codigo || null,
        })
      } else {
        pedidoRes = await pedidoService.crearInvitado({
          email: emailInvitado.trim(),
          nombre: direccion.nombreCompleto.trim(),
          telefono: telLimpio,
          items: itemsPayload,
          direccionEntrega: payloadDireccion,
          metodoPago,
          codigoCupon: cupon?.codigo || null,
        })
      }

      const pagoPayload = {
        pedidoId: pedidoRes.id,
        metodoPago,
        email: autenticado ? usuario?.email : emailInvitado.trim(),
      }

      const pagoRes = autenticado
        ? await pagoService.iniciar(pagoPayload)
        : await pagoService.iniciarInvitado(pagoPayload)

      // Métodos integrados con Wompi Bancolombia (Tarjetas, PSE, Nequi)
      if (metodoPago === 'WOMPI' || metodoPago === 'PSE' || metodoPago === 'NEQUI') {
        const esSimulado =
          pagoRes.esSandboxSimulado ||
          !pagoRes.publicKey ||
          pagoRes.publicKey.includes('Q5yDA9xoKdePzhSGeVe9KvxXQKIO5Ade')

        // Si estamos en entorno de desarrollo / sandbox o si las llaves son de prueba de Wompi
        if (esSimulado) {
          setPedidoParaWompi({ ...pedidoRes, total })
          setMostrarModalWompi(true)
          return
        }

        if (window.WidgetCheckout && pagoRes.publicKey && pagoRes.signatureIntegrity) {
          try {
            const checkout = new window.WidgetCheckout({
              currency: 'COP',
              amountInCents: pagoRes.amountInCents,
              reference: pagoRes.reference,
              publicKey: pagoRes.publicKey,
              signature: { integrity: pagoRes.signatureIntegrity },
              redirectUrl: window.location.origin + '/pago/exitoso?ref=' + pagoRes.reference,
              customerData: {
                email: pagoRes.customerEmail || (autenticado ? usuario?.email : emailInvitado.trim()),
                fullName: pagoRes.customerFullName || direccion.nombreCompleto.trim(),
                phoneNumber: pagoRes.customerPhoneNumber || telLimpio,
                phoneNumberPrefix: '+57',
              }
            })

            checkout.open(async (result) => {
              const transaction = result?.transaction
              if (transaction?.status === 'APPROVED') {
                try {
                  if (autenticado) {
                    await pagoService.confirmarPago(pedidoRes.id, transaction.id)
                  } else {
                    await pagoService.confirmarPagoInvitado(pedidoRes.id, transaction.id)
                  }
                } catch (e) {
                  console.warn('Error confirmando pago:', e)
                }
                limpiarCarrito()
                limpiarBorradorCheckout()
                navigate('/pago/exitoso?ref=' + pagoRes.reference)
              } else if (transaction && (transaction.status === 'DECLINED' || transaction.status === 'ERROR')) {
                navigate('/pago/cancelado?ref=' + pagoRes.reference)
              }
            })
            return
          } catch (widgetErr) {
            console.warn('Error en widget Wompi, activando pasarela interactiva Mercatto:', widgetErr)
            setPedidoParaWompi({ ...pedidoRes, total })
            setMostrarModalWompi(true)
            return
          }
        }

        // Si no está disponible el widget CDN, abrir modal integrado
        setPedidoParaWompi({ ...pedidoRes, total })
        setMostrarModalWompi(true)
        return
      }

      // Contra Entrega en efectivo
      limpiarCarrito()
      limpiarBorradorCheckout()
      setPedidoCreado({ ...pedidoRes, metodoPago, total })
    } catch (err) {
      toastError(err.response?.data?.message || err.response?.data?.mensaje || (idioma === 'EN' ? 'Error processing purchase' : 'Error al procesar la compra'))
    } finally {
      setLoading(false)
      procesandoRef.current = false
    }
  }

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto font-sans">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <Lock size={20} className="text-emerald-600" />
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t('checkout_titulo')}</h1>
      </div>

      <form onSubmit={handleProcesarCompra} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Forms column */}
        <div className="lg:col-span-8 space-y-6">

          {/* Banner o Datos de Comprador Invitado */}
          {!autenticado ? (
            <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-slate-800/80 dark:to-indigo-950/40 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100/80 dark:border-slate-700/60">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {idioma === 'EN' ? 'Fast Checkout without Account' : 'Compra Rápida sin Registro'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {idioma === 'EN' ? 'Enter your email for the invoice and tracking link.' : 'Solo ingresa tu correo para enviarte el recibo y la guía de tu paquete.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/login?redirect=/checkout')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('ya_tienes_cuenta')} {t('iniciar_sesion')}</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1.5">
                  {t('correo_electronico')} *
                </label>
                <input
                  type="email"
                  placeholder={t('correo_placeholder')}
                  value={emailInvitado}
                  onChange={(e) => setEmailInvitado(e.target.value)}
                  className="w-full text-sm px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white shadow-xs"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                <span>{idioma === 'EN' ? 'Ordering as:' : 'Comprando como:'}</span>
                <strong className="font-bold">{usuario?.nombre || usuario?.email}</strong>
                <span className="text-[11px] opacity-75">({usuario?.email})</span>
              </div>
            </div>
          )}

          {/* Step 1: Address (Cartagena de Indias) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-white text-sm">
              <MapPin size={18} className="text-violet-600" />
              <span>1. {t('direccion_entrega')}</span>
            </div>
            <AddressForm direccion={direccion} onChange={setDireccion} />
          </div>

          {/* Step 2: Payment method (Wompi Escrow) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-white text-sm">
              <CreditCard size={18} className="text-violet-600" />
              <span>2. {t('metodo_pago')}</span>
            </div>
            <PaymentForm metodoSeleccionado={metodoPago} onSelectMetodo={setMetodoPago} />
          </div>

          {/* Final Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-base font-extrabold shadow-xl cursor-pointer"
            loading={loading}
            disabled={loading}
          >
            <ShieldCheck size={20} className="mr-2" />
            <span>{t('confirmar_pedido')}</span>
          </Button>
        </div>

        {/* Order Summary sidebar */}
        <div className="lg:col-span-4 sticky top-28">
          <CartSummary showCheckoutBtn={false} />
        </div>
      </form>

      {/* Modal de Pago Seguro Wompi Sandbox */}
      <WompiPaymentModal
        isOpen={mostrarModalWompi}
        onClose={() => setMostrarModalWompi(false)}
        pedido={pedidoParaWompi}
        metodoInicial={metodoPago}
        esInvitado={!autenticado}
        onPagoCompletado={(refTx) => {
          limpiarCarrito()
          limpiarBorradorCheckout()
          setMostrarModalWompi(false)
          navigate('/pago/exitoso?ref=' + refTx)
        }}
        onCancelarPedido={() => {
          setMostrarModalWompi(false)
          setPedidoParaWompi(null)
        }}
      />
    </div>
  )
}

export default Checkout
