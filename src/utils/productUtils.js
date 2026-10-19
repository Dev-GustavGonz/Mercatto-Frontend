/**
 * productUtils.js
 * Utilidades para normalización y resolución de imágenes de productos de la base de datos.
 */

export const resolveProductImage = (prod) => {
  if (!prod) return '/images/bento/headphones.png'

  // 1. Imagen principal o primera imagen del arreglo de imagenes
  if (prod.imagenes && Array.isArray(prod.imagenes) && prod.imagenes.length > 0) {
    const principal = prod.imagenes.find(i => i.principal || i.esPrincipal)
    if (principal?.url && principal.url.trim() !== '') return principal.url
    if (prod.imagenes[0]?.url && prod.imagenes[0].url.trim() !== '') return prod.imagenes[0].url
  }

  // 2. Propiedad imagenUrl directa
  if (prod.imagenUrl && typeof prod.imagenUrl === 'string' && prod.imagenUrl.trim() !== '') {
    return prod.imagenUrl
  }

  // 3. Propiedad imagen directa
  if (prod.imagen && typeof prod.imagen === 'string' && prod.imagen.trim() !== '') {
    return prod.imagen
  }

  // 4. Mapeo contextual por título o categoría para que NUNCA aparezca rota
  const title = (prod.titulo || '').toLowerCase()
  const cat = (prod.categoria?.nombre || '').toLowerCase()

  if (title.includes('nevera') || title.includes('refrigerador') || cat.includes('electrodomésticos')) {
    return 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80'
  }
  if (title.includes('ventilador') || title.includes('aire') || title.includes('clima')) {
    return 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80'
  }
  if (title.includes('audio') || title.includes('audífono') || title.includes('sound') || cat.includes('audio') || title.includes('sony')) {
    return '/images/bento/headphones.png'
  }
  if (title.includes('phone') || title.includes('celular') || title.includes('móvil') || cat.includes('smartphones') || title.includes('iphone')) {
    return '/images/bento/smartphone.png'
  }
  if (title.includes('watch') || title.includes('reloj') || cat.includes('fitness') || cat.includes('deportes')) {
    return '/images/bento/smartwatch.png'
  }
  if (title.includes('camera') || title.includes('cámara') || title.includes('canon')) {
    return '/images/bento/camera.png'
  }
  if (title.includes('laptop') || title.includes('computador') || cat.includes('tecnología') || title.includes('macbook')) {
    return '/images/bento/laptop.png'
  }
  if (cat.includes('moda') || title.includes('tenis') || title.includes('calzado') || title.includes('zapato') || title.includes('sneaker')) {
    return '/images/bento/sneaker.png'
  }

  // Fallback por defecto limpio
  return '/images/bento/headphones.png'
}
