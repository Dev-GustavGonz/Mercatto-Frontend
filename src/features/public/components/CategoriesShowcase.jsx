import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
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
  ArrowUpRight
} from 'lucide-react'

export const CategoriesShowcase = ({ categorias = [] }) => {
  const navigate = useNavigate()
  const { t, idioma } = useLanguage()
  const [categoriaActiva, setCategoriaActiva] = useState(null)

  // Imágenes de productos reales de alta fidelidad alusivas a cada categoría
  const visualMeta = useMemo(() => ({
    // Tecnología → MacBook Pro Studio
    1: { icono: Laptop,     imagen: '/images/bento/laptop.png',                                                            badgeKey: 'badge_flagship',    nameKey: 'cat_tecnologia', badgeDefault: 'MacBook & PC' },
    // Moda → Sneaker urbano Nike
    2: { icono: Shirt,      imagen: '/images/bento/sneaker.png',                                                           badgeKey: 'badge_tendencia',   nameKey: 'cat_moda',       badgeDefault: 'Streetwear' },
    // Hogar → Sofá de diseño nórdico
    3: { icono: Home,       imagen: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80', badgeKey: 'badge_confort',     nameKey: 'cat_hogar',      badgeDefault: 'Muebles & Deco' },
    // Deportes → Smartwatch Apple Watch Ultra Fitness
    4: { icono: Activity,   imagen: '/images/bento/smartwatch.png',                                                        badgeKey: 'badge_pro_fitness', nameKey: 'cat_deportes',   badgeDefault: 'Fitness & Gym' },
    // Belleza → Perfume de alta gama & Skincare
    5: { icono: Sparkles,   imagen: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80', badgeKey: 'badge_cuidado',    nameKey: 'cat_belleza',    badgeDefault: 'Cosmética & Spa' },
    // Herramientas → Taladro inalámbrico moderno de precisión
    6: { icono: Wrench,     imagen: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80', badgeKey: 'badge_taller',     nameKey: 'cat_herramientas', badgeDefault: 'Taller Industrial' },
    // Smartphones (id 7) → iPhone 15 Pro
    7: { icono: Smartphone, imagen: '/images/bento/smartphone.png',                                                        badgeKey: 'badge_flagship',    nameKey: 'cat_tecnologia', badgeDefault: 'Smartphones' },
    // Accesorios tech (id 8) → Sony WH-1000XM5 Studio Headphones
    8: { icono: Laptop,     imagen: '/images/bento/headphones.png',                                                        badgeKey: 'badge_flagship',    nameKey: 'cat_tecnologia', badgeDefault: 'Audio Hi-Res' },
    // Calzado (id 9) → Sneaker local
    9: { icono: Footprints, imagen: '/images/bento/sneaker.png',                                                           badgeKey: 'badge_tendencia',   nameKey: 'cat_moda',       badgeDefault: 'Calzado Pro' },
    // Cocina (id 10) → Sartenes y menaje chef
   10: { icono: Utensils,   imagen: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80', badgeKey: 'badge_confort',     nameKey: 'cat_hogar',      badgeDefault: 'Menaje Chef' }
  }), [])

  // Resolución inteligente de metadatos según id o nombre de categoría
  const resolverMeta = (cat) => {
    if (visualMeta[cat.id]) return visualMeta[cat.id]
    const nombre = (cat.nombre || '').toLowerCase()
    if (nombre.includes('tecno') || nombre.includes('elect')) return visualMeta[1]
    if (nombre.includes('moda') || nombre.includes('ropa')) return visualMeta[2]
    if (nombre.includes('hogar') || nombre.includes('mueble')) return visualMeta[3]
    if (nombre.includes('deporte') || nombre.includes('fitness')) return visualMeta[4]
    if (nombre.includes('belleza') || nombre.includes('cuidado')) return visualMeta[5]
    if (nombre.includes('herramienta') || nombre.includes('industria')) return visualMeta[6]
    if (nombre.includes('celular') || nombre.includes('phone') || nombre.includes('smart')) return visualMeta[7]
    if (nombre.includes('cocina')) return visualMeta[10]
    return { icono: Sparkles, imagen: '/images/bento/laptop.png', badgeKey: 'badge_oficial', nameKey: null }
  }

  // Lista de categorías con textos traducidos y fallbacks limpios
  const listaCategorias = useMemo(() => {
    if (categorias && categorias.length > 0) {
      return categorias.map((cat) => {
        const meta = resolverMeta(cat)
        const imagenFinal = (cat.imagenUrl && cat.imagenUrl.trim() !== '' && !cat.imagenUrl.includes('photo-1541643600914')) 
          ? cat.imagenUrl 
          : meta.imagen
        return {
          id: cat.id,
          nombre: meta.nameKey ? t(meta.nameKey) : cat.nombre,
          imagen: imagenFinal,
          fallbackImagen: meta.imagen,
          icono: meta.icono,
          badge: t(meta.badgeKey)
        }
      })
    }

    return [
      { id: 1, nombre: t('cat_tecnologia'), imagen: visualMeta[1].imagen, fallbackImagen: visualMeta[1].imagen, icono: Laptop, badge: t(visualMeta[1].badgeKey) },
      { id: 2, nombre: t('cat_moda'), imagen: visualMeta[2].imagen, fallbackImagen: visualMeta[2].imagen, icono: Shirt, badge: t(visualMeta[2].badgeKey) },
      { id: 3, nombre: t('cat_hogar'), imagen: visualMeta[3].imagen, fallbackImagen: visualMeta[3].imagen, icono: Home, badge: t(visualMeta[3].badgeKey) },
      { id: 4, nombre: t('cat_deportes'), imagen: visualMeta[4].imagen, fallbackImagen: visualMeta[4].imagen, icono: Activity, badge: t(visualMeta[4].badgeKey) },
      { id: 5, nombre: t('cat_belleza'), imagen: visualMeta[5].imagen, fallbackImagen: visualMeta[5].imagen, icono: Sparkles, badge: t(visualMeta[5].badgeKey) },
      { id: 6, nombre: t('cat_herramientas'), imagen: visualMeta[6].imagen, fallbackImagen: visualMeta[6].imagen, icono: Wrench, badge: t(visualMeta[6].badgeKey) }
    ]
  }, [categorias, visualMeta, t])

  const handleSelect = (cat) => {
    setCategoriaActiva(cat.id)
    navigate(`/catalogo?categoriaId=${cat.id}`)
  }

  return (
    <section className="space-y-6">
      
      {/* Encabezado de la Sección con Mayúscula Inicial */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('explora_por_categorias')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-emerald-500">
              Mercatto
            </span>
          </h2>
        </div>

        <button
          onClick={() => navigate('/catalogo')}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-violet-400 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-violet-600 transition cursor-pointer shadow-xs"
        >
          <span>{t('ver_todo_catalogo')}</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Cuadrícula de Tarjetas Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
        {listaCategorias.map((cat) => {
          const Icon = cat.icono || Sparkles
          const esActivo = categoriaActiva === cat.id

          return (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat)}
              className={`group relative rounded-[28px] sm:rounded-[30px] p-4 bg-white dark:bg-slate-900 border transition-all duration-300 flex flex-col items-center justify-between min-h-[190px] cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                esActivo 
                  ? 'border-emerald-500 ring-2 ring-emerald-500/25 bg-emerald-50/20 dark:bg-emerald-950/20' 
                  : 'border-slate-200/90 dark:border-slate-800 hover:border-violet-500/70'
              }`}
            >
              {/* Badge superior */}
              <div className="w-full flex items-center justify-between">
                <span className="w-6.5 h-6.5 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-violet-600 text-slate-500 group-hover:text-white flex items-center justify-center transition-colors">
                  <Icon size={13} />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/90 text-[10px] font-extrabold tracking-wide text-slate-500 dark:text-slate-400 group-hover:bg-emerald-500/15 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {cat.badge}
                </span>
              </div>

              {/* Imagen de Producto Real de la Categoría */}
              <div className="relative w-full h-24 sm:h-28 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 flex items-center justify-center p-2 group-hover:bg-violet-50/50 dark:group-hover:bg-violet-950/20 transition-colors overflow-hidden">
                <img
                  src={cat.imagen}
                  alt={cat.nombre}
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = cat.fallbackImagen || '/images/bento/laptop.png'
                  }}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.12)] group-hover:scale-110 transition-transform duration-300"
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
