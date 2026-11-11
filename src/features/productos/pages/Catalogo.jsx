import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productoService } from '@/features/productos'
import ProductGrid from '../components/ProductGrid'
import ProductFilters from '../components/ProductFilters'
import Pagination from '@/components/common/Pagination'
import ModalContactoVendedor from '../components/ModalContactoVendedor'
import { Crown, Sparkles, Search, Layers } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { sortCategoriesHierarchically, translateCategoryName } from '@/utils/categoryUtils'
import { apiCache } from '@/utils/apiCache'

export const Catalogo = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState(
    () => apiCache.peekData('/categorias/todas') || apiCache.peekData('/categorias') || []
  )
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
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

  const [busquedaInput, setBusquedaInput] = useState(termino)

  useEffect(() => {
    setBusquedaInput(termino)
  }, [termino])

  useEffect(() => {
    productoService
      .listarTodasCategorias({ noCache: true, params: { _t: Date.now() } })
      .then((data) => setCategorias(Array.isArray(data) ? data : []))
      .catch(() => {
        productoService.listarCategorias().then((data) => setCategorias(data || [])).catch(() => {})
      })
  }, [])

  const categoriasOrdenadas = useMemo(() => sortCategoriesHierarchically(categorias), [categorias])

  useEffect(() => {
    const trimmed = busquedaInput.trim()
    if (trimmed === termino) return
    const timer = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      if (trimmed) next.set('q', trimmed)
      else next.delete('q')
      next.set('pagina', '0')
      setSearchParams(next)
    }, 300)
    return () => clearTimeout(timer)
  }, [busquedaInput])

  const aplicarBusquedaDirecta = (e) => {
    e.preventDefault()
    const trimmed = busquedaInput.trim()
    const next = new URLSearchParams(searchParams)
    if (trimmed) next.set('q', trimmed)
    else next.delete('q')
    next.set('pagina', '0')
    setSearchParams(next)
  }

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true)
      try {
        const data = await productoService.listar({
          categoriaId,
          marca: marca || null,
          q: termino,
          orden,
          pagina,
          precioMin,
          precioMax,
          soloElite: soloElite ? true : undefined,
          tamano: 12,
        })
        let items = data.content || []
        if (soloElite) {
          items = items.filter(p => (p.vendedor?.tipoSuscripcion || p.vendedor?.plan || '').toUpperCase() === 'ELITE')
        }
        // Si no hay un orden de precio o ventas explícito, priorizar por membresía: ÉLITE > PRO > STARTER
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
        setProductos(items)
        setTotalPages(data.totalPages || 0)
        setTotalElements(data.totalElements ?? items.length)
      } catch {
        setProductos([])
        setTotalPages(0)
        setTotalElements(0)
      } finally {
        setLoading(false)
      }
    }
    fetchProductos()
  }, [categoriaId, marca, termino, orden, pagina, precioMin, precioMax, soloElite])

  const handleCategoryChange = (catId) => {
    const next = new URLSearchParams(searchParams)
    if (catId) {
      next.set('categoriaId', catId)
    } else {
      next.delete('categoriaId')
    }
    next.set('pagina', '0')
    setSearchParams(next)
  }

  const handleMarcaChange = (nuevaMarca) => {
    const next = new URLSearchParams(searchParams)
    if (nuevaMarca) {
      next.set('marca', nuevaMarca)
    } else {
      next.delete('marca')
    }
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
    if (checked) {
      next.set('soloElite', 'true')
    } else {
      next.delete('soloElite')
    }
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

  const hayFiltrosActivos = Boolean(
    categoriaId || marca || termino || precioMin || precioMax || soloElite || orden !== 'recientes'
  )

  return (
    <div className="space-y-8 pb-20 font-sans">
      {/* Hero Banner Catálogo (estilo Directorio de Tiendas) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mercatto-surface0/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30 backdrop-blur-sm">
            <Sparkles size={14} className="text-amber-400" />
            <span>{isEn ? 'Official Mercatto Marketplace' : 'Catálogo Oficial Mercatto'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {termino ? `${t('resultados_para')}: "${termino}"` : t('catalogo_de_productos')}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('explora_productos_publicados')}
          </p>

          {/* Barra de búsqueda dentro del Hero */}
          <form onSubmit={aplicarBusquedaDirecta} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={isEn ? 'Search products, brands or keywords...' : 'Buscar productos, marcas o palabras clave...'}
                value={busquedaInput}
                onChange={(e) => setBusquedaInput(e.target.value)}
                className="w-full pl-11 pr-9 py-3 bg-white/10 text-white placeholder-slate-400 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 backdrop-blur-md text-sm transition"
              />
              {busquedaInput && (
                <button
                  type="button"
                  onClick={() => {
                    setBusquedaInput('')
                    const next = new URLSearchParams(searchParams)
                    next.delete('q')
                    next.set('pagina', '0')
                    setSearchParams(next)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-mercatto-primary/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Barra de Búsqueda, Ordenamiento y Chips de Categorías */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={isEn ? 'Filter by product name or brand...' : 'Filtrar por nombre de producto o marca...'}
              value={busquedaInput}
              onChange={(e) => setBusquedaInput(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder-slate-400 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-mercatto-primary transition"
            />
            {busquedaInput && (
              <button
                type="button"
                onClick={() => {
                  setBusquedaInput('')
                  const next = new URLSearchParams(searchParams)
                  next.delete('q')
                  next.set('pagina', '0')
                  setSearchParams(next)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 font-medium px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-normal">{t('ordenar_por')}:</span>
              <select
                value={orden}
                onChange={(e) => handleOrdenChange(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-mercatto-primary cursor-pointer"
              >
                <option value="recientes">{t('mas_recientes')}</option>
                <option value="precio_asc">{t('menor_precio')}</option>
                <option value="precio_desc">{t('mayor_precio')}</option>
                <option value="calificacion">{t('mejor_valorados')}</option>
                <option value="ventas">{t('mas_vendidos')}</option>
              </select>
            </div>
            {!loading && (
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {totalElements} {totalElements === 1 ? 'producto' : 'productos'}
              </span>
            )}
            {hayFiltrosActivos && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 underline cursor-pointer"
              >
                {t('limpiar')}
              </button>
            )}
          </div>
        </div>

        {/* Barra rápida de categorías + filtro Élite */}
        {categoriasOrdenadas.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => handleCategoryChange(null)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                !categoriaId
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-mercatto-border dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              <Layers size={13} />
              <span>{t('todas_las_categorias')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSoloEliteChange(!soloElite)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                soloElite
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm ring-1 ring-amber-300'
                  : 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 hover:bg-amber-50 dark:hover:bg-amber-950/20'
              }`}
            >
              <Crown size={13} className="text-amber-600 dark:text-amber-400 fill-amber-500/20" />
              <span>Plan Élite</span>
            </button>

            {categoriasOrdenadas.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => handleCategoryChange(String(categoriaId) === String(cat.id) ? null : cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  String(categoriaId) === String(cat.id)
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-mercatto-border dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                {translateCategoryName(cat.nombre, isEn)}
              </button>
            ))}
          </div>
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
