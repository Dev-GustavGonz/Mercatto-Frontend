// categoryUtils.js - Reusable category translation for bilingual marketplace
export const translateCategoryName = (nombre, isEn) => {
  if (!nombre) return ''
  if (!isEn) return nombre
  const n = String(nombre).toLowerCase().trim()
  if (n.includes('hogar') || n.includes('mueble')) return 'Home & Furniture'
  if (n.includes('tecnolog') || n.includes('electr')) return 'Technology & Electronics'
  if (n.includes('videojuego') || n.includes('juego') || n.includes('gamer')) return 'Video Games & Gaming'
  if (n.includes('moda') || n.includes('ropa')) return 'Fashion & Apparel'
  if (n.includes('calzado') || n.includes('zapato')) return 'Footwear & Shoes'
  if (n.includes('deporte') || n.includes('fitness')) return 'Sports & Fitness'
  if (n.includes('belleza') || n.includes('cuidado')) return 'Beauty & Personal Care'
  if (n.includes('herramienta') || n.includes('industria')) return 'Tools & Industry'
  if (n.includes('smart') || n.includes('celular') || n.includes('telefono')) return 'Smartphones & Mobile'
  if (n.includes('computador') || n.includes('laptop') || n.includes('pc')) return 'Laptops & Computers'
  if (n.includes('juguete')) return 'Toys & Hobbies'
  if (n.includes('accesorio')) return 'Accessories'
  if (n.includes('cocina')) return 'Kitchen & Cookware'
  return nombre
}
