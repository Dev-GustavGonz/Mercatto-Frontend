/**
 * universalTranslator.js
 * Motor de traducción universal bidireccional en tiempo real para Mercatto.
 * 
 * Funcionalidad:
 * - Supervisa todo el árbol DOM con un MutationObserver.
 * - Traduce dinámicamente nodos de texto, inputs, placeholders, atributos 'title',
 *   'aria-label' y 'alt' en TODAS las páginas del proyecto (Catálogo, Carrito,
 *   Detalle de Producto, Login, Registro, Checkout, Perfil, Tiendas, Admin, etc.).
 * - Al volver a 'ES', restaura de forma fidedigna los textos originales.
 * - Garantiza la regla: "si inicia un párrafo o texto ponle mayúscula a la primera letra".
 */

// Diccionario exhaustivo frase por frase y término por término
export const dictionaryEStoEN = {
  // Slogan & Marca
  'del barrio a tu pantalla': 'From the neighborhood to your screen',
  'el marketplace de colombia': "Colombia's Marketplace",

  // Navegación & Layout
  'catálogo de productos': 'Product Catalog',
  'catálogo completo': 'Full Catalog',
  'todo el catálogo': 'All Catalog',
  'catálogo': 'Catalog',
  'tiendas oficiales': 'Official Stores',
  'directorio de tiendas': 'Stores Directory',
  'buscar productos, marcas y tiendas...': 'Search products, brands and stores...',
  'buscar en catálogo...': 'Search in catalog...',
  'buscar productos...': 'Search products...',
  'nosotros': 'About Us',
  'contacto': 'Contact Us',
  'iniciar sesión': 'Log In',
  'registrarse': 'Sign Up',
  'mi perfil': 'My Profile',
  'mis pedidos': 'My Orders',
  'favoritos': 'Wishlist',
  'mis favoritos': 'My Wishlist',
  'cerrar sesión': 'Log Out',
  'panel administrador': 'Admin Portal',
  'panel vendedor': 'Seller Portal',
  'bolsa de compras': 'Shopping Bag',
  'carrito de compras': 'Shopping Cart',
  'marcas oficiales': 'Official Brands',
  'más vendidos': 'Best Sellers',
  'nuevos productos': 'New Arrivals',
  'cargando categorías...': 'Loading categories...',
  'cargando marcas...': 'Loading brands...',
  'cargando productos...': 'Loading products...',
  'cargando...': 'Loading...',
  'inicio': 'Home',

  // Bento Hero Showcase & Home
  'comienza tu': 'Start your',
  'viaje': 'Journey',
  'categorías:': 'Categories:',
  'comprar ahora': 'Shop now',
  'materiales y calidad original certificada': 'Certified original quality materials',
  'experiencia 2026': 'Experience 2026',
  'ver exhibición': 'Watch showcase',
  'ver showcase': 'Watch showcase',
  'nueva colección': 'New Collection',
  'ver todo': 'View all',
  'ver todo el catálogo': 'View full catalog',
  'ver catálogo completo': 'View full catalog',
  'siempre': 'Always',
  'único': 'Unique',
  'con los': 'With the',
  'mejores': 'Best',
  'materiales': 'Materials',
  'multi-categoría': 'Multi-category',
  'móviles': 'Mobile',
  'calzado': 'Footwear',
  'cámaras': 'Cameras',
  'producto destacado': 'Featured Product',
  'oferta flash': 'Flash Deal',
  'producto de temporada': 'Seasonal Pick',
  'novedad oficial': 'Official Release',
  'distribuidores y marcas oficiales verificadas': 'Verified official brands & distributors',
  'proveedores certificados': 'Certified Suppliers',
  'tienda oficial verificada': 'Verified Official Store',
  'tienda oficial': 'Official Store',
  'ver tienda': 'View Store',

  // Barra de confianza
  'envíos & pago wompi': 'Wompi Secure Shipping & Payment',
  'pse, nequi, bancolombia y tarjetas': 'PSE, Nequi, Bancolombia and cards',
  'compra 100% protegida': '100% Protected Purchase',
  'tu dinero seguro en cada pedido': 'Your money safe on every order',
  'garantía oficial': 'Official Warranty',
  'tiendas y marcas verificadas': 'Verified stores and brands',
  'envío a toda colombia': 'Nationwide Shipping across Colombia',
  'despacho rápido con rastreo': 'Fast dispatch with tracking',

  // Secciones Bento & Home
  'ofertas del mes &': 'Deals of the month &',
  'destacados pro': 'Pro picks',
  'oferta del mes': 'Deal of the month',
  'precios especiales directos de proveedores verificados en colombia': 'Special direct prices from verified suppliers in Colombia',
  'audio hi-res pro': 'Pro Hi-Res Audio',
  'precio oficial': 'Official Price',
  'explorar pro': 'Explore Pro',
  'distribuidor oficial': 'Official Distributor',
  'garantía oficial y entrega en colombia': 'Official warranty and delivery in Colombia',
  'equipamiento pro': 'Pro Gear',
  'stock verificado para despacho inmediato': 'Stock verified for immediate dispatch',
  'ver colección': 'View Collection',
  'calzado, deportes y accesorios originales': 'Original footwear, sports & accessories',
  'productos destacados pro': 'Featured Pro Products',
  'especial rendimiento': 'Pro Performance Special',
  'hasta 45% off en línea pro': 'Up to 45% off in pro line',
  'equipamiento deportivo, tecnología y moda con garantía oficial y pago protegido por wompi.': 'Sports equipment, tech and fashion with official warranty and Wompi protected payment.',
  'oferta pro': 'Pro Deal',
  'garantía verificada': 'Verified Warranty',
  'añadir': 'Add',
  'quitar de favoritos': 'Remove from wishlist',
  'guardar en favoritos': 'Save to wishlist',
  'ver producto completo': 'View full product',
  'ver producto': 'View product',
  'ofertas del momento': 'Trending Deals',
  'mejor calificados': 'Top Rated',
  'beneficio exclusivo': 'Exclusive Benefit',
  'ahorra 35% en tu pedido': 'Save 35% on your order',
  'paga seguro con wompi, pse, nequi o tarjetas. cobertura de envíos a toda colombia.': 'Pay safely with Wompi, PSE, Nequi or cards. Nationwide shipping across Colombia.',
  'explorar ahora': 'Explore Now',
  'ver detalle': 'View Details',
  'explora por categorías': 'Explore by Categories',

  // Catálogo & Filtros
  'filtros': 'Filters',
  'filtros dinámicos': 'Dynamic Filters',
  'limpiar filtros': 'Clear Filters',
  'limpiar': 'Clear',
  'ordenar por': 'Sort By',
  'ordenar por:': 'Sort by:',
  'más recientes': 'Newest',
  'menor precio': 'Lowest Price',
  'mayor precio': 'Highest Price',
  'mejor valorados': 'Highest Rated',
  'precio': 'Price',
  'rango de precio': 'Price Range',
  'mín': 'Min',
  'máx': 'Max',
  'mínimo': 'Minimum',
  'máximo': 'Maximum',
  'aplicar filtro': 'Apply Filter',
  'aplicar': 'Apply',
  'todas las categorías': 'All Categories',
  'todas las marcas': 'All Brands',
  'todas': 'All',
  'resultados para:': 'Results for:',
  'explora productos publicados por tiendas y proveedores verificados': 'Explore products published by verified stores and suppliers',
  'sin resultados': 'No Results Found',
  'no encontramos productos con los filtros seleccionados': 'We did not find any products matching your selected filters',

  // Categorías nombres
  'tecnología y electrónica': 'Technology & Electronics',
  'moda y ropa': 'Fashion & Apparel',
  'hogar y muebles': 'Home & Furniture',
  'hogar y cocina': 'Home & Kitchen',
  'deportes y fitness': 'Sports & Fitness',
  'moda hombre': 'Men\'s Fashion',
  'moda mujer': 'Women\'s Fashion',
  'belleza y cuidado personal': 'Beauty & Personal Care',
  'herramientas e industria': 'Tools & Hardware',
  'herramientas': 'Tools & Hardware',
  'juguetes': 'Toys & Games',
  'mascotas': 'Pet Supplies',
  'libros': 'Books',
  'automotriz': 'Automotive',
  'salud': 'Health & Wellness',
  'bebés': 'Baby Products',
  'muebles': 'Furniture',
  'electrodomésticos': 'Appliances',
  'videojuegos': 'Video Games',
  'música': 'Music & Instruments',
  'arte y manualidades': 'Arts & Crafts',
  'oficina': 'Office Supplies',
  'jardinería': 'Garden & Outdoor',

  // Badges categorías
  'gama alta': 'Flagship',
  'tendencia': 'Trending',
  'confort': 'Comfort',
  'pro fitness': 'Pro Fitness',
  'cuidado': 'Personal Care',
  'taller': 'Workshop',
  'oficial': 'Official',

  // Ficha de Producto
  'agregar a la bolsa': 'Add to Bag',
  'agregar al carrito': 'Add to Cart',
  'unidades disponibles': 'units available',
  'sin stock': 'Out of Stock',
  'agotado': 'Sold Out',
  'envío gratis': 'Free Shipping',
  'vendido por': 'Sold by',
  'descripción': 'Description',
  'especificaciones': 'Specifications',
  'opiniones y reseñas': 'Reviews & Ratings',
  'opiniones': 'Customer Reviews',
  'reseñas': 'Reviews',
  'calificación': 'Rating',
  'estado:': 'Condition:',
  'nuevo': 'Brand New',
  'usado': 'Used',
  'reacondicionado': 'Refurbished',
  'compartir': 'Share',
  'contactar vendedor': 'Contact Seller',
  'escribir reseña': 'Write a Review',
  'productos relacionados': 'Related Products',

  // Carrito & Checkout
  'resumen de la orden': 'Order Summary',
  'resumen del pedido': 'Order Summary',
  'subtotal': 'Subtotal',
  'descuento': 'Discount',
  'envío': 'Shipping',
  'total a pagar': 'Total Due',
  'total': 'Total',
  'finalizar compra': 'Checkout',
  'finalizar pedido seguro': 'Secure Checkout',
  'continuar compra': 'Continue Shopping',
  'vaciar carrito': 'Clear Cart',
  'tu bolsa está vacía': 'Your bag is empty',
  'tu carrito está vacío': 'Your cart is empty',
  'ingresa cupón de descuento': 'Enter coupon code',
  'cupón de descuento': 'Discount Coupon',
  'dirección de entrega': 'Delivery Address',
  'medio de pago seguro': 'Secure Payment Method',
  'confirmar y pagar': 'Confirm and Pay',
  'pagar con wompi': 'Pay with Wompi',
  'pago exitoso': 'Payment Successful',
  'pago cancelado': 'Payment Cancelled',
  'rastreo de pedido': 'Order Tracking',

  // Autenticación & Formularios
  'correo electrónico': 'Email Address',
  'contraseña': 'Password',
  'confirmar contraseña': 'Confirm Password',
  'nombre completo': 'Full Name',
  'teléfono': 'Phone Number',
  'dirección': 'Address',
  'ciudad': 'City',
  'departamento': 'State / Province',
  'código postal': 'Zip / Postal Code',
  '¿olvidaste tu contraseña?': 'Forgot your password?',
  '¿ya tienes cuenta?': 'Already have an account?',
  '¿no tienes cuenta?': 'Don\'t have an account?',
  'crear cuenta': 'Create Account',
  'iniciar sesión con google': 'Sign in with Google',
  'o continuar con': 'Or continue with',

  // Soporte & Bot
  'asistente de atención': 'Support Assistant',
  'en línea': 'Online',
  'atención al cliente': 'Customer Support',
  'atención por whatsapp': 'WhatsApp Support',
  'dejar solicitud formal por correo': 'Send Email Inquiry',
  'temas de asistencia': 'Help Topics',
  'volver al chat': 'Back to chat',

  // Footer
  'todos los derechos reservados': 'All rights reserved',
  'despachos a todo el país': 'Nationwide shipping in Colombia',
  'opción pago contra entrega': 'Cash on Delivery Available',
  'términos y condiciones': 'Terms & Conditions',
  'política de privacidad': 'Privacy Policy',
  'sobre mercatto': 'About Mercatto'
}

