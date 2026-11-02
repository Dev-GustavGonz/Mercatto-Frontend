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
  Mail,
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

const getOpcionesGuia = (isEn) => [
  {
    id: 'como_comprar',
    titulo: isEn ? 'How to buy on Mercatto?' : '¿Cómo comprar en Mercatto?',
    subtitulo: isEn ? 'Step-by-step guide to place your order' : 'Paso a paso para hacer tu primer pedido',
    icono: ShoppingBag,
    color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
  },
  {
    id: 'medios_pago',
    titulo: isEn ? 'Accepted payment methods' : 'Métodos de pago aceptados',
    subtitulo: isEn ? 'Cards, PSE, Nequi and Cash on Delivery' : 'Tarjetas, PSE, Nequi y Contra Entrega',
    icono: CreditCard,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
  },
  {
    id: 'vender',
    titulo: isEn ? 'How to open your store?' : '¿Cómo abrir mi propia tienda?',
    subtitulo: isEn ? 'Sign up, list items and receive payouts' : 'Registro, publicación de productos y cobros',
    icono: Store,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60'
  },
  {
    id: 'planes',
    titulo: isEn ? 'Seller plans & commissions' : 'Planes y comisiones para vendedores',
    subtitulo: isEn ? 'Starter, Professional and Elite Premium' : 'Starter, Profesional y Elite Premium',
    icono: Sparkles,
    color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60'
  },
  {
    id: 'envios',
    titulo: isEn ? 'Shipping coverage in Colombia' : 'Cobertura de envíos en Colombia',
    subtitulo: isEn ? 'Flat rates and free shipping from $150,000 COP' : 'Costo de envío y envío gratis desde $150.000',
    icono: Truck,
    color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60'
  },
  {
    id: 'cupones',
    titulo: isEn ? 'Active discount coupons' : 'Cupones de descuento activos',
    subtitulo: isEn ? 'MERCATTO10 and BIENVENIDA promo codes' : 'MERCATTO10 y BIENVENIDA',
    icono: Tag,
    color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60'
  },
  {
    id: 'rastreo',
    titulo: isEn ? 'Track your order' : 'Rastrear mi pedido',
    subtitulo: isEn ? 'Check order status and delivery proof' : 'Consulta el estado de tu compra',
    icono: Package,
    color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60'
  },
  {
    id: 'soporte_directo',
    titulo: isEn ? 'Mercatto Customer Support' : 'Atención al Cliente Mercatto',
    subtitulo: isEn ? 'Talk to a customer care or sales specialist' : 'Hablar con un asesor comercial o de soporte',
    icono: Headphones,
    color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60',
    destacado: true
  }
]

const SUGERENCIAS_INICIALES = [
  { id: 'como_comprar', labelEs: 'Cómo comprar', labelEn: 'How to buy', icono: ShoppingBag },
  { id: 'medios_pago', labelEs: 'Medios de pago', labelEn: 'Payment methods', icono: CreditCard },
  { id: 'envios', labelEs: 'Envíos', labelEn: 'Shipping', icono: Truck },
  { id: 'cupones', labelEs: 'Cupones', labelEn: 'Coupons', icono: Tag },
  { id: 'planes', labelEs: 'Vender y planes', labelEn: 'Sell & plans', icono: Sparkles }
]

