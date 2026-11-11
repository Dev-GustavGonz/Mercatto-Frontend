import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { productoService } from '@/features/productos/services/productoService'
import ModalContactoVendedor from '@/features/productos/components/ModalContactoVendedor'
import ProductGrid from '@/features/productos/components/ProductGrid'
import { tiendaService } from '@/features/tiendas/services/tiendaService'
import { useCart } from '@/hooks/useCart'
import { useFavorites } from '@/hooks/useFavorites'
import { useLanguage } from '@/hooks/useLanguage'
import { apiCache } from '@/utils/apiCache'
import { sortCategoriesHierarchically } from '@/utils/categoryUtils'
import Spinner from '@/components/common/Spinner'
import Pagination from '@/components/common/Pagination'

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
  Flame,
  CheckCircle2,
  Sparkles,
  Star,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react'

// Prioridad de membresía comercial garantizada: ELITE > PRO > STARTER
const getPlanWeight = (prod, tiendasList) => {
  let s = (prod?.vendedor?.tipoSuscripcion || prod?.vendedor?.plan || '').toUpperCase()
  if (!s && (prod?.vendedor?.id || prod?.vendedorId) && Array.isArray(tiendasList)) {
    const vId = prod?.vendedor?.id || prod?.vendedorId
    const match = tiendasList.find((item) => String(item.id) === String(vId))
    if (match) s = (match.tipoSuscripcion || match.plan || '').toUpperCase()
  }
  if (s === 'ELITE') return 3
  if (s === 'PRO') return 2
  return 1
}

const buildUnifiedProductPool = (dest, listaGeneral, masVend, nuev, tiendasList) => {
  return [
    ...(Array.isArray(dest) ? dest : []),
    ...(Array.isArray(listaGeneral) ? listaGeneral : []),
    ...(Array.isArray(masVend) ? masVend : []),
    ...(Array.isArray(nuev) ? nuev : [])
  ]
    .filter((p, idx, arr) => p && p.id && arr.findIndex((item) => item.id === p.id) === idx)
    .sort((a, b) => {
      const wB = getPlanWeight(b, tiendasList)
      const wA = getPlanWeight(a, tiendasList)
      if (wB !== wA) return wB - wA
      if (b.destacado !== a.destacado) return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0)
      return (b.totalVentas || 0) - (a.totalVentas || 0)
    })
}

