import React from 'react'
import { Link, useLocation } from 'react-router-dom'
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
    <footer className="relative mt-24 font-sans">
      {/* Tarjeta superior flotante oscura sobre el borde del footer */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 relative z-20 -mb-24">
        <div className="relative overflow-hidden rounded-[28px] bg-[#0C0A14] border border-white/15 shadow-2xl px-7 py-9 sm:px-12 sm:py-12">
          {/* Resplandor violeta sutil a la izquierda */}
          <div className="absolute -left-20 -bottom-24 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-violet-500/[0.06] to-transparent pointer-events-none" />

          {/* Gráfica decorativa de puntos en el lado derecho */}
          <svg
            aria-hidden="true"
            viewBox="0 0 360 220"
            className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 w-[320px] lg:w-[380px] h-auto opacity-85 pointer-events-none select-none"
          >
            <defs>
              <linearGradient id="footerArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <circle cx="215" cy="125" r="118" fill="none" stroke="url(#footerArcGrad)" strokeWidth="1.2" />
            {Array.from({ length: 14 }).map((_, row) =>
              Array.from({ length: 18 }).map((__, col) => {
                const cx = 125 + col * 11
                const cy = 22 + row * 12
                const dx = cx - 215
                const dy = cy - 125
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist > 110 || (row + col) % 3 === 0) return null
                const isHighlight = (row === 4 && col === 9) || (row === 6 && col === 12) || (row === 8 && col === 7)
                return (
                  <circle
                    key={`${row}-${col}`}
                    cx={cx}
                    cy={cy}
                    r={isHighlight ? 2.8 : 1.3}
                    fill={isHighlight ? '#FFFFFF' : '#CBD5E1'}
                    opacity={isHighlight ? 0.95 : 0.45}
                  />
                )
              })
            )}
          </svg>

          <div className="relative z-10 max-w-xl space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-[1.15]">
              {isEn
                ? 'Shop & sell in Cartagena without intermediaries'
                : 'Compra y vende en Cartagena sin intermediarios'}
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              {isEn
                ? 'Verified local stores, Wompi-protected payments, and fast delivery.'
                : 'Tiendas verificadas, pagos protegidos con Wompi y entregas rápidas a tu puerta.'}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/catalogo"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-200 text-xs sm:text-sm font-bold transition shadow-md"
              >
                {isEn ? 'Explore catalog' : 'Explorar catálogo'}
              </Link>
              <Link
                to="/registro?rol=VENDEDOR"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/15 border border-white/15 text-xs sm:text-sm font-semibold transition"
              >
                {isEn ? 'Open a store' : 'Crear tienda'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cuerpo principal negro redondeado */}
      <div className="bg-[#050507] text-slate-300 rounded-t-[32px] pt-36 pb-10 border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Columna izquierda: Logo, dirección/horario, teléfono y correo */}
            <div className="lg:col-span-5 space-y-6">
              <Link to="/" className="inline-block" title="Ir al inicio de Mercatto">
                <MercattoLogo variant="whiteBorder" size={28} showSlogan={false} />
              </Link>

              <div className="text-xs sm:text-[13px] text-slate-400 leading-relaxed space-y-0.5">
                <p>Cartagena de Indias</p>
                <p>Bolívar, Colombia</p>
                <p>{isEn ? 'Mon - Sat: 8:00 AM - 6:00 PM' : 'Lun - Sáb: 8:00 AM - 6:00 PM'}</p>
              </div>

              <div className="flex flex-wrap gap-8 pt-1">
                <div className="space-y-1">
                  <span className="block text-[11px] text-slate-500">
                    {isEn ? 'WhatsApp / Phone' : 'WhatsApp / Teléfono'}
                  </span>
                  <a
                    href="https://wa.me/573233882717?text=%C2%A1Hola%20Mercatto!%20Requiero%20soporte%20o%20asesor%C3%ADa."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-[13px] font-semibold text-white hover:text-violet-300 transition"
                  >
                    +57 323 388 2717
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="block text-[11px] text-slate-500">
                    {isEn ? 'Email' : 'Correo'}
                  </span>
                  <a
                    href="mailto:realmercatto@gmail.com"
                    className="text-xs sm:text-[13px] font-semibold text-white hover:text-violet-300 transition"
                  >
                    realmercatto@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Columnas derechas: solo opciones implementadas y sin columna Social */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:justify-items-end">
              <div className="space-y-3.5">
                <h4 className="text-xs font-medium text-slate-500">
                  {isEn ? 'Quick links' : 'Enlaces rápidos'}
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-200">
                  <li>
                    <Link to="/catalogo" className="hover:text-white transition-colors">
                      {t('todo_catalogo')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/catalogo?orden=ventas" className="hover:text-white transition-colors">
                      {t('mas_vendidos')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/tiendas" className="hover:text-white transition-colors">
                      {t('tiendas_oficiales')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/favoritos" className="hover:text-white transition-colors">
                      {t('mis_favoritos')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/rastreo" className="hover:text-white transition-colors">
                      {isEn ? 'Track Order' : 'Rastrear pedido'}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3.5">
                <h4 className="text-xs font-medium text-slate-500">
                  {isEn ? 'Platform' : 'Plataforma'}
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-200">
                  <li>
                    <Link to="/registro?rol=VENDEDOR" className="hover:text-white transition-colors">
                      {isEn ? 'Create Store' : 'Crear tienda'}
                    </Link>
                  </li>
                  <li>
                    <Link to="/vendedor" className="hover:text-white transition-colors">
                      {t('panel_vendedor')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="hover:text-white transition-colors">
                      {isEn ? 'About us' : 'Sobre nosotros'}
                    </Link>
                  </li>
                  <li>
                    <Link to="/soporte" className="hover:text-white transition-colors">
                      {isEn ? 'Help Center' : 'Centro de soporte'}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3.5">
                <h4 className="text-xs font-medium text-slate-500">
                  {isEn ? 'Legal' : 'Legal'}
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-200">
                  <li>
                    <Link to="/terminos" className="hover:text-white transition-colors">
                      {isEn ? 'Terms of service' : 'Términos y condiciones'}
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacidad" className="hover:text-white transition-colors">
                      {isEn ? 'Privacy policy' : 'Política de privacidad'}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Línea inferior centrada */}
          <div className="mt-14 pt-6 border-t border-white/10 text-center text-[11px] text-slate-500">
            © {new Date().getFullYear()} Mercatto Marketplace. {t('derechos_reservados') || 'Todos los derechos reservados.'}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