const RESPUESTAS_BASE_ES = {
  como_comprar:
    '**Comprar en Mercatto es fácil, rápido y 100% seguro:**\n\n• **1. Explora el Catálogo:** Navega entre categorías oficiales o busca tus artículos favoritos.\n• **2. Agrega al Carrito:** Elige la talla, color o variante que prefieras.\n• **3. Compra Fácil:** Puedes comprar con tu cuenta o como **Invitado** indicando solo tu correo, teléfono y dirección de entrega.\n• **4. Paga Seguro:** Mediante pasarela certificada Wompi (Tarjetas, PSE, Nequi) o Pago Contra Entrega en efectivo.\n• **5. Confirmación y Factura:** Recibirás al instante un correo con el comprobante oficial y el enlace para rastrear tu paquete en vivo.',

  medios_pago:
    '**Medios de Pago y Protección de Fondos:**\n\n• **Billeteras Digitales:** Paga al instante desde tu app de **Nequi** o **Daviplata**.\n• **Transferencias PSE:** Débito directo desde cualquier banco de Colombia.\n• **Tarjetas de Crédito y Débito:** Visa, Mastercard y American Express con opción de cuotas.\n• **Pago Contra Entrega (Efectivo):** Pagas en efectivo al momento de recibir el paquete en tu puerta.\n\n**Custodia Mercatto Escrow:** Tu dinero está 100% protegido. El vendedor recibe el desembolso únicamente después de que el pedido sea entregado a tu entera satisfacción.',

  vender:
    '**¿Cómo Vender en Mercatto y Abrir tu Propia Tienda?:**\n\n¡Abrir tu tienda en Mercatto es gratis y toma menos de 2 minutos!\n\n• **1. Regístrate:** Elige el rol **Vendedor** al crear tu cuenta.\n• **2. Configura tu Tienda:** Sube tu logo, portada y descripción de tu marca.\n• **3. Publica tus Productos:** Agrega fotos, tallas/colores, stock y precios.\n• **4. Gestiona tus Ventas:** Panel administrativo completo con analítica de ventas, control de inventario y pedidos en tiempo real.\n\n**Comisión Transparente:** Desde el 2% por venta según el plan que elijas. ¡Sin costos ocultos ni ataduras!',

  planes:
    '**Planes y Comisiones para Vendedores en Mercatto:**\n\n• **Plan Starter ($0 COP/mes):** Sin costo fijo mensual y comisión del **10%** por venta. Ideal para emprendedores que inician.\n• **Plan Profesional ($49.000 COP/mes):** Comisión reducida del **5%** por venta, perfecto para negocios con ventas constantes.\n• **Plan Elite Premium ($99.000 COP/mes):** Comisión mínima del **2%**, insignia Élite de tienda verificada y máxima visibilidad en el catálogo.\n\n*Puedes cambiar o pausar tu plan en cualquier momento desde tu panel de vendedor.*',

  cupones:
    '**Cupones de Descuento Activos en Mercatto:**\n\n• **BIENVENIDA:** **$20.000 COP de descuento** en compras iguales o superiores a $100.000 COP.\n• **MERCATTO10:** **10% de descuento** en artículos seleccionados en compras desde $30.000 COP (ahorro máximo de $50.000 COP).\n\n**¿Cómo aplicarlo?:** Ingresa el código en la casilla *\'Código de cupón\'* en el Carrito o en el Checkout antes de finalizar tu orden.',

  envios:
    '**Política de Envíos y Tiempos de Entrega:**\n\n• **Envío Gratis:** En todas tus compras iguales o superiores a **$150.000 COP** en Colombia.\n• **Tarifa Estándar Fija:** Solo **$12.000 COP** para pedidos menores.\n• **Tiempos de Entrega:**\n  - **Cartagena de Indias:** De 24 a 48 horas hábiles.\n  - **Otras Ciudades de Colombia:** De 48 a 72 horas hábiles.\n• **Transportadoras:** Despachos asegurados con Coordinadora, Servientrega e Interrapidísimo.\n• **Evidencia de Entrega:** El vendedor o repartidor carga una foto de prueba física al momento de la entrega.',

  rastreo:
    '**Rastreo de Pedidos en Tiempo Real:**\n\n• **Si compraste con cuenta:** Ingresa a **Mis Pedidos** desde tu menú de usuario para ver el historial y fotos de entrega.\n• **Si compraste como invitado:** Entra a **Rastrear Pedido** (`/rastreo`) e ingresa tu código de orden (ej: `PED-20261031-1045`) y tu correo electrónico.\n\n*Verás el paso a paso en tiempo real y la foto de evidencia cargada por el vendedor al momento de la entrega.*'
}

