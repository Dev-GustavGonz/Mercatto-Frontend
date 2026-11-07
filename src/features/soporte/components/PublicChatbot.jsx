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
    id: 'como_funciona',
    titulo: isEn ? 'How does Mercatto work?' : '¿Cómo funciona Mercatto?',
    subtitulo: isEn ? 'Everything you need to know about our marketplace' : 'Conoce qué es Mercatto para comprar y vender',
    icono: HelpCircle,
    color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
  },
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
    id: 'tickets_soporte',
    titulo: isEn ? 'How to submit a support ticket?' : '¿Cómo radicar un ticket de soporte?',
    subtitulo: isEn ? 'Step-by-step guide to report issues or warranties' : 'Reportar incidencias, garantías y dudas',
    icono: Mail,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60'
  },
  {
    id: 'devoluciones_garantias',
    titulo: isEn ? 'Warranties & Return Policy' : 'Garantías y devoluciones',
    subtitulo: isEn ? 'Buyer Escrow protection and refunds' : 'Protección al comprador y reembolsos',
    icono: AlertCircle,
    color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60'
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
  { id: 'como_funciona', labelEs: '¿Cómo funciona?', labelEn: 'How it works?', icono: HelpCircle },
  { id: 'como_comprar', labelEs: 'Cómo comprar', labelEn: 'How to buy', icono: ShoppingBag },
  { id: 'tickets_soporte', labelEs: 'Tickets de soporte', labelEn: 'Support tickets', icono: Mail },
  { id: 'devoluciones_garantias', labelEs: 'Garantías', labelEn: 'Warranties', icono: AlertCircle },
  { id: 'medios_pago', labelEs: 'Medios de pago', labelEn: 'Payment methods', icono: CreditCard },
  { id: 'envios', labelEs: 'Envíos', labelEn: 'Shipping', icono: Truck },
  { id: 'cupones', labelEs: 'Cupones', labelEn: 'Coupons', icono: Tag },
  { id: 'planes', labelEs: 'Vender y planes', labelEn: 'Sell & plans', icono: Sparkles }
]

const obtenerRespuestaVariada = (elemento) => {
  if (!elemento) return ''
  if (Array.isArray(elemento)) {
    if (elemento.length === 0) return ''
    const idx = Math.floor(Math.random() * elemento.length)
    return elemento[idx]
  }
  return String(elemento)
}

const SALUDOS_VARIADOS_ES = [
  '¡Hola! Qué gusto saludarte. Soy el asistente oficial de Mercatto. ¿En qué te puedo colaborar hoy con tus compras o tu tienda?',
  '¡Hola! Bienvenido a Mercatto Colombia. Con gusto te asisto con información de productos, medios de pago, envíos o ventas. ¿Qué necesitas saber?',
  '¡Buenas! Me alegra saludarte. Estoy aquí para resolver tus dudas sobre compras, pedidos o apertura de tienda en Mercatto. ¿Cómo te ayudo?',
  '¡Hola! Te doy la bienvenida a Mercatto. Cuéntame, ¿buscas algún producto en especial o deseas consultar sobre despachos o pagos?'
]

const SALUDOS_VARIADOS_EN = [
  "Hello! Great to connect with you. I am Mercatto's official virtual assistant. How can I help you today with your orders or store?",
  "Welcome to Mercatto Colombia! I'm happy to assist you with products, payments, shipping, or seller inquiries. What can I do for you?",
  "Hi there! Glad to assist you today. I can guide you through checkout, tracking your packages, or setting up a seller account. How may I help?",
  "Hello! Welcome to Mercatto. Tell me, are you looking for a specific item, or would you like details on shipping and payment options?"
]

const MENSAJE_RESTRICCION_SEGURIDAD_ES =
  'Lo siento, no puedo proporcionar información interna, técnica o privada de la aplicación. Mi función es ayudarte a conocer sus funcionalidades y orientarte sobre cómo utilizarla.'

const MENSAJE_RESTRICCION_SEGURIDAD_EN =
  'I am sorry, I cannot provide internal, technical, or private information about the application. My role is to help you learn about its features and guide you on how to use it.'

const esConsultaTecnicaOPrivada = (texto) => {
  if (!texto) return false
  const t = texto.toLowerCase()
  return (
    t.includes('codigo fuente') ||
    t.includes('código fuente') ||
    t.includes('source code') ||
    t.includes('base de datos') ||
    t.includes('database') ||
    t.includes('schema') ||
    t.includes('sql') ||
    t.includes('postgresql') ||
    t.includes('supabase') ||
    t.includes('tabla ') ||
    t.includes('tablas') ||
    t.includes('credencial') ||
    t.includes('api key') ||
    t.includes('apikey') ||
    t.includes('token') ||
    t.includes('password') ||
    t.includes('contraseña') ||
    t.includes('endpoint') ||
    t.includes('ruta interna') ||
    t.includes('servidor') ||
    t.includes('server') ||
    t.includes('infraestructura') ||
    t.includes('arquitectura interna') ||
    t.includes('logica de negocio') ||
    t.includes('lógica de negocio') ||
    t.includes('algoritmo') ||
    t.includes('prompt del sistema') ||
    t.includes('system prompt') ||
    t.includes('instrucciones internas') ||
    t.includes('configuracion del agente') ||
    t.includes('como estas programado') ||
    t.includes('cómo estás programado') ||
    t.includes('muestrame el codigo') ||
    t.includes('muéstrame el código') ||
    t.includes('ver el codigo') ||
    t.includes('dame el codigo') ||
    t.includes('dame la api') ||
    t.includes('dame la clave')
  )
}

const DISCULPAS_FUERA_DE_TEMA_ES = [
  'Lo siento, no estoy programado para responder esa pregunta. Mi función es orientarte sobre el uso, compras, ventas y servicios de Mercatto. ¿En qué te puedo ayudar sobre la plataforma?',
  'Disculpa, no estoy programado para responder sobre ese tema. Como asesor virtual de Mercatto, puedo ayudarte a realizar compras, consultar métodos de pago o abrir tu propia tienda. ¿Qué te gustaría saber sobre la tienda?',
  'Lo siento, no puedo responder esa pregunta ya que está fuera de mis funciones. Estoy capacitado exclusivamente para atender consultas sobre el marketplace de Mercatto. ¿Deseas consultar sobre compras, envíos o cupones?',
  'Soy el asistente virtual de esta aplicación y estoy aquí para ayudarte con información sobre sus servicios y funcionalidades. ¿Qué te gustaría conocer sobre la plataforma?',
  'Disculpa la molestia, pero no tengo respuestas sobre ese asunto. Mi propósito es orientarte sobre el uso y los beneficios de Mercatto. ¿Te puedo colaborar con alguna duda sobre la plataforma?',
  'Lo siento, esa pregunta no está relacionada con la plataforma. Con gusto te asisto con información de productos, despachos en Colombia o registro de vendedores. ¿En qué te colaboro?'
]

const DISCULPAS_FUERA_DE_TEMA_EN = [
  "I'm sorry, I am not programmed to answer that question. My role is to help you with information about products, orders, payments, shipping, and stores on Mercatto. What would you like to know about the platform?",
  "I apologize, I am not programmed to respond to that topic. As Mercatto's virtual assistant, I can guide you through purchases, payment methods, or opening your own store. How may I assist you?",
  "I am the official virtual assistant of this application and I am here to help you with information about its services and features. What would you like to know about the platform?",
  "I'm sorry, that question is outside my programming. I am strictly designed to assist with Mercatto marketplace inquiries. Would you like details on orders, shipping, or coupons?",
  "I apologize, but I do not have answers on that subject. My sole focus is to assist you with Mercatto services, shopping, and seller features in Colombia. How can I help you today?"
]

const SOPORTE_VARIADO_ES = [
  'Nuestro equipo de **Atención al Cliente Mercatto** está disponible de lunes a sábado de 8:00 a.m. a 7:00 p.m. para resolver cualquier duda o acompañarte en tus compras.',
  'En **Mercatto** contamos con canales dedicados de soporte y postventa para que compres o vendas con total tranquilidad. ¿Cómo prefieres comunicarte?',
  '¡Con gusto te conecto con un asesor de Mercatto! Nuestro equipo humano está atento para atender tus solicitudes o dudas especiales.'
]

const SOPORTE_VARIADO_EN = [
  'Our **Mercatto Customer Support** team is available Monday through Saturday from 8:00 AM to 7:00 PM to help with any question or order support.',
  'At **Mercatto**, we offer dedicated human support and sales advisory so you can buy and sell with complete confidence. How would you like to get in touch?',
  'I will gladly connect you with a Mercatto specialist! Our human team is ready to assist you with your orders and inquiries.'
]

