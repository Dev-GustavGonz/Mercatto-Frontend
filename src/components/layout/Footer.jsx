import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Mail, MessageCircle, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useToast } from '@/hooks/useToast'
import MercattoLogo from '@/components/common/MercattoLogo'

export const Footer = () => {
  const { idioma, t } = useLanguage()
  const { success, error } = useToast()
  const isEn = idioma === 'EN'
  const location = useLocation()
  const [emailNewsletter, setEmailNewsletter] = useState('')

  // Ocultar footer en las rutas de paneles de administración y vendedor
  if (
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/panel-vendedor') ||
    location.pathname.startsWith('/vendedor')
  ) {
    return null
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    const clean = emailNewsletter.trim()
    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      error(isEn ? 'Please enter a valid email address.' : 'Ingresa un correo electrónico válido.')
      return
    }
    setEmailNewsletter('')
    success(
      isEn
        ? 'Subscribed! You will receive Mercatto updates and offers.'
        : '¡Suscripción confirmada! Recibirás novedades y ofertas de Mercatto.'
    )
  }

  return (
    <footer className="relative mt-16 bg-[#0B0B0F] text-slate-300 font-sans border-t border-white/10 overflow-hidden">
      {/* Luz ambiental sutil */}
      <div className="absolute -top-24 left-1/3 w-96 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pt-14 sm:pt-16 pb-0 relative z-10">
        {/* Fila superior minimalista */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Columna 1: Marca, descripción e iconos */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-block" title="Ir al inicio de Mercatto">
              <MercattoLogo variant="whiteBorder" size={30} showSlogan={false} />
            </Link>

            <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed max-w-xs">
              {isEn
                ? 'Mercatto connects verified local stores and buyers across Cartagena with direct, fast delivery.'
                : 'Mercatto conecta tiendas verificadas y compradores en Cartagena con entregas rápidas y cero intermediarios.'}
            </p>

            {/* Iconos minimalistas */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="mailto:realmercatto@gmail.com"
                aria-label="Correo Mercatto"
                title="realmercatto@gmail.com"
                className="w-8 h-8 rounded-lg border border-white/15 text-slate-400 hover:text-white hover:border-white/35 flex items-center justify-center transition"
              >
                <Mail size={15} />
              </a>
              <a
                href="https://wa.me/573233882717?text=%C2%A1Hola%20Mercatto!%20Requiero%20soporte%20o%20asesor%C3%ADa."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Mercatto"
                title="WhatsApp: +57 323 388 2717"
                className="w-8 h-8 rounded-lg border border-white/15 text-slate-400 hover:text-white hover:border-white/35 flex items-center justify-center transition"
              >
                <MessageCircle size={15} />
              </a>
              <Link
                to="/soporte"
                aria-label="Compra protegida y soporte"
                title={isEn ? 'Protected purchase & support' : 'Compra protegida y soporte'}
                className="w-8 h-8 rounded-lg border border-white/15 text-slate-400 hover:text-white hover:border-white/35 flex items-center justify-center transition"
              >
                <ShieldCheck size={15} />
              </Link>
            </div>
          </div>

          {/* Columna 2: Comprar */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-semibold text-white tracking-wide">
              {isEn ? 'Marketplace' : 'Comprar'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-400">
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

          {/* Columna 3: Vendedores */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-semibold text-white tracking-wide">
              {isEn ? 'Sellers' : 'Vendedores'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-400">
              <li>
                <Link to="/registro?rol=VENDEDOR" className="hover:text-white transition-colors">
                  {isEn ? 'Create Virtual Store' : 'Crear tienda'}
                </Link>
              </li>
              <li>
                <Link to="/vendedor" className="hover:text-white transition-colors">
                  {t('panel_vendedor')}
                </Link>
              </li>
              <li>
                <Link to="/tiendas" className="hover:text-white transition-colors">
                  {isEn ? 'Store Directory' : 'Directorio de tiendas'}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  {isEn ? 'Seller Login' : 'Acceso proveedores'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Empresa */}
          <div className="lg:col-span-1 space-y-3.5">
            <h4 className="text-xs font-semibold text-white tracking-wide">
              {isEn ? 'Company' : 'Empresa'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-400">
              <li>
                <Link to="/soporte" className="hover:text-white transition-colors">
                  {isEn ? 'Contact' : 'Contacto'}
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-white transition-colors">
                  {isEn ? 'Privacy' : 'Privacidad'}
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="hover:text-white transition-colors">
                  {isEn ? 'Terms' : 'Términos'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 5: Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-wide">
              {isEn ? 'Subscribe to our newsletter' : 'Suscríbete a novedades'}
            </h4>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex items-center p-1 rounded-xl bg-[#13131A] border border-white/15 focus-within:border-white/35 transition"
            >
              <input
                type="email"
                value={emailNewsletter}
                onChange={(e) => setEmailNewsletter(e.target.value)}
                placeholder={isEn ? 'johndoe@gmail.com' : 'tucorreo@gmail.com'}
                aria-label={isEn ? 'Email address' : 'Correo electrónico'}
                className="flex-1 min-w-0 bg-transparent px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                aria-label={isEn ? 'Subscribe' : 'Suscribirse'}
                className="w-8 h-8 rounded-lg bg-white text-slate-950 hover:bg-slate-200 flex items-center justify-center shrink-0 transition cursor-pointer"
              >
                <ArrowRight size={15} />
              </button>
            </form>
            <p className="text-[11px] text-slate-500">
              {isEn
                ? 'Unsubscribe anytime · Cartagena, Colombia'
                : 'Cancela cuando quieras · Cartagena, Colombia'}
            </p>
          </div>
        </div>

        {/* Bloque central de copyright + marca gigante tipo watermark */}
        <div className="relative mt-16 sm:mt-20 pt-8 flex flex-col items-center justify-end">
          <div className="text-center space-y-1 text-[11px] text-slate-400 mb-6 sm:mb-8 relative z-10">
            <p>© {new Date().getFullYear()}</p>
            <p className="text-slate-200 font-semibold">Mercatto</p>
            <p className="text-slate-500">
              {isEn ? 'From the neighborhood to your screen.' : 'Del barrio a tu pantalla.'}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="w-full text-center select-none pointer-events-none overflow-hidden leading-[0.8]"
          >
            <span className="block font-black tracking-tight text-white/[0.06] text-[20vw] sm:text-[17vw] lg:text-[185px] -mb-2 sm:-mb-4">
              Mercatto
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
