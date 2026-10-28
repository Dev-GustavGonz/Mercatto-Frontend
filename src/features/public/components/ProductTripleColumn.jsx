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
  Flame, 
  Award, 
  TrendingUp,
  Sparkles
} from 'lucide-react'

export const ProductTripleColumn = ({ destacados = [], nuevos = [], masVendidos = [] }) => {
  const navigate = useNavigate()
  const { agregarItem } = useCart()
  const { favoriteIds, toggleFavoriteId } = useFavorites()
  const { t, idioma } = useLanguage()
  const [hoveredItemId, setHoveredItemId] = useState(null)

  const isEn = idioma === 'EN'

  // Separación dinámica en 3 listas a partir de productos reales de la base de datos
  // Pool unificado de productos para evitar columnas vacías
  const poolProductos = useMemo(() => {
    const todos = [...(destacados || []), ...(nuevos || []), ...(masVendidos || [])];
    return todos.filter((p, idx, arr) => p && p.id && arr.findIndex(item => item.id === p.id) === idx);
  }, [destacados, nuevos, masVendidos]);

  const hotDeals = useMemo(() => {
    if (poolProductos.length === 0) return [];
    const ofertasReales = poolProductos.filter(p => p.precioOferta && p.precioOferta < p.precio);
    if (ofertasReales.length > 0) return ofertasReales.slice(0, 3);
    return poolProductos.slice(0, 3);
  }, [poolProductos]);

  const bestSellers = useMemo(() => {
    if (masVendidos && masVendidos.length > 0) {
      const ordenados = [...masVendidos].sort((a, b) => (b.totalVentas || 0) - (a.totalVentas || 0));
      return ordenados.slice(0, 3);
    }
    if (poolProductos.length === 0) return [];
    const ordenados = [...poolProductos].sort((a, b) => (b.totalVentas || 0) - (a.totalVentas || 0));
    return ordenados.slice(0, 3);
  }, [masVendidos, poolProductos]);

  const topRated = useMemo(() => {
    if (poolProductos.length === 0) return [];
    const ordenados = [...poolProductos].sort((a, b) => (b.calificacion || 5.0) - (a.calificacion || 5.0));
    return ordenados.slice(0, 3);
  }, [poolProductos]);

  if (hotDeals.length === 0 && bestSellers.length === 0 && topRated.length === 0) {
    return null
  }

  // Renderizador de cada fila compacta de producto Bento
  const renderItemCard = (prod) => {
    const isFav = favoriteIds.includes(prod.id)
    const esHover = hoveredItemId === prod.id
    const precio = prod.precioOferta || prod.precio || 0

    return (
      <div
        key={prod.id}
        onMouseEnter={() => setHoveredItemId(prod.id)}
        onMouseLeave={() => setHoveredItemId(null)}
        onClick={() => navigate(`/producto/${prod.id}`)}
        className={`group relative rounded-[24px] sm:rounded-[26px] p-3.5 bg-white dark:bg-slate-900 border transition-all duration-300 flex items-center gap-3.5 cursor-pointer ${
          esHover
            ? 'border-violet-500 shadow-lg ring-1 ring-violet-500/20 -translate-y-0.5'
            : 'border-slate-200/90 dark:border-slate-800 shadow-xs'
        }`}
      >
        {/* Imagen del Producto en Miniatura */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src={resolveProductImage(prod)}
            alt={prod.titulo}
            className="max-h-full max-w-full object-contain filter drop-shadow-xs group-hover:scale-108 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal"
            loading="lazy"
          />
        </div>

        {/* Información y Acciones Rápidas */}
        <div className="flex-1 min-w-0 space-y-1">
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {prod.titulo}
          </h4>

          {/* Precios */}
          <div className="flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              {formatCurrency(precio)}
            </span>
            {prod.precioOferta && prod.precioOferta < prod.precio && (
              <span className="text-[10px] line-through text-slate-400 font-medium">
                {formatCurrency(prod.precio)}
              </span>
            )}
          </div>

          {/* Estrellas y Reseñas */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-black text-slate-800 dark:text-slate-200">
                {Number(prod.calificacion || 5.0).toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold ml-0.5">
                ({prod.totalResenas || 0} {prod.totalResenas === 1 ? 'reseña' : 'reseñas'})
              </span>
            </div>
            {prod.totalVentas > 0 && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Flame size={9} className="fill-amber-500 text-amber-500" />
                <span>{prod.totalVentas} {isEn ? 'sold' : 'vendidos'}</span>
              </span>
            )}
          </div>

          {/* Botones de acción flotantes al pasar el mouse */}
          {esHover && (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="flex items-center gap-1.5 pt-1 animate-fadeIn"
            >
              <button
                onClick={() => agregarItem(prod)}
                className="p-1.5 rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-emerald-500 hover:text-white shadow-xs transition-colors cursor-pointer"
                title={t('agregar_al_carrito')}
              >
                <ShoppingBag size={13} />
              </button>
              <button
                onClick={() => toggleFavoriteId(prod.id)}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  isFav ? 'bg-rose-100 text-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500'
                }`}
                title={isFav ? t('quitar_favoritos') : t('guardar_favoritos')}
              >
                <Heart size={13} fill={isFav ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => navigate(`/producto/${prod.id}`)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-violet-600 transition-colors cursor-pointer"
                title={t('ver_detalle')}
              >
                <Eye size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
      
      {/* ============================================================== */}
      {/* COLUMNA 1: HOT DEALS (OFERTAS DEL MOMENTO)                     */}
      {/* ============================================================== */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
            <Flame size={16} />
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
            {t('ofertas_momento')}
          </h3>
        </div>
        <div className="space-y-3">
          {hotDeals.map(renderItemCard)}
        </div>
      </div>

      {/* ============================================================== */}
      {/* COLUMNA 2: BEST SELLER (MÁS VENDIDOS)                          */}
      {/* ============================================================== */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 flex items-center justify-center shrink-0">
            <TrendingUp size={16} />
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
            {t('mas_vendidos_col')}
          </h3>
        </div>
        <div className="space-y-3">
          {bestSellers.map(renderItemCard)}
        </div>
      </div>

      {/* ============================================================== */}
      {/* COLUMNA 3: TOP RATED (MEJOR CALIFICADOS)                       */}
      {/* ============================================================== */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0">
            <Award size={16} />
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
            {t('mejor_calificados')}
          </h3>
        </div>
        <div className="space-y-3">
          {topRated.map(renderItemCard)}
        </div>
      </div>

      {/* ============================================================== */}
      {/* COLUMNA 4: BANNER VERTICAL DERECHO EN ESTILO BENTO PRO         */}
      {/* ============================================================== */}
      <div 
        onClick={() => navigate('/catalogo')}
        className="relative rounded-[30px] sm:rounded-[34px] overflow-hidden min-h-[340px] flex flex-col justify-between p-6 sm:p-7 text-white shadow-xs border border-violet-900/50 cursor-pointer group bg-gradient-to-b from-[#181335] via-[#100d24] to-[#0a0817]"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-106 transition-transform duration-700 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0817] via-[#100d24]/85 to-transparent" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest uppercase text-violet-300 bg-violet-950/80 px-3 py-1 rounded-full border border-violet-400/30 backdrop-blur-md">
            <Sparkles size={11} className="text-violet-400" />
            <span>{t('beneficio_exclusivo')}</span>
          </span>
        </div>

        <div className="relative z-10 space-y-3 pt-10">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
            {t('ahorra_35')}
          </h3>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            {t('banner_triple_desc')}
          </p>

          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md group-hover:scale-105 transition-all">
              <span>{t('explorar_ahora')}</span>
              <ArrowRight size={14} className="stroke-[2.5]" />
            </span>
          </div>
        </div>
      </div>

    </section>
  )
}

export default ProductTripleColumn
