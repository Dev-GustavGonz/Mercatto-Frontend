import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import api from '@/utils/api'
import {
  X,
  Send,
  Sparkles,
  ExternalLink,
  Headphones,
  CheckCircle2,
  Mail,
  User,
  Phone,
  MessageCircle,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  RefreshCw,
  ShoppingBag,
  CreditCard,
  Truck,
  Store,
  Tag,
  Package
} from 'lucide-react'

// Línea oficial de atención al cliente Mercatto (Colombia)
const WHATSAPP_SOPORTE = '573233882717'
const MENSAJE_WHATSAPP = encodeURIComponent(
  '¡Hola Mercatto! 👋 Estoy navegando en el marketplace y requiero asesoría personalizada antes de registrarme.'
)

const OPCIONES_GUIA = [
  {
    id: 'como_comprar',
    titulo: '¿Cómo comprar en Mercatto?',
    subtitulo: 'Paso a paso para hacer tu primer pedido',
    icono: ShoppingBag,
    color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
  },
  {
    id: 'medios_pago',
    titulo: 'Métodos de pago aceptados',
    subtitulo: 'Tarjetas, PSE, Nequi y Contra Entrega',
    icono: CreditCard,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
  },
  {
    id: 'vender',
    titulo: '¿Cómo abrir mi propia tienda?',
    subtitulo: 'Registro, publicación de productos y cobros',
    icono: Store,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60'
  },
  {
    id: 'planes',
    titulo: 'Planes y comisiones para vendedores',
    subtitulo: 'Starter, Profesional y Elite Premium',
    icono: Sparkles,
    color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60'
  },
  {
    id: 'envios',
    titulo: 'Cobertura de envíos en Colombia',
    subtitulo: 'Costo de envío y envío gratis desde $150.000',
    icono: Truck,
    color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60'
  },
  {
    id: 'cupones',
    titulo: 'Cupones de descuento activos',
    subtitulo: 'MERCATTO10 y BIENVENIDA',
    icono: Tag,
    color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60'
  },
  {
    id: 'rastreo',
    titulo: 'Rastrear mi pedido',
    subtitulo: 'Consulta el estado de tu compra',
    icono: Package,
    color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60'
  },
  {
    id: 'soporte_directo',
    titulo: 'Atención al Cliente Mercatto',
    subtitulo: 'Hablar con un asesor comercial o de soporte',
    icono: Headphones,
    color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60',
    destacado: true
  }
]

const SUGERENCIAS_INICIALES = [
  { id: 'como_comprar', label: '🛒 Cómo comprar' },
  { id: 'medios_pago', label: '💳 Medios de pago' },
  { id: 'envios', label: '🚚 Envíos' },
  { id: 'cupones', label: '🏷️ Cupones' },
  { id: 'planes', label: '✨ Vender y planes' }
]

