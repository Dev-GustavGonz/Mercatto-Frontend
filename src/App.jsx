import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
// Common Layout & Components
import Spinner from './components/common/Spinner'
import ErrorBoundary from './components/common/ErrorBoundary'

// Landing page (eager para primer pintado inmediato sin cascada de chunks)
import Home from './features/public/pages/Home'
import CartDrawer from './features/pedidos/components/CartDrawer'
import ScrollToTop from './components/common/ScrollToTop'

// Loaders reutilizables para code-splitting y precarga en segundo plano
const loadDirectorioCategorias = () => import('./features/public/pages/DirectorioCategorias')
const loadAboutUs = () => import('./features/public/pages/AboutUs')
const loadNotFound = () => import('./features/public/pages/NotFound')
const loadTerminos = () => import('./features/public/pages/Terminos')
const loadPrivacidad = () => import('./features/public/pages/Privacidad')

const loadLogin = () => import('./features/auth/pages/Login')
const loadRegistro = () => import('./features/auth/pages/Registro')
const loadRecuperarPassword = () => import('./features/auth/pages/RecuperarPassword')

const loadCatalogo = () => import('./features/productos/pages/Catalogo')
const loadDetalleProducto = () => import('./features/productos/pages/DetalleProducto')
const loadCategoria = () => import('./features/productos/pages/Categoria')
const loadBusqueda = () => import('./features/productos/pages/Busqueda')
const loadFavoritos = () => import('./features/productos/pages/Favoritos')

const loadCarrito = () => import('./features/pedidos/pages/Carrito')
const loadCheckout = () => import('./features/pedidos/pages/Checkout')
const loadMisPedidos = () => import('./features/pedidos/pages/MisPedidos')
const loadPagoExitoso = () => import('./features/pedidos/pages/PagoExitoso')
const loadPagoCancelado = () => import('./features/pedidos/pages/PagoCancelado')
const loadRastreoPedido = () => import('./features/pedidos/pages/RastreoPedido')

const loadDirectorioTiendas = () => import('./features/tiendas/pages/DirectorioTiendas')
const loadVitrinaTienda = () => import('./features/tiendas/pages/VitrinaTienda')
const loadPerfil = () => import('./features/usuario/pages/Perfil')
const loadMensajes = () => import('./features/mensajes/pages/Mensajes')
const loadCentroSoporte = () => import('./features/soporte/pages/CentroSoporte')
const loadPublicChatbot = () => import('./features/soporte/components/PublicChatbot')
const loadPanelAdmin = () => import('./features/admin/pages/PanelAdmin')
const loadPanelVendedor = () => import('./features/tiendas/pages/PanelVendedor')

const DirectorioCategorias = lazy(loadDirectorioCategorias)
const AboutUs = lazy(loadAboutUs)
const NotFound = lazy(loadNotFound)
const Terminos = lazy(loadTerminos)
const Privacidad = lazy(loadPrivacidad)

const Login = lazy(loadLogin)
const Registro = lazy(loadRegistro)
const RecuperarPassword = lazy(loadRecuperarPassword)

const Catalogo = lazy(loadCatalogo)
const DetalleProducto = lazy(loadDetalleProducto)
const Categoria = lazy(loadCategoria)
const Busqueda = lazy(loadBusqueda)
const Favoritos = lazy(loadFavoritos)

const Carrito = lazy(loadCarrito)
const Checkout = lazy(loadCheckout)
const MisPedidos = lazy(loadMisPedidos)
const PagoExitoso = lazy(loadPagoExitoso)
const PagoCancelado = lazy(loadPagoCancelado)
const RastreoPedido = lazy(loadRastreoPedido)

const DirectorioTiendas = lazy(loadDirectorioTiendas)
const VitrinaTienda = lazy(loadVitrinaTienda)
const Perfil = lazy(loadPerfil)
const Mensajes = lazy(loadMensajes)
const CentroSoporte = lazy(loadCentroSoporte)
const PublicChatbot = lazy(loadPublicChatbot)
const PanelAdmin = lazy(loadPanelAdmin)
const PanelVendedor = lazy(loadPanelVendedor)

const RouteLoader = () => (
  <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-slate-100/60 dark:bg-slate-900/60 overflow-hidden pointer-events-none">
    <div className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-rose-500 animate-loading-bar w-full" />
  </div>
)