const RESPUESTAS_BASE_ES = {
  como_funciona: [
    '**¿Cómo funciona Mercatto? — Tu Marketplace Multitienda en Colombia:**\n\nMercatto conecta a compradores con tiendas y emprendedores verificados en un ecosistema ágil y 100% seguro:\n\n• **Para Compradores:**\n  1. **Explora el Catálogo:** Descubre miles de artículos en Tecnología, Moda, Calzado, Hogar y Belleza.\n  2. **Compra Fácil:** Puedes comprar con tu cuenta o como **Invitado** indicando solo tu correo, teléfono y dirección de entrega.\n  3. **Pagos 100% Protegidos:** Mediante pasarela certificada Wompi Bancolombia (Tarjetas, PSE, Nequi, Daviplata) o **Pago Contra Entrega** en efectivo en tu puerta.\n  4. **Custodia Mercatto Escrow:** Tu dinero está en custodia segura y solo se libera a la tienda una vez que recibes tu pedido a entera satisfacción.\n  5. **Envíos y Rastreo:** Envíos a toda Colombia (¡gratis desde $150.000 COP!), seguimiento en vivo 24/7 y foto física como prueba de entrega.\n\n• **Para Vendedores:**\n  1. **Abre tu Tienda en 2 Minutos:** Regístrate gratis como vendedor y personaliza tu marca.\n  2. **Registro de Cuenta Bancaria:** Para activar o cambiar cualquier membresía, es obligatorio ingresar tu número de cuenta bancaria y banco donde se liquidarán ventas y se cobrará la suscripción.\n  3. **Comisiones Competitivas:** Starter al 6% ($0/mes), Profesional al 3% ($49.000 COP/mes) o Elite Premium al 1% ($99.000 COP/mes).\n  4. **Control Total:** Panel administrativo completo con analítica de ventas y control de inventario en tiempo real.\n\n*¿Deseas saber más sobre métodos de pago, cómo abrir tu propia tienda o rastrear una compra?*',
    '**Mercatto en pocas palabras — La plataforma multitienda líder:**\n\n• **Compras 100% Seguras:** Pagas con PSE, Nequi, tarjetas de crédito/débito o en efectivo al recibir (Contra Entrega). Tu dinero queda bajo custodia Escrow hasta que el paquete llega a tus manos con evidencia fotográfica.\n• **Logística Asegurada:** Despachos a nivel nacional con flete fijo de $12.000 COP y **Envío Gratis** desde $150.000 COP.\n• **Oportunidad para Vendedores:** Abre tu tienda online con comisiones hipercompetitivas: Starter (6%), Profesional (3%) y Elite (1%). Los vendedores deben vincular previamente su número de cuenta bancaria para el débito de la suscripción.\n\n¿Te gustaría que te oriente sobre cómo realizar un pedido, los medios de pago o cómo registrar tu tienda?',
    '**Todo sobre Mercatto de un vistazo:**\n\nSomos el marketplace que reúne a las mejores marcas y emprendimientos colombianos con compradores en todo el territorio nacional.\n\n1. **Compradores:** Compras con pasarela bancaria o contra entrega, entregas rápidas y garantía total de devolución.\n2. **Vendedores:** Panel de control, analítica predictiva de ingresos y comisiones reducidas (6% Starter, 3% Pro y 1% Elite) previa inscripción de su cuenta bancaria de facturación.\n\n¿Tienes alguna duda puntual sobre compras, envíos o ventas?',
    '**Mercatto: Comercio electrónico transparente y confiable:**\n\nNuestra plataforma garantiza una experiencia ágil tanto para clientes como para comerciantes:\n\n• Los compradores disfrutan de protección de fondos Escrow, soporte por tickets y rastreo en tiempo real.\n• Los comercios disfrutan de visibilidad nacional, bajas tasas por venta (Starter 6%, Pro 3%, Elite 1%) y cobro seguro de suscripción mediante cuenta bancaria registrada.\n\n¿En qué proceso te podemos ayudar en este momento?'
  ],

  como_comprar: [
    '**¡Comprar en Mercatto es muy fácil y 100% seguro! Sigue estos sencillos pasos:**\n\n1. **Busca tus artículos:** Explora las categorías en el menú superior (Moda, Tecnología, Calzado, Hogar) o usa la barra de búsqueda.\n2. **Elige variantes:** Selecciona tu talla, color o modelo y presiona **"Agregar al Carrito"** o **"Comprar Ahora"**.\n3. **Compra con cuenta o como Invitado:** No es obligatorio registrar contraseña; puedes tramitar tu pedido como invitado ingresando tu correo, teléfono y dirección de entrega en Colombia.\n4. **Elige tu método de pago:** Paga en línea mediante pasarela segura Wompi (Tarjetas, PSE, Nequi, Daviplata) o en efectivo con **Pago Contra Entrega** al recibir en tu puerta.\n5. **Garantía y Rastreo:** Tu dinero queda protegido bajo custodia Escrow hasta que recibes tu pedido a conformidad con foto de evidencia.\n\n*¿Buscas alguna categoría o artículo en especial para ayudarte a encontrarlo?*',
    '**¿Quieres hacer una compra? Aquí te explico qué hacer paso a paso:**\n\n• **1. Encuentra lo que te gusta:** Navega por nuestro catálogo multitienda.\n• **2. Revisa tu Carrito:** Haz clic en *Proceder al Pago*.\n• **3. Datos de Envío:** Escribe la dirección donde deseas recibir en Colombia (¡envío gratis en órdenes desde $150.000 COP!).\n• **4. Paga Seguro:** Usa PSE, Nequi, tarjeta o selecciona Pago Contra Entrega en efectivo.\n• **5. Seguimiento:** Al instante te llegará tu comprobante al correo con el código de orden para rastrear el despacho en vivo en `/rastreo`.\n\n¿Deseas saber más sobre medios de pago o tiempos de entrega?',
    '**Guía rápida para realizar tu pedido en Mercatto:**\n\n1. Selecciona el artículo que te interese y haz clic en *Agregar al Carrito* o *Comprar Ahora*.\n2. Si no tienes cuenta, ¡no te preocupes! Puedes tramitar la orden como **Invitado** ingresando tus datos de entrega.\n3. Escoge tu medio de pago favorito: PSE, Nequi, tarjetas o Contra Entrega.\n4. Al confirmar la compra te llegará un correo con el identificador único para monitorear el estado del despacho en tiempo real.',
    '**Paso a paso para adquirir tus productos favoritos:**\n\n• Agrega los productos a tu bolsa de compras.\n• Ve al checkout y diligencia la dirección de entrega en cualquier ciudad de Colombia.\n• Selecciona tu método de pago preferido (Tarjetas bancarias, PSE, Nequi o Pago Contra Entrega en efectivo).\n• Recibe tu código de guía y realiza el seguimiento minuto a minuto con fotografía de entrega garantizada.'
  ],

  medios_pago: [
    '**Medios de Pago y Protección de Fondos:**\n\n• **Billeteras Digitales:** Paga al instante desde tu app de **Nequi** o **Daviplata**.\n• **Transferencias PSE:** Débito directo desde cualquier banco de Colombia.\n• **Tarjetas de Crédito y Débito:** Visa, Mastercard y American Express con opción de cuotas.\n• **Pago Contra Entrega (Efectivo):** Pagas en efectivo al momento de recibir el paquete en tu puerta.\n\n**Custodia Mercatto Escrow:** Tu dinero está 100% protegido. El vendedor recibe el desembolso únicamente después de que el pedido sea entregado a tu entera satisfacción.',
    '**Opciones de pago seguras en Mercatto:**\n\nAceptamos pagos electrónicos mediante pasarela bancaria certificada Wompi (tarjetas de crédito, débito, PSE y Nequi), además de **Pago Contra Entrega** en efectivo en las principales ciudades.\n\nTu dinero permanece resguardado por el sistema de custodia Mercatto hasta que recibes tu paquete conforme.',
    '**¿Cómo pagar tu orden en Mercatto?:**\n\nDispones de múltiples alternativas:\n1. **Wompi Bancolombia:** PSE, transferencias interbancarias, cuentas de ahorro y tarjetas Visa/Mastercard.\n2. **Billeteras móviles:** Nequi y Daviplata con notificación inmediata.\n3. **Contra Entrega:** Cancela en efectivo al mensajero en la comodidad de tu domicilio.\n\nTodas las transacciones en línea cuentan con cifrado TLS y protocolo 3D Secure.',
    '**Flexibilidad y seguridad en tus pagos:**\n\nPuedes abonar de forma digital inmediata o elegir contraentrega en efectivo. Lo mejor: con la garantía Mercatto Escrow tu dinero no se le desembolsa a la tienda hasta que verifiques la llegada de tu producto.'
  ],

  vender: [
    '**¿Cómo Vender en Mercatto y Abrir tu Propia Tienda?:**\n\n¡Abrir tu tienda en Mercatto es muy fácil! Sigue estos pasos:\n\n• **1. Regístrate:** Elige el rol **Vendedor** al crear tu cuenta.\n• **2. Vincula tu Cuenta Bancaria:** Por seguridad y facturación de la suscripción, debes ingresar tu número de cuenta bancaria y banco antes de seleccionar tu membresía.\n• **3. Elige tu Plan:**\n  - **Starter:** $0/mes, comisión del **6%** por venta.\n  - **Profesional:** $49.000 COP/mes, comisión del **3%** por venta.\n  - **Elite Premium:** $99.000 COP/mes, comisión de solo el **1%** por venta.\n• **4. Publica tus Productos:** Agrega fotos, descripciones, stock y precios.\n• **5. Gestiona tus Ventas:** Panel administrativo con inventario, despacho y analítica predictiva de ingresos.',
    '**Emprende y vende a nivel nacional con Mercatto:**\n\nSolo requieres registrarte como **Vendedor**, registrar la cuenta bancaria donde se te desembolsarán las ventas y se facturará tu suscripción, y seleccionar el plan que mejor se adapte a tu volumen (Starter 6%, Pro 3% o Elite 1%). Dispondrás de soporte dedicado, logística integrada y analítica en tiempo real.',
    '**Requisitos y pasos para abrir tu tienda hoy:**\n\n1. Crea tu cuenta con perfil Vendedor.\n2. Completa los datos de tu comercio y registra el número de cuenta bancaria donde se debitará la suscripción y recibirás tus pagos.\n3. Selecciona tu plan de membresía (Starter 6%, Pro 3% o Elite 1%).\n4. Empieza a cargar tu catálogo y recibe pedidos de compradores de toda Colombia.',
    '**¿Por qué vender en Mercatto?:**\n\nOfrecemos las tasas de comisión más bajas de Colombia (6% Starter, 3% Profesional y 1% Elite Premium), pasarela de pagos integrada, protección de fondos y logística automatizada. Solo necesitas tu cuenta bancaria activa para iniciar.'
  ],

  planes: [
    '**Planes y Comisiones para Vendedores en Mercatto:**\n\n• **Plan Starter ($0 COP/mes):** Sin costo fijo mensual y comisión del **6%** por venta exitosa. Ideal para nuevos emprendedores.\n• **Plan Profesional ($49.000 COP/mes):** Comisión reducida al **3%** por venta, perfecto para tiendas en crecimiento constante.\n• **Plan Elite Premium ($99.000 COP/mes):** Comisión mínima del **1%** por venta, insignia verificada de tienda oficial y máxima exposición en el catálogo.\n\n> **Requisito obligatorio:** Para seleccionar o activar cualquier plan, el vendedor debe registrar previamente su número de cuenta bancaria y entidad bancaria para la facturación y cobro automático de la suscripción.\n\n*Puedes gestionar o cambiar tu plan en cualquier momento desde tu panel de vendedor.*',
    '**Tarifas y membresías de tienda Mercatto:**\n\nOfrecemos 3 niveles:\n1. **Starter:** $0 cuota mensual y **6%** de comisión por venta.\n2. **Profesional:** $49.000 COP/mes y solo **3%** de comisión.\n3. **Elite Premium:** $99.000 COP/mes con la tasa más baja: solo **1%** de comisión.\n\n*Nota:* Antes de escoger el plan, el sistema te solicitará ingresar el número de cuenta bancaria en el que se debitará la cuota de la suscripción.',
    '**Comisiones actualizadas de Mercatto:**\n\n• Starter: **6%** por transacción.\n• Pro: **3%** por transacción.\n• Elite: **1%** por transacción.\n\nRecuerda que antes de activar el plan debes tener cargada tu cuenta bancaria en el formulario de membresía para habilitar el cobro correspondiente.',
    '**Estructura de suscripción para vendedores:**\n\nElige entre Starter (6% comisión, $0/mes), Profesional (3% comisión, $49.000 COP/mes) y Elite Premium (1% comisión, $99.000 COP/mes). El alta o cambio de plan exige el registro formal del número de cuenta bancaria del titular del comercio.'
  ],

  cupones: [
    '**Cupones de Descuento Activos en Mercatto:**\n\n• **BIENVENIDA:** **$20.000 COP de descuento** en compras iguales o superiores a $100.000 COP.\n• **MERCATTO10:** **10% de descuento** en artículos seleccionados en compras desde $30.000 COP (ahorro máximo de $50.000 COP).\n\n**¿Cómo aplicarlo?:** Ingresa el código en la casilla *"Código de cupón"* en el Carrito o en el Checkout antes de finalizar tu orden.',
    '**Promociones y códigos vigentes:**\n\nUsa **BIENVENIDA** para ahorrar $20.000 COP en pedidos superiores a $100.000 COP, o **MERCATTO10** para obtener 10% de descuento en referencias seleccionadas. Recuerda escribirlo en el campo de cupón durante el checkout.',
    '**Ahorra en tus compras con cupones Mercatto:**\n\nActualmente disponemos de:\n1. **BIENVENIDA**: Te rebaja $20.000 COP en compras mayores a $100.000 COP.\n2. **MERCATTO10**: Te brinda un 10% de descuento en referencias participantes a partir de $30.000 COP.\n\n¡Aprovéchalos antes de culminar tu compra!',
    '**Descuentos especiales disponibles:**\n\nPuedes redimir los cupones **BIENVENIDA** ($20.000 COP de rebaja en órdenes de $100.000+) y **MERCATTO10** (10% de ahorro directo). Solo digítalos en la pantalla de pago.'
  ],

  envios: [
    '**Política de Envíos y Tiempos de Entrega:**\n\n• **Envío Gratis:** En todas tus compras iguales o superiores a **$150.000 COP** en Colombia.\n• **Tarifa Estándar Fija:** Solo **$12.000 COP** para pedidos menores.\n• **Tiempos de Entrega:**\n  - **Cartagena de Indias:** De 24 a 48 horas hábiles.\n  - **Otras Ciudades de Colombia:** De 48 a 72 horas hábiles.\n• **Transportadoras:** Despachos asegurados con Coordinadora, Servientrega e Interrapidísimo.\n• **Evidencia de Entrega:** El transportista carga una foto de prueba física al momento de la entrega.',
    '**Cobertura y despacho a nivel nacional:**\n\nContamos con entregas en toda Colombia (24-48 horas en Cartagena y 48-72 horas en el resto de ciudades). En pedidos desde $150.000 COP el envío es completamente gratuito, y para órdenes inferiores la tarifa plana es de solo $12.000 COP.',
    '**Tiempos de entrega y transportadoras:**\n\nTrabajamos con las mejores empresas logísticas del país (Coordinadora, Servientrega, Interrapidísimo). Los despachos tardan entre 1 y 3 días hábiles y cuentan con foto de evidencia al ser entregados.',
    '**Tarifas de flete y despacho:**\n\nDisfruta de flete totalmente gratis por compras desde $150.000 COP. Si el total es inferior, el envío a cualquier rincón de Colombia cuesta únicamente $12.000 COP.'
  ],

  rastreo: [
    '**Rastreo de Pedidos en Tiempo Real:**\n\n• **Si compraste con cuenta:** Ingresa a **Mis Pedidos** desde tu menú de usuario para ver el historial y fotos de entrega.\n• **Si compraste como invitado:** Entra a **Rastrear Pedido** (`/rastreo`) e ingresa tu código de orden (ej: `PED-20261031-1045`) y tu correo electrónico.\n\n*Verás el paso a paso en tiempo real y la foto de evidencia cargada por el vendedor al momento de la entrega.*',
    '**Sigue el estado de tu compra:**\n\nPuedes consultar el progreso en vivo desde la sección **/rastreo** digitando tu número de orden y correo, o desde el panel de **Mis Pedidos** si tienes cuenta. El transportista además sube una fotografía física al confirmar la entrega.',
    '**¿Dónde viene mi paquete?:**\n\nConsulta en tiempo real en la página de rastreo de Mercatto con tu número de pedido y correo. Podrás observar la fase actual (Confirmado, En preparación, En camino, Entregado) y la constancia fotográfica.',
    '**Monitoreo 24/7 de tus envíos:**\n\nCada orden genera una guía rastreable automáticamente. Puedes revisar el estado de tu envío en la opción *Rastrear Pedido* de la cabecera en cualquier momento del día.'
  ],

  contraentrega: [
    '**Pago Contra Entrega en Efectivo:**\n\n• **¿En qué consiste?:** Pagas el valor total de tu orden en efectivo directamente al mensajero cuando llegue a tu puerta.\n• **Cobertura:** Disponible para las principales ciudades y municipios de Colombia.\n• **Seguridad:** No requieres tarjetas bancarias ni claves por internet. Solo asegúrate de tener el dinero en efectivo disponible al momento del arribo del transportista.',
    '**¿Cómo funciona el pago contra entrega?:**\n\nAl finalizar tu compra en el checkout, selecciona la opción **Pago Contra Entrega**. El pedido se despacha a tu dirección y cancelas en efectivo una vez que el mensajero te entregue el paquete en mano.',
    '**Beneficios de comprar contraentrega:**\n\n1. Pagas únicamente cuando el paquete está físicamente en tu puerta.\n2. Ideal si prefieres no utilizar tarjetas bancarias por internet.\n3. Despacho rápido y seguro con las principales transportadoras de Colombia.',
    '**Disponibilidad de Pago Contra Entrega:**\n\nPuedes elegir contra entrega en el checkout siempre que la cobertura de la transportadora esté habilitada en tu código postal. ¡Es una forma práctica y muy segura de comprar en Mercatto!'
  ],

  seguridad_confianza: [
    '**Seguridad, Privacidad y Confianza en Mercatto:**\n\n• **Custodia Escrow:** Tu dinero nunca va de inmediato al vendedor; Mercatto lo resguarda en custodia hasta que recibes tu producto a conformidad.\n• **Pagos Certificados:** Procesados a través de Wompi Bancolombia bajo normas PCI-DSS y encriptación de 256 bits.\n• **Prueba de Entrega con Foto:** Todos los envíos cuentan con registro fotográfico al momento del despacho y de la recepción.',
    '**¿Por qué es seguro comprar en Mercatto?:**\n\nPorque contamos con garantía de protección al comprador Escrow. Si el producto no llega o tiene defectos, tu dinero te es reembolsado en su totalidad.',
    '**Protección de compras y datos personales:**\n\nCumplimos estrictamente con la normativa colombiana de Habeas Data y protección al consumidor. Tus datos están cifrados y las transacciones monitoreadas antifraude.',
    '**Garantía Mercatto:**\n\nComprar en nuestra plataforma es 100% confiable: pagos protegidos, vendedores verificados y soporte continuo ante cualquier eventualidad.'
  ],

  categorias: [
    '**Categorías disponibles en Mercatto:**\n\nEncuentra miles de referencias organizadas en:\n• **Tecnología:** Smartphones, computadores, accesorios y audio.\n• **Moda y Ropa:** Tendencias urbanas, prendas para damas, caballeros y niños.\n• **Calzado:** Zapatos casuales, deportivos y formales.\n• **Hogar y Cocina:** Decoración, utensilios y electrodomésticos.\n• **Belleza y Cuidado Personal:** Cosméticos, perfumes y cuidado facial.',
    '**Variedad de productos en nuestro catálogo:**\n\nExplora moda, tecnología, calzado, hogar, deportes y belleza navegando por el menú superior de categorías o filtrando tus marcas favoritas en la barra de búsqueda.',
    '**¿Qué productos puedes comprar en Mercatto?:**\n\nDesde lo último en tecnología y calzado hasta artículos de moda y hogar suministrados por comercios directos de todo el país.',
    '**Catálogo multitienda Mercatto:**\n\nTenemos un amplio portafolio de artículos en categorías como Moda, Calzado, Tecnología, Belleza y Hogar, con envíos garantizados a toda Colombia.'
  ],

  cuenta_registro: [
    '**Gestión de Cuentas y Registro en Mercatto:**\n\n• **Crear Cuenta:** Puedes registrarte gratis con tu correo o iniciar sesión rápidamente con tu cuenta de Google.\n• **Perfil de Comprador o Vendedor:** Elige ser comprador para disfrutar de ofertas, o vendedor para abrir tu tienda.\n• **Compra como Invitado:** Si no deseas crear cuenta, puedes comprar indicando únicamente tus datos de envío.',
    '**¿Cómo registrarte o iniciar sesión?:**\n\nHaz clic en el botón **Ingresar** en la esquina superior derecha. Podrás iniciar sesión con Google o tu correo y contraseña en segundos.',
    '**Recuperación de cuenta y datos:**\n\nSi olvidaste tu clave, utiliza el enlace "¿Olvidaste tu contraseña?" en el formulario de inicio de sesión para recibir un correo de restablecimiento seguro.',
    '**Beneficios de tener una cuenta Mercatto:**\n\nGuarda tus direcciones preferidas, revisa el historial completo de pedidos, gestiona tus cupones y realiza compras con un solo clic.'
  ],

  facturacion: [
    '**Facturación y Comprobantes de Pago:**\n\n• **Compradores:** Cada compra genera su comprobante digital enviado inmediatamente a tu correo electrónico registrado.\n• **Vendedores:** El cobro de las suscripciones (Starter $0, Profesional $49.000 COP, Elite $99.000 COP) se debita directamente de la cuenta bancaria vinculada por el comerciante.\n• **Liquidación de Ventas:** Los fondos de tus ventas liberados por Escrow se transfieren a tu cuenta bancaria registrada.',
    '**Detalles de facturación y cobro:**\n\nLos compradores reciben su factura/recibo digital en su correo. Para los vendedores, la cuota mensual del plan se carga a la cuenta bancaria obligatoria registrada en el perfil de tienda.',
    '**Transparencia en cobros y desembolsos:**\n\nTodas las transacciones y cobros de comisiones (6% Starter, 3% Pro, 1% Elite) se reflejan de forma clara y detallada en el panel de vendedor.',
    '**Soporte de pagos y facturación:**\n\nSi requieres una factura electrónica con NIT o tienes dudas sobre un cobro bancario, puedes radicar un ticket de soporte adjuntando tu número de orden.'
  ],

  despedida_agradecimiento: [
    '¡Con el mayor gusto! Recuerda que estoy disponible 24/7 para asistirte en Mercatto. ¡Que tengas un excelente día y felices compras!',
    '¡Ha sido un verdadero placer ayudarte! Si necesitas cualquier otra información sobre pedidos, envíos o tu tienda, aquí estaré.',
    '¡De nada! Gracias por confiar en Mercatto, tu marketplace multitienda de confianza en Colombia. ¡Hasta pronto!',
    '¡Para servirte siempre! No dudes en volver a consultar si tienes preguntas adicionales sobre tus compras o ventas en Mercatto.'
  ],

  tickets_soporte: [
    '**¿Cómo generar y radicar un Ticket de Soporte en Mercatto?:**\n\nPuedes radicar una solicitud formal de asistencia directamente:\n\n• **1. Desde este chat:** Haz clic en el botón verde **"Radicar Ticket"** (ícono de audífonos) en la barra inferior para abrir el formulario directo.\n• **2. Completa tus datos:** Escribe tu nombre, correo electrónico donde recibirás la respuesta, teléfono (opcional) y el detalle de tu solicitud o código de pedido (ej: `PED-20261031-1045`).\n• **3. Enviar:** Presiona *"Enviar Solicitud"* y tu ticket quedará registrado. Nuestro equipo humano te responderá directamente a tu correo.\n\n*También puedes escribir al WhatsApp oficial [+57 323 388 2717](https://wa.me/573233882717) o al correo realmercatto@gmail.com.*',
    '**Pasos para radicar un Ticket de Atención:**\n\n1. Presiona el botón de **Ticket** en la parte inferior de este asistente.\n2. Ingresa tu correo y describe tu caso (devolución, garantía, pago o duda de orden).\n3. Al hacer clic en *Enviar*, nuestro equipo revisará tu caso y se pondrá en contacto contigo de inmediato.',
    '**Asistencia formal mediante ticket:**\n\nGenera un ticket de soporte haciendo clic en la opción *Radicar Ticket* abajo. Nuestro equipo de atención al cliente le dará seguimiento prioritario a tu solicitud con respuesta por correo electrónico.',
    '**Canal oficial de soporte Mercatto:**\n\nSi tienes inconvenientes con una orden, garantía o pago, radica un ticket con tus datos de contacto y número de pedido para brindarte una solución ágil.'
  ],

  devoluciones_garantias: [
    '**Garantías, Devoluciones y Protección Escrow:**\n\n• **Garantía Mercatto Escrow:** Tu dinero está 100% protegido. El vendedor NO recibe el pago hasta que confirmes la entrega satisfactoria del producto.\n• **¿Tu producto llegó defectuoso o no corresponde?:**\n  1. Tienes hasta **5 días hábiles** tras recibir el paquete para reportarlo.\n  2. Radica un **Ticket de Soporte** desde este chat o escribe al WhatsApp [+57 323 388 2717](https://wa.me/573233882717) con fotos de evidencia y tu código de orden.\n  3. El equipo de soporte congelará el desembolso y coordinará el cambio o el **reembolso total** de tu dinero a tu cuenta.\n• **Foto de Entrega:** Cada transportista carga una foto física al momento de la entrega.',
    '**¿Cómo solicitar una devolución o reembolso?:**\n\nSi requieres un cambio o reembolso, tienes 5 días hábiles desde la entrega para reportarlo mediante un ticket de soporte o por nuestro WhatsApp oficial (+57 323 388 2717) adjuntando fotos del artículo y número de pedido.',
    '**Protección de compras y devoluciones:**\n\nEn Mercatto tu satisfacción está garantizada. Si el producto no es lo que esperabas o llega con defectos de fábrica, abres un ticket y gestionamos tu reembolso íntegro de inmediato.',
    '**Política de cambios y garantías:**\n\nCuentas con respaldo integral en todos tus pedidos. Tu dinero permanece bajo custodia segura hasta que tengas el producto en tus manos y confirmes que todo está en perfecto orden.'
  ]
}

