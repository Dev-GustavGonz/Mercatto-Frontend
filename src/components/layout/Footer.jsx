import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import MercattoLogo from '@/components/common/MercattoLogo'

const AMERICAS_POLYGONS = [
  // Norteamérica
  [
    [-165, 65], [-140, 70], [-95, 70], [-60, 55], [-55, 47], [-70, 42],
    [-80, 32], [-81, 25], [-83, 29], [-90, 29], [-97, 26], [-96, 19],
    [-88, 21], [-87, 18], [-92, 15], [-105, 20], [-112, 29], [-117, 32],
    [-124, 42], [-125, 49], [-135, 58], [-165, 65],
  ],
  // Centroamérica
  [
    [-92, 15], [-88, 16], [-83, 15], [-83, 10], [-78, 9], [-79, 8],
    [-85, 10], [-90, 14], [-92, 15],
  ],
  // Suramérica
  [
    [-78, 9], [-75, 11], [-71, 12], [-62, 10], [-50, 1], [-35, -6],
    [-38, -14], [-40, -22], [-48, -28], [-54, -34], [-63, -41], [-68, -54],
    [-73, -53], [-75, -42], [-71, -30], [-70, -18], [-78, -12], [-81, -5],
    [-79, 2], [-78, 9],
  ],
  // Caribe
  [
    [-84, 22], [-75, 20], [-74, 21], [-83, 23], [-84, 22],
  ],
]

const pointInPolygon = (x, y, poly) => {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1]
    const xj = poly[j][0], yj = poly[j][1]
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

export const Footer = () => {
  const { idioma, t } = useLanguage()
  const isEn = idioma === 'EN'
  const location = useLocation()

  const globeDots = useMemo(() => {
    const cx0 = 215
    const cy0 = 125
    const rMax = 112
    const scale = 1.95
    const lon0 = -76
    const lat0 = 12
    const dots = []

    for (let px = cx0 - rMax; px <= cx0 + rMax; px += 6.5) {
      for (let py = cy0 - rMax; py <= cy0 + rMax; py += 6.5) {
        const dx = px - cx0
        const dy = py - cy0
        if (dx * dx + dy * dy > rMax * rMax) continue
        const lon = lon0 + dx / scale
        const lat = lat0 - dy / scale
        const inLand = AMERICAS_POLYGONS.some((poly) => pointInPolygon(lon, lat, poly))
        if (inLand) {
          dots.push({ x: +px.toFixed(1), y: +py.toFixed(1) })
        }
      }
    }
    return dots
  }, [])

  // Coordenadas exactas de Cartagena de Indias (-75.48, 10.39)
  const cartagenaX = 215 + (-75.48 - -76) * 1.95
  const cartagenaY = 125 - (10.39 - 12) * 1.95

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

          {/* Gráfica tipo mapamundi de puntos con ubicación de Cartagena marcada */}
          <svg
            aria-hidden="true"
            viewBox="0 0 360 250"
            className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 w-[310px] lg:w-[360px] h-auto pointer-events-none select-none"
          >
            <defs>
              <linearGradient id="footerArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
              </linearGradient>
              <radialGradient id="cartagenaGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Contorno del globo */}
            <circle cx="215" cy="125" r="116" fill="#090712" fillOpacity="0.55" stroke="url(#footerArcGrad)" strokeWidth="1.3" />
            <ellipse cx="215" cy="125" rx="116" ry="38" fill="none" stroke="#FFFFFF" strokeOpacity="0.06" strokeWidth="0.8" strokeDasharray="3 4" />
            <ellipse cx="215" cy="125" rx="48" ry="116" fill="none" stroke="#FFFFFF" strokeOpacity="0.06" strokeWidth="0.8" strokeDasharray="3 4" />

            {/* Puntos del continente americano */}
            {globeDots.map((dot, idx) => (
              <circle
                key={idx}
                cx={dot.x}
                cy={dot.y}
                r="1.35"
                fill="#E2E8F0"
                opacity="0.7"
              />
            ))}

            {/* Resplandor y pin de Cartagena de Indias */}
            <circle cx={cartagenaX} cy={cartagenaY} r="22" fill="url(#cartagenaGlow)" />
            <circle cx={cartagenaX} cy={cartagenaY} r="10" fill="none" stroke="#A78BFA" strokeWidth="1.2" opacity="0.65" />
            <path
              d={`M ${cartagenaX} ${cartagenaY - 2} C ${cartagenaX - 5.5} ${cartagenaY - 9}, ${cartagenaX - 6} ${cartagenaY - 14.5}, ${cartagenaX} ${cartagenaY - 14.5} C ${cartagenaX + 6} ${cartagenaY - 14.5}, ${cartagenaX + 5.5} ${cartagenaY - 9}, ${cartagenaX} ${cartagenaY - 2} Z`}
              fill="#8B5CF6"
              stroke="#FFFFFF"
              strokeWidth="1.3"
            />
            <circle cx={cartagenaX} cy={cartagenaY - 10.5} r="2" fill="#FFFFFF" />
            <circle cx={cartagenaX} cy={cartagenaY} r="2.6" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />

            {/* Etiqueta Cartagena */}
            <g transform={`translate(${cartagenaX + 11}, ${cartagenaY - 11})`}>
              <rect x="0" y="-10" width="66" height="19" rx="9.5" fill="#1E1B2E" stroke="#8B5CF6" strokeOpacity="0.65" strokeWidth="1" />
              <text x="33" y="3" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">
                Cartagena
              </text>
            </g>
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