// Protected Route Wrapper for Vendor
const RutaVendedor = ({ children }) => {
  const { autenticado, esVendedor, esAdmin, cargando } = useAuth()
  if (cargando) {
    return <RouteLoader />
  }
  if (!autenticado || (!esVendedor && !esAdmin)) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Protected Route Wrapper for Admin
const RutaAdmin = ({ children }) => {
  const { autenticado, esAdmin, cargando } = useAuth()
  if (cargando) {
    return <RouteLoader />
  }
  if (!autenticado || !esAdmin) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Protected Route Wrapper for Logged-in Buyers
const RutaProtegida = ({ children }) => {
  const { autenticado, cargando } = useAuth()
  if (cargando) {
    return <RouteLoader />
  }
  if (!autenticado) {
    return <Navigate to="/login" replace />
  }
  return children
}

const CORE_ROUTE_LOADERS = [
  loadCatalogo,
  loadDetalleProducto,
  loadCategoria,
  loadBusqueda,
  loadDirectorioCategorias,
  loadDirectorioTiendas,
  loadVitrinaTienda,
  loadLogin,
  loadRegistro,
  loadRecuperarPassword,
  loadPublicChatbot,
]

const SECONDARY_ROUTE_LOADERS = [
  loadAboutUs,
  loadCentroSoporte,
  loadCarrito,
  loadRastreoPedido,
  loadFavoritos,
  loadCheckout,
  loadMisPedidos,
  loadPerfil,
  loadMensajes,
  loadPagoExitoso,
  loadPagoCancelado,
  loadTerminos,
  loadPrivacidad,
  loadPanelAdmin,
  loadPanelVendedor,
  loadNotFound,
]

let routesPrefetchStarted = false

const scheduleIdle = (cb, fallbackDelay = 250, timeout = 1200) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const id = window.requestIdleCallback(cb, { timeout })
    return () => window.cancelIdleCallback(id)
  }
  const timer = setTimeout(cb, fallbackDelay)
  return () => clearTimeout(timer)
}

const AppLayout = () => {
  const location = useLocation()
  const esRutaPanel =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/panel-vendedor') ||
    location.pathname.startsWith('/vendedor')
  const esRutaAuth =
    location.pathname === '/login' ||
    location.pathname === '/registro' ||
    location.pathname.startsWith('/recuperar-password')
  const esHome = location.pathname === '/'

  // Precarga inmediata de rutas en segundo plano para navegación sin tiempos de espera
  useEffect(() => {
    if (routesPrefetchStarted) return
    routesPrefetchStarted = true

    // 1. Precarga inmediata e instantánea de todas las rutas principales
    Promise.allSettled(CORE_ROUTE_LOADERS.map((loader) => {
      try { return loader().catch(() => {}) } catch { return Promise.resolve() }
    }))

    // 2. Precarga rápida de rutas secundarias
    const timer = setTimeout(() => {
      Promise.allSettled(SECONDARY_ROUTE_LOADERS.map((loader) => {
        try { return loader().catch(() => {}) } catch { return Promise.resolve() }
      }))
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-mercatto-bg dark:bg-slate-950 text-mercatto-text dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {!esRutaPanel && !esRutaAuth && <Navbar />}
      <CartDrawer />
      {!esRutaPanel && !esRutaAuth && (
        <Suspense fallback={null}>
          <PublicChatbot />
        </Suspense>
      )}

      <main className={esRutaPanel || esHome || esRutaAuth ? "flex-1 w-full" : "flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6"}>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            {/* Public Marketplace routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/categorias" element={<DirectorioCategorias />} />
            <Route path="/categoria/:id" element={<Categoria />} />
            <Route path="/buscar" element={<Busqueda />} />
            <Route path="/tiendas" element={<DirectorioTiendas />} />
            <Route path="/tienda/:id" element={<VitrinaTienda />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/rastreo" element={<RastreoPedido />} />
            <Route path="/soporte" element={<CentroSoporte />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/recuperar-password" element={<RecuperarPassword />} />

            {/* Buyer protected routes */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pago/exitoso" element={<PagoExitoso />} />
            <Route path="/pago/cancelado" element={<PagoCancelado />} />
            <Route
              path="/perfil"
              element={
                <RutaProtegida>
                  <Perfil />
                </RutaProtegida>
              }
            />
            <Route
              path="/mis-pedidos"
              element={
                <RutaProtegida>
                  <MisPedidos />
                </RutaProtegida>
              }
            />
            <Route
              path="/favoritos"
              element={
                <RutaProtegida>
                  <Favoritos />
                </RutaProtegida>
              }
            />
            <Route
              path="/mensajes"
              element={
                <RutaProtegida>
                  <Mensajes />
                </RutaProtegida>
              }
            />

            {/* Vendor Panel */}
            <Route
              path="/vendedor"
              element={
                <RutaVendedor>
                  <PanelVendedor />
                </RutaVendedor>
              }
            />
            <Route
              path="/panel-vendedor"
              element={
                <RutaVendedor>
                  <PanelVendedor />
                </RutaVendedor>
              }
            />

            {/* Admin Panel */}
            <Route
              path="/admin"
              element={
                <RutaAdmin>
                  <PanelAdmin />
                </RutaAdmin>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {!esRutaPanel && !esRutaAuth && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            <FavoritesProvider>
              <CartProvider>
                <ErrorBoundary>
                  <AppLayout />
                </ErrorBoundary>
              </CartProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
