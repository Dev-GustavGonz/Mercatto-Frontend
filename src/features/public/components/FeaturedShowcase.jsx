import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCart } from '@/hooks/useCart'
import { useFavorites } from '@/hooks/useFavorites'
import { useLanguage } from '@/hooks/useLanguage'
import { resolveProductImage } from '@/utils/productUtils'
import { 
  ShoppingBag, 
  Heart, 
  Eye, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Store,
  ShieldCheck
} from 'lucide-react'

export const FeaturedShowcase = ({ productos = [], tiendas = [] }) => {
  const navigate = useNavigate()
  const { agregarItem } = useCart()
  const { favoriteIds, toggleFavoriteId } = useFavorites()
  const { t, idioma } = useLanguage()
  const [hoveredCard, setHoveredCard] = useState(null)

  const isEn = idioma === 'EN'

  // Identificar IDs de empresas con membresía ELITE
  const eliteStoreIds = useMemo(() => {
    const ids = new Set()
    if (Array.isArray(tiendas)) {
      tiendas.forEach((t) => {
        const plan = (t.tipoSuscripcion || t.plan || '').toUpperCase()
        if (plan === 'ELITE') {
          if (t.id) ids.add(t.id)
          if (t.usuarioId) ids.add(t.usuarioId)
        }
      })
    }
    return ids
  }, [tiendas])

  // Filtrar exclusivamente productos reales de empresas que tengan un plan ELITE
  const productosElite = useMemo(() => {
    if (!productos || productos.length === 0) return []
    return productos.filter((p) => {
      const planDirecto = (p.vendedor?.plan || p.vendedor?.tipoSuscripcion || p.plan || '').toUpperCase()
      if (planDirecto === 'ELITE') return true

      const vId = p.vendedor?.id || p.vendedorId
      const uId = p.vendedor?.usuarioId
      if (vId && eliteStoreIds.has(vId)) return true
      if (uId && eliteStoreIds.has(uId)) return true
      return false
    })
  }, [productos, eliteStoreIds])

  // Tomamos únicamente los productos reales de empresas Elite de la base de datos (sin elementos estáticos)
  const items = useMemo(() => {
    return productosElite.slice(0, 4)
  }, [productosElite])

  if (!items || items.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      
      {/* Encabezado con Tipografía de Alto Impacto */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('productos_destacados_pro')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-violet-600">
              Tiendas Elite
            </span>
          </h2>
        </div>
      </div>

      {/* Grid: 1 Banner Promocional Lateral Bento + 4 Tarjetas de Productos */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6 items-stretch">
        
        {/* ============================================================== */}
        {/* BANNER PROMOCIONAL LATERAL IZQUIERDO (ESTILO BENTO PRO)        */}
        {/* ============================================================== */}
        <div 
          onClick={() => navigate('/catalogo?enOferta=true')}
          className="relative rounded-[30px] sm:rounded-[34px] overflow-hidden min-h-[380px] lg:min-h-full flex flex-col justify-between p-6 sm:p-7 text-white shadow-xs border border-violet-900/50 cursor-pointer group bg-gradient-to-b from-[#181335] via-[#100d24] to-[#0a0817]"
        >
          {/* Glows y atmósfera Bento */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Imagen de fondo tenue */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-106 transition-transform duration-700 pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0817] via-[#100d24]/85 to-transparent" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest uppercase text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-400/30 backdrop-blur-md">
              <Sparkles size={11} className="text-emerald-400" />
              <span>{t('especial_rendimiento')}</span>
            </span>
          </div>

          <div className="relative z-10 space-y-3 pt-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
              {t('hasta_45_off')}
            </h3>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {t('banner_destacados_desc')}
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md group-hover:scale-105 transition-all">
                <span>{t('comprar_ahora')}</span>
                <ArrowRight size={14} className="stroke-[2.5]" />
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4 TARJETAS DE PRODUCTOS SINCRONIZADAS                          */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {items.map((prod, index) => {
            const isFav = favoriteIds.includes(prod.id)
            const esHovered = hoveredCard === prod.id
            const precioActual = prod.precioOferta || prod.precio || 0
            const tieneOferta = prod.precioOferta && prod.precioOferta < prod.precio

            return (
              <div
                key={prod.id || index}
                onMouseEnter={() => setHoveredCard(prod.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative rounded-[28px] sm:rounded-[30px] bg-white dark:bg-slate-900 border transition-all duration-300 flex flex-col justify-between p-4 sm:p-4.5 shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                  esHovered
                    ? 'border-violet-500 ring-2 ring-violet-500/20'
                    : 'border-slate-200/90 dark:border-slate-800'
                }`}
              >
                {/* Botón flotante superior: Favoritos & Vista */}
                <div className="w-full flex items-center justify-between pb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={10} className="text-amber-500 fill-amber-500" />
                    <span>{t('oferta_pro_badge')}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavoriteId(prod.id)
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        isFav 
                          ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/60' 
                          : 'bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:bg-slate-800'
                      }`}
                      title={isFav ? t('quitar_favoritos') : t('guardar_favoritos')}
                    >
                      <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
                    </button>

                    <button
                      onClick={() => navigate(`/producto/${prod.id}`)}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                      title={t('ver_producto')}
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                </div>

                {/* Imagen del Producto */}
                <div 
                  onClick={() => navigate(`/producto/${prod.id}`)}
                  className="relative w-full h-40 sm:h-44 rounded-2xl bg-[#f8f8fc] dark:bg-slate-800/40 flex items-center justify-center p-3 cursor-pointer select-none overflow-hidden"
                >
                  <img
                    src={resolveProductImage(prod)}
                    alt={prod.titulo}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_15px_rgba(0,0,0,0.10)] group-hover:scale-108 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Detalles y Precio */}
                <div className="pt-3.5 space-y-2">
                  {/* Tienda vendedora */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1.5 truncate">
                      <Store size={12} className="text-violet-500 shrink-0" />
                      <span className="truncate">{prod.vendedor?.nombreTienda || t('tienda_oficial_badge')}</span>
                    </span>
                    <ShieldCheck size={13} className="text-emerald-500 shrink-0" title={t('garantia_verificada')} />
                  </div>

                  {/* Título */}
                  <h4 
                    onClick={() => navigate(`/producto/${prod.id}`)}
                    className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors cursor-pointer"
                  >
                    {prod.titulo}
                  </h4>

                  {/* Precios */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {formatCurrency(precioActual)}
                    </span>
                    {tieneOferta && (
                      <span className="text-xs line-through text-slate-400 font-medium">
                        {formatCurrency(prod.precio)}
                      </span>
                    )}
                  </div>

                  {/* Estrellas de Calificación & Botón Carrito */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" />
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        agregarItem(prod)
                      }}
                      className={`px-3.5 h-8.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                        esHovered 
                          ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 scale-105' 
                          : 'bg-violet-600 text-white hover:bg-slate-950 hover:text-white'
                      }`}
                      title={t('agregar_al_carrito')}
                    >
                      <ShoppingBag size={13} />
                      <span>{t('anadir')}</span>
                    </button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

      </div>

    </section>
  )
}

export default FeaturedShowcase