const RESPUESTAS_BASE_EN = {
  como_funciona: [
    '**How does Mercatto work? — Colombia\'s Multi-Vendor Marketplace:**\n\nMercatto connects shoppers with verified stores and brands across Colombia in a secure and transparent shopping ecosystem:\n\n• **For Shoppers:**\n  1. **Browse the Catalog:** Explore thousands of items in Fashion, Tech, Footwear, Home, and Beauty.\n  2. **Guest or Account Checkout:** Order with your registered profile or simply as a **Guest** without requiring passwords.\n  3. **100% Protected Payments:** Handled by certified Wompi gateway (Cards, PSE, Nequi) or **Cash on Delivery** at your door.\n  4. **Mercatto Escrow Guarantee:** Your funds are safely held in custody and only released to the store once delivery is confirmed.\n  5. **Live Tracking:** Nationwide shipping (free over $150,000 COP), 24/7 parcel tracking, and physical delivery photo proof.\n\n• **For Sellers:**\n  1. **Open Your Store in 2 Minutes:** Quick sign-up and brand customization.\n  2. **Bank Account Registration:** Vendors must register their bank account and bank name before choosing a subscription plan for billing.\n  3. **Low Commissions:** Starter at 6% ($0/mo), Professional at 3% ($49,000 COP/mo), or Elite Premium at 1% ($99,000 COP/mo).\n  4. **Full Management:** Dashboard with real-time inventory, order processing, and sales analytics.\n\n*Would you like more details on how to buy, payment methods, or opening a seller store?*',
    '**Mercatto in a nutshell:**\n\n• **Safe Shopping:** Pay securely via PSE, Nequi, credit cards, or cash at delivery. Funds are held in escrow until you receive your items.\n• **Reliable Shipping:** Fast dispatch across Colombia with delivery photo evidence and 24/7 tracking.\n• **Empowering Sellers:** Launch your online store with industry-low commissions (Starter 6%, Pro 3%, Elite 1%). Sellers register their bank account upfront for automatic subscription billing.\n\nHow may I help you today? Would you like to explore products, learn about payment options, or register as a seller?',
    '**Everything you need to know about Mercatto:**\n\nWe bring Colombian merchants and shoppers together on one secure platform.\n• **Buyers:** Protected payments, escrow safety, and cash on delivery available.\n• **Sellers:** Low commission tiers (6% Starter, 3% Pro, 1% Elite) with automated bank account billing.',
    '**Why choose Mercatto?:**\n\nEnjoy guaranteed escrow security, nationwide parcel shipping with proof of delivery photos, and low commission seller plans (Starter 6%, Pro 3%, Elite 1%).'
  ],

  como_comprar: [
    '**Buying on Mercatto is easy, fast, and 100% secure:**\n\n• **1. Browse the Catalog:** Explore verified categories or search for your favorite items.\n• **2. Add to Cart:** Pick your desired size, color, or variant.\n• **3. Easy Checkout:** Shop with your account or as a **Guest** by simply entering your email, phone, and delivery address.\n• **4. Secure Payment:** Handled by certified Wompi gateway (Cards, PSE, Nequi) or Cash on Delivery.\n• **5. Live Tracking:** You will immediately receive order confirmation and a real-time tracking link with delivery photo proof.',
    '**Quick guide to purchasing on Mercatto:**\n\n1. Select your favorite items and add them to your cart.\n2. Checkout with your registered account or simply as a **Guest**.\n3. Pick your preferred payment method: credit/debit card, PSE, Nequi, or Cash on Delivery.\n4. You will receive an instant confirmation email with live tracking details.',
    '**Step-by-step shopping on Mercatto:**\n\nAdd items to your bag, choose shipping address anywhere in Colombia, pay online or upon delivery, and track your package 24/7 with photographic evidence.',
    '**Ordering made simple:**\n\nNo registration required! You can place orders as a guest with safe payment processing and full Escrow protection.'
  ],

  medios_pago: [
    '**Payment Methods & Buyer Protection:**\n\n• **Digital Wallets:** Instant payment through **Nequi** or **Daviplata**.\n• **Bank Transfers (PSE):** Direct debit from any bank in Colombia.\n• **Credit & Debit Cards:** Visa, Mastercard, and American Express with installment options.\n• **Cash on Delivery:** Pay in cash when the courier hands the package at your door.\n\n**Mercatto Escrow Guarantee:** Your funds are 100% protected. Sellers only get paid after your order has been safely delivered to your total satisfaction.',
    '**Secure payment options:**\n\nWe accept credit/debit cards, bank debit through PSE, Nequi, and Cash on Delivery. All electronic payments are processed securely via Wompi with escrow protection.',
    '**How to pay your order:**\n\nChoose between Wompi (Cards, PSE, Nequi) or Cash on Delivery. Your funds are secured in escrow until you verify your items.',
    '**Payment flexibility:**\n\nPay digitally with instant confirmation or pay cash at your doorstep. Both methods include complete buyer protection.'
  ],

  vender: [
    '**How to Sell on Mercatto & Open Your Store:**\n\nOpening your store on Mercatto is free and takes under 2 minutes!\n\n• **1. Sign Up:** Choose the **Seller** role when registering.\n• **2. Add Bank Account:** Provide your bank account number and bank name where sales will be paid out and subscriptions will be billed.\n• **3. Pick a Plan:** Starter (6% commission, $0/mo), Professional (3% commission, $49,000 COP/mo), or Elite Premium (1% commission, $99,000 COP/mo).\n• **4. List Your Products:** Add pictures, colors/sizes, stock, and prices.\n• **5. Manage Orders:** Full dashboard with live inventory, sales analytics, and predictive earnings.',
    '**Start selling on Mercatto today:**\n\nCreate a seller profile in just minutes, register your bank account for payouts and subscription billing, pick your tier (Starter 6%, Pro 3%, Elite 1%), and receive orders from buyers all across Colombia.',
    '**Seller registration steps:**\n\n1. Create your seller account.\n2. Upload your store details and bank account information.\n3. Select your commission tier (6% Starter, 3% Pro, 1% Elite).\n4. List your inventory and start generating sales.',
    '**Why sell on Mercatto?:**\n\nEnjoy the lowest commission rates in Colombia (Starter 6%, Pro 3%, Elite 1%), automated courier shipping, escrow protection, and advanced analytics.'
  ],

  planes: [
    '**Seller Plans & Commission Rates:**\n\n• **Starter Plan ($0 COP/month):** No monthly fee and **6%** commission per sale. Perfect for new entrepreneurs.\n• **Professional Plan ($49,000 COP/month):** Reduced **3%** commission per sale, great for established businesses.\n• **Elite Premium Plan ($99,000 COP/month):** Minimal **1%** commission, verified Elite badge, and top catalog priority.\n\n> **Mandatory Requirement:** Before activating or changing a plan, sellers must provide their bank account number and bank name for automated subscription billing.\n\n*You can upgrade, downgrade, or pause your plan at any time from your seller panel.*',
    '**Seller tiers and benefits:**\n\nChoose **Starter** with $0 monthly cost (6% commission), **Professional** at $49,000 COP/month (3% commission), or **Elite Premium** at $99,000 COP/month (1% commission and verified badge).\n\n*Note:* You must register your bank account prior to selecting your plan.',
    '**Updated commission rates:**\n\n• Starter: **6%** per sale.\n• Pro: **3%** per sale.\n• Elite: **1%** per sale.\n\nEnsure your bank account is saved in your store profile for subscription debiting.',
    '**Membership structure for merchants:**\n\nPick between Starter (6% commission), Professional (3% commission), and Elite Premium (1% commission). Bank account registration is required upfront.'
  ],

  cupones: [
    '**Active Discount Coupons on Mercatto:**\n\n• **BIENVENIDA:** **$20,000 COP off** on orders of $100,000 COP or more.\n• **MERCATTO10:** **10% off** on selected items for orders over $30,000 COP (max savings $50,000 COP).\n\n**How to redeem:** Enter the code in the *"Coupon code"* field in the Cart drawer or at Checkout before completing your order.',
    '**Current promo codes:**\n\nApply **BIENVENIDA** for $20,000 COP discount on orders over $100,000 COP, or **MERCATTO10** for 10% off on eligible items during checkout.',
    '**Save with Mercatto coupons:**\n\nEnjoy $20,000 COP off with code **BIENVENIDA** (orders $100,000+) or 10% off with **MERCATTO10**.',
    '**Special discounts available:**\n\nEnter coupon **BIENVENIDA** or **MERCATTO10** at checkout to unlock instant discounts.'
  ],

  envios: [
    '**Shipping Policy & Delivery Times:**\n\n• **Free Shipping:** On all purchases equal to or over **$150,000 COP** in Colombia.\n• **Flat Shipping Fee:** Only **$12,000 COP** for smaller orders nationwide.\n• **Estimated Delivery Times:**\n  - **Cartagena de Indias:** 24 to 48 business hours.\n  - **Other Major Cities in Colombia:** 48 to 72 business hours.\n• **Couriers:** Insured shipping via Coordinadora, Servientrega, and Interrapidísimo.\n• **Delivery Photo Proof:** Couriers upload a real physical delivery photo upon delivery.',
    '**Nationwide shipping coverage:**\n\nOrders over $150,000 COP enjoy free delivery anywhere in Colombia. For smaller orders, a standard fee of $12,000 COP applies. Deliveries take 24-48 hours in Cartagena and 48-72 hours in other major cities.',
    '**Delivery carriers and times:**\n\nWe work with top couriers (Coordinadora, Servientrega, Interrapidísimo). Packages arrive in 1 to 3 business days with photographic evidence.',
    '**Shipping rates:**\n\nFree shipping on orders from $150,000 COP; flat rate of $12,000 COP for lower amounts across all Colombia.'
  ],

  rastreo: [
    '**Real-Time Order Tracking:**\n\n• **If you have an account:** Go to **My Orders** from your account menu to review tracking status and delivery photos.\n• **If you bought as guest:** Visit **Track Order** (`/rastreo`) and enter your order code (e.g., `PED-20261031-1045`) and email address.\n\n*You can view real-time courier progress and photo proof.*',
    '**Track your package:**\n\nAccess **/rastreo** anytime with your order code and email, or view full status history and photo evidence under **My Orders**.',
    '**Where is my parcel?:**\n\nCheck live status using your order number and email on the tracking page with real-time milestones and courier photo proof.',
    '**24/7 package monitoring:**\n\nEvery order generates a tracking code. Follow delivery progress anytime in the Track Order section.'
  ],

  contraentrega: [
    '**Cash on Delivery (COD) in Colombia:**\n\n• **How it works:** Pay the total order value in cash directly to the courier when the parcel arrives at your address.\n• **Coverage:** Available in major Colombian cities and metropolitan areas.\n• **Security:** No online cards or passwords needed. Simply have exact cash ready when the driver arrives.',
    '**Cash on Delivery details:**\n\nSelect **Cash on Delivery** at checkout. Your order will be dispatched to your address and you pay in cash upon receiving the package.',
    '**Benefits of COD:**\n\n1. Pay only when the physical box arrives at your door.\n2. Perfect if you prefer not using online bank cards.\n3. Fast and safe dispatch with leading domestic couriers.',
    '**Cash on Delivery availability:**\n\nAvailable at checkout for eligible postal codes throughout Colombia. Safe, convenient, and easy!'
  ],

  seguridad_confianza: [
    '**Security, Privacy & Trust at Mercatto:**\n\n• **Escrow Custody:** Your payment is safely held by Mercatto and not released to the seller until you confirm receipt.\n• **Certified Payments:** Handled by Wompi Bancolombia with 256-bit encryption and PCI-DSS compliance.\n• **Photo Evidence:** Couriers capture a physical delivery photo upon handing over the order.',
    '**Why shopping on Mercatto is safe:**\n\nBecause we provide full buyer escrow protection. If your order is missing or damaged, you get a full refund.',
    '**Data protection and privacy:**\n\nWe adhere to Colombian Habeas Data regulations. Your private details and payment credentials are fully encrypted.',
    '**The Mercatto Guarantee:**\n\n100% peace of mind: secured funds, verified merchants, and responsive customer support.'
  ],

  categorias: [
    '**Shopping Categories on Mercatto:**\n\nExplore thousands of items in:\n• **Technology:** Smartphones, laptops, audio, and accessories.\n• **Fashion & Apparel:** Trending clothes for men, women, and kids.\n• **Footwear:** Sneakers, formal and casual shoes.\n• **Home & Kitchen:** Appliances, decor, and cookware.\n• **Beauty & Personal Care:** Skincare, perfumes, and cosmetics.',
    '**Catalog variety:**\n\nBrowse tech, footwear, apparel, home essentials, and beauty in the category menu or search by brand in the search bar.',
    '**What can you buy on Mercatto?:**\n\nFrom cutting-edge electronics and footwear to trendy fashion and home goods from verified merchants.',
    '**Multi-vendor selection:**\n\nWide array of catalog items with guaranteed courier delivery across Colombia.'
  ],

  cuenta_registro: [
    '**Account Management & Sign Up:**\n\n• **Sign Up:** Register for free using your email or sign in instantly with your Google account.\n• **Buyer or Seller:** Choose between a buyer profile to shop deals or seller account to open a store.\n• **Guest Checkout:** You can also complete orders without creating an account.',
    '**How to register or log in:**\n\nClick the **Sign In** button in the top right corner. You can log in via Google or email in seconds.',
    '**Password recovery:**\n\nIf you forgot your password, click "Forgot password?" on the login page to receive a password reset link.',
    '**Benefits of a Mercatto account:**\n\nSave multiple addresses, view order history, redeem exclusive coupons, and checkout faster.'
  ],

  facturacion: [
    '**Billing & Payment Invoices:**\n\n• **Buyers:** Receive a digital receipt in your email immediately upon completing your purchase.\n• **Sellers:** Plan subscriptions (Starter $0, Pro $49,000 COP, Elite $99,000 COP) are automatically debited from your registered bank account.\n• **Payouts:** Escrow-released funds are transferred directly to the seller\'s bank account.',
    '**Billing details:**\n\nCustomers get instant digital receipts. For sellers, monthly plan fees are billed to the registered bank account.',
    '**Clear fees and payouts:**\n\nCommission rates (6% Starter, 3% Pro, 1% Elite) and transaction logs are transparently itemized in your seller dashboard.',
    '**Invoicing support:**\n\nNeed an official tax invoice or have questions about a bank charge? Submit a ticket with your order ID for prompt assistance.'
  ],

  despedida_agradecimiento: [
    'You are very welcome! Remember I am here 24/7 to assist you on Mercatto. Have a great day and happy shopping!',
    'It was my pleasure! If you have any further questions about your orders or store, just ask.',
    'Glad I could help! Thank you for choosing Mercatto Colombia. See you soon!',
    'Always happy to assist! Feel free to reach out anytime for shopping or seller inquiries on Mercatto.'
  ],

  tickets_soporte: [
    '**How to submit a Support Ticket in Mercatto:**\n\n• **1. In this widget:** Click the **"Submit Ticket"** button in the bottom bar to open the form.\n• **2. Enter your details:** Type your name, email, phone (optional), and case description or Order Code.\n• **3. Submit:** Once sent, our customer support team will reply directly to your email address.\n\n*You can also contact our official WhatsApp at [+57 323 388 2717](https://wa.me/573233882717) or email realmercatto@gmail.com.*',
    '**Steps to open a support ticket:**\n\n1. Click the **Ticket** button at the bottom of this widget.\n2. Enter your email and order details.\n3. Our team will review your case and reply shortly.',
    '**Priority customer support:**\n\nSubmit a ticket anytime for refunds, warranties, or delivery inquiries. Our support agents respond directly to your email.',
    '**Official Mercatto support:**\n\nNeed help with an existing order? Create a support ticket with your order code for expedited assistance.'
  ],

  devoluciones_garantias: [
    '**Warranties, Returns & Escrow Refunds:**\n\n• **Buyer Protection:** Funds remain in escrow until you receive and verify your order.\n• **Defective Item:** You have **5 business days** after delivery to request an exchange or full refund by submitting a ticket or contacting WhatsApp [+57 323 388 2717](https://wa.me/573233882717) with photos of the item and order code.',
    '**How to request a refund or exchange:**\n\nIf you need a refund, notify us within 5 business days after delivery with photos and order ID via ticket or WhatsApp (+57 323 388 2717).',
    '**Satisfaction guaranteed:**\n\nIf an item arrives damaged or incorrect, our escrow warranty protects you with an immediate exchange or full refund.',
    '**Return policy:**\n\nWe protect your purchase from checkout to delivery. Report any issues within 5 business days for swift resolution.'
  ]
}

