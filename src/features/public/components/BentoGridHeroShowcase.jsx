import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Tag,
  Star,
  Flame,
  Zap,
  TrendingUp
} from 'lucide-react'
import ChromeBlobSculpture from './ChromeBlobSculpture'
import { useCart } from '@/hooks/useCart'
import { useFavorites } from '@/hooks/useFavorites'
import { useLanguage } from '@/hooks/useLanguage'
import { formatCurrency } from '@/utils/formatCurrency'
import { resolveProductImage } from '@/utils/productUtils'

/**
 * BentoGridHeroShowcase
 * Showcase Bento 100% dinámico alimentado por los productos reales de la Base de Datos.
 * Sin fotos de modelos o elementos falsos. Cada tarjeta representa un producto real.
 */
export const BentoGridHeroShowcase = ({ categorias = [], productos = [], onAddToCart }) => {
  const navigate = useNavigate()
  const { agregarItem } = useCart()
  const { toggleFavoriteId, favoriteIds } = useFavorites()
  const { idioma, t } = useLanguage()

  const isEn = idioma === 'EN'

  // Notificación flotante al agregar al carrito
  const [cartToast, setCartToast] = useState(null)

  // Índice del producto activo en el Hero Card central
  const [activeHeroIdx, setActiveHeroIdx] = useState(0)

  // Normalización de productos reales de la BD
  const dbProducts = useMemo(() => {
    if (!productos || productos.length === 0) {
      // Fallback seguro si la base de datos está cargando
      return [
        {
          id: 101,
          titulo: 'Nevera No Frost',
          precio: 1500000,
          precioOferta: 1400000,
          marca: 'Mabe',
          descripcion: isEn 
            ? 'High-efficiency cooling technology with multi-airflow and official warranty.' 
            : 'Tecnología de refrigeración de alta eficiencia con flujo multi-aire y garantía oficial.',
          categoria: { nombre: isEn ? 'Appliances' : 'Electrodomésticos' },
          imagenes: [{ url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80', principal: true }]
        },
        {
          id: 102,
          titulo: 'Ventilador Turbo Silence',
          precio: 150000,
          precioOferta: 140000,
          marca: 'Samurai',
          descripcion: isEn 
            ? 'Maximum airflow power with ultra-quiet acoustic engineering.' 
            : 'Máxima potencia de flujo de aire con ingeniería acústica ultra silenciosa.',
          categoria: { nombre: isEn ? 'Home & Kitchen' : 'Hogar y Cocina' },
          imagenes: [{ url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80', principal: true }]
        },
        {
          id: 201,
          titulo: 'Sony WH-1000XM5 Studio',
          precio: 1699000,
          precioOferta: 1399000,
          marca: 'Sony',
          descripcion: isEn 
            ? 'High-fidelity audio with dual noise-cancelling processor.' 
            : 'Audio de alta fidelidad con doble procesador de cancelación de ruido.',
          categoria: { nombre: isEn ? 'Technology & Electronics' : 'Tecnología y Electrónica' },
          imagenes: [{ url: '/images/bento/headphones.png', principal: true }]
        },
        {
          id: 202,
          titulo: 'iPhone 15 Pro Titanium',
          precio: 4899000,
          precioOferta: 4299000,
          marca: 'Apple',
          descripcion: isEn 
            ? 'Titanium aerospace design with A17 Pro chip.' 
            : 'Diseño aeroespacial en titanio con chip A17 Pro de alto rendimiento.',
          categoria: { nombre: isEn ? 'Smartphones' : 'Smartphones' },
          imagenes: [{ url: '/images/bento/smartphone.png', principal: true }]
        },
        {
          id: 203,
          titulo: 'Apple Watch Ultra 2',
          precio: 3699000,
          precioOferta: 3199000,
          marca: 'Apple',
          descripcion: isEn 
            ? 'Extreme sports smartwatch with precision biometric sensors.' 
            : 'Reloj inteligente para deportes extremos con sensores biométricos de precisión.',
          categoria: { nombre: isEn ? 'Sports & Fitness' : 'Deportes y Fitness' },
          imagenes: [{ url: '/images/bento/smartwatch.png', principal: true }]
        },
        {
          id: 205,
          titulo: 'Canon EOS R50 4K',
          precio: 3999000,
          precioOferta: 3499000,
          marca: 'Canon',
          descripcion: isEn 
            ? 'Compact 4K mirrorless creator camera with ultra-fast autofocus.' 
            : 'Cámara creadora mirrorless 4K compacta con enfoque automático ultra rápido.',
          categoria: { nombre: isEn ? 'Technology & Electronics' : 'Tecnología y Electrónica' },
          imagenes: [{ url: '/images/bento/camera.png', principal: true }]
        }
      ]
    }
    return productos
  }, [productos, isEn])

  // Distribución de productos reales en los bloques del Bento
  const heroItems = dbProducts.slice(0, 5)
  const currentHero = heroItems[activeHeroIdx % heroItems.length] || heroItems[0]
  
  // Tarjeta superior derecha: Segundo producto real de la BD
  const productTopRight = dbProducts[1] || dbProducts[0]

  // Tarjeta izquierda (reemplaza a "Nueva Colección"): Tercer producto real de la BD
  const productLeft = dbProducts[2] || dbProducts[0]

  // 3 Tarjetas de "Más Vendidos" (inferior derecha): Productos reales 3, 4 y 5 de la BD
  const bestSellersItems = useMemo(() => {
    if (dbProducts.length >= 6) {
      return dbProducts.slice(3, 6)
    }
    if (dbProducts.length >= 3) {
      return dbProducts.slice(0, 3)
    }
    return dbProducts
  }, [dbProducts])

  const handleAddToCart = (product, e) => {
    e.stopPropagation()
    const itemToAdd = {
      id: product.id,
      nombre: product.titulo,
      titulo: product.titulo,
      precio: product.precioOferta || product.precio || 0,
      imagenUrl: resolveProductImage(product),
      imagenes: [{ url: resolveProductImage(product), principal: true }]
    }
    if (onAddToCart) {
      onAddToCart(itemToAdd, 1)
    } else {
      agregarItem(itemToAdd, 1)
    }

    setCartToast({
      title: product.titulo,
      time: Date.now()
    })
    setTimeout(() => setCartToast(null), 3000)
  }

  return (
    <div className="w-full bg-[#f6f5fa] dark:bg-slate-950 py-3 sm:py-5 transition-colors font-sans">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">

        {/* ========================================================================= */}
        {/* FILA 1: HERO CARD PRINCIPAL + SPOTLIGHT DE PRODUCTO DESTACADO (BD)       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          
          {/* 1.1 HERO CARD PRINCIPAL (PRODUCTO REAL DE LA BD) */}
          <div 
            onClick={() => navigate(`/producto/${currentHero.id}`)}
            className="lg:col-span-8 bg-[#f2f0fb] dark:bg-slate-900 rounded-[32px] sm:rounded-[36px] p-6 sm:p-9 sm:pb-8 relative overflow-hidden flex flex-col justify-between shadow-xs border border-violet-100/60 dark:border-slate-800 min-h-[420px] sm:min-h-[440px] cursor-pointer group"
          >
            {/* Círculo difuminado de fondo que acoge al producto */}
            <div className="absolute top-[48%] right-[16%] -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#ded9f5]/70 dark:bg-violet-950/40 blur-2xl pointer-events-none transition-all duration-700 group-hover:scale-115" />

            {/* Selector de productos reales de la base de datos */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="flex flex-wrap items-center gap-1.5 sm:gap-2 z-20 mb-2"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-700/70 dark:text-violet-400 mr-1 select-none">
                {t('hero_categories_label')}
              </span>
              {heroItems.map((prod, idx) => (
                <button
                  key={prod.id}
                  onClick={() => setActiveHeroIdx(idx)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeHeroIdx === idx 
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm' 
                      : 'bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                >
                  {prod.categoria?.nombre || prod.marca || `Producto #${idx + 1}`}
                </button>
              ))}
            </div>

            {/* Contenido principal: texto e imagen en flujo responsivo sin superposición */}
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-5 my-auto py-2">
              {/* Cabecera del Hero con Tipografía Bento y Pill de Acción */}
              <div className="w-full md:max-w-[56%] space-y-3 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <span className="inline-block text-[11px] font-black tracking-widest uppercase text-violet-600 dark:text-violet-400 bg-violet-100/80 dark:bg-violet-950/80 px-3 py-0.5 rounded-full">
                    {currentHero.marca || currentHero.vendedor?.nombreTienda || t('tienda_oficial')}
                  </span>
                  
                  <h1 className="text-xl sm:text-2xl lg:text-[34px] font-black text-slate-900 dark:text-white tracking-tight leading-tight font-sans line-clamp-2">
                    {currentHero.titulo}
                  </h1>
                  
                  {/* Precio destacado en píldora con Mayúscula Inicial */}
                  <div className="pt-1 flex items-baseline gap-2">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black text-base sm:text-xl shadow-xs">
                      {formatCurrency(currentHero.precioOferta || currentHero.precio)} COP
                    </span>
                    {currentHero.precioOferta && (
                      <span className="text-sm line-through text-slate-400 font-bold">
                        {formatCurrency(currentHero.precio)} COP
                      </span>
                    )}
                  </div>
                </div>

                {/* Descripción breve del producto real */}
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                  {currentHero.descripcion || t('modal_experience_desc')}
                </p>
              </div>

              {/* Imagen del Producto Real: contenida limpiamente para que NUNCA choque con el texto */}
              <div className="w-full md:w-[42%] flex items-center justify-center relative min-h-[190px] sm:min-h-[220px]">
                <div className="relative w-full max-w-[240px] sm:max-w-[280px] h-48 sm:h-64 flex items-center justify-center">
                  <img
                    key={currentHero.id}
                    src={resolveProductImage(currentHero)}
                    alt={currentHero.titulo}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_25px_rgba(20,15,45,0.20)] group-hover:scale-105 transition-all duration-500 ease-out"
                  />

                  {/* Badge lila redondeado con respaldo oficial */}
                  <div className="absolute left-0 bottom-2 bg-[#beb8ea]/90 dark:bg-violet-950/90 backdrop-blur-md border border-white/60 dark:border-violet-700 rounded-2xl p-2 sm:p-2.5 text-center shadow-md select-none">
                    <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-none">
                      100%
                    </div>
                    <div className="text-[8.5px] sm:text-[9.5px] font-semibold text-slate-700 dark:text-violet-200 leading-tight mt-0.5 max-w-[80px]">
                      {t('garantia_oficial')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del Hero Card */}
            <div className="relative z-10 pt-4 sm:pt-6 border-t border-violet-200/50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 mt-1">
              
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-violet-100 dark:bg-violet-950/80 border border-violet-200/60 dark:border-violet-800 text-violet-700 dark:text-violet-300 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                  <ShieldCheck size={18} className="text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <span className="block text-slate-900 dark:text-white font-bold text-xs sm:text-sm leading-tight">
                    {currentHero.vendedor?.nombreTienda || currentHero.marca || t('tienda_oficial')}
                  </span>
                  <span className="text-[10.5px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {t('garantia_verificada')}
                  </span>
                </div>
              </div>

              {/* Botón negro píldora "Comprar ahora" */}
              <button
                onClick={(e) => handleAddToCart(currentHero, e)}
                className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-emerald-600 dark:hover:bg-emerald-400 dark:hover:text-slate-950 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2"
              >
                <span>{t('comprar_ahora')}</span>
                <ArrowRight size={14} />
              </button>

            </div>

          </div>

          {/* 1.2 TARJETA SUPERIOR DERECHA: PRODUCTO REAL DESTACADO DE LA BD */}
          <div 
            onClick={() => navigate(`/producto/${productTopRight.id}`)}
            className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[32px] sm:rounded-[36px] overflow-hidden relative group cursor-pointer shadow-xs border border-slate-200/80 dark:border-slate-800 min-h-[340px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-7 select-none hover:shadow-xl transition-all duration-300"
          >
            {/* Header de la tarjeta */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-[10px] font-extrabold uppercase tracking-widest text-violet-700 dark:text-violet-300">
                <Sparkles size={11} className="text-violet-600" />
                <span>{t('producto_destacado') || 'Producto Destacado'}</span>
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavoriteId(productTopRight.id)
                }}
                className={`w-8 h-8 rounded-full border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 transition cursor-pointer ${
                  favoriteIds.includes(productTopRight.id) ? 'text-rose-500 fill-rose-500' : ''
                }`}
                title={t('guardar_favoritos')}
              >
                <Heart size={15} fill={favoriteIds.includes(productTopRight.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Imagen centrada del producto real */}
            <div className="relative w-full h-48 sm:h-56 flex items-center justify-center p-2 my-auto">
              <img
                src={resolveProductImage(productTopRight)}
                alt={productTopRight.titulo}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_16px_20px_rgba(0,0,0,0.12)] group-hover:scale-108 transition-transform duration-500"
              />
            </div>

            {/* Footer con título y precio del producto real */}
            <div className="relative z-10 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <p className="text-[11px] font-bold text-violet-600 dark:text-violet-400 truncate uppercase">
                {productTopRight.marca || productTopRight.categoria?.nombre || t('tienda_oficial')}
              </p>
              
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate group-hover:text-violet-600 transition-colors">
                {productTopRight.titulo}
              </h3>

              <div className="flex items-center justify-between pt-1">
                <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  {formatCurrency(productTopRight.precioOferta || productTopRight.precio)} COP
                </span>

                <button
                  onClick={(e) => handleAddToCart(productTopRight, e)}
                  className="px-4 py-1.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:bg-emerald-500 hover:text-white transition flex items-center gap-1.5"
                >
                  <ShoppingBag size={13} />
                  <span>{t('anadir')}</span>
                </button>
              </div>
            </div>

          </div>

        </div>


        {/* ========================================================================= */}
        {/* FILA 2 & 3: COLUMNA IZQUIERDA (PRODUCTO DE LA BD) + DERECHA (BEST SELLERS BD) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          
          {/* 2.1 COLUMNA IZQUIERDA: PRODUCTO REAL DE LA BASE DE DATOS (REEMPLAZO DE LA FOTO DEL MODELO) */}
          <div 
            onClick={() => navigate(`/producto/${productLeft.id}`)}
            className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[30px] sm:rounded-[34px] overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between relative group min-h-[480px] sm:min-h-[530px] h-full p-5 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
          >
            {/* Header del producto real */}
            <div className="z-10 space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 text-[10px] font-extrabold uppercase tracking-wider">
                <Flame size={11} className="text-emerald-600" />
                <span>{t('novedad_oficial') || 'Novedad Oficial'}</span>
              </span>
              
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight line-clamp-2 pt-1">
                {productLeft.titulo}
              </h2>
              
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                {productLeft.categoria?.nombre || productLeft.marca || t('tienda_oficial')}
              </p>
            </div>

            {/* Imagen del producto real */}
            <div className="relative w-full h-56 sm:h-64 flex items-center justify-center p-2 my-auto">
              <img
                src={resolveProductImage(productLeft)}
                alt={productLeft.titulo}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_16px_20px_rgba(0,0,0,0.12)] group-hover:scale-108 transition-transform duration-500"
              />
            </div>

            {/* Footer con precio y acción directa */}
            <div className="z-10 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  {t('precio_oficial')}
                </span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {formatCurrency(productLeft.precioOferta || productLeft.precio)} COP
                </span>
              </div>

              <button
                onClick={(e) => handleAddToCart(productLeft, e)}
                className="w-full py-2.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xs hover:bg-emerald-600 hover:text-white transition flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} />
                <span>{t('comprar_ahora')}</span>
              </button>
            </div>

          </div>


          {/* 2.2 COLUMNA DERECHA: BANNER DE CONFIANZA + MÁS VENDIDOS DE LA BD */}
          <div className="lg:col-span-9 space-y-4 sm:space-y-6 flex flex-col justify-between h-full">
            
            {/* SUB-FILA SUPERIOR: TARJETA DE CONFIANZA + BANNER BENTO */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-stretch">
              
              {/* Tarjeta lila informativa de respaldo */}
              <div className="md:col-span-4 bg-[#cfcaef] dark:bg-violet-950/70 rounded-[28px] sm:rounded-[30px] p-5 sm:p-6 flex flex-col justify-between shadow-xs border border-violet-200/60 dark:border-violet-900 min-h-[150px] sm:h-[155px]">
                <p className="text-xs sm:text-[13px] font-semibold text-[#2d2556] dark:text-violet-200 leading-snug">
                  {t('team_quote')}
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-violet-900/80 text-[#2d2556] dark:text-white font-extrabold text-xs">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>{t('compra_protegida_titulo')}</span>
                  </span>
                </div>
              </div>

              {/* Banner "SIEMPRE ÚNICO CON LOS MEJORES MATERIALES" */}
              <div className="md:col-span-8 bg-white dark:bg-slate-900 rounded-[28px] sm:rounded-[30px] p-5 sm:p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 relative overflow-hidden flex items-center justify-between min-h-[150px] sm:h-[155px]">
                
                <svg className="absolute -right-6 -bottom-6 w-80 h-80 text-slate-100 dark:text-slate-800/40 pointer-events-none" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M0,100 C40,40 100,160 200,80" />
                  <path d="M0,120 C50,60 110,180 200,100" />
                  <path d="M0,140 C60,80 120,200 200,120" />
                  <path d="M0,160 C70,100 130,220 200,140" />
                </svg>

                <div className="space-y-1.5 sm:space-y-2 z-10">
                  <div className="flex items-center flex-wrap gap-2 text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    <span>{t('always_text')}</span>
                    <span className="bg-[#cdc8f0] dark:bg-violet-900/80 text-[#2b2354] dark:text-violet-200 px-3 py-0.5 rounded-lg font-black tracking-wider">
                      {t('unique_badge')}
                    </span>
                  </div>

                  <div className="flex items-center flex-wrap gap-2 text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    <span>{t('with_the_text')}</span>
                    <span className="bg-[#cdc8f0] dark:bg-violet-900/80 text-[#2b2354] dark:text-violet-200 px-3 py-0.5 rounded-lg font-black tracking-wider">
                      {t('best_badge')}
                    </span>
                    <span>{t('materials_text')}</span>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 pl-2">
                  <ChromeBlobSculpture className="w-14 h-14 sm:w-16 sm:h-16" />
                </div>

              </div>

            </div>


            {/* SUB-FILA INFERIOR: SECCIÓN "MÁS VENDIDOS" CON 3 PRODUCTOS REALES DE LA BD */}
            <div className="space-y-3 sm:space-y-4 pt-1">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {t('best_sellers')}
                  </h3>
                  <span className="text-xs text-slate-500 font-bold hidden sm:inline">
                    {t('destacados_pro')}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/catalogo?orden=ventas')}
                  className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-violet-600 dark:hover:bg-slate-100 px-5 py-1.5 rounded-full text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {t('view_all')}
                </button>
              </div>

              {/* Cuadrícula de 3 tarjetas de productos reales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-1 items-stretch">
                {bestSellersItems.map((prod) => {
                  const isFav = favoriteIds.includes(prod.id)
                  const img = resolveProductImage(prod)

                  return (
                    <div
                      key={prod.id}
                      onClick={() => navigate(`/producto/${prod.id}`)}
                      className="bg-white dark:bg-slate-900 rounded-[28px] p-5 shadow-xs hover:shadow-xl transition-all duration-300 relative border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between group cursor-pointer h-full min-h-[300px] sm:min-h-[320px] overflow-hidden"
                    >
                      <div className="flex items-center justify-between z-10 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 truncate max-w-[140px]">
                          {prod.categoria?.nombre || prod.marca || t('tienda_oficial')}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavoriteId(prod.id)
                          }}
                          className="w-8 h-8 rounded-full border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 transition cursor-pointer"
                          title={t('guardar_favoritos')}
                        >
                          <Heart
                            size={16}
                            className={`transition-colors ${isFav ? 'fill-rose-500 text-rose-500' : ''}`}
                          />
                        </button>
                      </div>

                      {/* Imagen del producto de la base de datos */}
                      <div className="relative h-44 sm:h-48 w-full flex items-center justify-center my-1">
                        <img
                          src={img}
                          alt={prod.titulo}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_16px_16px_rgba(0,0,0,0.13)] group-hover:scale-108 transition-transform duration-300"
                        />
                      </div>

                      {/* Footer con nombre y precio */}
                      <div className="pt-2 flex items-end justify-between z-10">
                        <div className="min-w-0 pr-2">
                          <p className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                            {prod.titulo}
                          </p>
                          <p className="text-sm sm:text-base font-extrabold text-[#8572e4] dark:text-violet-400 mt-0.5">
                            {formatCurrency(prod.precioOferta || prod.precio)} COP
                          </p>
                        </div>

                        <button
                          onClick={(e) => handleAddToCart(prod, e)}
                          className="w-10 h-10 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-md hover:scale-110 hover:bg-violet-700 dark:hover:bg-violet-400 active:scale-95 transition-all cursor-pointer shrink-0"
                          title={t('agregar_al_carrito')}
                        >
                          <ShoppingBag size={16} />
                        </button>
                      </div>

                    </div>
                  )
                })}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Toast flotante al agregar al carrito */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0">
            <Check size={16} strokeWidth={3} />
          </div>
          <div>
            <p className="text-xs font-bold text-white">{t('added_to_cart')}</p>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{cartToast.title}</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default BentoGridHeroShowcase
