import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react'
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
    <footer className="bg-mercatto-dark text-mercatto-on-dark mt-12 font-sans border-t border-violet-900/40">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4" title="Inicio de Mercatto">
              <MercattoLogo className="text-3xl text-mercatto-on-dark" />
            </Link>
            <p className="text-sm text-mercatto-on-dark/75 leading-relaxed pr-4">
              {isEn 
                ? 'The direct platform connecting buyers and suppliers across Colombia. Buy securely and communicate without intermediaries.' 
                : 'La plataforma que une compradores y proveedores directamente. Compra con seguridad y comunícate sin intermediarios.'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-4">{isEn ? 'Shop' : 'Comprar'}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/catalogo" className="text-mercatto-on-dark/75 hover:text-white transition-colors">{t('todo_catalogo')}</Link></li>
              <li><Link to="/catalogo?orden=ventas" className="text-mercatto-on-dark/75 hover:text-white transition-colors">{t('mas_vendidos')}</Link></li>
              <li><Link to="/favoritos" className="text-mercatto-on-dark/75 hover:text-white transition-colors">{t('mis_favoritos')}</Link></li>
              <li><Link to="/rastreo" className="text-mercatto-btn-dark font-semibold hover:text-white transition-colors">{isEn ? 'Track Order' : 'Rastrear mi Pedido'}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-4">{isEn ? 'Sellers' : 'Vendedores'}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/registro?rol=VENDEDOR" className="text-mercatto-on-dark/75 hover:text-white transition-colors">{isEn ? 'Open Virtual Store' : 'Crear Tienda Virtual'}</Link></li>
              <li><Link to="/vendedor" className="text-mercatto-on-dark/75 hover:text-white transition-colors">{t('panel_vendedor')}</Link></li>
              <li><Link to="/login" className="text-mercatto-on-dark/75 hover:text-white transition-colors">{isEn ? 'Supplier Access' : 'Acceso Proveedores'}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-4">{t('contacto')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/soporte" className="text-mercatto-btn-dark font-semibold hover:text-white transition-colors flex items-center gap-1.5">
                  <Headphones size={15} />
                  <span>{isEn ? 'Submit Support Ticket' : 'Crear Ticket de Soporte'}</span>
                </Link>
              </li>
              <li>
                <a href="mailto:realmercatto@gmail.com" className="text-mercatto-on-dark/75 hover:text-white transition-colors">
                  realmercatto@gmail.com
                </a>
              </li>
              <li><span className="text-mercatto-on-dark/75">{isEn ? 'Mon - Sat: 8am - 6pm' : 'Lunes a Sábado: 8am - 6pm'}</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-violet-900/30 text-center text-sm text-mercatto-on-dark/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Mercatto Marketplace. {t('derechos_reservados')}.</p>
          <div className="flex gap-4">
            <Link to="/privacidad" className="hover:text-white transition-colors">{isEn ? 'Privacy Policy' : 'Política de Privacidad'}</Link>
            <Link to="/terminos" className="hover:text-white transition-colors">{isEn ? 'Terms & Conditions' : 'Términos y Condiciones'}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