const sanitizarComisionesYPlanes = (texto, isEn) => {
  if (!texto) return texto
  const lower = texto.toLowerCase()
  if (
    lower.includes('4%') ||
    lower.includes('sin membresías fijas') ||
    lower.includes('sin membresias fijas') ||
    lower.includes('sin cobros mensuales') ||
    lower.includes('sin planes ni cuotas') ||
    lower.includes('comisión fija única') ||
    lower.includes('comision fija unica')
  ) {
    return obtenerRespuestaVariada((isEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).planes)
  }
  return texto
}

const sanitizeResponseLanguage = (text, isEn, userQuery) => {
  if (!isEn || !text) return text
  const t = text.toLowerCase()
  const q = (userQuery || '').toLowerCase()

  // Detect Spanish leakage in English mode
  const hasSpanish =
    t.includes('¡hola') ||
    t.includes('artículos más') ||
    t.includes('articulos mas') ||
    t.includes('¿deseas') ||
    t.includes('con gusto te ayudo') ||
    t.includes('métodos de pago') ||
    t.includes('metodos de pago') ||
    t.includes('cómo comprar') ||
    t.includes('como comprar') ||
    t.includes('en la tienda hoy') ||
    t.includes('soy mercattobot')

  if (!hasSpanish) return text

  // Map to clean English based on query
  if (q.includes('work') || q.includes('how does') || q.includes('about')) {
    return obtenerRespuestaVariada(RESPUESTAS_BASE_EN.como_funciona)
  }
  if (q.includes('pay') || q.includes('card') || q.includes('method') || q.includes('pse') || q.includes('cash')) {
    return obtenerRespuestaVariada(RESPUESTAS_BASE_EN.medios_pago)
  }
  if (q.includes('buy') || q.includes('how to') || q.includes('purchase') || q.includes('order')) {
    return obtenerRespuestaVariada(RESPUESTAS_BASE_EN.como_comprar)
  }
  if (q.includes('sell') || q.includes('store') || q.includes('plan') || q.includes('fee') || q.includes('commission')) {
    return obtenerRespuestaVariada(RESPUESTAS_BASE_EN.planes)
  }
  if (q.includes('ship') || q.includes('delivery') || q.includes('freight')) {
    return obtenerRespuestaVariada(RESPUESTAS_BASE_EN.envios)
  }
  if (q.includes('coupon') || q.includes('discount') || q.includes('promo')) {
    return obtenerRespuestaVariada(RESPUESTAS_BASE_EN.cupones)
  }
  if (q.includes('track') || q.includes('where is')) {
    return obtenerRespuestaVariada(RESPUESTAS_BASE_EN.rastreo)
  }

  return obtenerRespuestaVariada(RESPUESTAS_BASE_EN.como_comprar)
}