const RESPUESTAS_BASE_EN = {
  como_comprar:
    '**Buying on Mercatto is easy, fast, and 100% secure:**\n\n• **1. Browse the Catalog:** Explore verified categories or search for your favorite items.\n• **2. Add to Cart:** Pick your desired size, color, or variant.\n• **3. Easy Checkout:** Shop with your account or as a **Guest** by simply entering your email, phone, and delivery address.\n• **4. Secure Payment:** Handled by certified Wompi gateway (Cards, PSE, Nequi) or Cash on Delivery.\n• **5. Live Tracking:** You will immediately receive order confirmation and a real-time tracking link with delivery photo proof.',

  medios_pago:
    '**Payment Methods & Buyer Protection:**\n\n• **Digital Wallets:** Instant payment through **Nequi** or **Daviplata**.\n• **Bank Transfers (PSE):** Direct debit from any bank in Colombia.\n• **Credit & Debit Cards:** Visa, Mastercard, and American Express with installment options.\n• **Cash on Delivery:** Pay in cash when the courier hands the package at your door.\n\n**Mercatto Escrow Guarantee:** Your funds are 100% protected. Sellers only get paid after your order has been safely delivered to your total satisfaction.',

  vender:
    '**How to Sell on Mercatto & Open Your Store:**\n\nOpening your store on Mercatto is free and takes under 2 minutes!\n\n• **1. Sign Up:** Choose the **Seller** role when registering.\n• **2. Set Up Your Store:** Upload your logo, cover banner, and brand description.\n• **3. List Your Products:** Add pictures, colors/sizes, stock, and prices.\n• **4. Manage Orders:** Full dashboard with live inventory, sales analytics, and order fulfillment.\n\n**Transparent Commission:** From 2% per sale depending on your plan. No hidden fees!',

  planes:
    '**Seller Plans & Commission Rates:**\n\n• **Starter Plan ($0 COP/month):** No monthly fee and **10%** commission per sale. Perfect for new entrepreneurs.\n• **Professional Plan ($49,000 COP/month):** Reduced **5%** commission per sale, great for established businesses.\n• **Elite Premium Plan ($99,000 COP/month):** Minimal **2%** commission, verified Elite badge, and top catalog priority.\n\n*You can upgrade, downgrade, or pause your plan at any time from your seller panel.*',

  cupones:
    '**Active Discount Coupons on Mercatto:**\n\n• **BIENVENIDA:** **$20,000 COP off** on orders of $100,000 COP or more.\n• **MERCATTO10:** **10% off** on selected items for orders over $30,000 COP (max savings $50,000 COP).\n\n**How to redeem:** Enter the code in the *\'Coupon code\'* field in the Cart drawer or at Checkout before completing your order.',

  envios:
    '**Shipping Policy & Delivery Times:**\n\n• **Free Shipping:** On all purchases equal to or over **$150,000 COP** in Colombia.\n• **Flat Shipping Fee:** Only **$12,000 COP** for smaller orders nationwide.\n• **Estimated Delivery Times:**\n  - **Cartagena de Indias:** 24 to 48 business hours.\n  - **Other Major Cities in Colombia:** 48 to 72 business hours.\n• **Couriers:** Insured shipping via Coordinadora, Servientrega, and Interrapidísimo.\n• **Delivery Photo Proof:** Couriers upload a real physical delivery photo upon delivery.',

  rastreo:
    '**Real-Time Order Tracking:**\n\n• **If you have an account:** Go to **My Orders** from your account menu to review tracking status and delivery photos.\n• **If you bought as guest:** Visit **Track Order** (`/rastreo`) and enter your order code (e.g., `PED-20261031-1045`) and email address.\n\n*You can view real-time courier progress and photo proof.*'
}

