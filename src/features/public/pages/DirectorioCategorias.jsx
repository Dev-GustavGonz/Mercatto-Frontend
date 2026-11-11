import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productoService } from '@/features/productos'
import { apiCache } from '@/utils/apiCache'
import { getMediaUrl } from '@/utils/constants'
import {
  resolveCategoryVisualMeta,
  sortCategoriesHierarchically,
  translateCategoryName,
} from '@/utils/categoryUtils'
import { useLanguage } from '@/hooks/useLanguage'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import {
  Laptop,
  Smartphone,
  Shirt,
  Footprints,
  Sparkles,
  Home,
  Wrench,
  Activity,
  Utensils,
  ShoppingBasket,
  Search,
  Layers,
  ArrowRight,
} from 'lucide-react'

const ICON_MAP = {
  Laptop,
  Smartphone,
  Shirt,
  Footprints,
  Sparkles,
  Home,
  Wrench,
  Activity,
  Utensils,
  ShoppingBasket,
}

export const DirectorioCategorias = () => {
  const cachedCats = apiCache.peekData('/categorias/todas') || apiCache.peekData('/categorias')
  const [categorias, setCategorias] = useState(() => (Array.isArray(cachedCats) ? cachedCats : []))
  const [cargando, setCargando] = useState(!cachedCats || cachedCats.length === 0)
  const [busqueda, setBusqueda] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('TODAS') // 'TODAS' | 'PRINCIPALES' | 'SUBCATEGORIAS'
  const [padreFiltro, setPadreFiltro] = useState('')
  const { t, idioma } = useLanguage()
  const navigate = useNavigate()
  const isEn = (idioma || '').toUpperCase() === 'EN'

  useEffect(() => {
    let activo = true
    productoService
      .listarTodasCategorias()
      .then((data) => {
        if (activo) setCategorias(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        productoService
          .listarCategorias()
          .then((data) => {
            if (activo) setCategorias(Array.isArray(data) ? data : [])
          })
          .catch(() => {})
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  const categoriasOrdenadas = useMemo(() => sortCategoriesHierarchically(categorias), [categorias])

  const categoriasPrincipales = useMemo(
    () => categoriasOrdenadas.filter((c) => !c.padre?.id),
    [categoriasOrdenadas]
  )

  const categoriasFiltradas = useMemo(() => {
    const query = busqueda.trim().toLowerCase()
    return categoriasOrdenadas.filter((cat) => {
      const nombreTrad = translateCategoryName(cat.nombre, isEn).toLowerCase()
      const coincideTexto =
        !query ||
        (cat.nombre || '').toLowerCase().includes(query) ||
        nombreTrad.includes(query) ||
        (cat.descripcion || '').toLowerCase().includes(query) ||
        (cat.padre?.nombre || '').toLowerCase().includes(query)

      const esSub = Boolean(cat.padre?.id)
      const coincideTipo =
        tipoFiltro === 'TODAS' ||
        (tipoFiltro === 'PRINCIPALES' && !esSub) ||
        (tipoFiltro === 'SUBCATEGORIAS' && esSub)

      const coincidePadre =
        !padreFiltro ||
        String(cat.id) === String(padreFiltro) ||
        String(cat.padre?.id) === String(padreFiltro)

      return coincideTexto && coincideTipo && coincidePadre
    })
  }, [categoriasOrdenadas, busqueda, tipoFiltro, padreFiltro, isEn])

  const hayFiltros = Boolean(busqueda || tipoFiltro !== 'TODAS' || padreFiltro)

  const limpiarFiltros = () => {
    setBusqueda('')
    setTipoFiltro('TODAS')
    setPadreFiltro('')
  }

  return (
    <div className="space-y-8 pb-20 font-sans">
      {/* Encabezado limpio estilo claro */}
      <div className="flex flex-wrap items-end justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-[11px] font-extrabold tracking-widest uppercase text-violet-700 dark:text-violet-300">
            <Layers size={12} />
            <span>{isEn ? 'All Marketplace Categories' : 'Explora Mercatto por Categorías'}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isEn ? 'Categories Directory' : 'Directorio de Categorías'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Discover every category and subcategory available in our marketplace.'
              : 'Explora todas las categorías y subcategorías registradas para encontrar lo que buscas.'}
          </p>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros de Categorías */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={isEn ? 'Filter categories by name...' : 'Filtrar categorías por nombre o descripción...'}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder-slate-400 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-mercatto-primary transition"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 font-medium px-1">
            {categoriasPrincipales.length > 0 && (
              <select
                value={padreFiltro}
                onChange={(e) => setPadreFiltro(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-mercatto-primary cursor-pointer"
              >
                <option value="">{isEn ? 'All groups' : 'Todos los grupos'}</option>
                {categoriasPrincipales.map((p) => (
                  <option key={p.id} value={p.id}>
                    {translateCategoryName(p.nombre, isEn)}
                  </option>
                ))}
              </select>
            )}

            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {categoriasFiltradas.length} {t('categorias')}
            </span>

            {hayFiltros && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 underline cursor-pointer"
              >
                {t('limpiar')}
              </button>
            )}
          </div>
        </div>

        {/* Filtro rápido Principales / Subcategorías */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'TODAS', label: isEn ? 'All Categories' : 'Todas las categorías' },
            { id: 'PRINCIPALES', label: isEn ? 'Main Categories' : 'Categorías principales' },
            { id: 'SUBCATEGORIAS', label: isEn ? 'Subcategories' : 'Subcategorías' },
          ].map((opt) => (
            <button
              type="button"
              key={opt.id}
              onClick={() => setTipoFiltro(opt.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                tipoFiltro === opt.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-mercatto-border dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cuadrícula completa de Categorías */}
      {cargando ? (
        <Spinner size="lg" className="py-20" />
      ) : categoriasFiltradas.length === 0 ? (
        <EmptyState
          title={isEn ? 'No categories found' : 'No encontramos categorías'}
          description={isEn ? 'Try another search term or clear filters.' : 'Intenta buscar con otro término o limpia los filtros.'}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {categoriasFiltradas.map((cat) => {
            const meta = resolveCategoryVisualMeta(cat)
            const Icon = ICON_MAP[meta.iconKey] || Sparkles
            const imagen =
              cat.imagenUrl && cat.imagenUrl.trim() !== '' && !cat.imagenUrl.includes('photo-1541643600914')
                ? getMediaUrl(cat.imagenUrl, meta.imagen)
                : meta.imagen
            const badge = cat.padre?.nombre
              ? translateCategoryName(cat.padre.nombre, isEn)
              : t(meta.badgeKey)
            const nombreMostrado = translateCategoryName(cat.nombre, isEn)

            return (
              <div
                key={cat.id}
                onClick={() => navigate(`/catalogo?categoriaId=${cat.id}`)}
                className="group relative rounded-[28px] p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-violet-500/70 transition-all duration-300 flex flex-col justify-between min-h-[225px] cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1 select-none"
              >
                <div className="w-full flex items-center justify-between gap-2">
                  <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-violet-600 text-slate-500 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <Icon size={14} />
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/90 text-[10px] font-extrabold tracking-wide text-slate-500 dark:text-slate-400 group-hover:bg-emerald-500/15 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate max-w-[130px]">
                    {badge}
                  </span>
                </div>

                {/* Imagen con fondo blanco sin bordes */}
                <div className="relative w-full h-28 rounded-2xl bg-white dark:bg-white flex items-center justify-center p-1.5 overflow-hidden my-2">
                  <img
                    src={imagen}
                    alt={nombreMostrado}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = meta.imagen || '/images/bento/laptop.png'
                    }}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                      {nombreMostrado}
                    </h3>
                    <ArrowRight size={13} className="text-slate-300 group-hover:text-violet-600 shrink-0 transition-colors" />
                  </div>
                  {cat.descripcion && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {cat.descripcion}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DirectorioCategorias
