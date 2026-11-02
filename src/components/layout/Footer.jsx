import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Headphones, 
  CreditCard, 
  Mail, 
  Clock, 
  Sparkles, 
  ShoppingBag, 
  Store, 
  ExternalLink,
  ChevronRight,
  Heart,
  Package,
  CheckCircle2,
  Lock
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import MercattoLogo from '@/components/common/MercattoLogo'

export const Footer = () => {
  const { idioma, t } = useLanguage()
  const isEn = idioma === 'EN'
  const location = useLocation()

  // Ocultar footer en las rutas de paneles de administración y vendedor
  if (
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/panel-vendedor') ||
    location.pathname.startsWith('/vendedor')
  ) {
    return null
  }

  return (
    <footer className="relative mt-16 bg-gradient-to-b from-[#181236] via-[#120D2A] to-[#0A071A] text-slate-200 font-sans border-t border-violet-500/20 overflow-hidden shadow-2xl">
      {/* Luz ambiental decorativa superior */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-80 h-40 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Barra de Propuesta de Valor / Garantías Mercatto */}
      <div className="border-b border-violet-500/15 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-violet-500/30 transition">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/25">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  {isEn ? '100% Protected' : 'Compra Protegida'}
                </h5>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">
                  {isEn ? 'Wompi certified payment' : 'Garantía directa de compra'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-violet-500/30 transition">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/25">
                <Truck size={22} />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  {isEn ? 'National Shipping' : 'Envíos en Colombia'}
                </h5>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">
                  {isEn ? 'Live order tracking' : 'Rastreo en vivo de tu paquete'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-violet-500/30 transition">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/25">
                <Store size={22} />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  {isEn ? 'Official Stores' : 'Tiendas Oficiales'}
                </h5>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">
                  {isEn ? 'Verified direct suppliers' : 'Marcas y proveedores certificados'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-violet-500/30 transition">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/25">
                <Headphones size={22} />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  {isEn ? 'Dedicated Care' : 'Atención Directa'}
                </h5>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">
                  {isEn ? 'Chat, WhatsApp & tickets' : 'Chat en vivo, WhatsApp y tickets'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Cuerpo Principal de 4 Columnas */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Columna 1: Marca & Respaldo Mercatto (span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block" title="Ir al inicio de Mercatto">
              <MercattoLogo 
                variant="onDark" 
                size={34} 
                showSlogan={true} 
                sloganClassName="text-violet-300 font-semibold text-xs block" 
              />
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed pr-2 sm:pr-6">
              {isEn 
                ? 'The direct marketplace connecting verified brands, official distributors, and buyers across Colombia. Buy with total peace of mind and zero intermediaries.' 
                : 'La plataforma que une marcas verificadas, distribuidores oficiales y compradores en toda Colombia. Compra con total tranquilidad y cero intermediarios.'}
            </p>

            {/* Certificación y medios de pago */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Lock size={13} className="text-emerald-400" />
                <span>{isEn ? 'Encrypted transactions with 256-bit SSL' : 'Transacciones cifradas con Wompi Bancolombia'}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold tracking-wider">PSE</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold tracking-wider">NEQUI</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold tracking-wider">BANCOLOMBIA</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold tracking-wider">VISA</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold tracking-wider">MASTERCARD</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold tracking-wider">
                  {isEn ? 'CASH ON DELIVERY' : 'CONTRA ENTREGA'}
                </span>
              </div>
            </div>
          </div>

          {/* Columna 2: Comprar (span 2.5) */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2 pb-1 border-b border-violet-800/40">
              <ShoppingBag size={15} className="text-emerald-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                {isEn ? 'Shop' : 'Comprar'}
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/catalogo" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 group-hover:scale-125 transition-transform" />
                  <span>{t('todo_catalogo')}</span>
                </Link>
              </li>
              <li>
                <Link to="/catalogo?orden=ventas" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                  <span>{t('mas_vendidos')}</span>
                </Link>
              </li>
              <li>
                <Link to="/tiendas" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform" />
                  <span>{t('tiendas_oficiales')}</span>
                </Link>
              </li>
              <li>
                <Link to="/favoritos" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <Heart size={12} className="text-rose-400 group-hover:scale-125 transition-transform" />
                  <span>{t('mis_favoritos')}</span>
                </Link>
              </li>
              <li>
                <Link to="/rastreo" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/60 text-indigo-300 hover:text-white border border-indigo-700/50 text-xs font-bold transition">
                  <Package size={12} className="text-indigo-400" />
                  <span>{isEn ? 'Track My Order' : 'Rastrear mi Pedido'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Vendedores (span 2.5) */}
          <div className="lg:col-span-3 space-y-3.5">
            <div className="flex items-center gap-2 pb-1 border-b border-violet-800/40">
              <Store size={15} className="text-amber-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                {isEn ? 'Sellers' : 'Vendedores'}
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link 
                  to="/registro?rol=VENDEDOR" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-300 hover:text-white font-bold text-xs transition shadow-xs group"
                >
                  <Sparkles size={13} className="text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>{isEn ? 'Open Virtual Store' : 'Crear Tienda Virtual'}</span>
                </Link>
              </li>
              <li>
                <Link to="/vendedor" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 group-hover:scale-125 transition-transform" />
                  <span>{t('panel_vendedor')}</span>
                </Link>
              </li>
              <li>
                <Link to="/tiendas" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform" />
                  <span>{isEn ? 'Certified Suppliers' : 'Directorio Proveedores'}</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:scale-125 transition-transform" />
                  <span>{isEn ? 'Supplier Access' : 'Acceso Proveedores'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Atención & Contacto (span 3) */}
          <div className="lg:col-span-3 space-y-3.5">
            <div className="flex items-center gap-2 pb-1 border-b border-violet-800/40">
              <Headphones size={15} className="text-violet-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                {isEn ? 'Customer Care & Contact' : 'Atención & Contacto'}
              </h4>
            </div>

            <div className="space-y-2.5">
              {/* Botón interactivo para radicar ticket */}
              <Link 
                to="/soporte" 
                className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-violet-900/60 to-indigo-900/40 hover:from-violet-800 hover:to-indigo-800 border border-violet-500/30 text-white font-bold text-xs transition shadow-md group"
              >
                <div className="flex items-center gap-2.5">
                  <Headphones size={16} className="text-violet-300" />
                  <span>{isEn ? 'Submit Support Ticket' : 'Crear Ticket de Soporte'}</span>
                </div>
                <ChevronRight size={14} className="text-violet-300 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Canal Directo WhatsApp */}
              <a 
                href="https://wa.me/573233882717?text=%C2%A1Hola%20Mercatto!%20Requiero%20soporte%20o%20asesor%C3%ADa."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-semibold transition"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>WhatsApp: +57 323 388 2717</span>
                </div>
                <ExternalLink size={12} className="opacity-70" />
              </a>

              {/* Correo y Horario */}
              <div className="space-y-1.5 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-indigo-400 shrink-0" />
                  <a href="mailto:realmercatto@gmail.com" className="hover:text-white hover:underline transition">
                    realmercatto@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11.5px]">
                  <Clock size={13} className="text-slate-400 shrink-0" />
                  <span>{isEn ? 'Mon - Sat: 8:00 AM - 6:00 PM (COT)' : 'Lunes a Sábado: 8:00 AM - 6:00 PM'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Sub-footer con Copyright y Enlaces Legales */}
        <div className="mt-12 pt-6 border-t border-violet-800/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} <strong className="text-slate-200">Mercatto Marketplace</strong>. {t('derechos_reservados') || 'Todos los derechos reservados.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
            <Link to="/privacidad" className="hover:text-white transition-colors">
              {isEn ? 'Privacy Policy' : 'Política de Privacidad'}
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:inline" />
            <Link to="/terminos" className="hover:text-white transition-colors">
              {isEn ? 'Terms & Conditions' : 'Términos y Condiciones'}
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:inline" />
            <Link to="/soporte" className="hover:text-white transition-colors">
              {isEn ? 'Help Center' : 'Centro de Ayuda'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