const RESPUESTAS_BASE = {
  como_comprar:
    '🛒 **Comprar en Mercatto es muy sencillo:**\n\n1. Explora el catálogo o busca el producto que necesitas.\n2. Agrégalo a tu carrito (puedes comprar con tu cuenta o como invitado, solo con tu correo).\n3. En el checkout ingresa tu dirección de entrega y, si tienes uno, tu cupón.\n4. Paga de forma segura con Wompi (tarjeta, PSE, Nequi o Bancolombia) o elige pago contra entrega.\n5. Recibirás la confirmación y el recibo por correo electrónico.',
  medios_pago:
    '💳 **Medios de pago en Mercatto:**\n\n• **Wompi (pasarela segura de Bancolombia):** tarjetas de crédito y débito, PSE, Nequi y Bancolombia.\n• **Pago contra entrega:** pagas en efectivo cuando recibes tu pedido.\n\nCada pago aprobado genera un recibo en tu correo.',
  vender:
    '🏬 **Vender en Mercatto:**\n\n1. Crea tu cuenta y elige registrarte como vendedor.\n2. Configura el perfil de tu tienda y publica tus productos con fotos, precio y variantes.\n3. Gestiona pedidos, mensajes con compradores y estadísticas desde tu panel.\n\nElige el plan que mejor se ajuste a tu negocio: empieza gratis con **Starter** y crece cuando lo necesites.',
  planes:
    '✨ **Planes para vendedores:**\n\n• **Starter:** $0 al mes · comisión del **10%** por venta.\n• **Profesional:** $49.000 COP al mes · comisión del **5%** por venta.\n• **Elite Premium:** $99.000 COP al mes · comisión del **2%** por venta, insignia Élite y prioridad en el catálogo.\n\nPuedes cambiar de plan cuando quieras desde tu panel de vendedor.',
  cupones:
    '🏷️ **Cupones activos de Mercatto:**\n\n• **MERCATTO10:** 10% de descuento en compras desde $30.000 COP (descuento máximo de $50.000 COP).\n• **BIENVENIDA:** $20.000 COP de descuento en compras desde $100.000 COP.\n\nAplícalos en el carrito o en el checkout antes de pagar.',
  envios:
    '🚚 **Envíos en Mercatto:**\n\nDespachamos a toda Colombia a través de transportadoras aliadas. El envío cuesta **$12.000 COP** y es **gratis en compras desde $150.000 COP**. Cuando tu pedido salga, podrás seguir su estado desde tu cuenta.',
  rastreo:
    '📦 **Rastrea tu pedido:**\n\n• Si compraste con tu cuenta, entra a **Mis pedidos** y revisa el estado en tiempo real.\n• Si compraste como invitado, usa tu código de pedido y el correo con el que compraste.\n\nTambién te enviamos por correo la confirmación y el recibo de tu compra.'
}

