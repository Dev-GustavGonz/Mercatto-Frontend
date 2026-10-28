import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productoService } from '@/features/productos'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useFavorites } from '@/hooks/useFavorites'
import { useLanguage } from '@/hooks/useLanguage'
import ProductImages from '../components/ProductImages'
import ProductVariants from '../components/ProductVariants'
import PriceDisplay from '../components/PriceDisplay'
import StarRating from '@/components/common/StarRating'
import ProductReviews from '../components/ProductReviews'
import ModalContactoVendedor from '../components/ModalContactoVendedor'
import Button from '@/components/common/Button'
import Spinner from '@/components/common/Spinner'
import { ShoppingBag, Heart, MessageSquare, Store, ShieldCheck, Truck, RefreshCw, ChevronRight } from 'lucide-react'

export const DetalleProducto = () => {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [modalContacto, setModalContacto] = useState(false)

  const { agregarItem, setDrawerAbierto } = useCart()
  const { usuario, autenticado } = useAuth()
  const { favoriteIds, toggleFavoriteId } = useFavorites()
  const { success, info } = useToast()
  const { t, idioma } = useLanguage()
  const navigate = useNavigate()

  const [errorCarga, setErrorCarga] = useState(false)

  useEffect(() => {
    setLoading(true)
    setErrorCarga(false)

    const fetchProducto = async () => {
      try {
        let data
        if (!isNaN(id)) {
          data = await productoService.obtenerPorId(id)
        } else {
          data = await productoService.obtenerPorSlug(id)
        }
        setProducto(data)
        if (data.variantes && data.variantes.length > 0) {
          setVarianteSeleccionada(data.variantes[0])
        }
      } catch (err) {
        console.error('Error cargando producto:', err)
        setErrorCarga(true)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProducto()
    }
  }, [id])

  const esFavorito = producto ? favoriteIds.includes(producto.id) : false

  if (loading) {
    return <Spinner size="lg" className="py-32" />
  }

  if (errorCarga || !producto) {
    return (
      <div className="py-24 text-center space-y-4 font-sans">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">
          {idioma === 'EN' ? 'Product not found' : 'Producto no encontrado'}
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {idioma === 'EN' 
            ? 'The product you are looking for is unavailable or paused by its seller.'
            : 'El producto que buscas no está disponible o ha sido pausado por su vendedor.'}
        </p>
        <Button variant="primary" onClick={() => navigate('/catalogo')}>
          {t('ver_todo_catalogo')}
        </Button>
      </div>
    )
  }

  const precioActual = varianteSeleccionada
    ? varianteSeleccionada.precio
    : producto.precio
  const precioOfertaActual = varianteSeleccionada
    ? varianteSeleccionada.precioOferta
    : producto.precioOferta
  const stockDisponible = varianteSeleccionada
    ? varianteSeleccionada.stock
    : producto.stock

  const handleAddToCart = () => {
    agregarItem(producto, varianteSeleccionada, cantidad)
  }

  const handleBuyNow = () => {
    agregarItem(producto, varianteSeleccionada, cantidad)
    navigate('/checkout')
  }

  const handleToggleFavorito = async () => {
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

  const handleContactar = () => {
    if (!autenticado) {
      info(t('preguntar_vendedor'))
      navigate('/login')
      return
    }
    const destinoId = producto.vendedor?.usuarioId || producto.vendedor?.id || 1
    navigate(`/mensajes?vendedorId=${destinoId}&productoId=${producto.id}`)
  }

  const esMiProducto = usuario && producto.vendedor && (
    usuario.id === producto.vendedor.usuarioId || 
    usuario.id === producto.vendedor.id
  )

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto font-sans">
      {/* Breadcrumb de Navegación */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Link to="/" className="hover:text-mercatto-primary transition">{t('inicio')}</Link>
        <ChevronRight size={12} />
        <Link to="/catalogo" className="hover:text-mercatto-primary transition">{t('catalogo')}</Link>
        {producto.categoria && (
          <>
            <ChevronRight size={12} />
            <Link to={`/catalogo?categoriaId=${producto.categoria.id}`} className="hover:text-mercatto-primary transition truncate max-w-[120px]">
              {producto.categoria.nombre}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{producto.titulo}</span>
      </nav>

      {/* Main Grid: Images & Buy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <ProductImages imagenes={producto.imagenes} titulo={producto.titulo} />
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Vendor Card */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-mercatto-surface/50 dark:bg-slate-800/60 border border-mercatto-border dark:border-slate-700 shadow-sm">
            <Link
              to={producto.vendedor?.id ? `/tienda/${producto.vendedor.id}` : '#'}
              className="flex items-center gap-3 group/vendor"
              title="Ver vitrina completa y catálogo de esta tienda"
            >
              <div className="w-10 h-10 rounded-xl bg-mercatto-primary text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover/vendor:scale-105 transition-transform overflow-hidden">
                {producto.vendedor?.logoUrl ? (
                  <img src={producto.vendedor.logoUrl} alt={producto.vendedor.nombreTienda} className="w-full h-full object-cover" />
                ) : (
                  <Store size={18} />
                )}
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">
                  {esMiProducto ? (idioma === 'EN' ? 'Your registered store' : 'Tu tienda registrada') : t('vendido_por')}
                </p>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover/vendor:text-mercatto-primary transition flex items-center gap-1">
                  <span>{producto.vendedor?.nombreTienda || 'Tienda Oficial Mercatto'}</span>
                  <span className="text-[10px] text-indigo-500 font-normal">→ {t('ver_tienda')}</span>
                </h4>
                <span className="text-[10px] text-slate-500">
                  {producto.vendedor?.ciudad || 'Colombia'} • {(producto.vendedor?.calificacion || 5.0).toFixed(1)} ★
                </span>
              </div>
            </Link>

            {/* Botón clave de contacto con el vendedor */}
            <div className="flex items-center gap-2">
              {producto.vendedor?.id && (
                <Link
                  to={`/tienda/${producto.vendedor.id}`}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-mercatto-border dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-indigo-500 hover:text-mercatto-primary transition shadow-sm"
                >
                  {t('ver_tienda')}
                </Link>
              )}
              {esMiProducto ? (
                <Link
                  to="/panel-vendedor"
                  className="px-3.5 py-2 rounded-xl bg-mercatto-primary text-white text-xs font-bold hover:bg-mercatto-deep flex items-center gap-1.5 shadow-sm transition"
                >
                  <Store size={14} />
                  <span>{t('panel_vendedor')}</span>
                </Link>
              ) : (
                <button
                  onClick={handleContactar}
                  className="px-3.5 py-2 rounded-xl bg-mercatto-primary text-white text-xs font-bold hover:bg-mercatto-deep flex items-center gap-1.5 shadow-sm cursor-pointer transition hover:scale-105"
                  title={t('preguntar_vendedor')}
                >
                  <MessageSquare size={14} />
                  <span>{t('contacto')}</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-mercatto-primary dark:text-indigo-400">
                {producto.categoria?.nombre || 'General'}
              </span>
              {producto.marca && (
                <>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-mercatto-surface dark:bg-slate-800 text-mercatto-deep dark:text-indigo-300 border border-mercatto-border dark:border-slate-700">
                    Marca: {producto.marca}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {producto.titulo}
            </h1>

            <div className="flex items-center gap-3 mt-2.5">
              <StarRating rating={producto.calificacion || 0} size={16} />
              <span className="text-xs text-slate-500">
                {producto.calificacion?.toFixed(1) || '0.0'} ({producto.totalResenas || 0} {t('opiniones')})
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-500">{producto.totalVentas || 0} {t('mas_vendidos')}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-mercatto-border dark:border-slate-800">
            <PriceDisplay
              precio={precioActual}
              precioOferta={precioOfertaActual}
              size="lg"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              {stockDisponible > 0 ? (
                <span className="text-emerald-600 font-semibold">{stockDisponible} {t('unidades_disponibles')}</span>
              ) : (
                <span className="text-rose-500 font-semibold">{t('sin_stock')}</span>
              )}
            </p>
          </div>

          {/* Variants */}
          {producto.variantes && producto.variantes.length > 0 && (
            <ProductVariants
              variantes={producto.variantes}
              varianteSeleccionada={varianteSeleccionada}
              onSelectVariante={setVarianteSeleccionada}
            />
          )}

          {/* Quantity & Buy Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="px-3 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                  {cantidad}
                </span>
                <button
                  onClick={() => setCantidad(Math.min(stockDisponible, cantidad + 1))}
                  className="px-3 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleToggleFavorito}
                className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-rose-500 hover:bg-slate-50 cursor-pointer"
                title={t('guardar_favoritos')}
              >
                <Heart size={20} className={esFavorito ? 'text-rose-500 fill-rose-500' : ''} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleAddToCart}
                disabled={stockDisponible <= 0}
                className="w-full font-bold cursor-pointer"
              >
                <ShoppingBag size={18} className="mr-2" />
                <span>{t('agregar_al_carrito')}</span>
              </Button>

              <Button
                variant="primary"
                size="lg"
                onClick={handleBuyNow}
                disabled={stockDisponible <= 0}
                className="w-full font-bold cursor-pointer"
              >
                {t('comprar_ahora')}
              </Button>
            </div>

            {/* Botón directo de chat y consulta de producto */}
            {esMiProducto ? (
              <Link
                to="/panel-vendedor"
                className="w-full py-3 px-4 rounded-2xl border border-mercatto-border dark:border-slate-700 bg-mercatto-surface/50 dark:bg-slate-800/60 hover:bg-indigo-100 text-mercatto-deep dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Store size={16} />
                <span>{t('panel_vendedor')}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleContactar}
                className="w-full py-3 px-4 rounded-2xl border border-mercatto-border dark:border-slate-700 bg-mercatto-surface/50 dark:bg-slate-800/60 hover:bg-indigo-100/70 text-mercatto-deep dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
              >
                <MessageSquare size={16} />
                <span>{t('preguntar_vendedor')}</span>
              </button>
            )}
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>{t('compra_protegida_titulo')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-indigo-500 shrink-0" />
              <span>{t('envio_colombia_titulo')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-mercatto-border dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('descripcion')}</h3>
        <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {producto.descripcion}
        </div>
      </section>

      {/* Reviews */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-mercatto-border dark:border-slate-800">
        <ProductReviews
          productoId={producto.id}
          calificacionPromedio={producto.calificacion || 0}
          totalResenas={producto.totalResenas || 0}
        />
      </section>

      {/* Modal Contacto Vendedor */}
      {modalContacto && (
        <ModalContactoVendedor
          isOpen={true}
          producto={producto}
          onClose={() => setModalContacto(false)}
        />
      )}
    </div>
  )
}

export default DetalleProducto
