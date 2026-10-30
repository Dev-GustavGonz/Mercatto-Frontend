import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useFavorites } from '@/hooks/useFavorites'
import { useLanguage } from '@/hooks/useLanguage'
import { productoService } from '@/features/productos'
import { formatCurrency } from '@/utils/formatCurrency'
import { resolveProductImage } from '@/utils/productUtils'
import { ShoppingCart, Heart, MessageSquare, Store, Star, Zap, CheckCircle2 } from 'lucide-react'

export const ProductCard = ({ producto, onContactClick }) => {
  const { agregarItem } = useCart()
  const { autenticado } = useAuth()
  const { success, info } = useToast()
  const { favoriteIds, toggleFavoriteId } = useFavorites()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const esFavorito = favoriteIds.includes(producto.id)

  const imagenPrincipal = resolveProductImage(producto)

  // Cálculo de descuento real basado únicamente en datos verídicos de la base de datos
  const tieneDescuentoReal = Boolean(
    producto.precioOferta && 
    Number(producto.precioOferta) > 0 && 
    Number(producto.precioOferta) < Number(producto.precio)
  )

  const porcentajeDescuento = tieneDescuentoReal
    ? Math.round(((producto.precio - producto.precioOferta) / producto.precio) * 100)
    : 0

  const precioFinal = tieneDescuentoReal ? producto.precioOferta : producto.precio

  const planVendedor = (producto.vendedor?.tipoSuscripcion || producto.vendedor?.plan || '').toUpperCase()
  const esElite = planVendedor === 'ELITE'
  const esPro = planVendedor === 'PRO' || planVendedor === 'PROFESIONAL'

  const handleToggleFavorito = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!autenticado) {
      info(t('guardar_favoritos'))
      navigate('/login')
      return
    }
    try {
      const res = await productoService.toggleFavorito(producto.id)
      toggleFavoriteId(producto.id)
      success(res?.mensaje || t('guardar_favoritos'))
    } catch {
      // Manejo silencioso
    }
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    agregarItem(producto, null, 1)
  }

  const handleContactarDirecto = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!autenticado) {
      info(t('preguntar_vendedor'))
      navigate('/login')
      return
    }
    const destinoId = producto.vendedor?.usuarioId || producto.vendedor?.id || 1
    navigate(`/mensajes?vendedorId=${destinoId}&productoId=${producto.id}`)
  }

  return (
    <div 
      onClick={() => navigate(`/producto/${producto.id}`)}
      className="group bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-3 sm:p-4 transition-all duration-300 flex flex-col relative min-h-[360px] sm:h-[390px] border border-mercatto-border dark:border-slate-800 hover:border-mercatto-primary dark:hover:border-violet-700 shadow-xs hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1.5 cursor-pointer select-none"
    >
      {/* Insignias superiores flotantes */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start max-w-[70%]">
        {esElite && (
          <span className="inline-flex items-center gap-1 bg-mercatto-elite-bg text-mercatto-elite-text border border-amber-300/60 text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-md tracking-wider">
            <span>👑</span>
            <span>Élite</span>
          </span>
        )}
        {esPro && (
          <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-800 border border-violet-200/90 text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs tracking-wider">
            <CheckCircle2 size={11} className="text-violet-600 stroke-[2.5]" />
            <span>Verificado</span>
          </span>
        )}
        {tieneDescuentoReal && (
          <div className="bg-mercatto-offer-bg text-mercatto-offer-text border border-mercatto-offer/40 text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
            <Zap size={10} className="fill-white" />
            <span>-{porcentajeDescuento}%</span>
          </div>
        )}
      </div>

      {/* Botón de favoritos con efecto pop */}
      <button
        onClick={handleToggleFavorito}
        className="absolute top-3 right-3 z-10 p-2 sm:p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:scale-115 active:scale-95 transition-all cursor-pointer"
        title={t('guardar_favoritos')}
      >
        <Heart 
          size={15} 
          className={esFavorito ? 'text-rose-500 fill-rose-500' : 'transition-colors'} 
        />
      </button>

      {/* Contenedor de Imagen con fondo blanco limpio para que fotos con fondo blanco se integren sin bordes */}
      <div className="relative h-36 sm:h-44 w-full flex items-center justify-center rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2.5 sm:p-3 mt-4 overflow-hidden group-hover:border-violet-200 dark:group-hover:border-violet-700/60 shadow-2xs transition-all">
        <img
          src={imagenPrincipal}
          alt={producto.titulo}
          className="max-h-full max-w-full object-contain rounded-xl group-hover:scale-108 transition-transform duration-500 drop-shadow-sm mix-blend-multiply dark:mix-blend-normal"
          loading="lazy"
        />
      </div>

      {/* Calificación y Tienda */}
      <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-1 text-xs text-slate-500">
        <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 bg-amber-50 dark:bg-amber-950/40 px-1.5 sm:px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/50 shrink-0">
          <Star size={11} className="text-amber-500 fill-amber-500 shrink-0" />
          <span className="text-[11px] sm:text-xs">{producto.calificacion != null && Number(producto.calificacion) > 0 ? Number(producto.calificacion).toFixed(1) : '5.0'}</span>
          {producto.totalResenas > 0 && (
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-semibold">
              ({producto.totalResenas})
            </span>
          )}
        </div>

        {producto.vendedor?.nombreTienda && (
          <span 
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/tienda/${producto.vendedor.id || producto.vendedor.usuarioId}`)
            }}
            className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-violet-600 transition truncate max-w-[95px] sm:max-w-[140px]"
            title={`${t('tienda_oficial')}: ${producto.vendedor.nombreTienda}`}
          >
            <Store size={11} className="shrink-0 text-violet-500" />
            <span className="truncate">{producto.vendedor.nombreTienda}</span>
            {esPro && (
              <CheckCircle2 size={11} className="shrink-0 text-violet-600 stroke-[2.5]" title="Tienda PRO Verificada" />
            )}
            {esElite && (
              <span className="shrink-0 text-[10px]" title="Tienda Élite Oficial">👑</span>
            )}
          </span>
        )}
      </div>

      {/* Título de Producto */}
      <div className="mt-2 flex-1">
        <h3 
          className="text-sm sm:text-base font-bold text-slate-800 dark:text-white line-clamp-2 group-hover:text-violet-600 transition-colors leading-snug"
          title={producto.titulo}
        >
          {producto.titulo}
        </h3>
      </div>

      {/* Precios y Botones de Acción */}
      <div className="mt-auto pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
        <div className="min-w-0 flex-1">
          <div className="text-sm sm:text-base lg:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
            {formatCurrency(precioFinal)}
          </div>
          {tieneDescuentoReal && (
            <div className="text-[10px] sm:text-xs text-slate-400 line-through truncate">
              {formatCurrency(producto.precio)}
            </div>
          )}
        </div>

        {/* Botones de Contacto y Compra */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {onContactClick && (
            <button
              onClick={handleContactarDirecto}
              className="p-2 sm:p-2.5 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/50 text-slate-600 dark:text-slate-300 hover:text-violet-600 border border-slate-200 dark:border-slate-700 transition-all hover:scale-105"
              title={t('preguntar_vendedor')}
            >
              <MessageSquare size={14} className="sm:w-[15px] sm:h-[15px]" />
            </button>
          )}

          <button
            onClick={handleAddToCart}
            className="p-2 sm:p-2.5 rounded-full bg-slate-900 dark:bg-slate-100 dark:text-slate-900 group-hover:bg-mercatto-primary dark:group-hover:bg-mercatto-primary dark:group-hover:text-white text-white shadow-md hover:shadow-violet-500/25 transition-all hover:scale-110 active:scale-95"
            title={t('anadir')}
          >
            <ShoppingCart size={15} className="sm:w-[16px] sm:h-[16px]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
