import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { soporteService } from '../services/soporteService'
import Spinner from '@/components/common/Spinner'
import {
  Headphones,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Mail,
  Phone,
  User,
  PlusCircle,
  ListOrdered,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Store,
  CreditCard,
  Truck,
  RotateCcw
} from 'lucide-react'

const WHATSAPP_SOPORTE = '573233882717'
const MENSAJE_WHATSAPP = encodeURIComponent(
  '¡Hola Mercatto! 👋 Requiero asistencia técnica / comercial con mi cuenta.'
)

const CATEGORIAS_TICKET = [
  { id: 'PEDIDO', label: 'Duda sobre un pedido o despacho' },
  { id: 'PAGO', label: 'Pagos, transferencias o cupones' },
  { id: 'TIENDA', label: 'Gestión de tienda o comisiones (Vendedores)' },
  { id: 'PLATAFORMA', label: 'Problema técnico o error en la web' },
  { id: 'CUENTA', label: 'Cuenta, acceso o contraseña' },
  { id: 'OTRO', label: 'Otra consulta general' }
]

const FAQS = [
  {
    q: '¿Cómo puedo rastrear mi pedido?',
    a: 'Puedes ir a la opción "Rastrear Pedido" en el menú o ingresar con tu código de guía en la sección de Envíos de la transportadora asignada.'
  },
  {
    q: '¿Cuánto tarda en responder el equipo de soporte?',
    a: 'Normalmente respondemos las solicitudes radicadas en menos de 2 a 4 horas hábiles. Recibirás una notificación por correo electrónico tan pronto un asesor responda tu ticket.'
  },
  {
    q: '¿Dónde puedo ver las respuestas a mis tickets?',
    a: 'Si has iniciado sesión con tu cuenta, puedes consultar el historial y las respuestas de soporte en la pestaña "Mis Tickets" de este Centro de Ayuda.'
  },
  {
    q: 'Soy vendedor, ¿cómo solicito soporte sobre mis comisiones o productos?',
    a: 'Selecciona la categoría "Gestión de tienda o comisiones" al radicar tu ticket. Nuestro equipo administrativo revisará tu caso directamente en el panel de auditoría.'
  }
]