export const isEnglishText = (text) => {
  if (!text) return false
  const t = text.toLowerCase().trim()
  const pattern = /\b(how|what|where|when|why|who|which|can|could|would|should|do|does|did|is|are|was|were|will|shall|hello|hi|hey|good\s+(morning|afternoon|evening)|please|help|buy|buying|purchase|order|orders|shipping|ship|delivery|store|shop|seller|sell|payment|pay|paid|price|cost|discount|coupon|coupons|track|tracking|product|products|item|items|refund|thanks|thank\s+you|support|recommend|shoes|clothes|laptop|phone)\b/i
  return pattern.test(t)
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
          texto: obtenerRespuestaVariada(respuestasBase[opcionId]) || (isEn ? 'Would you like to ask anything else?' : '¿Deseas consultar alguna otra información?'),
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ofrecerMenu: true
        }
      ])
      setVistaActual('chat')
    }, 450)
  }

  const handleEnviarMensaje = async (e, textoDirecto = null) => {
    if (e && e.preventDefault) e.preventDefault()
    if (escribiendo) return
    const texto = (textoDirecto !== null ? textoDirecto : mensajeInput).trim()
    if (!texto) return

    setMensajeInput('')
    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    setMensajes((prev) => [
      ...prev,
      { id: Date.now(), remitente: 'usuario', texto, hora }
    ])

    const t = texto.toLowerCase()
    const isEffectiveEn = isEn || isEnglishText(texto)

    // [SEGURIDAD Y PRIVACIDAD] Restricción estricta de información técnica o interna
    if (esConsultaTecnicaOPrivada(t)) {
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          remitente: 'bot',
          texto: isEffectiveEn ? MENSAJE_RESTRICCION_SEGURIDAD_EN : MENSAJE_RESTRICCION_SEGURIDAD_ES,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ofrecerMenu: true
        }
      ])
      return
    }

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
          texto: isEffectiveEn ? obtenerRespuestaVariada(SOPORTE_VARIADO_EN) : obtenerRespuestaVariada(SOPORTE_VARIADO_ES),
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
            idioma: isEffectiveEn ? 'en' : 'es'
          },
          { timeout: 12000 }
        )

        const rawReply = resIa?.data?.reply || resIa?.data?.respuesta
        if (rawReply) {
          const contieneListaProductosInesperada = (rawReply.includes('Artículos más destacados') || rawReply.includes('Articulos mas destacados') || rawReply.includes('Nevera No Frost') || rawReply.includes('Grand theft'))
          // Solo se considera petición de catálogo si el usuario pide explícitamente ver artículos o explorar el catálogo comercial
          const esPeticionExplicitaCatalogo = /\b(ver catalogo|ver productos|que venden|que hay|muestrame productos|mostrar catalogo|recomienda|recomiendame|articulos destacados|productos destacados|show catalog|what do you sell)\b/i.test(t) && !/\b(como|cómo|que hago|qué hago|pasos|ayuda|guia|guía)\b/i.test(t)

          if (contieneListaProductosInesperada && !esPeticionExplicitaCatalogo) {
            // El backend devolvió una lista de productos en lugar de dar la asistencia sobre el uso de la app que pidió el usuario.
            // Detectamos el propósito exacto de asistencia del usuario:
            if (t.includes('ticket') || t.includes('radicar') || t.includes('generar ticket') || t.includes('abrir ticket') || t.includes('formulario de soporte')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).tickets_soporte)
            } else if (t.includes('garantia') || t.includes('garantía') || t.includes('devoluc') || t.includes('reembolso') || t.includes('cambio') || t.includes('defectuoso') || t.includes('warranty') || t.includes('refund') || t.includes('return')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).devoluciones_garantias)
            } else if (t.includes('contraentrega') || t.includes('contra entrega') || t.includes('en efectivo') || t.includes('cod ') || t.endsWith('cod')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).contraentrega)
            } else if (t.includes('seguridad') || t.includes('confianza') || t.includes('escrow') || t.includes('fraude') || t.includes('proteccion') || t.includes('protección') || t.includes('security')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).seguridad_confianza)
            } else if (t.includes('categoria') || t.includes('categoría') || t.includes('seccion') || t.includes('sección') || t.includes('category') || t.includes('categories')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).categorias)
            } else if (t.includes('registro') || t.includes('crear cuenta') || t.includes('iniciar sesion') || t.includes('iniciar sesión') || t.includes('login') || t.includes('sign up') || t.includes('recuperar clave')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).cuenta_registro)
            } else if (t.includes('factura') || t.includes('facturación') || t.includes('facturacion') || t.includes('recibo') || t.includes('cobro') || t.includes('invoice') || t.includes('billing')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).facturacion)
            } else if (t.includes('gracias') || t.includes('muchas gracias') || t.includes('agradezco') || t.includes('thank') || t.includes('thanks') || t.includes('adios') || t.includes('adiós') || t.includes('chao') || t.includes('bye')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).despedida_agradecimiento)
            } else if (t.includes('comprar') || t.includes('que hago') || t.includes('como compro') || t.includes('pasos') || t.includes('pedido') || t.includes('orden') || t.includes('buy') || t.includes('purchase') || t.includes('how to')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).como_comprar)
            } else if (t.includes('funciona') || t.includes('que es mercatto') || t.includes('de que trata') || t.includes('como opera') || t.includes('how it works') || t.includes('what is mercatto') || t.includes('about mercatto')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).como_funciona)
            } else if (t.includes('pago') || t.includes('tarjeta') || t.includes('nequi') || t.includes('banco') || t.includes('pse') || t.includes('pay') || t.includes('card')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).medios_pago)
            } else if (t.includes('vender') || t.includes('tienda') || t.includes('proveedor') || t.includes('sell') || t.includes('store')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).vender)
            } else if (t.includes('plan') || t.includes('comision') || t.includes('comisión') || t.includes('suscrip') || t.includes('fee')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).planes)
            } else if (t.includes('envio') || t.includes('envío') || t.includes('flete') || t.includes('ciudad') || t.includes('despacho') || t.includes('ship') || t.includes('delivery')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).envios)
            } else if (t.includes('rastre') || t.includes('seguimiento') || t.includes('estado de mi') || t.includes('donde esta') || t.includes('track') || t.includes('where is')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).rastreo)
            } else if (t.includes('cupon') || t.includes('cupón') || t.includes('descuento') || t.includes('promo') || t.includes('coupon') || t.includes('discount')) {
              respuestaIA = obtenerRespuestaVariada((isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES).cupones)
            } else if (/^(hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|hi|hello|saludos|que tal|como estas|holi|alo)/i.test(t.trim())) {
              respuestaIA = isEffectiveEn ? obtenerRespuestaVariada(SALUDOS_VARIADOS_EN) : obtenerRespuestaVariada(SALUDOS_VARIADOS_ES)
            } else {
              respuestaIA = obtenerRespuestaVariada(isEffectiveEn ? DISCULPAS_FUERA_DE_TEMA_EN : DISCULPAS_FUERA_DE_TEMA_ES)
            }
          } else {
            respuestaIA = sanitizeResponseLanguage(rawReply, isEffectiveEn, texto)
          }
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
              idioma: isEffectiveEn ? 'en' : 'es'
            })
          })

          if (response.ok) {
            const data = await response.json()
            const n8nRaw = data?.reply || data?.output || data?.text
            if (n8nRaw) {
              respuestaIA = sanitizeResponseLanguage(n8nRaw, isEffectiveEn, texto)
            }
          }
        } catch (errN8n) {
          console.warn('n8n directo falló:', errN8n)
        }
      }

      if (!respuestaIA) {
        throw new Error('Sin respuesta de los agentes')
      }

      setEscribiendo(false)
      const textoFinal = sanitizarComisionesYPlanes(respuestaIA, isEffectiveEn)
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          remitente: 'bot',
          texto: textoFinal,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          esOpcionSoporte: false,
          ofrecerMenu: true,
          agente: agenteUsado
        }
      ])
    } catch {
      setEscribiendo(false)

      const fallbackRespuestas = isEffectiveEn ? RESPUESTAS_BASE_EN : RESPUESTAS_BASE_ES
      const esSaludo = /^(hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|hi|hello|saludos|que tal|como estas|holi|alo)/i.test(t.trim())

      let respuesta = ''
      if (t.includes('ticket') || t.includes('radicar') || t.includes('generar ticket') || t.includes('abrir ticket')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.tickets_soporte)
      } else if (t.includes('garantia') || t.includes('garantía') || t.includes('devoluc') || t.includes('reembolso') || t.includes('defectuoso') || t.includes('warranty') || t.includes('refund')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.devoluciones_garantias)
      } else if (t.includes('contraentrega') || t.includes('contra entrega') || t.includes('en efectivo') || t.includes('cod ') || t.endsWith('cod')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.contraentrega)
      } else if (t.includes('seguridad') || t.includes('confianza') || t.includes('escrow') || t.includes('fraude') || t.includes('proteccion') || t.includes('protección') || t.includes('security')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.seguridad_confianza)
      } else if (t.includes('categoria') || t.includes('categoría') || t.includes('seccion') || t.includes('sección') || t.includes('category') || t.includes('categories')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.categorias)
      } else if (t.includes('registro') || t.includes('crear cuenta') || t.includes('iniciar sesion') || t.includes('iniciar sesión') || t.includes('login') || t.includes('sign up') || t.includes('recuperar clave')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.cuenta_registro)
      } else if (t.includes('factura') || t.includes('facturación') || t.includes('facturacion') || t.includes('recibo') || t.includes('cobro') || t.includes('invoice') || t.includes('billing')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.facturacion)
      } else if (t.includes('gracias') || t.includes('muchas gracias') || t.includes('agradezco') || t.includes('thank') || t.includes('thanks') || t.includes('adios') || t.includes('adiós') || t.includes('chao') || t.includes('bye')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.despedida_agradecimiento)
      } else if (t.includes('funciona') || t.includes('que es mercatto') || t.includes('de que trata') || t.includes('como opera') || t.includes('how it works') || t.includes('about mercatto') || t.includes('how does mercatto work')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.como_funciona)
      } else if (esSaludo) {
        respuesta = isEffectiveEn ? obtenerRespuestaVariada(SALUDOS_VARIADOS_EN) : obtenerRespuestaVariada(SALUDOS_VARIADOS_ES)
      } else if (t.includes('pago') || t.includes('tarjeta') || t.includes('nequi') || t.includes('banco') || t.includes('pse') || t.includes('pay') || t.includes('card')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.medios_pago)
      } else if (t.includes('rastre') || t.includes('seguimiento') || t.includes('estado de mi') || t.includes('track') || t.includes('where is')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.rastreo)
      } else if (t.includes('comprar') || t.includes('pedido') || t.includes('orden') || t.includes('buy') || t.includes('purchase') || t.includes('how to')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.como_comprar)
      } else if (t.includes('plan') || t.includes('comision') || t.includes('comisión') || t.includes('suscrip') || t.includes('fee')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.planes)
      } else if (t.includes('vender') || t.includes('tienda') || t.includes('proveedor') || t.includes('sell') || t.includes('store')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.vender)
      } else if (t.includes('cupon') || t.includes('cupón') || t.includes('descuento') || t.includes('promo') || t.includes('coupon') || t.includes('discount')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.cupones)
      } else if (t.includes('envio') || t.includes('envío') || t.includes('flete') || t.includes('ciudad') || t.includes('despacho') || t.includes('ship') || t.includes('delivery')) {
        respuesta = obtenerRespuestaVariada(fallbackRespuestas.envios)
      } else {
        // Fuera de tema de Mercatto: Respuesta obligatoria con disculpa cortés y variada
        respuesta = isEffectiveEn ? obtenerRespuestaVariada(DISCULPAS_FUERA_DE_TEMA_EN) : obtenerRespuestaVariada(DISCULPAS_FUERA_DE_TEMA_ES)
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
    if (escribiendo) return
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
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end pointer-events-none font-sans">
      {/* Ventana Flotante del Asistente */}
      {abierto && (
        <div className="pointer-events-auto mb-2.5 w-[calc(100vw-1.5rem)] sm:w-[380px] max-w-[380px] h-[min(510px,calc(100dvh-150px))] sm:h-[min(530px,calc(100dvh-170px))] bg-white dark:bg-slate-900 rounded-3xl border border-mercatto-border dark:border-slate-800 shadow-2xl shadow-mercatto-dark/25 ring-1 ring-mercatto-primary/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 backdrop-blur-sm">
          
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
        className="pointer-events-auto shrink-0 group relative w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-full bg-gradient-to-tr from-mercatto-primary via-mercatto-primary to-mercatto-deep hover:from-mercatto-deep hover:to-mercatto-deep text-white shadow-xl shadow-violet-600/35 hover:shadow-2xl hover:shadow-violet-600/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer border-2 border-white/30 select-none"
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
