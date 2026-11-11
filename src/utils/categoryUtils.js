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
