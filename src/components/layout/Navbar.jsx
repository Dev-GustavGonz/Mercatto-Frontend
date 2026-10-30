import React, { useState, useEffect, useRef } from 'react'
import {
  Link,
  useNavigate,
  useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useFavorites } from '@/hooks/useFavorites'
import { useLanguage } from '@/hooks/useLanguage'
import { useTheme } from '@/hooks/useTheme'
import { productoService } from '../../features/productos'
import { tiendaService, vendedorService } from '../../features/tiendas'
import SearchBar from './SearchBar'
import MercattoLogo from '../common/MercattoLogo'
import { 
  ShoppingBag,
  Heart,
  User,
  LogOut,
  Store,
  Shield,
  Package,
  Menu,
  X,
  MessageSquare,
  Globe,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  Tag,
  Layers,
  Settings,
  DollarSign,
  Headphones,
  CheckCircle2,
  Home as HomeIcon,
  Info
} from 'lucide-react'

export const Navbar = () => {
  const { usuario, autenticado, logout, esVendedor, esAdmin, esComprador } = useAuth()
  const { totalItems, setDrawerAbierto } = useCart()
  const { favoriteIds } = useFavorites()
  const { idioma, cambiarIdioma, t } = useLanguage()
  const { theme, isDark, toggleTheme } = useTheme()
  const [dropdownUser, setDropdownUser] = useState(false)
  const [dropdownLang, setDropdownLang] = useState(false)
  const [dropdownShop, setDropdownShop] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [marcas, setMarcas] = useState([])
  const [menuMobile, setMenuMobile] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const [nombreTienda, setNombreTienda] = useState(() => {
    return usuario?.nombreTienda || ''
  })

  useEffect(() => {
    if (usuario?.nombreTienda) {
      setNombreTienda(usuario.nombreTienda)
    } else if (esVendedor && autenticado) {
      vendedorService.obtenerPerfil()
        .then((res) => {
          if (res?.nombreTienda) {
            setNombreTienda(res.nombreTienda)
          }
        })
        .catch(() => {})
    }
  }, [usuario, esVendedor, autenticado])

  // Obtener la inicial del avatar: para vendedores, la inicial del nombre de la tienda
  const inicialAvatar = (() => {
    if (esAdmin) return 'A'
    if (esVendedor) {
      const tienda = (nombreTienda || usuario?.nombreTienda || '').trim()
      if (tienda) {
        return tienda.charAt(0).toUpperCase()
      }
      return (usuario?.nombre?.trim()?.charAt(0).toUpperCase()) || 'T'
    }
    return (usuario?.nombre?.trim()?.charAt(0).toUpperCase()) || 'U'
  })()

  // Si estamos dentro del panel de administrador o panel de vendedor, ocultamos la barra pública
  // para que el panel trabaje a pantalla completa con su propio dock y cabecera profesional.
  const esRutaPanel = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/panel-vendedor') || 
    location.pathname.startsWith('/vendedor')

  useEffect(() => {
    const cargarFiltros = async () => {
      try {
        const [cats, marcs] = await Promise.all([
          productoService.listarCategorias().catch(() => []),
          tiendaService.listarMarcas().catch(() => [])
        ])
        setCategorias(cats || [])
        setMarcas(marcs || [])
      } catch {
        // Fallback silencioso
      }
    }
    cargarFiltros()
  }, [])

  const [navVisible, setNavVisible] = useState(true)
  const prevScrollY = useRef(0)

  // Auto-ocultar al hacer scroll hacia abajo y mostrar de inmediato al subir
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - prevScrollY.current

      // Si está cerca del tope superior, siempre visible
      if (currentScrollY < 50) {
        setNavVisible(true)
      } else if (delta > 8) {
        setNavVisible(false)
        setDropdownShop(false)
        setDropdownUser(false)
        setDropdownLang(false)
      } else if (delta < -8) {
        setNavVisible(true)
      }

      prevScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (esRutaPanel) {
    return null
  }

  const handleLogout = async () => {
    setDropdownUser(false)
    try {
      await logout()
    } catch (e) {
      console.warn('Error en logout:', e)
    }
    window.location.href = '/'
  }

  const esAdminOVendedor = esAdmin || esVendedor

  return (
    <header 
      className={`sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-100/80 dark:border-slate-800/80 transition-all duration-300 ease-in-out ${
        navVisible || menuMobile 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* BARRA DE NAVEGACIÓN FULL-WIDTH LIMPIA SIN BORDES DE CAJA */}
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-4 sm:gap-6 pointer-events-auto transition-all">
        
        {/* BLOQUE IZQUIERDO: LOGO + DIVISOR SUTIL + NAVEGACIÓN EDITORIAL */}
        <div className="flex items-center gap-4 lg:gap-5 shrink-0">
          {/* LOGO OFICIAL MERCATTO */}
          <Link 
            to="/" 
            className="flex items-center shrink-0 transition-transform"
            title="Ir al inicio de Mercatto"
          >
            <MercattoLogo showSlogan={true} />
          </Link>

          <span className="hidden lg:block h-5 w-px bg-slate-200/80" />

          {/* ENLACES SUPERIORES SEGÚN EL ROL DEL USUARIO */}
          <nav className="hidden lg:flex items-center gap-1 text-[13.5px] font-semibold text-slate-600 dark:text-slate-300">
            
            {/* 1. Catálogo desplegable (disponible para todos para inspeccionar productos) */}
            <div 
              className="relative"
              onMouseEnter={() => setDropdownShop(true)}
              onMouseLeave={() => setDropdownShop(false)}
            >
              <button 
                onClick={() => setDropdownShop(!dropdownShop)}
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  location.pathname.startsWith('/catalogo')
                    ? 'text-emerald-800 bg-emerald-50/90 font-bold'
                    : 'hover:text-slate-950 hover:bg-slate-100/80'
                }`}
              >
                <span>{t('catalogo')}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${dropdownShop ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>

              {dropdownShop && (
                <div className="absolute top-full left-0 pt-2 w-[420px] z-50 animate-in fade-in">
                  <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-4 overflow-hidden text-slate-800">
                    {/* Accesos rápidos superiores */}
                    <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
                      <Link
                        to="/catalogo"
                        onClick={() => setDropdownShop(false)}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/80 text-xs font-bold text-slate-800 hover:text-emerald-700 transition"
                      >
                        <ShoppingBag size={15} className="text-emerald-600" />
                        <span>{t('todo_catalogo')}</span>
                      </Link>
                      <Link
                        to="/tiendas"
                        onClick={() => setDropdownShop(false)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/80 text-xs font-bold text-slate-800 hover:text-emerald-700 transition"
                      >
                        <Store size={15} className="text-violet-600" />
                        <span>{t('tiendas_oficiales')}</span>
                      </Link>
                    </div>

                    {/* Contenido Dinámico: Categorías y Marcas de la BD */}
                    <div className="grid grid-cols-2 gap-4 py-3">
                      {/* Categorías */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1">
                          <Layers size={12} className="text-emerald-600" />
                          <span>{t('categorias')}</span>
                        </span>
                        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                          {categorias && categorias.length > 0 ? (
                            categorias.slice(0, 5).map((cat) => (
                              <Link
                                key={cat.id}
                                to={`/catalogo?categoriaId=${cat.id}`}
                                onClick={() => setDropdownShop(false)}
                                className="block px-2 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition truncate"
                              >
                                {cat.nombre}
                              </Link>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">{t('cargando_categorias')}</span>
                          )}
                        </div>
                      </div>

                      {/* Marcas */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1">
                          <Tag size={12} className="text-violet-500" />
                          <span>{t('marcas_oficiales')}</span>
                        </span>
                        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                          {marcas && marcas.length > 0 ? (
                            marcas.slice(0, 5).map((m) => (
                              <Link
                                key={m}
                                to={`/catalogo?marca=${encodeURIComponent(m)}`}
                                onClick={() => setDropdownShop(false)}
                                className="block px-2 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition truncate"
                              >
                                {m}
                              </Link>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">{t('cargando_marcas')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer del dropdown */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <Link
                        to="/catalogo?orden=ventas"
                        onClick={() => setDropdownShop(false)}
                        className="text-slate-500 hover:text-slate-950 font-medium flex items-center gap-1"
                      >
                        <Sparkles size={12} className="text-amber-500" />
                        <span>{t('mas_vendidos')}</span>
                      </Link>
                      <Link
                        to="/catalogo?orden=recientes"
                        onClick={() => setDropdownShop(false)}
                        className="text-slate-500 hover:text-emerald-700 font-medium flex items-center gap-1"
                      >
                        <Package size={12} className="text-emerald-500" />
                        <span>{t('nuevos_productos')}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Opciones SOLO para Compradores / Usuarios Generales */}
            {/* 2. Opciones de Exploración Oficial */}
            <Link 
              to="/tiendas" 
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                location.pathname.startsWith('/tienda')
                  ? 'text-emerald-800 bg-emerald-50/90 font-bold'
                  : 'hover:text-slate-950 hover:bg-slate-100/80'
              }`}
            >
              {t('tiendas_oficiales')}
            </Link>

            <Link 
              to="/about" 
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                location.pathname === '/about'
                  ? 'text-emerald-800 bg-emerald-50/90 font-bold'
                  : 'hover:text-slate-950 hover:bg-slate-100/80'
              }`}
            >
              {t('nosotros')}
            </Link>

            {/* 3. Botón de acceso exclusivo para VENDEDOR */}
            {esVendedor && (
              <Link 
                to="/panel-vendedor" 
                className="px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white transition flex items-center gap-1.5 shadow-xs text-xs font-bold ml-1"
                title="Ir a mi panel de vendedor"
              >
                <Store size={14} />
                <span>{t('panel_vendedor')}</span>
              </Link>
            )}

            {/* 4. Botón de acceso exclusivo para ADMIN */}
            {esAdmin && (
              <Link 
                to="/admin" 
                className="px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white transition flex items-center gap-1.5 shadow-xs text-xs font-bold ml-1"
                title="Ir al panel central de administración"
              >
                <Shield size={14} />
                <span>{t('panel_admin')}</span>
              </Link>
            )}

          </nav>
        </div>

        {/* BUSCADOR REDONDEADO CENTRAL */}
        <div className="flex-1 max-w-md hidden md:block">
          <SearchBar placeholder={t('buscar_placeholder')} />
        </div>

        {/* ACCIONES Y BOTONES DERECHA */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Selector de Idioma (Pastilla limpia sin borde duro) */}
          <div className="relative">
            <button 
              onClick={() => setDropdownLang(!dropdownLang)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/85 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition cursor-pointer"
              title="Cambiar idioma"
            >
              <Globe size={13} className="text-emerald-600" />
              <span>{idioma === 'EN' ? 'EN' : 'ES'}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
            {dropdownLang && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-[0_15px_40px_rgba(15,23,42,0.12)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.4)] py-1.5 z-50 text-xs font-semibold">
                <button 
                  onClick={() => { cambiarIdioma('es'); setDropdownLang(false); }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  🇨🇴 Español
                </button>
                <button 
                  onClick={() => { cambiarIdioma('en'); setDropdownLang(false); }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  🇺🇸 English
                </button>
              </div>
            )}
          </div>

          {/* Botón Modo Oscuro / Modo Claro (al lado del idioma) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? (idioma === 'EN' ? 'Switch to Light Mode' : 'Cambiar a modo claro') : (idioma === 'EN' ? 'Switch to Dark Mode' : 'Cambiar a modo oscuro')}
            title={isDark ? (idioma === 'EN' ? 'Switch to Light Mode' : 'Cambiar a modo claro') : (idioma === 'EN' ? 'Switch to Dark Mode' : 'Cambiar a modo oscuro')}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-violet-950/60 dark:hover:bg-violet-900/60 border border-transparent dark:border-violet-700/40 text-slate-700 dark:text-amber-300 hover:text-slate-950 dark:hover:text-amber-200 transition-all cursor-pointer shrink-0 shadow-xs"
          >
            {isDark ? <Sun size={15} className="text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" /> : <Moon size={15} className="text-slate-700" />}
          </button>

          <span className="hidden sm:block h-5 w-px bg-slate-200/80 dark:bg-slate-700" />

          {/* Carrito de Compras (SOLO para compradores, NO vendedor ni admin) */}
          {!esAdminOVendedor && (
            <button
              onClick={() => setDrawerAbierto(true)}
              className="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition relative flex items-center justify-center cursor-pointer"
              title="Carrito de compras"
            >
              <ShoppingBag size={19} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-violet-600 text-white text-[10px] font-black w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center border border-white leading-none select-none">
                  {totalItems}
                </span>
              )}
            </button>
          )}

          {/* Favoritos (SOLO para compradores autenticados, NO vendedor ni admin) */}
          {autenticado && !esAdminOVendedor && (
            <Link
              to="/favoritos"
              className="w-9 h-9 rounded-full hover:bg-rose-50 text-slate-700 hover:text-rose-500 transition relative hidden sm:flex items-center justify-center"
              title="Mis Favoritos"
            >
              <Heart size={19} />
              {favoriteIds?.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-black w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center border border-white leading-none select-none">
                  {favoriteIds.length}
                </span>
              )}
            </Link>
          )}

          {/* Acceso a Centro de Ayuda & Soporte */}
          <Link
            to="/soporte"
            className="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 transition hidden sm:flex items-center justify-center cursor-pointer"
            title="Centro de Soporte & Ayuda"
          >
            <Headphones size={19} />
          </Link>

          {/* Menú de Usuario / Avatar según el Rol */}
          {autenticado ? (
            <div className="relative">
              <button
                onClick={() => setDropdownUser(!dropdownUser)}
                className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-black text-xs shadow-xs border border-slate-200 hover:scale-105 transition cursor-pointer ${
                  esAdmin ? 'bg-violet-700' : esVendedor ? 'bg-violet-600' : 'bg-slate-900'
                }`}
                title={esVendedor ? (nombreTienda || usuario?.nombreTienda || 'Mi Tienda') : 'Opciones de cuenta'}
              >
                {inicialAvatar}
              </button>

              {dropdownUser && (
                <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl py-2 z-50 text-xs font-medium text-slate-700 dark:text-slate-200">
                  
                  {/* Encabezado del Perfil */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        esAdmin 
                          ? 'bg-violet-50 text-violet-700 border border-violet-200' 
                          : esVendedor 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {esAdmin ? 'Super Administrador' : esVendedor ? 'Vendedor Verificado' : 'Comprador'}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 truncate">
                      {esVendedor ? (nombreTienda || usuario?.nombreTienda || usuario?.nombre || 'Mi Tienda') : (usuario?.nombre || 'Usuario')}
                    </p>
                    <p className="text-slate-400 text-[11px] truncate">{usuario?.email}</p>
                  </div>

                  {/* CASO 1: OPCIONES EXCLUSIVAS PARA ADMINISTRADOR */}
                  {esAdmin && (
                    <div className="py-1">
                      <Link
                        to="/admin"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-800 hover:bg-violet-50 hover:text-violet-700 font-bold"
                      >
                        <Shield size={15} className="text-violet-600" />
                        <span>Panel Central Admin</span>
                      </Link>
                      <Link
                        to="/admin?tab=vendedores"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Store size={15} />
                        <span>Tiendas & Solicitudes</span>
                      </Link>
                      <Link
                        to="/admin?tab=finanzas"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <DollarSign size={15} />
                        <span>Comisiones & Finanzas</span>
                      </Link>
                      <Link
                        to="/admin?tab=pedidos"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Package size={15} />
                        <span>Auditoría de Pedidos</span>
                      </Link>
                      <Link
                        to="/admin?tab=soporte"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Headphones size={15} />
                        <span>Tickets de Soporte</span>
                      </Link>
                    </div>
                  )}

                  {/* CASO 2: OPCIONES EXCLUSIVAS PARA VENDEDOR */}
                  {esVendedor && (
                    <div className="py-1">
                      <Link
                        to="/panel-vendedor"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-800 hover:bg-violet-50 hover:text-violet-700 font-bold"
                      >
                        <Store size={15} className="text-violet-600" />
                        <span>Mi Panel de Tienda</span>
                      </Link>
                      <Link
                        to="/panel-vendedor?tab=productos"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Package size={15} />
                        <span>Mis Productos</span>
                      </Link>
                      <Link
                        to="/panel-vendedor?tab=pedidos"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <ShoppingBag size={15} />
                        <span>Pedidos & Envíos</span>
                      </Link>
                      <Link
                        to="/panel-vendedor?tab=mensajes"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <MessageSquare size={15} />
                        <span>Chat con Clientes</span>
                      </Link>
                      <Link
                        to="/panel-vendedor?tab=perfil"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Settings size={15} />
                        <span>Datos de Mi Tienda</span>
                      </Link>
                      <Link
                        to="/soporte"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Headphones size={15} />
                        <span>Soporte Técnico Mercatto</span>
                      </Link>
                    </div>
                  )}

                  {/* CASO 3: OPCIONES PARA COMPRADORES NORMALES */}
                  {!esAdminOVendedor && (
                    <div className="py-1">
                      <Link
                        to="/perfil"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <User size={15} />
                        <span>{t('mi_perfil')}</span>
                      </Link>
                      <Link
                        to="/mis-pedidos"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Package size={15} />
                        <span>{t('mis_pedidos')}</span>
                      </Link>
                      <Link
                        to="/favoritos"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Heart size={15} />
                        <span>{t('mis_favoritos')}</span>
                      </Link>
                      <Link
                        to="/mensajes"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <MessageSquare size={15} />
                        <span>Mensajes con Tiendas</span>
                      </Link>
                      <Link
                        to="/soporte"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Headphones size={15} />
                        <span>Centro de Ayuda & Soporte</span>
                      </Link>
                    </div>
                  )}

                  {/* Cerrar Sesión para todos */}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition cursor-pointer font-bold"
                    >
                      <LogOut size={15} />
                      <span>{t('cerrar_sesion')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition flex items-center justify-center cursor-pointer"
              title={t('iniciar_sesion')}
            >
              <User size={19} />
            </Link>
          )}

          {/* Botón menú móvil */}
          <button
            onClick={() => setMenuMobile(!menuMobile)}
            className="text-slate-700 lg:hidden p-1.5 cursor-pointer"
          >
            {menuMobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Overlay Backdrop para cerrar menú al pulsar fuera */}
      {menuMobile && (
        <div 
          className="fixed inset-0 top-[60px] bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setMenuMobile(false)}
        />
      )}

      {/* Menú Móvil desplegable adaptado al Rol con Accesos de Catálogo Completos */}
      {menuMobile && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl px-4 py-4 space-y-3.5 max-h-[calc(100vh-65px)] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto">
          
          {/* 1. Buscador de catálogo dentro del menú móvil */}
          <SearchBar 
            placeholder={t('buscar_placeholder')} 
            onSearchSubmit={() => setMenuMobile(false)} 
          />

          {/* 2. Accesos Principales de Navegación */}
          <div className="grid grid-cols-3 gap-2">
            <Link 
              to="/" 
              onClick={() => setMenuMobile(false)} 
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition text-center ${
                location.pathname === '/' 
                  ? 'bg-violet-50 dark:bg-violet-950/60 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 font-bold' 
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <HomeIcon size={18} className="text-violet-600 mb-1" />
              <span className="text-xs font-bold leading-none">{t('inicio') || 'Inicio'}</span>
            </Link>

            <Link 
              to="/tiendas" 
              onClick={() => setMenuMobile(false)} 
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition text-center ${
                location.pathname.startsWith('/tienda') 
                  ? 'bg-violet-50 dark:bg-violet-950/60 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 font-bold' 
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Store size={18} className="text-violet-600 mb-1" />
              <span className="text-xs font-bold leading-none truncate max-w-full">{t('tiendas_oficiales')}</span>
            </Link>

            <Link 
              to="/about" 
              onClick={() => setMenuMobile(false)} 
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition text-center ${
                location.pathname === '/about' 
                  ? 'bg-violet-50 dark:bg-violet-950/60 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 font-bold' 
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Info size={18} className="text-violet-600 mb-1" />
              <span className="text-xs font-bold leading-none">{t('nosotros')}</span>
            </Link>
          </div>

          {/* 3. Accesos del Catálogo (igual al menú desplegable del catálogo) */}
          <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <ShoppingBag size={14} className="text-emerald-600" />
                <span>{t('catalogo')}</span>
              </span>
              <Link 
                to="/catalogo" 
                onClick={() => setMenuMobile(false)} 
                className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline"
              >
                {t('ver_todo') || 'Ver todo'} →
              </Link>
            </div>

            {/* Accesos rápidos superiores de compras */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/catalogo"
                onClick={() => setMenuMobile(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-700 transition shadow-xs"
              >
                <ShoppingBag size={14} className="text-emerald-600 shrink-0" />
                <span className="truncate">{t('todo_catalogo')}</span>
              </Link>

              <Link
                to="/catalogo?orden=ventas"
                onClick={() => setMenuMobile(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 transition shadow-xs"
              >
                <Sparkles size={14} className="text-amber-500 shrink-0" />
                <span className="truncate">{t('mas_vendidos')}</span>
              </Link>

              <Link
                to="/catalogo?orden=recientes"
                onClick={() => setMenuMobile(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 transition shadow-xs"
              >
                <Package size={14} className="text-emerald-500 shrink-0" />
                <span className="truncate">{t('nuevos_productos')}</span>
              </Link>

              <Link
                to="/catalogo?soloElite=true"
                onClick={() => setMenuMobile(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs font-bold text-amber-700 dark:text-amber-300 hover:text-amber-600 transition shadow-xs"
              >
                <span className="text-xs">👑</span>
                <span className="truncate">Tiendas Élite</span>
              </Link>
            </div>

            {/* Categorías Dinámicas */}
            {categorias && categorias.length > 0 && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5 flex items-center gap-1">
                  <Layers size={11} className="text-emerald-600" />
                  <span>{t('categorias')}</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {categorias.slice(0, 6).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/catalogo?categoriaId=${cat.id}`}
                      onClick={() => setMenuMobile(false)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 transition"
                    >
                      {cat.nombre}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Marcas Dinámicas */}
            {marcas && marcas.length > 0 && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5 flex items-center gap-1">
                  <Tag size={11} className="text-violet-500" />
                  <span>{t('marcas_oficiales')}</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {marcas.slice(0, 6).map((m) => (
                    <Link
                      key={m}
                      to={`/catalogo?marca=${encodeURIComponent(m)}`}
                      onClick={() => setMenuMobile(false)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-violet-50 hover:text-violet-700 transition"
                    >
                      {m}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Accesos a Paneles según Rol */}
          {esAdmin && (
            <Link 
              to="/admin" 
              onClick={() => setMenuMobile(false)} 
              className="px-3.5 py-2.5 rounded-xl bg-violet-600 text-white font-bold flex items-center gap-2.5 shadow-sm text-xs"
            >
              <Shield size={16} />
              <span>{t('panel_admin')}</span>
            </Link>
          )}

          {esVendedor && (
            <Link 
              to="/panel-vendedor" 
              onClick={() => setMenuMobile(false)} 
              className="px-3.5 py-2.5 rounded-xl bg-violet-600 text-white font-bold flex items-center gap-2.5 shadow-sm text-xs"
            >
              <Store size={16} />
              <span>{t('panel_vendedor')}</span>
            </Link>
          )}

          <Link 
            to="/soporte" 
            onClick={() => setMenuMobile(false)} 
            className="px-3.5 py-2 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/40 flex items-center gap-2.5 text-violet-700 dark:text-violet-300 font-bold transition text-xs"
          >
            <Headphones size={16} />
            <span>Centro de Ayuda & Soporte</span>
          </Link>

          {/* 5. Sección de Usuario / Cuenta */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            {autenticado ? (
              <>
                <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-1 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-800 dark:text-white truncate">
                      {esVendedor ? (nombreTienda || usuario?.nombreTienda || usuario?.nombre || 'Mi Tienda') : (usuario?.nombre || 'Mi Cuenta')}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{usuario?.email}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 rounded-full">
                    {rolFormateado}
                  </span>
                </div>
                <Link 
                  to="/perfil" 
                  onClick={() => setMenuMobile(false)} 
                  className="px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  <User size={15} />
                  <span>{t('mi_perfil')}</span>
                </Link>
                {!esAdminOVendedor && (
                  <>
                    <Link 
                      to="/mis-pedidos" 
                      onClick={() => setMenuMobile(false)} 
                      className="px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <Package size={15} />
                      <span>{t('mis_pedidos')}</span>
                    </Link>
                    <Link 
                      to="/favoritos" 
                      onClick={() => setMenuMobile(false)} 
                      className="px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <Heart size={15} className="text-rose-500" />
                      <span>{t('favoritos')}</span>
                    </Link>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => { setMenuMobile(false); handleLogout(); }}
                  className="w-full px-3.5 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 text-xs font-bold text-rose-600 transition cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>{t('cerrar_sesion')}</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMenuMobile(false)}
                  className="px-3 py-2 text-center text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 transition"
                >
                  {t('iniciar_sesion')}
                </Link>
                <Link
                  to="/registro"
                  onClick={() => setMenuMobile(false)}
                  className="px-3 py-2 text-center text-xs font-bold rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-xs transition"
                >
                  {t('registrarse')}
                </Link>
              </div>
            )}
          </div>

          {/* 6. Selector de Idioma y Modo Oscuro en Móvil */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('idioma') || 'Idioma'}:</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => { cambiarIdioma('es'); setMenuMobile(false); }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${idioma === 'ES' ? 'bg-violet-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  🇨🇴 ES
                </button>
                <button
                  type="button"
                  onClick={() => { cambiarIdioma('en'); setMenuMobile(false); }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${idioma === 'EN' ? 'bg-violet-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  🇺🇸 EN
                </button>
              </div>

              {/* Botón Modo Oscuro Móvil */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