export const PublicChatbot = () => {
  const { usuario } = useAuth()
  const location = useLocation()
  const { idioma } = useLanguage()
  const isEn = (idioma || '').toUpperCase() === 'EN'

  const [abierto, setAbierto] = useState(false)
  const [mensajeInput, setMensajeInput] = useState('')
  const [vistaActual, setVistaActual] = useState('chat') // 'chat' | 'menu_opciones' | 'formulario_contacto'

  const mensajeBienvenida = isEn
    ? 'Hello! I am **Mercatto Bot**, your virtual shopping assistant in Colombia.\n\nI can help you with purchases, payments, shipping, discount coupons, or opening your own store. Where shall we start?'
    : '¡Hola! Soy el asistente de **Mercatto**, el marketplace multitienda de Colombia.\n\nPuedo ayudarte con compras, pagos, envíos, cupones o con abrir tu propia tienda. ¿Por dónde empezamos?'

  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      remitente: 'bot',
      texto: mensajeBienvenida,
      sugerencias: true,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  // Actualizar bienvenida si cambia el idioma y la conversación apenas inicia
  useEffect(() => {
    setMensajes((prev) => {
      if (prev.length === 1 && prev[0].id === 1) {
        return [
          {
            ...prev[0],
            texto: isEn
              ? 'Hello! I am **Mercatto Bot**, your virtual shopping assistant in Colombia.\n\nI can help you with purchases, payments, shipping, discount coupons, or opening your own store. Where shall we start?'
              : '¡Hola! Soy el asistente de **Mercatto**, el marketplace multitienda de Colombia.\n\nPuedo ayudarte con compras, pagos, envíos, cupones o con abrir tu propia tienda. ¿Por dónde empezamos?',
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]
      }
      return prev
    })
  }, [isEn])

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

  // Scroll suave al final del chat
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

  const opcionesGuia = getOpcionesGuia(isEn)
  const respuestasBase = isEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES

  const seleccionarOpcion = (opcionId) => {
    const opcion = opcionesGuia.find((o) => o.id === opcionId)
    if (!opcion) return

    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

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
            texto: isEn
              ? 'Our **Mercatto Customer Support** team is ready to help you with any inquiry. How would you prefer to connect?'
              : 'Nuestro equipo de **Atención al Cliente Mercatto** está a tu disposición para ayudarte con cualquier inquietud. ¿Cómo prefieres comunicarte?',
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            esOpcionSoporte: true
          }
        ])
        setVistaActual('chat')
      }, 400)
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
          texto: respuestasBase[opcionId] || (isEn ? 'Would you like to ask anything else?' : '¿Deseas consultar alguna otra información?'),
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ofrecerMenu: true
        }
      ])
      setVistaActual('chat')
    }, 450)
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
    if (
      t.includes('soporte') ||
      t.includes('humano') ||
      t.includes('asesor') ||
      t.includes('admin') ||
      t.includes('persona') ||
      t.includes('support') ||
      t.includes('agent') ||
      t.includes('human')
    ) {
      setEscribiendo(false)
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          remitente: 'bot',
          texto: isEn
            ? 'I will gladly connect you with the **Mercatto Customer Support** team. You can chat directly via WhatsApp or send us an inquiry below:'
            : 'Con gusto te comunico con el equipo de **Atención al Cliente Mercatto**. Puedes escribirnos directamente por WhatsApp o dejarnos tu solicitud por mensaje:',
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          esOpcionSoporte: true,
          ofrecerMenu: false
        }
      ])
      return
    }

    try {
      let respuestaIA = ''
      let agenteUsado = ''

      // 1. Intentar con el servicio Multi-Agente del Backend
      try {
        const resIa = await api.post(
          '/ia/chat',
          {
            message: texto,
            mensaje: texto,
            sessionId: sessionId,
            idioma: isEn ? 'en' : 'es'
          },
          { timeout: 25000 }
        )

        const rawReply = resIa?.data?.reply || resIa?.data?.respuesta
        if (rawReply) {
          respuestaIA = rawReply
          agenteUsado = resIa.data.agente
        }
      } catch (errBackendIa) {
        console.warn('Backend IA no disponible o timeout, intentando n8n directo:', errBackendIa)
      }

      // 2. Si no respondió el backend, intentar con n8n webhook directo
      if (!respuestaIA) {
        try {
          const n8nUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/mercatto-chat'
          const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: texto,
              sessionId: sessionId,
              idioma: isEn ? 'en' : 'es'
            })
          })

          if (response.ok) {
            const data = await response.json()
            respuestaIA = data?.reply || data?.output || data?.text
          }
        } catch (errN8n) {
          console.warn('n8n directo falló:', errN8n)
        }
      }

      if (!respuestaIA) {
        throw new Error('Sin respuesta de los agentes')
      }

      setEscribiendo(false)
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          remitente: 'bot',
          texto: respuestaIA,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          esOpcionSoporte: false,
          ofrecerMenu: true,
          agente: agenteUsado
        }
      ])
    } catch {
      setEscribiendo(false)

      let respuesta = ''
      if (t.includes('pago') || t.includes('tarjeta') || t.includes('nequi') || t.includes('banco') || t.includes('pse') || t.includes('pay')) {
        respuesta = respuestasBase.medios_pago
      } else if (t.includes('rastre') || t.includes('seguimiento') || t.includes('estado de mi') || t.includes('track')) {
        respuesta = respuestasBase.rastreo
      } else if (t.includes('comprar') || t.includes('pedido') || t.includes('orden') || t.includes('buy') || t.includes('purchase')) {
        respuesta = respuestasBase.como_comprar
      } else if (t.includes('plan') || t.includes('comision') || t.includes('suscrip') || t.includes('fee')) {
        respuesta = respuestasBase.planes
      } else if (t.includes('vender') || t.includes('tienda') || t.includes('proveedor') || t.includes('sell') || t.includes('store')) {
        respuesta = respuestasBase.vender
      } else if (t.includes('cupon') || t.includes('descuento') || t.includes('promo') || t.includes('coupon')) {
        respuesta = respuestasBase.cupones
      } else if (t.includes('envio') || t.includes('flete') || t.includes('ciudad') || t.includes('despacho') || t.includes('ship')) {
        respuesta = respuestasBase.envios
      } else {
        respuesta = isEn
          ? 'Hello! We are here to help. I can assist you with orders, payment methods, shipping, discount coupons, order tracking, or selling plans (commissions from 2%). What would you like to know?'
          : '¡Hola! En Mercatto estamos para ayudarte. Puedo orientarte sobre compras, métodos de pago, envíos, cupones, rastreo de pedidos o los planes para vender (comisiones desde el 2%). ¿Qué te gustaría saber?'
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
      setTicketError(isEn ? 'Please fill in name, email and message.' : 'Por favor completa nombre, correo y tu consulta.')
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
          texto: isEn
            ? `**Inquiry submitted successfully.**\n\nWe received your request, ${formTicket.nombre}. A member of **Mercatto Customer Support** will review it and reply to **${formTicket.email}** as soon as possible.`
            : `**Solicitud radicada con éxito.**\n\nHemos recibido tu consulta, ${formTicket.nombre}. Un asesor de **Atención al Cliente Mercatto** revisará tu caso y se pondrá en contacto contigo a través de tu correo **${formTicket.email}** a la mayor brevedad.`,
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
      setTicketError(err.response?.data?.message || (isEn ? 'Failed to submit inquiry. Please try again.' : 'No se pudo enviar la solicitud. Por favor intenta de nuevo.'))
    }
  }

  const reiniciarConversacion = () => {
    const nuevoSid = 'session_' + Math.random().toString(36).substring(2, 11)
    sessionStorage.setItem('mercatto_chat_sid', nuevoSid)
    setMensajes([
      {
        id: Date.now(),
        remitente: 'bot',
        texto: isEn
          ? 'Conversation restarted. I am **Mercatto Bot**. Ask me anything about purchases, payments, shipping, coupons, or seller plans.'
          : '¡Conversación reiniciada! Soy el asistente de **Mercatto**. Pregúntame lo que quieras sobre compras, pagos, envíos, cupones o planes para vendedores.',
        sugerencias: true,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ])
    setVistaActual('chat')
  }

  const enviarPreguntaRapida = (preguntaTexto) => {
    setMensajeInput(preguntaTexto)
    const e = { preventDefault: () => {} }
    setTimeout(() => {
      handleEnviarMensaje(e, preguntaTexto)
    }, 50)
  }

  // Convierte los asteriscos **texto** en negrita limpia y remueve emojis ruidosos
  const renderizarTextoFormateado = (texto) => {
    if (!texto) return ''
    // Limpieza de emojis exagerados que quitan estilo minimalista
    const textoLimpio = texto
      .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]/g, '')
      .replace(/[\u2600-\u27BF]/g, '')

    const partes = textoLimpio.split(/(\*\*.*?\*\*)/g)
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

  const mensajeWhatsApp = encodeURIComponent(
    isEn
      ? 'Hello Mercatto! I am browsing the marketplace and would like personalized assistance.'
      : '¡Hola Mercatto! Estoy navegando en el marketplace y requiero asesoría personalizada antes de registrarme.'
  )

  if (esRutaPanel) return null

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end pointer-events-none font-sans max-w-[calc(100vw-1.5rem)]">
      {/* Ventana Flotante del Asistente */}
      {abierto && (
        <div className="pointer-events-auto mb-2.5 w-[calc(100vw-1.5rem)] sm:w-[380px] max-w-full h-[min(510px,calc(100dvh-150px))] sm:h-[min(530px,calc(100dvh-170px))] bg-white dark:bg-slate-900 rounded-3xl border border-mercatto-border dark:border-slate-800 shadow-2xl shadow-mercatto-dark/25 ring-1 ring-mercatto-primary/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 backdrop-blur-sm">
          
          {/* Header Elegante Minimalista */}
          <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-mercatto-dark via-[#2f2766] to-mercatto-dark text-white flex items-center justify-between border-b border-indigo-500/20 shadow-md shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-mercatto-primary to-mercatto-deep text-white flex items-center justify-center font-bold shadow-lg shadow-violet-500/30">
                  <span 
                    className="text-white text-lg sm:text-xl font-normal leading-none select-none -mt-0.5"
                    style={{ fontFamily: "'Pacifico', 'Caveat', cursive, sans-serif" }}
                  >
                    M
                  </span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">Mercatto Bot</h4>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    {isEn ? 'Online' : 'En línea'}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">
                  {isEn ? 'Mercatto Virtual Assistant' : 'Asistente virtual de Mercatto'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={reiniciarConversacion}
                className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer text-xs"
                title={isEn ? 'Restart conversation' : 'Reiniciar conversación'}
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setVistaActual(vistaActual === 'menu_opciones' ? 'chat' : 'menu_opciones')}
                className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer text-xs"
                title={isEn ? 'Help topics' : 'Guía rápida'}
              >
                <HelpCircle size={15} />
              </button>
              <button
                onClick={() => setAbierto(false)}
                className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                title={isEn ? 'Minimize' : 'Minimizar ventana'}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Subheader Informativo */}
          <div className="px-3.5 py-1.5 bg-mercatto-surface dark:bg-slate-800/80 border-b border-mercatto-border dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
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
            <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto overflow-x-hidden space-y-2.5 bg-mercatto-bg dark:bg-slate-950/40">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {isEn ? 'Help Topics' : 'Temas Frecuentes'}
                </span>
                <button
                  onClick={() => setVistaActual('chat')}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {isEn ? 'Back to chat' : 'Volver al chat'}
                </button>
              </div>

              <div className="space-y-2">
                {opcionesGuia.map((op) => {
                  const Icono = op.icono
                  return (
                    <button
                      key={op.id}
                      onClick={() => seleccionarOpcion(op.id)}
                      className="w-full min-w-0 text-left p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-mercatto-primary/60 hover:shadow-md transition group cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${op.color} shadow-xs`}>
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
            /* Vista del Formulario de Solicitud */
            <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto overflow-x-hidden bg-mercatto-bg dark:bg-slate-950/40">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Mail size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {isEn ? 'Message for Customer Support' : 'Mensaje para Atención al Cliente'}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {isEn ? 'We will reply directly to your email' : 'Te responderemos directamente a tu correo'}
                      </p>
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
                      {isEn ? 'Full name *' : 'Nombre completo *'}
                    </label>
                    <input
                      type="text"
                      placeholder={isEn ? 'E.g. John Doe' : 'Ej. Andrés Ramírez'}
                      value={formTicket.nombre}
                      onChange={(e) => setFormTicket({ ...formTicket, nombre: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-mercatto-primary outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        {isEn ? 'Email address *' : 'Correo electrónico *'}
                      </label>
                      <input
                        type="email"
                        placeholder="user@example.com"
                        value={formTicket.email}
                        onChange={(e) => setFormTicket({ ...formTicket, email: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-mercatto-primary outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        {isEn ? 'Phone / WhatsApp' : 'Teléfono / WhatsApp'}
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
                      {isEn ? 'How can we help you? *' : '¿En qué te podemos asesorar? *'}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={isEn ? 'Write your inquiry...' : 'Escribe tu consulta detallada...'}
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
                      {ticketCargando ? (isEn ? 'Sending...' : 'Enviando solicitud...') : (isEn ? 'Submit inquiry' : 'Enviar Consulta')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setVistaActual('chat')}
                      className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                    >
                      {isEn ? 'Cancel' : 'Cancelar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* Vista del Historial de Chat */
            <div
              ref={mensajesContainerRef}
              className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto overflow-x-hidden space-y-3.5 text-xs bg-mercatto-bg dark:bg-slate-950/50"
            >
              {mensajes.map((m) => {
                const esBot = m.remitente === 'bot'
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${esBot ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[92%] min-w-0">
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
                        className={`p-3 sm:p-3.5 min-w-0 break-words rounded-2xl leading-relaxed whitespace-pre-line shadow-sm text-xs ${
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
                              href={`https://wa.me/${WHATSAPP_SOPORTE}?text=${mensajeWhatsApp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition cursor-pointer shadow-xs"
                            >
                              <div className="flex items-center gap-2">
                                <Headphones size={15} />
                                <span>{isEn ? 'Chat via WhatsApp' : 'Hablar por WhatsApp'}</span>
                              </div>
                              <ExternalLink size={12} />
                            </a>

                            <button
                              onClick={() => setVistaActual('formulario_contacto')}
                              className="flex items-center justify-between w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 text-slate-800 dark:text-white font-semibold transition cursor-pointer border border-slate-200 dark:border-slate-600"
                            >
                              <div className="flex items-center gap-2">
                                <Mail size={14} className="text-indigo-600 dark:text-indigo-400" />
                                <span>{isEn ? 'Leave request by email' : 'Dejar solicitud por correo'}</span>
                              </div>
                              <ChevronRight size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {esBot && m.sugerencias && (
                      <div className="flex flex-wrap gap-1.5 mt-2 ml-0 sm:ml-8 max-w-full">
                        {SUGERENCIAS_INICIALES.map((s) => {
                          const Icono = s.icono
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => seleccionarOpcion(s.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-mercatto-deep dark:text-violet-300 border border-mercatto-lavender dark:border-slate-700 hover:bg-mercatto-soft hover:border-mercatto-primary text-[11px] font-semibold transition cursor-pointer shadow-xs"
                            >
                              <Icono size={12} className="text-violet-600 dark:text-violet-400 shrink-0" />
                              <span>{isEn ? s.labelEn : s.labelEs}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                    {esBot && m.ofrecerMenu && !m.sugerencias && (
                      <button
                        type="button"
                        onClick={() => setVistaActual('menu_opciones')}
                        className="mt-2 ml-0 sm:ml-8 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-mercatto-surface dark:bg-slate-800 text-mercatto-deep dark:text-violet-300 border border-mercatto-border dark:border-slate-700 hover:bg-mercatto-soft text-[11px] font-semibold transition cursor-pointer"
                      >
                        <HelpCircle size={12} />
                        <span>{isEn ? 'More help topics' : 'Ver más temas'}</span>
                        <ChevronRight size={12} />
                      </button>
                    )}
                    <span className={`text-[10px] text-slate-400 mt-1 ${esBot ? 'pl-0 sm:pl-8' : 'pr-1'}`}>{m.hora}</span>
                  </div>
                )
              })}

              {/* Indicador suave de IA Pensando */}
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
            <div className="p-2.5 sm:p-3 min-w-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
              
              {/* Chips de Preguntas Rápidas Minimalistas (con iconos limpios, sin emojis) */}
              <div
                className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 text-[11px]"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <button
                  type="button"
                  onClick={() => enviarPreguntaRapida(isEn ? 'What are your seller plans and fees?' : '¿Qué planes y comisiones tienen para vendedores?')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-mercatto-soft dark:bg-violet-950/50 text-mercatto-deep dark:text-violet-300 border border-mercatto-lavender dark:border-violet-800 hover:bg-mercatto-lavender/60 transition whitespace-nowrap cursor-pointer shrink-0 font-medium"
                >
                  <Tag size={11} className="text-violet-600 dark:text-violet-400 shrink-0" />
                  <span>{isEn ? 'Fees & Plans' : 'Comisiones'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => enviarPreguntaRapida(isEn ? 'How do I open my store on Mercatto?' : '¿Cómo abro mi tienda en Mercatto?')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition whitespace-nowrap cursor-pointer shrink-0 font-medium"
                >
                  <Store size={11} className="text-slate-500 shrink-0" />
                  <span>{isEn ? 'Open store' : 'Abrir tienda'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => enviarPreguntaRapida(isEn ? 'What payment methods do you accept?' : '¿Qué métodos de pago reciben?')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition whitespace-nowrap cursor-pointer shrink-0 font-medium"
                >
                  <CreditCard size={11} className="text-slate-500 shrink-0" />
                  <span>{isEn ? 'Payment methods' : 'Métodos de pago'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVistaActual('formulario_contacto')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 hover:bg-emerald-100 transition whitespace-nowrap cursor-pointer shrink-0 font-medium"
                >
                  <Headphones size={11} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{isEn ? 'Live support' : 'Asesor humano'}</span>
                </button>
              </div>

              {/* Input Minimalista Píldora */}
              <form onSubmit={handleEnviarMensaje} className="flex items-center gap-2">
                <input
                  type="text"
                  value={mensajeInput}
                  onChange={(e) => setMensajeInput(e.target.value)}
                  placeholder={isEn ? 'Ask Mercatto Bot...' : 'Pregúntale a Mercatto Bot...'}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-full bg-mercatto-surface dark:bg-slate-800 border border-mercatto-border dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-mercatto-primary focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 transition shadow-inner min-w-0"
                />
                <button
                  type="submit"
                  disabled={!mensajeInput.trim()}
                  className="p-2.5 rounded-full bg-gradient-to-r from-mercatto-primary to-mercatto-deep hover:from-mercatto-deep hover:to-mercatto-deep disabled:opacity-40 text-white transition-all duration-200 cursor-pointer shrink-0 shadow-md shadow-violet-500/25 active:scale-95 hover:scale-105"
                  title={isEn ? 'Send message' : 'Enviar consulta'}
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Botón Circular Flotante del Chatbot */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="pointer-events-auto group relative w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-full bg-gradient-to-tr from-mercatto-primary via-mercatto-primary to-mercatto-deep hover:from-mercatto-deep hover:to-mercatto-deep text-white shadow-xl shadow-violet-600/35 hover:shadow-2xl hover:shadow-violet-600/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer border-2 border-white/30 select-none"
        aria-label={abierto ? (isEn ? 'Close assistant' : 'Cerrar asistente') : (isEn ? 'Open Mercatto assistant' : 'Abrir asistente Mercatto')}
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

export default PublicChatbot
