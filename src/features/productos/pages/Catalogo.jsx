import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productoService } from '@/features/productos'
import { apiCache } from '@/utils/apiCache'
import ProductGrid from '../components/ProductGrid'
import ProductFilters from '../components/ProductFilters'
import Pagination from '@/components/common/Pagination'
import ModalContactoVendedor from '../components/ModalContactoVendedor'
import { Crown, Sparkles } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

const formatCatalogItems = (data, soloElite, orden) => {
  let items = data?.content ? [...data.content] : []
  if (soloElite) {
    items = items.filter((p) => (p.vendedor?.tipoSuscripcion || p.vendedor?.plan || '').toUpperCase() === 'ELITE')
  }
  if (!orden || orden === 'recientes') {
    items.sort((a, b) => {
      const getPriority = (p) => {
        const s = (p.vendedor?.tipoSuscripcion || p.vendedor?.plan || '').toUpperCase()
        if (s === 'ELITE') return 3
        if (s === 'PRO') return 2
        return 1
      }
      const pDiff = getPriority(b) - getPriority(a)
      if (pDiff !== 0) return pDiff
      if (b.destacado !== a.destacado) return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0)
      return (b.totalVentas || 0) - (a.totalVentas || 0)
    })
  }
  return items
}

export const Catalogo = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [productoContacto, setProductoContacto] = useState(null)
  const { t, idioma } = useLanguage()
  const isEn = (idioma || '').toUpperCase() === 'EN'

  const categoriaId = searchParams.get('categoriaId') || null
  const marca = searchParams.get('marca') || ''
  const termino = searchParams.get('q') || ''
  const orden = searchParams.get('orden') || 'recientes'
  const pagina = Number(searchParams.get('pagina') || 0)
  const precioMin = searchParams.get('precioMin') ? Number(searchParams.get('precioMin')) : null
  const precioMax = searchParams.get('precioMax') ? Number(searchParams.get('precioMax')) : null
  const soloElite = searchParams.get('soloElite') === 'true'

  const queryParams = useMemo(() => ({
    categoriaId,
    marca: marca || null,
    q: termino,
    orden,
    pagina,
    precioMin,
    precioMax,
    soloElite: soloElite ? true : undefined,
    tamano: 12,
  }), [categoriaId, marca, termino, orden, pagina, precioMin, precioMax, soloElite])

  const initialCached = apiCache.peekExact('/productos', queryParams)
  const [productos, setProductos] = useState(() => (initialCached ? formatCatalogItems(initialCached, soloElite, orden) : []))
  const [totalPages, setTotalPages] = useState(() => initialCached?.totalPages || 0)
  const [totalElements, setTotalElements] = useState(() => initialCached?.totalElements ?? (initialCached?.content?.length || 0))
  const [loading, setLoading] = useState(!initialCached)

  useEffect(() => {
    let activo = true
    const cached = apiCache.peekExact('/productos', queryParams)
    if (cached) {
      const items = formatCatalogItems(cached, soloElite, orden)
      setProductos(items)
      setTotalPages(cached.totalPages || 0)
      setTotalElements(cached.totalElements ?? items.length)
      setLoading(false)
    } else {
      setLoading(true)
    }

    const fetchProductos = async () => {
      try {
        const data = await productoService.listar(queryParams)
        if (!activo) return
        const items = formatCatalogItems(data, soloElite, orden)
        setProductos(items)
        setTotalPages(data.totalPages || 0)
        setTotalElements(data.totalElements ?? items.length)
      } catch {
        if (!activo || cached) return
        setProductos([])
        setTotalPages(0)
        setTotalElements(0)
      } finally {
        if (activo) setLoading(false)
      }
    }
    fetchProductos()
    return () => {
      activo = false
    }
  }, [queryParams, soloElite, orden])

  const handleCategoryChange = (catId) => {
    const next = new URLSearchParams(searchParams)
    if (catId) next.set('categoriaId', catId)
    else next.delete('categoriaId')
    next.set('pagina', '0')
    setSearchParams(next)
  }

  const handleMarcaChange = (nuevaMarca) => {
    const next = new URLSearchParams(searchParams)
    if (nuevaMarca) next.set('marca', nuevaMarca)
    else next.delete('marca')
    next.set('pagina', '0')
    setSearchParams(next)
  }

  const handlePriceChange = ({ min, max }) => {
    const next = new URLSearchParams(searchParams)
    if (min) next.set('precioMin', min)
    else next.delete('precioMin')
    if (max) next.set('precioMax', max)
    else next.delete('precioMax')
    next.set('pagina', '0')
    setSearchParams(next)
  }

  const handleSoloEliteChange = (checked) => {
    const next = new URLSearchParams(searchParams)
    if (checked) next.set('soloElite', 'true')
    else next.delete('soloElite')
    next.set('pagina', '0')
    setSearchParams(next)
  }

  const handleOrdenChange = (newOrden) => {
    const next = new URLSearchParams(searchParams)
    next.set('orden', newOrden)
    next.set('pagina', '0')
    setSearchParams(next)
  }

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams)
    next.set('pagina', newPage.toString())
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setSearchParams({})
  }

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Encabezado limpio estilo claro */}
      <div className="flex flex-wrap items-end justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-[11px] font-extrabold tracking-widest uppercase text-violet-700 dark:text-violet-300">
            <Sparkles size={12} />
            <span>{isEn ? 'Official Mercatto Marketplace' : 'Catálogo Oficial Mercatto'}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {termino ? `${t('resultados_para')}: "${termino}"` : t('catalogo_de_productos')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('explora_productos_publicados')}
          </p>
        </div>

        {!loading && (
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
            {totalElements} {totalElements === 1 ? 'producto' : 'productos'}
          </span>
        )}
      </div>

      {soloElite && (
        <div className="flex items-center justify-between gap-3 p-3.5 bg-gradient-to-r bg-mercatto-elite-bg/50 border border-amber-300/70 rounded-2xl animate-in fade-in">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-mercatto-elite-text dark:text-amber-200">
            <Crown size={18} className="text-amber-600 fill-amber-500/20 shrink-0" />
            <span>Filtro Exclusivo Activado: Mostrando productos de Tiendas con Plan Élite</span>
          </div>
          <button
            onClick={() => handleSoloEliteChange(false)}
            className="text-xs font-bold text-amber-900 dark:text-amber-100 bg-white/90 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700 transition cursor-pointer shadow-xs"
          >
            Quitar filtro
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            selectedCategory={categoriaId}
            onCategoryChange={handleCategoryChange}
            selectedMarca={marca}
            onMarcaChange={handleMarcaChange}
            priceRange={{ min: precioMin, max: precioMax }}
            onPriceChange={handlePriceChange}
            orden={orden}
            onOrdenChange={handleOrdenChange}
            soloElite={soloElite}
            onSoloEliteChange={handleSoloEliteChange}
            onReset={handleReset}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          <ProductGrid
            productos={productos}
            loading={loading}
            onContactClick={(prod) => setProductoContacto(prod)}
          />

          <Pagination
            currentPage={pagina}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {productoContacto && (
        <ModalContactoVendedor
          isOpen={true}
          producto={productoContacto}
          onClose={() => setProductoContacto(null)}
        />
      )}
    </div>
  )
}

export default Catalogo