export const CentroSoporte = ({ vistaEmbebida = false }) => {
  const { usuario, autenticado, esVendedor, esAdmin } = useAuth()
  const { success: toastSuccess, error: toastError } = useToast()

  const [tab, setTab] = useState('nuevo') // 'nuevo' | 'mis_tickets'
  const [cargandoEnvio, setCargandoEnvio] = useState(false)
  const [ticketEnviado, setTicketEnviado] = useState(null)
  
  // Mis tickets state
  const [misTickets, setMisTickets] = useState([])
  const [cargandoTickets, setCargandoTickets] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [ticketExpandido, setTicketExpandido] = useState(null)

  // FAQ state
  const [faqAbierta, setFaqAbierta] = useState(null)

  // Form state
  const [formulario, setFormulario] = useState({
    nombre: usuario?.nombre || '',
    email: usuario?.email || '',
    telefono: usuario?.telefono || '',
    categoria: 'PEDIDO',
    asunto: '',
    mensaje: ''
  })

  // Sincronizar usuario si cambia la sesión
  useEffect(() => {
    if (usuario) {
      setFormulario((prev) => ({
        ...prev,
        nombre: usuario.nombre || prev.nombre,
        email: usuario.email || prev.email,
        telefono: usuario.telefono || prev.telefono
      }))
    }
  }, [usuario])

  // Cargar tickets del usuario autenticado
  const cargarMisTickets = async () => {
    if (!autenticado) return
    setCargandoTickets(true)
    try {
      const data = await soporteService.obtenerMisTickets()
      setMisTickets(data || [])
    } catch (err) {
      console.error('Error al cargar tickets:', err)
      toastError('No se pudieron obtener tus tickets de soporte.')
    } finally {
      setCargandoTickets(false)
    }
  }

  useEffect(() => {
    if (tab === 'mis_tickets' && autenticado) {
      cargarMisTickets()
    }
  }, [tab, autenticado])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formulario.nombre.trim()) {
      toastError('Por favor ingresa tu nombre completo.')
      return
    }
    if (!formulario.email.trim()) {
      toastError('Por favor ingresa tu correo electrónico.')
      return
    }
    if (!formulario.asunto.trim()) {
      toastError('Por favor ingresa un asunto para tu solicitud.')
      return
    }
    if (!formulario.mensaje.trim() || formulario.mensaje.trim().length < 10) {
      toastError('Por favor detalla tu consulta en el mensaje (mínimo 10 caracteres).')
      return
    }

    const payload = {
      nombre: formulario.nombre.trim(),
      email: formulario.email.trim(),
      telefono: formulario.telefono.trim(),
      asunto: `[${formulario.categoria}] ${formulario.asunto.trim()}`,
      mensaje: formulario.mensaje.trim()
    }

    setCargandoEnvio(true)
    try {
      const nuevoTicket = await soporteService.crearTicket(payload)
      setTicketEnviado(nuevoTicket)
      toastSuccess('¡Ticket radicado con éxito! Nuestro equipo lo atenderá en breve.')
      
      // Limpiar formulario excepto datos de usuario
      setFormulario({
        nombre: usuario?.nombre || '',
        email: usuario?.email || '',
        telefono: usuario?.telefono || '',
        categoria: 'PEDIDO',
        asunto: '',
        mensaje: ''
      })

      // Si el usuario está autenticado, refrescar la lista de tickets
      if (autenticado) {
        cargarMisTickets()
      }
    } catch (err) {
      console.error('Error al enviar ticket:', err)
      toastError(
        err.response?.data?.message ||
        err.response?.data?.mensaje ||
        'Ocurrió un error al enviar el ticket. Por favor intenta de nuevo.'
      )
    } finally {
      setCargandoEnvio(false)
    }
  }

  const ticketsFiltrados = misTickets.filter((t) => {
    if (filtroEstado === 'TODOS') return true
    return t.estado === filtroEstado
  })

  return (
    <div className={vistaEmbebida ? "w-full" : "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans"}>
      
      {/* Encabezado Principal */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-violet-200 border border-white/10">
              <Headphones size={14} className="text-emerald-400" />
              <span>Atención Oficial Mercatto</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Centro de Ayuda & Soporte
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              ¿Tienes alguna duda con una compra, envío, tienda o la plataforma? Radica un ticket oficial y nuestro equipo administrativo te atenderá con prioridad.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <a
              href={`https://wa.me/${WHATSAPP_SOPORTE}?text=${MENSAJE_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shadow-emerald-900/30 hover:scale-105"
            >
              <Phone size={16} />
              <span>WhatsApp Directo</span>
            </a>
            <a
              href="mailto:realmercatto@gmail.com"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition border border-white/15"
            >
              <Mail size={16} />
              <span>realmercatto@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Selector de Pestañas: Radicar Ticket vs Mis Tickets */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-8">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => {
              setTab('nuevo')
              setTicketEnviado(null)
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              tab === 'nuevo'
                ? 'bg-white text-violet-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle size={16} />
            <span>Radicar Nuevo Ticket</span>
          </button>

          <button
            onClick={() => setTab('mis_tickets')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer relative ${
              tab === 'mis_tickets'
                ? 'bg-white text-violet-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListOrdered size={16} />
            <span>Mis Tickets</span>
            {autenticado && misTickets.length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-violet-100 text-violet-800">
                {misTickets.length}
              </span>
            )}
          </button>
        </div>

        {/* Estado de sesión informativo */}
        <div className="text-xs text-slate-500 flex items-center gap-2">
          {autenticado ? (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sesión activa como: <strong>{usuario?.nombre || usuario?.email}</strong></span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-200 text-emerald-900">
                {esAdmin ? 'Admin' : esVendedor ? 'Vendedor' : 'Comprador'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-600">
              <User size={14} className="text-slate-400" />
              <span>¿Tienes cuenta?</span>
              <Link to="/login" className="text-violet-600 font-bold hover:underline">Inicia sesión</Link>
              <span>para guardar tu historial.</span>
            </div>
          )}
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Formulario o Listado de Tickets (2 columnas) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* ============================================================== */}
          {/* TAB 1: FORMULARIO DE NUEVO TICKET                             */}
          {/* ============================================================== */}
          {tab === 'nuevo' && (
            <div>
              {/* Éxito tras enviar ticket */}
              {ticketEnviado ? (
                <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-sm text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    ¡Ticket #{ticketEnviado.id} radicado con éxito!
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                    Hemos recibido tu solicitud titulada: <strong>"{ticketEnviado.asunto}"</strong>. Un asesor de soporte revisará tu mensaje y se pondrá en contacto contigo a través de <strong>{ticketEnviado.email}</strong>.
                  </p>
                  
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 max-w-md mx-auto text-left text-xs text-slate-600 space-y-1">
                    <p><strong>Número de radicado:</strong> #{ticketEnviado.id}</p>
                    <p><strong>Fecha y hora:</strong> {new Date(ticketEnviado.fechaCreacion || Date.now()).toLocaleString()}</p>
                    <p><strong>Estado inicial:</strong> <span className="text-amber-600 font-bold">PENDIENTE</span></p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    {autenticado ? (
                      <button
                        onClick={() => setTab('mis_tickets')}
                        className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition"
                      >
                        Ver mis tickets radicados
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition"
                      >
                        Iniciar sesión para hacer seguimiento
                      </Link>
                    )}
                    <button
                      onClick={() => setTicketEnviado(null)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
                    >
                      Radicar otro ticket
                    </button>
                  </div>
                </div>
              ) : (
                /* Formulario de creación */
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
                >
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <MessageSquare size={20} className="text-violet-600" />
                      <span>Formulario de Radicación de Ticket</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Diligencia los datos a continuación con la mayor claridad posible para acelerar tu respuesta.
                    </p>
                  </div>

                  {/* Datos del usuario */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nombre completo <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={formulario.nombre}
                        onChange={handleInputChange}
                        placeholder="Ej. Andrés Gómez"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Correo electrónico <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formulario.email}
                        onChange={handleInputChange}
                        readOnly={autenticado}
                        placeholder="ejemplo@correo.com"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition ${
                          autenticado
                            ? 'bg-slate-50 text-slate-600 border-slate-200 cursor-not-allowed'
                            : 'border-slate-200 text-slate-900'
                        }`}
                      />
                      {autenticado && (
                        <p className="text-[11px] text-slate-400 mt-1">
                          Asociado a tu cuenta activa en Mercatto.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Teléfono / WhatsApp (Opcional)
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formulario.telefono}
                        onChange={handleInputChange}
                        placeholder="Ej. 300 123 4567"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Tipo de solicitud <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="categoria"
                        value={formulario.categoria}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition bg-white"
                      >
                        {CATEGORIAS_TICKET.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Asunto breve <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="asunto"
                      required
                      value={formulario.asunto}
                      onChange={handleInputChange}
                      placeholder="Ej. Consulta sobre estado de despacho de mi orden #1042"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Mensaje o Consulta detallada <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {formulario.mensaje.length}/2000 car.
                      </span>
                    </div>
                    <textarea
                      name="mensaje"
                      required
                      rows={5}
                      maxLength={2000}
                      value={formulario.mensaje}
                      onChange={handleInputChange}
                      placeholder="Escribe aquí los detalles de tu problema o inquietud (números de guía, ID de pedido, tienda involucrada, etc.)..."
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition leading-relaxed resize-y"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                      Al radicar este ticket, recibirás una copia y seguimiento en tu correo electrónico.
                    </p>
                    <button
                      type="submit"
                      disabled={cargandoEnvio}
                      className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 transition cursor-pointer disabled:opacity-50"
                    >
                      {cargandoEnvio ? (
                        <>
                          <Spinner size="sm" />
                          <span>Radicando ticket...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Enviar Ticket de Soporte</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: HISTORIAL DE MIS TICKETS                               */}
          {/* ============================================================== */}
          {tab === 'mis_tickets' && (
            <div className="space-y-4">
              {!autenticado ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-violet-50 text-violet-600 mx-auto flex items-center justify-center">
                    <User size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Inicia sesión para ver tus tickets
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                    Para consultar el estado y las respuestas de soporte otorgadas por el administrador de Mercatto, debes iniciar sesión con la cuenta con la que radicaste el ticket.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              ) : cargandoTickets ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                  <Spinner size="lg" />
                  <p className="text-slate-500 text-sm mt-3">Consultando tus tickets de soporte...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Filtro y contador */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <span>Total de tickets radicados:</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-900 font-black">
                        {misTickets.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={cargarMisTickets}
                        className="p-1.5 text-slate-400 hover:text-violet-600 rounded-lg hover:bg-slate-100 transition"
                        title="Actualizar listado"
                      >
                        <RotateCcw size={15} />
                      </button>

                      <div className="flex items-center gap-1 text-xs">
                        {['TODOS', 'PENDIENTE', 'RESUELTO'].map((st) => (
                          <button
                            key={st}
                            onClick={() => setFiltroEstado(st)}
                            className={`px-3 py-1.5 rounded-xl font-bold transition ${
                              filtroEstado === st
                                ? 'bg-violet-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {st === 'TODOS' ? 'Todos' : st === 'PENDIENTE' ? 'Pendientes' : 'Resueltos'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Listado de tickets */}
                  {ticketsFiltrados.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                      <div className="w-14 h-14 rounded-full bg-slate-50 text-slate-400 mx-auto flex items-center justify-center">
                        <MessageSquare size={28} />
                      </div>
                      <h4 className="text-base font-bold text-slate-700">No hay tickets en esta vista</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        No se encontraron tickets con el filtro seleccionado. Puedes radicar una nueva solicitud en cualquier momento.
                      </p>
                      <button
                        onClick={() => setTab('nuevo')}
                        className="px-5 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition"
                      >
                        Radicar un ticket
                      </button>
                    </div>
                  ) : (
                    ticketsFiltrados.map((ticket) => {
                      const expandido = ticketExpandido === ticket.id
                      const esResuelto = ticket.estado === 'RESUELTO'
                      const esPendiente = ticket.estado === 'PENDIENTE'

                      return (
                        <div
                          key={ticket.id}
                          className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-black text-slate-400">#{ticket.id}</span>
                              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                                {ticket.asunto || 'Consulta de soporte'}
                              </h3>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1 ${
                                  esResuelto
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : esPendiente
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-sky-50 text-sky-700 border border-sky-200'
                                }`}
                              >
                                {esResuelto ? (
                                  <>
                                    <CheckCircle2 size={12} />
                                    <span>Resuelto</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock size={12} />
                                    <span>Pendiente de respuesta</span>
                                  </>
                                )}
                              </span>

                              <button
                                onClick={() => setTicketExpandido(expandido ? null : ticket.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                                title={expandido ? 'Ocultar detalles' : 'Ver detalles'}
                              >
                                {expandido ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </button>
                            </div>
                          </div>

                          {/* Fecha e información breve */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock size={13} />
                              <span>Radicado: {new Date(ticket.fechaCreacion).toLocaleString()}</span>
                            </span>
                            {ticket.fechaRespuesta && (
                              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                <CheckCircle2 size={13} />
                                <span>Atendido: {new Date(ticket.fechaRespuesta).toLocaleString()}</span>
                              </span>
                            )}
                          </div>

                          {/* Mensaje original del usuario */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                            <p className="font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1">
                              Tu consulta radicada:
                            </p>
                            {ticket.mensaje}
                          </div>

                          {/* RESPUESTA DEL ADMINISTRADOR */}
                          {ticket.respuestaAdmin ? (
                            <div className="bg-violet-50/70 border-l-4 border-violet-600 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm text-slate-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-black text-violet-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                                  <ShieldCheck size={16} className="text-violet-700" />
                                  <span>Respuesta oficial de Soporte Mercatto</span>
                                </span>
                                {ticket.fechaRespuesta && (
                                  <span className="text-[11px] text-violet-700 font-medium">
                                    {new Date(ticket.fechaRespuesta).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              <p className="whitespace-pre-line leading-relaxed text-slate-800">
                                {ticket.respuestaAdmin}
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs">
                              <Clock size={15} className="shrink-0 text-amber-600" />
                              <span>
                                Este ticket está en cola de revisión por el equipo administrativo. Te notificaremos a <strong>{ticket.email}</strong> en cuanto sea atendido.
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Columna Derecha: Canales directos, FAQ y tarjetas informativas */}
        <div className="space-y-6">
          
          {/* Canales Oficiales */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Headphones size={18} className="text-violet-600" />
              <span>Canales Directos</span>
            </h3>

            <div className="space-y-3">
              <a
                href={`https://wa.me/${WHATSAPP_SOPORTE}?text=${MENSAJE_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 text-emerald-950 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">Línea WhatsApp</h4>
                    <p className="text-[11px] text-emerald-700">+57 323 388 2717</p>
                  </div>
                </div>
                <ExternalLink size={14} className="text-emerald-600 opacity-60 group-hover:opacity-100" />
              </a>

              <a
                href="mailto:realmercatto@gmail.com"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-900 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">Correo Oficial</h4>
                    <p className="text-[11px] text-slate-500">realmercatto@gmail.com</p>
                  </div>
                </div>
                <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-700" />
              </a>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">Horario de Atención:</p>
              <p>Lunes a Sábado: 8:00 AM – 6:00 PM (Hora de Colombia)</p>
            </div>
          </div>

          {/* Garantías de Seguridad */}
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-3xl border border-violet-100 p-6 space-y-3">
            <h3 className="font-bold text-violet-950 text-sm flex items-center gap-2">
              <ShieldCheck size={18} className="text-violet-600" />
              <span>Compromiso Mercatto</span>
            </h3>
            <ul className="text-xs text-violet-900/80 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Resolución garantizada en caso de discrepancias entre comprador y vendedor.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Protección antifraude en transacciones con tarjeta, PSE o contra entrega.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Atención prioritaria para solicitudes de vendedores verificados.</span>
              </li>
            </ul>
          </div>

          {/* Preguntas Frecuentes Rápidas */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <HelpCircle size={18} className="text-indigo-600" />
              <span>Preguntas Frecuentes</span>
            </h3>

            <div className="space-y-2.5">
              {FAQS.map((faq, idx) => {
                const abierta = faqAbierta === idx
                return (
                  <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setFaqAbierta(abierta ? null : idx)}
                      className="w-full p-3 text-left font-bold text-xs text-slate-800 hover:bg-slate-50 flex items-center justify-between gap-2 transition"
                    >
                      <span>{faq.q}</span>
                      {abierta ? <ChevronUp size={14} className="shrink-0 text-slate-400" /> : <ChevronDown size={14} className="shrink-0 text-slate-400" />}
                    </button>
                    {abierta && (
                      <div className="p-3 bg-slate-50 text-xs text-slate-600 border-t border-slate-100 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
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

export default CentroSoporte
