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
  if (n.includes('supermercado') || n.includes('alimento')) return 'Supermarket & Groceries'
  return nombre
}

/**
 * Ordena una lista de categorías (plana o con subcategorías anidadas) agrupando cada
 * subcategoría debajo de su categoría padre, añadiendo `_depth` y `_parentName`.
 */
export const sortCategoriesHierarchically = (categorias = []) => {
  if (!Array.isArray(categorias) || categorias.length === 0) return []

  // Aplanar en caso de recibir categorías con `subcategorias` anidadas y deduplicar por ID
  const flatMap = new Map()
  const collect = (list, fallbackParent = null) => {
    for (const item of list) {
      if (!item || item.id == null) continue
      const padre = item.padre || fallbackParent
      if (!flatMap.has(item.id)) {
        flatMap.set(item.id, padre ? { ...item, padre } : item)
      }
      if (Array.isArray(item.subcategorias) && item.subcategorias.length > 0) {
        collect(item.subcategorias, { id: item.id, nombre: item.nombre })
      }
    }
  }
  collect(categorias)

  const items = Array.from(flatMap.values())
  const idSet = new Set(items.map((c) => c.id))
  const childrenByParent = new Map()

  for (const cat of items) {
    const parentId = cat.padre?.id
    if (parentId && idSet.has(parentId) && parentId !== cat.id) {
      if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, [])
      childrenByParent.get(parentId).push(cat)
    }
  }

  const ordered = []
  const visited = new Set()

  const visit = (cat, depth = 0, parentName = null) => {
    if (visited.has(cat.id)) return
    visited.add(cat.id)
    ordered.push({ ...cat, _depth: depth, _parentName: parentName })
    const children = childrenByParent.get(cat.id) || []
    for (const child of children) {
      visit(child, depth + 1, cat.nombre)
    }
  }

  for (const cat of items) {
    const parentId = cat.padre?.id
    if (!parentId || !idSet.has(parentId) || parentId === cat.id) {
      visit(cat, 0, null)
    }
  }
  for (const cat of items) {
    if (!visited.has(cat.id)) {
      visit(cat, 0, cat.padre?.nombre || null)
    }
  }

  return ordered
}

const CATEGORY_VISUAL_PRESETS = {
  1:  { iconKey: 'Laptop',         imagen: '/images/bento/laptop.png',                                                            badgeKey: 'badge_flagship' },
  2:  { iconKey: 'Shirt',          imagen: '/images/bento/sneaker.png',                                                           badgeKey: 'badge_tendencia' },
  3:  { iconKey: 'Home',           imagen: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80', badgeKey: 'badge_confort' },
  4:  { iconKey: 'Activity',       imagen: '/images/bento/smartwatch.png',                                                        badgeKey: 'badge_pro_fitness' },
  5:  { iconKey: 'Sparkles',       imagen: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80', badgeKey: 'badge_cuidado' },
  6:  { iconKey: 'Wrench',         imagen: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80', badgeKey: 'badge_taller' },
  7:  { iconKey: 'Smartphone',     imagen: '/images/bento/smartphone.png',                                                        badgeKey: 'badge_flagship' },
  8:  { iconKey: 'Laptop',         imagen: '/images/bento/headphones.png',                                                        badgeKey: 'badge_flagship' },
  9:  { iconKey: 'Footprints',     imagen: '/images/bento/sneaker.png',                                                           badgeKey: 'badge_tendencia' },
  10: { iconKey: 'Utensils',       imagen: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80', badgeKey: 'badge_confort' },
  11: { iconKey: 'ShoppingBasket', imagen: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80', badgeKey: 'badge_oficial' },
}

/**
 * Resuelve metadatos visuales (icono, imagen de respaldo y badge) priorizando el nombre real.
 */
export const resolveCategoryVisualMeta = (cat) => {
  const nombre = (cat?.nombre || '').toLowerCase()
  if (nombre.includes('celular') || nombre.includes('phone') || nombre.includes('smart')) return CATEGORY_VISUAL_PRESETS[7]
  if (nombre.includes('computador') || nombre.includes('laptop') || nombre.includes('audifono') || nombre.includes('audio')) return CATEGORY_VISUAL_PRESETS[8]
  if (nombre.includes('calzado') || nombre.includes('zapato') || nombre.includes('tenis')) return CATEGORY_VISUAL_PRESETS[9]
  if (nombre.includes('cocina') || nombre.includes('menaje')) return CATEGORY_VISUAL_PRESETS[10]
  if (nombre.includes('supermercado') || nombre.includes('alimento') || nombre.includes('mercado')) return CATEGORY_VISUAL_PRESETS[11]
  if (nombre.includes('tecno') || nombre.includes('elect')) return CATEGORY_VISUAL_PRESETS[1]
  if (nombre.includes('moda') || nombre.includes('ropa')) return CATEGORY_VISUAL_PRESETS[2]
  if (nombre.includes('hogar') || nombre.includes('mueble')) return CATEGORY_VISUAL_PRESETS[3]
  if (nombre.includes('deporte') || nombre.includes('fitness')) return CATEGORY_VISUAL_PRESETS[4]
  if (nombre.includes('belleza') || nombre.includes('cuidado')) return CATEGORY_VISUAL_PRESETS[5]
  if (nombre.includes('herramienta') || nombre.includes('industria')) return CATEGORY_VISUAL_PRESETS[6]
  if (cat?.id && CATEGORY_VISUAL_PRESETS[cat.id]) return CATEGORY_VISUAL_PRESETS[cat.id]
  return { iconKey: 'Sparkles', imagen: '/images/bento/laptop.png', badgeKey: 'badge_oficial' }
}
