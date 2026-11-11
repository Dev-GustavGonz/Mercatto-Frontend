import React, { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import { getMediaUrl } from '@/utils/constants'
import { translateCategoryName } from '@/utils/categoryUtils'
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export const CategoriesShowcase = ({ categorias = [] }) => {
  const navigate = useNavigate()
  const { t, idioma } = useLanguage()
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const scrollRef = useRef(null)

  const scrollCategorias = (direccion) => {
    if (scrollRef.current) {
      const offset = direccion === 'left' ? -320 : 320
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
    }
  }

  // Imágenes de respaldo y estilos visuales según el tipo de categoría
  const visualMeta = useMemo(() => ({
    // Tecnología → MacBook Pro Studio
    1: { icono: Laptop,          imagen: '/images/bento/laptop.png',                                                            badgeKey: 'badge_flagship' },
    // Moda → Sneaker urbano Nike
    2: { icono: Shirt,           imagen: '/images/bento/sneaker.png',                                                           badgeKey: 'badge_tendencia' },
    // Hogar → Sofá de diseño nórdico
    3: { icono: Home,            imagen: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80', badgeKey: 'badge_confort' },
    // Deportes → Smartwatch Apple Watch Ultra Fitness
    4: { icono: Activity,        imagen: '/images/bento/smartwatch.png',                                                        badgeKey: 'badge_pro_fitness' },
    // Belleza → Perfume de alta gama & Skincare
    5: { icono: Sparkles,        imagen: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80', badgeKey: 'badge_cuidado' },
    // Herramientas → Taladro inalámbrico moderno de precisión
    6: { icono: Wrench,          imagen: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80', badgeKey: 'badge_taller' },
    // Smartphones (id 7) → iPhone 15 Pro
    7: { icono: Smartphone,      imagen: '/images/bento/smartphone.png',                                                        badgeKey: 'badge_flagship' },
    // Computadores / Audio (id 8) → Sony WH-1000XM5 Studio Headphones
    8: { icono: Laptop,          imagen: '/images/bento/headphones.png',                                                        badgeKey: 'badge_flagship' },
    // Calzado (id 9) → Sneaker local
    9: { icono: Footprints,      imagen: '/images/bento/sneaker.png',                                                           badgeKey: 'badge_tendencia' },
    // Cocina (id 10) → Sartenes y menaje chef
   10: { icono: Utensils,        imagen: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80', badgeKey: 'badge_confort' },
   // Supermercado / Alimentos
   11: { icono: ShoppingBasket,  imagen: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80', badgeKey: 'badge_oficial' }
  }), [])

  // Resolución inteligente de metadatos según nombre de categoría (priorizando nombre real antes que ID)
  const resolverMeta = (cat) => {
    const nombre = (cat.nombre || '').toLowerCase()
    if (nombre.includes('celular') || nombre.includes('phone') || nombre.includes('smart')) return visualMeta[7]
    if (nombre.includes('computador') || nombre.includes('laptop') || nombre.includes('audifono') || nombre.includes('audio')) return visualMeta[8]
    if (nombre.includes('calzado') || nombre.includes('zapato') || nombre.includes('tenis')) return visualMeta[9]
    if (nombre.includes('cocina') || nombre.includes('menaje')) return visualMeta[10]
    if (nombre.includes('supermercado') || nombre.includes('alimento') || nombre.includes('mercado')) return visualMeta[11]
    if (nombre.includes('tecno') || nombre.includes('elect')) return visualMeta[1]
    if (nombre.includes('moda') || nombre.includes('ropa')) return visualMeta[2]
    if (nombre.includes('hogar') || nombre.includes('mueble')) return visualMeta[3]
    if (nombre.includes('deporte') || nombre.includes('fitness')) return visualMeta[4]
    if (nombre.includes('belleza') || nombre.includes('cuidado')) return visualMeta[5]
    if (nombre.includes('herramienta') || nombre.includes('industria')) return visualMeta[6]
    if (visualMeta[cat.id]) return visualMeta[cat.id]
    return { icono: Sparkles, imagen: '/images/bento/laptop.png', badgeKey: 'badge_oficial' }
  }

  const isEn = (idioma || '').toUpperCase() === 'EN'

  // Lista de categorías con textos traducidos vinculadas exclusivamente a la base de datos
  const listaCategorias = useMemo(() => {
    if (categorias && categorias.length > 0) {
      return categorias.map((cat) => {
        const meta = resolverMeta(cat)
        const imagenFinal = (cat.imagenUrl && cat.imagenUrl.trim() !== '' && !cat.imagenUrl.includes('photo-1541643600914')) 
          ? getMediaUrl(cat.imagenUrl, meta.imagen) 
          : meta.imagen
        return {
          id: cat.id,
          nombre: translateCategoryName(cat.nombre, isEn),
          imagen: imagenFinal,
          fallbackImagen: meta.imagen,
          icono: meta.icono,
          badge: cat.padre?.nombre ? translateCategoryName(cat.padre.nombre, isEn) : t(meta.badgeKey)
        }
      })
    }
    return []
  }, [categorias, visualMeta, t, isEn])

  if (!listaCategorias || listaCategorias.length === 0) {
    return null
  }

  const handleSelect = (cat) => {
    setCategoriaActiva(cat.id)
    navigate(`/catalogo?categoriaId=${cat.id}`)
  }

  return (
    <section className="space-y-5 overflow-hidden">
      
      {/* Encabezado estilo carrusel (igual que Tiendas Oficiales) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('explora_por_categorias')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
              Mercatto
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isEn ? 'Browse all marketplace categories and subcategories' : 'Desliza para explorar todas las categorías disponibles'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => navigate('/catalogo')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-violet-400 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-violet-600 transition cursor-pointer shadow-xs"
          >
            <span>{t('ver_todo_catalogo')}</span>
            <ArrowUpRight size={14} />
          </button>

          <button
            onClick={() => scrollCategorias('left')}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-400 text-slate-600 dark:text-slate-300 hover:text-violet-600 flex items-center justify-center shadow-xs transition cursor-pointer"
            title={isEn ? 'Previous' : 'Anterior'}
            aria-label={isEn ? 'Previous categories' : 'Categorías anteriores'}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollCategorias('right')}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-400 text-slate-600 dark:text-slate-300 hover:text-violet-600 flex items-center justify-center shadow-xs transition cursor-pointer"
            title={isEn ? 'Next' : 'Siguiente'}
            aria-label={isEn ? 'Next categories' : 'Siguientes categorías'}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Carrusel horizontal de Tarjetas Bento */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none -mr-4 sm:-mr-6 lg:-mr-8 pr-12 sm:pr-16"
      >
        {listaCategorias.map((cat) => {
          const Icon = cat.icono || Sparkles
          const esActivo = categoriaActiva === cat.id

          return (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat)}
              className={`w-44 sm:w-52 shrink-0 group relative rounded-[28px] sm:rounded-[30px] p-4 bg-white dark:bg-slate-900 border transition-all duration-300 flex flex-col items-center justify-between min-h-[190px] cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1 select-none ${
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

              {/* Imagen de Producto Real de la Categoría */}
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

              {/* Nombre de la Categoría con Mayúscula Inicial */}
              <div className="w-full text-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span className={`text-xs sm:text-sm font-extrabold transition-colors block truncate ${
                  esActivo 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-slate-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400'
                }`}>
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