export const PublicChatbot = () => {
  const { autenticado, usuario } = useAuth()
  const location = useLocation()
  const { t, idioma } = useLanguage()
  const isEn = idioma === 'EN'
  const [abierto, setAbierto] = useState(false)
  const [mensajeInput, setMensajeInput] = useState('')
  const [vistaActual, setVistaActual] = useState('chat') // 'chat' | 'menu_opciones' | 'formulario_contacto'
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      remitente: 'bot',
      texto:
        '¡Hola! Soy el asistente de **Mercatto**, el marketplace multitienda de Colombia. 👋\n\nPuedo ayudarte con compras, pagos, envíos, cupones o con abrir tu propia tienda. ¿Por dónde empezamos?',
      sugerencias: true,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [escribiendo, setEscribiendo] = useState(false)
  const [ticketCargando, setTicketCargando] = useState(false)
  const [ticketError, setTicketError] = useState('')
  const [formTicket, setFormTicket] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: 'Consulta desde Asistente Mercatto',
    mensaje: ''
  })

  // Sincronizar datos si el usuario está autenticado
  useEffect(() => {
    if (usuario) {
      setFormTicket((prev) => ({
        ...prev,
        nombre: usuario.nombre || prev.nombre,
        email: usuario.email || prev.email,
        telefono: usuario.telefono || prev.telefono
      }))
    }
  }, [usuario])

  const mensajesContainerRef = useRef(null)

  // Generar o recuperar sessionId persistente para la conversación
  const [sessionId] = useState(() => {
    let sid = sessionStorage.getItem('mercatto_chat_sid')
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 11)
      sessionStorage.setItem('mercatto_chat_sid', sid)
    }
    return sid
  })


  // En paneles administrativos o de tienda, el usuario ya cuenta con su propio dock
  const esRutaPanel =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/panel-vendedor') ||
    location.pathname.startsWith('/vendedor')

  

  // Scroll suave contenido únicamente dentro del contenedor del chat
  const scrollAlFinal = () => {
    if (mensajesContainerRef.current) {
      mensajesContainerRef.current.scrollTo({
        top: mensajesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    if (abierto) {
      scrollAlFinal()
    }
  }, [mensajes, escribiendo, vistaActual, abierto])

  const seleccionarOpcion = (opcionId) => {
    const opcion = OPCIONES_GUIA.find((o) => o.id === opcionId)
    if (!opcion) return

    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Agrega la elección del usuario
    setMensajes((prev) => [
      ...prev,
      { id: Date.now(), remitente: 'usuario', texto: opcion.titulo, hora }
    ])

    if (opcionId === 'soporte_directo') {
      setEscribiendo(true)
      setTimeout(() => {
        setEscribiendo(false)
        setMensajes((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            remitente: 'bot',
            texto:
              'Nuestro equipo de **Atención al Cliente Mercatto** está a tu disposición para ayudarte con cualquier inquietud. ¿Cómo prefieres comunicarte?',
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            esOpcionSoporte: true
          }
        ])
        setVistaActual('chat')
      }, 500)
      return
    }

    setEscribiendo(true)
    setTimeout(() => {
      setEscribiendo(false)
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          remitente: 'bot',
          texto: RESPUESTAS_BASE[opcionId] || '¿Deseas consultar alguna otra información?',
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ofrecerMenu: true
        }
      ])
      setVistaActual('chat')
    }, 600)
  }

  const handleEnviarMensaje = async (e, textoDirecto = null) => {
    if (e && e.preventDefault) e.preventDefault()
    const texto = (textoDirecto !== null ? textoDirecto : mensajeInput).trim()
    if (!texto) return

    setMensajeInput('')
    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    setMensajes((prev) => [
      ...prev,
      { id: Date.now(), remitente: 'usuario', texto, hora }
    ])

    const t = texto.toLowerCase()
    setEscribiendo(true)

    // Si pide explícitamente contacto con humano/soporte
    if (t.includes('soporte') || t.includes('humano') || t.includes('asesor') || t.includes('admin') || t.includes('persona')) {
      setEscribiendo(false)
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          remitente: 'bot',
          texto: 'Con gusto te comunico con el equipo de **Atención al Cliente Mercatto**. Puedes escribirnos directamente por WhatsApp o dejarnos tu solicitud por mensaje:',
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          esOpcionSoporte: true,
          ofrecerMenu: false
        }
      ])
      return
    }

    try {
      // Llamada directa al agente de Inteligencia Artificial en n8n
      const n8nUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/mercatto-chat'
      const response = await fetch(n8nUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: texto,
          sessionId: sessionId
        })
      })

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor de IA')
      }

      const data = await response.json()
      const respuestaIA = data?.reply || data?.output || 'Disculpa, no pude procesar tu mensaje en este momento.'

      setEscribiendo(false)
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          remitente: 'bot',
          texto: respuestaIA,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          esOpcionSoporte: false,
          ofrecerMenu: true
        }
      ])
    } catch (err) {
      console.warn('Fallo n8n webhook, usando respuestas de respaldo:', err)
      setEscribiendo(false)

      let respuesta = ''
      if (t.includes('pago') || t.includes('tarjeta') || t.includes('nequi') || t.includes('banco') || t.includes('pse')) {
        respuesta = RESPUESTAS_BASE.medios_pago
      } else if (t.includes('rastre') || t.includes('seguimiento') || t.includes('estado de mi')) {
        respuesta = RESPUESTAS_BASE.rastreo
      } else if (t.includes('comprar') || t.includes('pedido') || t.includes('orden')) {
        respuesta = RESPUESTAS_BASE.como_comprar
      } else if (t.includes('plan') || t.includes('comision') || t.includes('suscrip') || t.includes('elite') || t.includes('starter') || t.includes('mensualidad')) {
        respuesta = RESPUESTAS_BASE.planes
      } else if (t.includes('vender') || t.includes('tienda') || t.includes('proveedor')) {
        respuesta = RESPUESTAS_BASE.vender
      } else if (t.includes('cupon') || t.includes('descuento') || t.includes('promo')) {
        respuesta = RESPUESTAS_BASE.cupones
      } else if (t.includes('envio') || t.includes('flete') || t.includes('ciudad') || t.includes('despacho')) {
        respuesta = RESPUESTAS_BASE.envios
      } else {
        respuesta = '¡Hola! En Mercatto estamos para ayudarte. Puedo orientarte sobre compras, métodos de pago, envíos, cupones, rastreo de pedidos o los planes para vender (comisiones desde el 2%). ¿Qué te gustaría saber?'
      }

      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          remitente: 'bot',
          texto: respuesta,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          esOpcionSoporte: false,
          ofrecerMenu: true
        }
      ])
    }
  }

  const handleEnviarFormulario = async (e) => {
    e.preventDefault()
    setTicketError('')

    if (!formTicket.nombre.trim() || !formTicket.email.trim() || !formTicket.mensaje.trim()) {
      setTicketError('Por favor completa nombre, correo y tu consulta.')
      return
    }

    try {
      setTicketCargando(true)
      await api.post('/soporte/ticket', formTicket)
      setTicketCargando(false)
      setVistaActual('chat')

      const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now(),
          remitente: 'bot',
          texto: `✅ **Solicitud radicada con éxito.**\n\nHemos recibido tu consulta, ${formTicket.nombre}. Un asesor de **Atención al Cliente Mercatto** revisará tu caso y se pondrá en contacto contigo a través de tu correo **${formTicket.email}** a la mayor brevedad.`,
          hora,
          ofrecerMenu: true
        }
      ])

      setFormTicket({
        nombre: '',
        email: '',
        telefono: '',
        asunto: 'Consulta desde Asistente Mercatto',
        mensaje: ''
      })
    } catch (err) {
      setTicketCargando(false)
      setTicketError(err.response?.data?.message || 'No se pudo enviar la solicitud. Por favor intenta de nuevo.')
    }
  }

  const reiniciarConversacion = () => {
    const nuevoSid = 'session_' + Math.random().toString(36).substring(2, 11)
    sessionStorage.setItem('mercatto_chat_sid', nuevoSid)
    setMensajes([
      {
        id: Date.now(),
        remitente: 'bot',
        texto:
          '¡Conversación reiniciada! ✨ Soy el asistente de **Mercatto**. Pregúntame lo que quieras sobre compras, pagos, envíos, cupones o planes para vendedores.',
        sugerencias: true,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ])
    setVistaActual('chat')
  }

  const enviarPreguntaRapida = (preguntaTexto) => {
    setMensajeInput(preguntaTexto)
    // Disparo inmediato simulando envío
    const e = { preventDefault: () => {} }
    setTimeout(() => {
      handleEnviarMensaje(e, preguntaTexto)
    }, 50)
  }

  // Convierte los asteriscos **texto** en negrita limpia de verdad sin mostrar asteriscos
  const renderizarTextoFormateado = (texto) => {
    if (!texto) return ''
    const partes = texto.split(/(\*\*.*?\*\*)/g)
    return partes.map((parte, i) => {
      if (parte.startsWith('**') && parte.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900 dark:text-white">
            {parte.slice(2, -2)}
          </strong>
        )
      }
      return parte
    })
  }

  if (esRutaPanel) return null

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end pointer-events-none font-sans">
      {/* Ventana de Atención Flotante (Se coloca ARRIBA de la pestañita) */}
      {abierto && (
        <div className="pointer-events-auto mb-2.5 w-[calc(100vw-24px)] sm:w-[400px] h-[560px] max-h-[calc(100dvh-85px)] sm:max-h-[calc(100vh-95px)] bg-white dark:bg-slate-900 rounded-3xl border border-mercatto-border dark:border-slate-800 shadow-2xl shadow-mercatto-dark/25 ring-1 ring-mercatto-primary/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 backdrop-blur-sm">
          
          {/* Header Elegante Degradado */}
          <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-mercatto-dark via-[#2f2766] to-mercatto-dark text-white flex items-center justify-between border-b border-indigo-500/20 shadow-md shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-mercatto-primary to-mercatto-deep text-white flex items-center justify-center font-bold shadow-lg shadow-violet-500/30">
                  <span 
                    className="text-white text-xl sm:text-2xl font-normal leading-none select-none -mt-0.5"
                    style={{ fontFamily: "'Pacifico', 'Caveat', cursive, sans-serif" }}
                  >
                    M
                  </span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">Mercatto Bot</h4>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    IA Activa
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">
                  Asistente Oficial con Gemini
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={reiniciarConversacion}
                className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer text-xs"
                title="Reiniciar conversación"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setVistaActual(vistaActual === 'menu_opciones' ? 'chat' : 'menu_opciones')}
                className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer text-xs"
                title="Guía rápida"
              >
                <HelpCircle size={15} />
              </button>
              <button
                onClick={() => setAbierto(false)}
                className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                title="Minimizar ventana"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Subheader Informativo */}
          <div className="px-4 py-2 bg-mercatto-surface dark:bg-slate-800/80 border-b border-mercatto-border dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
            <span className="text-slate-600 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-mercatto-primary"></span>
              {isEn ? 'Sell with commissions from 2%' : 'Vende con comisiones desde el 2%'}
            </span>
            <Link
              to="/soporte"
              onClick={() => setAbierto(false)}
              className="font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 flex items-center gap-1 text-[11px]"
            >
              <Headphones size={11} />
              <span>{isEn ? 'Support Center' : 'Centro de Soporte'}</span>
            </Link>
          </div>

          {/* Contenido Dinámico: Chat o Menú Temas */}
          {vistaActual === 'menu_opciones' ? (
            /* Vista del Menú de Temas Frecuentes */
            <div className="flex-1 p-4 overflow-y-auto space-y-2.5 bg-mercatto-bg dark:bg-slate-950/40">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Temas Frecuentes
                </span>
                <button
                  onClick={() => setVistaActual('chat')}
                  className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Volver al chat
                </button>
              </div>

              <div className="space-y-2">
                {OPCIONES_GUIA.map((op) => {
                  const Icono = op.icono
                  return (
                    <button
                      key={op.id}
                      onClick={() => seleccionarOpcion(op.id)}
                      className="w-full text-left p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-mercatto-primary/60 hover:shadow-md transition group cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${op.color} shadow-xs`}>
                          <Icono size={18} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {op.titulo}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {op.subtitulo}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={15} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                    </button>
                  )
                })}
              </div>
            </div>
          ) : vistaActual === 'formulario_contacto' ? (
            /* Vista Limpia del Formulario de Solicitud */
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/40">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                      <Mail size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Mensaje para Atención al Cliente</h4>
                      <p className="text-[10px] text-slate-400">Te responderemos directamente a tu correo</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setVistaActual('chat')}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {ticketError && (
                  <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 rounded-xl text-[11px] flex items-center gap-1.5">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{ticketError}</span>
                  </div>
                )}

                <form onSubmit={handleEnviarFormulario} className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Andrés Ramírez"
                      value={formTicket.nombre}
                      onChange={(e) => setFormTicket({ ...formTicket, nombre: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-mercatto-primary outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        Correo electrónico *
                      </label>
                      <input
                        type="email"
                        placeholder="tu@correo.com"
                        value={formTicket.email}
                        onChange={(e) => setFormTicket({ ...formTicket, email: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-mercatto-primary outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        Teléfono / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="300 000 0000"
                        value={formTicket.telefono}
                        onChange={(e) => setFormTicket({ ...formTicket, telefono: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-mercatto-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      ¿En qué te podemos asesorar? *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Escribe tu consulta detallada..."
                      value={formTicket.mensaje}
                      onChange={(e) => setFormTicket({ ...formTicket, mensaje: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-mercatto-primary outline-none resize-none"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={ticketCargando}
                      className="flex-1 py-2.5 bg-mercatto-primary hover:bg-mercatto-deep disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      {ticketCargando ? 'Enviando solicitud...' : 'Enviar Consulta'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setVistaActual('chat')}
                      className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* Vista del Historial de Chat */
            <div
              ref={mensajesContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-mercatto-bg dark:bg-slate-950/50"
            >
              {mensajes.map((m) => {
                const esBot = m.remitente === 'bot'
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${esBot ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[90%]">
                      {esBot && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-mercatto-primary to-mercatto-deep text-white flex items-center justify-center shrink-0 mb-1 shadow-xs">
                          <span 
                            className="text-white text-[12px] font-normal leading-none select-none"
                            style={{ fontFamily: "'Pacifico', 'Caveat', cursive, sans-serif" }}
                          >
                            M
                          </span>
                        </div>
                      )}
                      <div
                        className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-sm text-xs ${
                          esBot
                            ? 'bg-white dark:bg-slate-800 border border-mercatto-border dark:border-slate-700/80 text-mercatto-text dark:text-slate-100 rounded-bl-xs'
                            : 'bg-gradient-to-r from-mercatto-primary to-mercatto-deep text-white rounded-br-xs shadow-violet-500/10'
                        }`}
                      >
                        {renderizarTextoFormateado(m.texto)}

                        {/* Tarjetas de Soporte dentro del mensaje */}
                        {m.esOpcionSoporte && (
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
                            <a
                              href={`https://wa.me/${WHATSAPP_SOPORTE}?text=${MENSAJE_WHATSAPP}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition cursor-pointer shadow-xs"
                            >
                              <div className="flex items-center gap-2">
                                <MessageCircle size={15} />
                                <span>Hablar por WhatsApp</span>
                              </div>
                              <ExternalLink size={12} />
                            </a>

                            <button
                              onClick={() => setVistaActual('formulario_contacto')}
                              className="flex items-center justify-between w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 text-slate-800 dark:text-white font-semibold transition cursor-pointer border border-slate-200 dark:border-slate-600"
                            >
                              <div className="flex items-center gap-2">
                                <Mail size={14} className="text-indigo-600 dark:text-indigo-400" />
                                <span>Dejar solicitud por correo</span>
                              </div>
                              <ChevronRight size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {esBot && m.sugerencias && (
                      <div className="flex flex-wrap gap-1.5 mt-2 ml-8 max-w-[92%]">
                        {SUGERENCIAS_INICIALES.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => seleccionarOpcion(s.id)}
                            className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-mercatto-deep dark:text-violet-300 border border-mercatto-lavender dark:border-slate-700 hover:bg-mercatto-soft hover:border-mercatto-primary text-[11px] font-semibold transition cursor-pointer shadow-xs"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {esBot && m.ofrecerMenu && !m.sugerencias && (
                      <button
                        type="button"
                        onClick={() => setVistaActual('menu_opciones')}
                        className="mt-2 ml-8 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-mercatto-surface dark:bg-slate-800 text-mercatto-deep dark:text-violet-300 border border-mercatto-border dark:border-slate-700 hover:bg-mercatto-soft text-[11px] font-semibold transition cursor-pointer"
                      >
                        <HelpCircle size={12} />
                        <span>Ver más temas</span>
                        <ChevronRight size={12} />
                      </button>
                    )}
                    <span className={`text-[10px] text-slate-400 mt-1 ${esBot ? 'pl-8' : 'pr-1'}`}>{m.hora}</span>
                  </div>
                )
              })}

              {/* Indicador suave de IA Pensando con logo M */}
              {escribiendo && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-mercatto-primary to-mercatto-deep text-white flex items-center justify-center shrink-0 mb-1 shadow-xs">
                    <span 
                      className="text-white text-[12px] font-normal leading-none select-none"
                      style={{ fontFamily: "'Pacifico', 'Caveat', cursive, sans-serif" }}
                    >
                      M
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-xs shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Barra de Acciones y Entrada de Texto */}
          {vistaActual === 'chat' && (
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2.5 shrink-0">
              
              {/* Chips de Preguntas Frecuentes Rápidas */}
              <div
                className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <button
                  type="button"
                  onClick={() => enviarPreguntaRapida('¿Qué planes y comisiones tienen para vendedores?')}
                  className="px-2.5 py-1 rounded-full bg-mercatto-soft dark:bg-violet-950/50 text-mercatto-deep dark:text-violet-300 border border-mercatto-lavender dark:border-violet-800 hover:bg-mercatto-lavender/60 transition whitespace-nowrap cursor-pointer shrink-0"
                >
                  {isEn ? '🏷️ Fees?' : '🏷️ ¿Comisiones?'}
                </button>
                <button
                  type="button"
                  onClick={() => enviarPreguntaRapida('¿Cómo abro mi tienda en Mercatto?')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition whitespace-nowrap cursor-pointer shrink-0"
                >
                  {isEn ? '🏪 Open store' : '🏪 Abrir tienda'}
                </button>
                <button
                  type="button"
                  onClick={() => enviarPreguntaRapida('¿Qué métodos de pago reciben?')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition whitespace-nowrap cursor-pointer shrink-0"
                >
                  {isEn ? '💳 Payment methods' : '💳 Métodos de pago'}
                </button>
                <button
                  type="button"
                  onClick={() => setVistaActual('formulario_contacto')}
                  className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 hover:bg-emerald-100 transition whitespace-nowrap cursor-pointer shrink-0"
                >
                  {isEn ? '📞 Support agent' : '📞 Asesor humano'}
                </button>
              </div>

              {/* Input Moderno Píldora */}
              <form onSubmit={handleEnviarMensaje} className="flex items-center gap-2">
                <input
                  type="text"
                  value={mensajeInput}
                  onChange={(e) => setMensajeInput(e.target.value)}
                  placeholder={isEn ? 'Ask Mercatto Bot...' : 'Pregúntale a Mercatto Bot...'}
                  className="flex-1 text-xs px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-mercatto-surface dark:bg-slate-800 border border-mercatto-border dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-mercatto-primary focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 transition shadow-inner min-w-0"
                />
                <button
                  type="submit"
                  disabled={!mensajeInput.trim()}
                  className="p-2.5 sm:p-3 rounded-full bg-gradient-to-r from-mercatto-primary to-mercatto-deep hover:from-mercatto-deep hover:to-mercatto-deep disabled:opacity-40 text-white transition-all duration-200 cursor-pointer shrink-0 shadow-md shadow-violet-500/25 active:scale-95 hover:scale-105"
                  title="Enviar consulta"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Botón Circular Flotante del Chatbot con M en blanco en estilo Mercatto */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="pointer-events-auto group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-mercatto-primary via-mercatto-primary to-mercatto-deep hover:from-mercatto-deep hover:to-mercatto-deep text-white shadow-xl shadow-violet-600/35 hover:shadow-2xl hover:shadow-violet-600/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer border-2 border-white/30 select-none"
        aria-label={abierto ? "Cerrar chat" : "Abrir asistente Mercatto"}
        title="Mercatto"
      >
        <span 
          className="text-white text-2xl sm:text-2xl font-normal leading-none drop-shadow-sm select-none -mt-0.5"
          style={{ fontFamily: "'Pacifico', 'Caveat', cursive, sans-serif" }}
        >
          M
        </span>
        <span className="absolute top-0 right-0 sm:-top-0.5 sm:-right-0.5 w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 bg-emerald-400 border-2 border-violet-700 rounded-full animate-pulse" />
      </button>
    </div>
  )
}

export default PublicChatbot;
