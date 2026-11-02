// categoryUtils.js - Reusable category translation for bilingual marketplace
export const translateCategoryName = (nombre, isEn) => {
  if (!nombre) return ''
  if (!isEn) return nombre
  const n = String(nombre).toLowerCase().trim()
  if (n.includes('hogar') || n.includes('mueble')) return 'Home & Furniture'
  if (n.includes('tecnolog') || n.includes('electr')) return 'Technology & Electronics'
  if (n.includes('moda') || n.includes('ropa')) return 'Fashion & Apparel'
  if (n.includes('deporte') || n.includes('fitness')) return 'Sports & Fitness'
  if (n.includes('belleza') || n.includes('cuidado')) return 'Beauty & Personal Care'
  if (n.includes('herramienta') || n.includes('industria')) return 'Tools & Industry'
  if (n.includes('smart') || n.includes('celular')) return 'Smartphones & Mobile'
  if (n.includes('computador') || n.includes('laptop')) return 'Laptops & Computers'
  if (n.includes('calzado')) return 'Sports Footwear'
  if (n.includes('cocina')) return 'Kitchen & Cookware'
  return nombre
}