export const Home = () => {
  const cachedDest = apiCache.peekExact('/productos/destacados')
  const cachedNuev = apiCache.peekExact('/productos/nuevos')
  const cachedMasV = apiCache.peekExact('/productos/mas-vendidos')
  const cachedTiendas = apiCache.peekExact('/tiendas')
  const cachedCats = apiCache.peekExact('/categorias/todas') || apiCache.peekExact('/categorias')
  const cachedAllProds = apiCache.peekExact('/productos', { tamano: 50 })
  const cachedEliteProds = apiCache.peekExact('/productos', { soloElite: true, tamano: 12 })

  const initialTiendas = Array.isArray(cachedTiendas) ? cachedTiendas : []
  const initialPool = buildUnifiedProductPool(
    cachedDest,
    cachedAllProds?.content,
    cachedMasV,
    cachedNuev,
    initialTiendas
  )
  const tieneCachePrevia = initialPool.length > 0

  const [destacados, setDestacados] = useState(() => initialPool)
  const [nuevos, setNuevos] = useState(() => (Array.isArray(cachedNuev) && cachedNuev.length > 0 ? cachedNuev : initialPool.slice(0, 8)))
  const [masVendidos, setMasVendidos] = useState(() => (Array.isArray(cachedMasV) && cachedMasV.length > 0 ? cachedMasV : initialPool))
  const [productosElite, setProductosElite] = useState(() => (Array.isArray(cachedEliteProds?.content) ? cachedEliteProds.content : []))
  const [tiendas, setTiendas] = useState(() => initialTiendas)
  const [categorias, setCategorias] = useState(() => (Array.isArray(cachedCats) ? sortCategoriesHierarchically(cachedCats) : []))
  const [loading, setLoading] = useState(!tieneCachePrevia)
  const [productoContacto, setProductoContacto] = useState(null)

  const { agregarItem } = useCart()
  const { toggleFavoriteId, favoriteIds } = useFavorites()
  const { t, idioma } = useLanguage()
  const navigate = useNavigate()
  const todosProductosRef = useRef(null)
  const [paginaHome, setPaginaHome] = useState(0)
  const PRODUCTOS_POR_PAGINA_HOME = 12

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
        const [dest, nuev, masVend, tiendasData, catsData, allProdsData, eliteData] = await Promise.all([
          productoService.obtenerDestacados().catch(() => []),
          productoService.obtenerNuevos().catch(() => []),
          productoService.obtenerMasVendidos().catch(() => []),
          tiendaService.listarTiendas().catch(() => []),
          productoService
            .listarTodasCategorias()
            .catch(() => productoService.listarCategorias().catch(() => [])),
          productoService.listar({ tamano: 50 }).catch(() => ({ content: [] })),
          productoService.listar({ soloElite: true, tamano: 12 }).catch(() => ({ content: [] }))
        ])
        const listaGeneral = allProdsData?.content || []
        const listaElite = eliteData?.content || []
        setProductosElite(listaElite)

        const poolCompleto = buildUnifiedProductPool(dest, listaGeneral, masVend, nuev, tiendasData)

        setDestacados(poolCompleto)
        setNuevos(nuev && nuev.length > 0 ? nuev : poolCompleto.slice(0, 8))
        
        const listaVendidos = (masVend && masVend.length > 0)
          ? [...masVend].sort((a, b) => (b.totalVentas || 0) - (a.totalVentas || 0))
          : [...poolCompleto].sort((a, b) => (b.totalVentas || 0) - (a.totalVentas || 0))
        setMasVendidos(listaVendidos)
        setTiendas(tiendasData || [])
        setCategorias(sortCategoriesHierarchically(catsData || []))
      } catch (err) {
        console.error('Error cargando datos del home:', err)
      } finally {
        setLoading(false)
      }
    }
    cargarDatos()
  }, [])

  // Pantalla de carga hasta que respondan los artículos reales (solo si no hay caché previa)
  if (loading && destacados.length === 0) {
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
          <FeaturedShowcase productos={productosElite.length > 0 ? productosElite : destacados} tiendas={tiendas} />
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
        {destacados.length > 0 && (() => {
          const totalPaginasHome = Math.ceil(destacados.length / PRODUCTOS_POR_PAGINA_HOME)
          const paginaSegura = Math.min(paginaHome, Math.max(0, totalPaginasHome - 1))
          const inicio = paginaSegura * PRODUCTOS_POR_PAGINA_HOME
          const productosPagina = destacados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA_HOME)

          return (
            <section ref={todosProductosRef} className="space-y-6">
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
                productos={productosPagina} 
                loading={false}
                onContactClick={(prod) => setProductoContacto(prod)}
              />

              <Pagination
                currentPage={paginaSegura}
                totalPages={totalPaginasHome}
                onPageChange={(nuevaPagina) => {
                  setPaginaHome(nuevaPagina)
                  todosProductosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              />
            </section>
          )
        })()}

        {/* ========================================================= */}
        {/* 8. SECCIÓN TIENDAS OFICIALES VERIFICADAS EN COLOMBIA      */}
        {/* ========================================================= */}
        {tiendasMostradas.length > 0 && (
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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

              <button
                onClick={() => navigate('/tiendas')}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-violet-400 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-violet-600 transition cursor-pointer shadow-xs"
              >
                <span>{isEn ? 'View all stores' : 'Ver todas las tiendas'}</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            {/* Cuadrícula limpia de tiendas destacadas (sin scrollbar) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {tiendasMostradas.slice(0, 4).map((tItem, idx) => {
                const coverImg = tItem.portadaUrl || tItem.bannerUrl || coverDefaults[idx % coverDefaults.length]
                return (
                  <div
                    key={tItem.id}
                    onClick={() => navigate(`/tienda/${tItem.id}`)}
                    className="bg-white dark:bg-slate-900 rounded-[28px] sm:rounded-[30px] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group select-none"
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
