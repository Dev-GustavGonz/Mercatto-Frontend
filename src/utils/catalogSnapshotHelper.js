import catalogSnapshot from '@/data/catalogSnapshot.json'

export const isManualProduct = (p) =>
  Boolean(p) &&
  !String(p.sku || '').toUpperCase().startsWith('SEED-') &&
  Number(p.id || 0) > 0 &&
  Number(p.id || 0) < 5000

export const isManualStore = (t) =>
  Boolean(t) &&
  !t.demo &&
  Number(t.id || 0) > 0 &&
  Number(t.id || 0) < 5000

export const getPlanWeight = (prod, tiendasList = []) => {
  let s = (prod?.vendedor?.tipoSuscripcion || prod?.vendedor?.plan || '').toUpperCase()
  if (!s && (prod?.vendedor?.id || prod?.vendedorId) && Array.isArray(tiendasList)) {
    const vId = prod?.vendedor?.id || prod?.vendedorId
    const match = tiendasList.find((item) => String(item.id) === String(vId))
    if (match) s = (match.tipoSuscripcion || match.plan || '').toUpperCase()
  }
  if (s === 'ELITE') return 3
  if (s === 'PRO') return 2
  return 1
}

export const getSnapshotCategories = () =>
  Array.isArray(catalogSnapshot?.categories) ? [...catalogSnapshot.categories] : []

export const getSnapshotManualStores = () =>
  Array.isArray(catalogSnapshot?.manualStores)
    ? catalogSnapshot.manualStores.filter(isManualStore)
    : []

export const getSnapshotAllStores = () => {
  const list = Array.isArray(catalogSnapshot?.allStores) ? [...catalogSnapshot.allStores] : []
  return list.sort((a, b) => {
    const aMan = isManualStore(a)
    const bMan = isManualStore(b)
    if (aMan !== bMan) return aMan ? -1 : 1
    return 0
  })
}

export const getSnapshotManualProducts = () => {
  const list = Array.isArray(catalogSnapshot?.manualProducts)
    ? catalogSnapshot.manualProducts.filter(isManualProduct)
    : []
  return [...list].sort((a, b) => {
    const pDiff = getPlanWeight(b) - getPlanWeight(a)
    if (pDiff !== 0) return pDiff
    if (b.destacado !== a.destacado) return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0)
    if ((b.totalVentas || 0) !== (a.totalVentas || 0)) return (b.totalVentas || 0) - (a.totalVentas || 0)
    return (Number(b.id) || 0) - (Number(a.id) || 0)
  })
}

export const getSnapshotAllProducts = (extraLiveProducts = []) => {
  const manual = Array.isArray(catalogSnapshot?.manualProducts) ? catalogSnapshot.manualProducts : []
  const seed = Array.isArray(catalogSnapshot?.seedProducts) ? catalogSnapshot.seedProducts : []
  const byId = new Map()

  // Live products override snapshot entries with the same ID
  if (Array.isArray(extraLiveProducts)) {
    for (const p of extraLiveProducts) {
      if (p && p.id && p.activo !== false) {
        byId.set(Number(p.id), p)
      }
    }
  }
  for (const p of manual) {
    if (p && p.id && !byId.has(Number(p.id))) {
      byId.set(Number(p.id), p)
    }
  }
  for (const p of seed) {
    if (p && p.id && !byId.has(Number(p.id))) {
      byId.set(Number(p.id), p)
    }
  }
  return Array.from(byId.values())
}

export const findProductInSnapshot = (idOrSlug) => {
  if (!idOrSlug) return null
  const all = getSnapshotAllProducts()
  const isNumeric = !isNaN(idOrSlug)
  if (isNumeric) {
    const numId = Number(idOrSlug)
    return all.find((p) => Number(p.id) === numId) || null
  }
  const slugLower = String(idOrSlug).trim().toLowerCase()
  return all.find((p) => String(p.slug || '').toLowerCase() === slugLower) || null
}

export const findStoreInSnapshot = (storeId) => {
  if (!storeId) return null
  const numId = Number(storeId)
  return getSnapshotAllStores().find((t) => Number(t.id) === numId) || null
}

export const findStoreProductsInSnapshot = (storeId) => {
  if (!storeId) return []
  const numId = Number(storeId)
  return getSnapshotAllProducts().filter((p) => Number(p.vendedor?.id) === numId)
}

