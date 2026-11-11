import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import { getMediaUrl } from '@/utils/constants'
import { resolveCategoryVisualMeta, translateCategoryName } from '@/utils/categoryUtils'
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
  ArrowUpRight,
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

export const CategoriesShowcase = ({ categorias = [] }) => {
  const navigate = useNavigate()
  const { t, idioma } = useLanguage()
  const [categoriaActiva, setCategoriaActiva] = useState(null)

  const isEn = (idioma || '').toUpperCase() === 'EN'

  // Mostrar una selección compacta (hasta 6 categorías) sin scrollbar horizontal
  const listaCategorias = useMemo(() => {
    if (!categorias || categorias.length === 0) return []
    return categorias.slice(0, 6).map((cat) => {
      const meta = resolveCategoryVisualMeta(cat)
      const imagenFinal =
        cat.imagenUrl && cat.imagenUrl.trim() !== '' && !cat.imagenUrl.includes('photo-1541643600914')
          ? getMediaUrl(cat.imagenUrl, meta.imagen)
          : meta.imagen
      return {
        id: cat.id,
        nombre: translateCategoryName(cat.nombre, isEn),
        imagen: imagenFinal,
        fallbackImagen: meta.imagen,
        icono: ICON_MAP[meta.iconKey] || Sparkles,
        badge: cat.padre?.nombre ? translateCategoryName(cat.padre.nombre, isEn) : t(meta.badgeKey),
      }
    })
  }, [categorias, t, isEn])

  if (!listaCategorias || listaCategorias.length === 0) {
    return null
  }

  const handleSelect = (cat) => {
    setCategoriaActiva(cat.id)
    navigate(`/catalogo?categoriaId=${cat.id}`)
  }

  return (
    <section className="space-y-6">
      {/* Encabezado de la Sección */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('explora_por_categorias')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
              Mercatto
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isEn ? 'Featured categories — open the directory to see all' : 'Categorías destacadas — entra para verlas todas'}
          </p>
        </div>

        <button
          onClick={() => navigate('/categorias')}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-violet-400 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-violet-600 transition cursor-pointer shadow-xs"
        >
          <span>{isEn ? 'View all categories' : 'Ver todas las categorías'}</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Cuadrícula limpia de categorías destacadas (sin scrollbar) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5">
        {listaCategorias.map((cat) => {
          const Icon = cat.icono || Sparkles
          const esActivo = categoriaActiva === cat.id

          return (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat)}
              className={`group relative rounded-[28px] sm:rounded-[30px] p-4 bg-white dark:bg-slate-900 border transition-all duration-300 flex flex-col items-center justify-between min-h-[190px] cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1 select-none ${
                esActivo
                  ? 'border-emerald-500 ring-2 ring-emerald-500/25 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-slate-200/90 dark:border-slate-800 hover:border-violet-500/70'
              }`}
            >
              {/* Badge superior */}
              <div className="w-full flex items-center justify-between gap-2">
                <span className="w-6.5 h-6.5 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-violet-600 text-slate-500 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                  <Icon size={13} />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/90 text-[10px] font-extrabold tracking-wide text-slate-500 dark:text-slate-400 group-hover:bg-emerald-500/15 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate max-w-[115px]">
                  {cat.badge}
                </span>
              </div>

              {/* Imagen con fondo blanco sin bordes */}
              <div className="relative w-full h-24 sm:h-28 rounded-2xl bg-white dark:bg-white flex items-center justify-center p-1.5 overflow-hidden">
                <img
                  src={cat.imagen}
                  alt={cat.nombre}
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = cat.fallbackImagen || '/images/bento/laptop.png'
                  }}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Nombre de la Categoría */}
              <div className="w-full text-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span
                  className={`text-xs sm:text-sm font-extrabold transition-colors block truncate ${
                    esActivo
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400'
                  }`}
                >
                  {cat.nombre}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default CategoriesShowcase
