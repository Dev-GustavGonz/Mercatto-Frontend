import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { productoService, ModalContactoVendedor, ProductGrid } from '@/features/productos'
import { tiendaService } from '@/features/tiendas/services/tiendaService'
import { useCart } from '@/hooks/useCart'
import { useFavorites } from '@/hooks/useFavorites'
import { useLanguage } from '@/hooks/useLanguage'
import Spinner from '@/components/common/Spinner'

// Componentes del diseño Showcase Bento 2026
import BentoGridHeroShowcase from '../components/BentoGridHeroShowcase'
import PromotionalBento from '../components/PromotionalBento'
import CategoriesShowcase from '../components/CategoriesShowcase'
import FeaturedShowcase from '../components/FeaturedShowcase'
import ProductTripleColumn from '../components/ProductTripleColumn'

import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  BadgeCheck, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  CheckCircle2,
  Sparkles,
  Star,
  ArrowRight
} from 'lucide-react'

export const Home = () => {
  const [destacados, setDestacados] = useState([])
  const [nuevos, setNuevos] = useState([])
  const [masVendidos, setMasVendidos] = useState([])
  const [tiendas, setTiendas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [productoContacto, setProductoContacto] = useState(null)

  const { agregarItem } = useCart()
  const { toggleFavoriteId, favoriteIds } = useFavorites()
  const { t, idioma } = useLanguage()
  const navigate = useNavigate()
  const tiendasScrollRef = useRef(null)

  const isEn = idioma === 'EN'

  const tiendasMostradas = tiendas

  // Portadas por defecto para las tiendas oficiales que no hayan subido portada
  const coverDefaults = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=600&auto=format&fit=crop&q=80'
  ]

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [dest, nuev, masVend, tiendasData, catsData, allProdsData] = await Promise.all([
          productoService.obtenerDestacados().catch(() => []),
          productoService.obtenerNuevos().catch(() => []),
          productoService.obtenerMasVendidos().catch(() => []),
          tiendaService.listarTiendas().catch(() => []),
          productoService.listarCategorias().catch(() => []),
          productoService.listar({ tamano: 50 }).catch(() => ({ content: [] }))
        ])
        const listaGeneral = allProdsData?.content || []
        
        // Pool unificado de todos los productos disponibles garantizando que ningún producto se pierda
        const poolCompleto = [
          ...(Array.isArray(dest) ? dest : []),
          ...(Array.isArray(listaGeneral) ? listaGeneral : []),
          ...(Array.isArray(masVend) ? masVend : []),
          ...(Array.isArray(nuev) ? nuev : [])
        ].filter((p, idx, arr) => p && p.id && arr.findIndex(item => item.id === p.id) === idx)

        setDestacados(poolCompleto)
        setNuevos(nuev && nuev.length > 0 ? nuev : poolCompleto.slice(0, 8))
        
        const listaVendidos = (masVend && masVend.length > 0)
          ? [...masVend].sort((a, b) => (b.totalVentas || 0) - (a.totalVentas || 0))
          : [...poolCompleto].sort((a, b) => (b.totalVentas || 0) - (a.totalVentas || 0))
        setMasVendidos(listaVendidos)
        setTiendas(tiendasData || [])
        setCategorias(catsData || [])
      } catch (err) {
        console.error('Error cargando datos del home:', err)
      } finally {
        setLoading(false)
      }
    }
    cargarDatos()
  }, [])

  // Desplazamiento horizontal para el carrusel de tiendas oficiales
  const scrollTiendas = (direccion) => {
    if (tiendasScrollRef.current) {
      const offset = direccion === 'left' ? -320 : 320
      tiendasScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
    }
  }

  // Pantalla de carga hasta que respondan los artículos reales de la base de datos
  if (loading) {
    return (
      <div className="min-h-[65vh] w-full flex flex-col items-center justify-center p-6 space-y-2">
        <Spinner size="lg" className="py-2" />
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Sincronizando artículos y tiendas
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-mercatto-bg dark:bg-slate-950 pb-20 font-sans">
      {/* ========================================================= */}
      {/* 1. HERO SHOWCASE FULL-WIDTH (100% ANCHO DE PANTALLA REAL) */}
      {/* ========================================================= */}
      <section className="w-full">
        <BentoGridHeroShowcase 
          categorias={categorias}
          masVendidos={masVendidos}
          productos={destacados}

          onAddToCart={agregarItem} 
        />
      </section>

      <div className="container max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-10 space-y-8 sm:space-y-14">

        {/* ========================================================= */}
        {/* 2. BARRA FLOTANTE DELGADA DE CONFIANZA (TEMPRANA / ARRIBA)*/}
        {/* ========================================================= */}
        <section aria-label="Garantías y respaldo oficial de Mercatto">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:px-7 sm:py-4 shadow-md shadow-slate-200/60 dark:shadow-black/40 border border-slate-200/90 dark:border-slate-800">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CreditCard size={19} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {t('envios_wompi_titulo')}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {t('envios_wompi_sub')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={19} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {t('compra_protegida_titulo')}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {t('compra_protegida_sub')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <BadgeCheck size={19} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {t('garantia_oficial_titulo')}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {t('garantia_oficial_sub')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                  <Truck size={19} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {t('envio_colombia_titulo')}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {t('envio_colombia_sub')}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. SECCIÓN DE OFERTAS CON URGENCIA (JUSTO DEBAJO DEL HERO)*/}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="space-y-1">
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t('ofertas_mes_titulo')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">{t('destacados_pro')}</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {t('ofertas_sub')}
            </p>
          </div>

          <PromotionalBento 
            productos={destacados}
 
            onAddToCart={agregarItem} 
          />
        </section>

        {/* ========================================================= */}
        {/* 4. TARJETAS DE CATEGORÍAS OFICIALES DESTACADAS            */}
        {/* ========================================================= */}
        <section>
          <CategoriesShowcase categorias={categorias} />
        </section>

        {/* ========================================================= */}
        {/* 5. NUESTROS PRODUCTOS DESTACADOS PRO                      */}
        {/* ========================================================= */}
        <section>
          <FeaturedShowcase productos={destacados} tiendas={tiendas} />
        </section>

        {/* ========================================================= */}
        {/* 6. TRIPLE COLUMNA + BANNER VERTICAL CON OVERLAY OSCURO    */}
        {/* ========================================================= */}
        <section>
          <ProductTripleColumn 
            destacados={destacados} 
            nuevos={nuevos}
            masVendidos={masVendidos} 
          />
        </section>

        {/* ========================================================= */}
        {/* 7. TODOS LOS PRODUCTOS DISPONIBLES EN MERCATTO            */}
        {/* ========================================================= */}
        {destacados.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-[11px] font-extrabold tracking-widest uppercase text-violet-700 dark:text-violet-300">
                  <Sparkles size={12} />
                  <span>{t('todos_los_productos') || 'Catálogo de Artículos'}</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Todos los <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">Productos</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Explora todos los artículos disponibles de vendedores oficiales en Colombia
                </p>
              </div>

              <button
                onClick={() => navigate('/catalogo')}
                className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-violet-600 dark:hover:bg-violet-500 hover:text-white dark:hover:text-white font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
              >
                <span>{t('ver_todo_catalogo')}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <ProductGrid 
              productos={destacados} 
              loading={false}
              onContactClick={(prod) => setProductoContacto(prod)}
            />
          </section>
        )}

        {/* ========================================================= */}
        {/* 8. SECCIÓN TIENDAS OFICIALES VERIFICADAS EN COLOMBIA      */}
        {/* ========================================================= */}
        {tiendasMostradas.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-[11px] font-extrabold tracking-widest uppercase text-violet-700 dark:text-violet-300">
                  <Sparkles size={12} />
                  <span>{t('proveedores_certificados')}</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t('tiendas_oficiales_titulo')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">{t('tiendas_oficiales_sub')}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t('tiendas_desc')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollTiendas('left')}
                  className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-400 text-slate-600 dark:text-slate-300 hover:text-violet-600 flex items-center justify-center shadow-xs transition cursor-pointer"
                  title="Anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scrollTiendas('right')}
                  className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-400 text-slate-600 dark:text-slate-300 hover:text-violet-600 flex items-center justify-center shadow-xs transition cursor-pointer"
                  title="Siguiente"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Carrusel horizontal de tiendas */}
            <div
              ref={tiendasScrollRef}
              className="flex gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none -mr-4 sm:-mr-6 lg:-mr-8 pr-12 sm:pr-16"
            >
              {tiendasMostradas.map((tItem, idx) => {
                const coverImg = tItem.portadaUrl || tItem.bannerUrl || coverDefaults[idx % coverDefaults.length]
                return (
                  <div
                    key={tItem.id}
                    onClick={() => navigate(`/tienda/${tItem.id}`)}
                    className="w-72 sm:w-80 shrink-0 bg-white dark:bg-slate-900 rounded-[28px] sm:rounded-[30px] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group select-none"
                  >
                    {/* Banner de la tienda amplio y 100% visible */}
                    <div className="h-36 sm:h-40 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={coverImg}
                        alt={tItem.nombreTienda}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>

                    <div className="p-4 pt-0 relative flex-1 flex flex-col justify-between">
                      <div className="flex items-end justify-between -mt-7 mb-2">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl border-2 border-white dark:border-slate-900 shadow-md overflow-hidden bg-slate-900 shrink-0">
                            {tItem.logoUrl ? (
                              <img src={tItem.logoUrl} alt={tItem.nombreTienda} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-black text-white text-sm bg-gradient-to-br from-violet-600 to-indigo-600">
                                {tItem.nombreTienda?.charAt(0) || 'T'}
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs">
                            <CheckCircle2 size={12} className="fill-emerald-500 text-white" />
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/tienda/${tItem.id}`)
                          }}
                          className="px-4 py-1.5 rounded-full bg-slate-950 dark:bg-slate-800 hover:bg-emerald-400 text-white hover:text-slate-950 font-bold text-xs transition cursor-pointer"
                        >
                          {t('ver_tienda')}
                        </button>
                      </div>

                      <div className="pt-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                            {tItem.nombreTienda}
                          </h3>
                          <BadgeCheck size={14} className="text-emerald-500 shrink-0" />
                        </div>
                        <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                          <span className="truncate">{tItem.ciudad || 'Colombia'} • {t('tienda_verificada')}</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold shrink-0">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span>{Number(tItem.calificacion || 5.0).toFixed(1)}</span>
                            {tItem.totalResenas > 0 && <span className="text-[10px] text-slate-400">({tItem.totalResenas})</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

      </div>

      {/* Modal Contacto Vendedor */}
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

export default Home