export const filterAndSortCatalogProducts = (
  allProducts,
  categories = [],
  { categoriaId = null, marca = '', q = '', precioMin = null, precioMax = null, soloElite = false, orden = 'recientes' } = {}
) => {
  let items = Array.isArray(allProducts) ? [...allProducts] : []
  const cats = Array.isArray(categories) && categories.length > 0 ? categories : getSnapshotCategories()

  // 1. Filtro por categoría (incluye subcategorías hijas si se selecciona una categoría principal)
  if (categoriaId) {
    const targetId = Number(categoriaId)
    const allowedCatIds = new Set([targetId])
    for (const c of cats) {
      if (Number(c?.padre?.id) === targetId) {
        allowedCatIds.add(Number(c.id))
      }
    }
    items = items.filter((p) => {
      const pCatId = Number(p?.categoria?.id)
      const pParentId = Number(p?.categoria?.padre?.id)
      return allowedCatIds.has(pCatId) || (pParentId > 0 && allowedCatIds.has(pParentId))
    })
  }

  // 2. Filtro por marca
  if (marca && String(marca).trim() !== '') {
    const marcaNorm = String(marca).trim().toLowerCase()
    items = items.filter((p) => String(p?.marca || '').trim().toLowerCase() === marcaNorm)
  }

  // 3. Filtro por término de búsqueda (q)
  if (q && String(q).trim() !== '') {
    const queryNorm = String(q).trim().toLowerCase()
    items = items.filter(
      (p) =>
        String(p?.titulo || '').toLowerCase().includes(queryNorm) ||
        String(p?.descripcion || '').toLowerCase().includes(queryNorm) ||
        String(p?.marca || '').toLowerCase().includes(queryNorm) ||
        String(p?.categoria?.nombre || '').toLowerCase().includes(queryNorm) ||
        String(p?.vendedor?.nombreTienda || '').toLowerCase().includes(queryNorm)
    )
  }

  // 4. Filtro por rango de precios
  if (precioMin !== null && precioMin !== '' && !isNaN(precioMin) && Number(precioMin) > 0) {
    const minVal = Number(precioMin)
    items = items.filter((p) => {
      const eff = p?.precioOferta && Number(p.precioOferta) > 0 ? Number(p.precioOferta) : Number(p?.precio || 0)
      return eff >= minVal
    })
  }
  if (precioMax !== null && precioMax !== '' && !isNaN(precioMax) && Number(precioMax) > 0) {
    const maxVal = Number(precioMax)
    items = items.filter((p) => {
      const eff = p?.precioOferta && Number(p.precioOferta) > 0 ? Number(p.precioOferta) : Number(p?.precio || 0)
      return eff <= maxVal
    })
  }

  // 5. Filtro exclusivo Plan Élite
  if (soloElite) {
    items = items.filter(
      (p) => String(p?.vendedor?.tipoSuscripcion || p?.vendedor?.plan || '').toUpperCase() === 'ELITE'
    )
  }

  // 6. Ordenamiento (garantizando que productos manuales salgan primero por defecto)
  items.sort((a, b) => {
    const aManual = isManualProduct(a)
    const bManual = isManualProduct(b)

    if (orden === 'precio_asc') {
      const pa = a?.precioOferta && Number(a.precioOferta) > 0 ? Number(a.precioOferta) : Number(a?.precio || 0)
      const pb = b?.precioOferta && Number(b.precioOferta) > 0 ? Number(b.precioOferta) : Number(b?.precio || 0)
      return pa - pb
    }
    if (orden === 'precio_desc') {
      const pa = a?.precioOferta && Number(a.precioOferta) > 0 ? Number(a.precioOferta) : Number(a?.precio || 0)
      const pb = b?.precioOferta && Number(b.precioOferta) > 0 ? Number(b.precioOferta) : Number(b?.precio || 0)
      return pb - pa
    }
    if (orden === 'calificacion') {
      if (aManual !== bManual) return aManual ? -1 : 1
      return (Number(b?.calificacion) || 0) - (Number(a?.calificacion) || 0)
    }
    if (orden === 'ventas') {
      if (aManual !== bManual) return aManual ? -1 : 1
      return (Number(b?.totalVentas) || 0) - (Number(a?.totalVentas) || 0)
    }

    // Por defecto ('recientes'): 100% productos manuales del usuario primero, luego seed de feria
    if (aManual !== bManual) return aManual ? -1 : 1

    const pDiff = getPlanWeight(b) - getPlanWeight(a)
    if (pDiff !== 0) return pDiff
    if (b.destacado !== a.destacado) return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0)
    if ((b.totalVentas || 0) !== (a.totalVentas || 0)) return (b.totalVentas || 0) - (a.totalVentas || 0)
    return new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0)
  })

  return items
}