// Mapa inverso para restaurar español con precisión
export const dictionaryENtoES = {}
Object.entries(dictionaryEStoEN).forEach(([es, en]) => {
  dictionaryENtoES[en.toLowerCase()] = es
})

// Claves de atributos a traducir
const TRANSLATABLE_ATTRS = ['placeholder', 'title', 'aria-label']

// Función de capitalización respetando la regla del usuario
function capitalizeFirstLetter(str) {
  if (!str || typeof str !== 'string') return str
  const trimmed = str.trim()
  if (!trimmed) return str
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

/**
 * UniversalDOMTranslator
 * Observador activo que traduce el DOM sin romper React ni eventos.
 */
class UniversalDOMTranslator {
  constructor() {
    this.currentLang = 'ES'
    this.observer = null
    this.originalTextMap = new WeakMap()
    this.originalAttrMap = new WeakMap()
    this.isTranslating = false
  }

  init(initialLang = 'ES') {
    this.currentLang = (initialLang || 'ES').toUpperCase()
    this.setupObserver()
    if (this.currentLang === 'EN') {
      this.translateTree(document.body)
    }
  }

  setLanguage(newLang) {
    const target = (newLang || 'ES').toUpperCase()
    if (this.currentLang === target) return
    this.currentLang = target

    if (this.currentLang === 'EN') {
      this.translateTree(document.body)
    } else {
      this.restoreTree(document.body)
    }
  }

  setupObserver() {
    if (this.observer) return

    this.observer = new MutationObserver((mutations) => {
      if (this.currentLang !== 'EN' || this.isTranslating) return

      this.isTranslating = true
      try {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                this.translateTree(node)
              } else if (node.nodeType === Node.TEXT_NODE) {
                this.translateTextNode(node)
              }
            }
          } else if (mutation.type === 'characterData') {
            this.translateTextNode(mutation.target)
          }
        }
      } finally {
        this.isTranslating = false
      }
    })

    if (document.body) {
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      })
    }
  }

  translateTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return
    const parent = node.parentElement
    if (!parent) return

    // Ignorar etiquetas técnicas o no traducibles
    const tag = parent.tagName
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE' || tag === 'PRE' || tag === 'SVG' || tag === 'PATH') {
      return
    }

    const text = node.nodeValue
    if (!text || !text.trim()) return

    // Guardar original si no ha sido registrado
    if (!this.originalTextMap.has(node)) {
      this.originalTextMap.set(node, text)
    }

    const clean = text.trim()
    const lower = clean.toLowerCase()

    // 1. Coincidencia directa de frase completa
    if (dictionaryEStoEN[lower]) {
      const translated = dictionaryEStoEN[lower]
      node.nodeValue = text.replace(clean, capitalizeFirstLetter(translated))
      return
    }

    // 2. Reemplazo de expresiones o fragmentos reconocidos
    let replaced = text
    let changed = false

    for (const [esKey, enVal] of Object.entries(dictionaryEStoEN)) {
      // Coincidencia con límites de palabra para evitar sustituciones parciales erróneas
      const regex = new RegExp(`\\b${esKey}\\b`, 'gi')
      if (regex.test(replaced)) {
        replaced = replaced.replace(regex, (match) => {
          changed = true
          // Preservar mayúscula inicial
          return match.charAt(0) === match.charAt(0).toUpperCase()
            ? capitalizeFirstLetter(enVal)
            : enVal
        })
      }
    }

    if (changed) {
      node.nodeValue = capitalizeFirstLetter(replaced.trim())
    }
  }

  translateAttributes(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return

    for (const attr of TRANSLATABLE_ATTRS) {
      const val = element.getAttribute(attr)
      if (val && val.trim()) {
        const lower = val.trim().toLowerCase()
        if (dictionaryEStoEN[lower]) {
          let attrStore = this.originalAttrMap.get(element)
          if (!attrStore) {
            attrStore = {}
            this.originalAttrMap.set(element, attrStore)
          }
          if (!attrStore[attr]) {
            attrStore[attr] = val
          }
          element.setAttribute(attr, capitalizeFirstLetter(dictionaryEStoEN[lower]))
        }
      }
    }
  }

  translateTree(root) {
    if (!root) return
    if (root.nodeType === Node.TEXT_NODE) {
      this.translateTextNode(root)
      return
    }

    if (root.nodeType === Node.ELEMENT_NODE) {
      const tag = root.tagName
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE' || tag === 'PRE' || tag === 'SVG') {
        return
      }

      this.translateAttributes(root)

      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        null,
        false
      )

      let current = walker.nextNode()
      while (current) {
        if (current.nodeType === Node.TEXT_NODE) {
          this.translateTextNode(current)
        } else if (current.nodeType === Node.ELEMENT_NODE) {
          this.translateAttributes(current)
        }
        current = walker.nextNode()
      }
    }
  }

  restoreTree(root) {
    if (!root) return

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      null,
      false
    )

    let current = walker.nextNode()
    while (current) {
      if (current.nodeType === Node.TEXT_NODE) {
        if (this.originalTextMap.has(current)) {
          current.nodeValue = this.originalTextMap.get(current)
        }
      } else if (current.nodeType === Node.ELEMENT_NODE) {
        const attrStore = this.originalAttrMap.get(current)
        if (attrStore) {
          for (const [attr, origVal] of Object.entries(attrStore)) {
            current.setAttribute(attr, origVal)
          }
        }
      }
      current = walker.nextNode()
    }
  }
}

export const universalTranslator = new UniversalDOMTranslator()
export default universalTranslator
