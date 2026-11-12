import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import MercattoLogo from '@/components/common/MercattoLogo'
import { RefreshCw, LogOut } from 'lucide-react'

/**
 * Dock lateral vertical compartido por PanelAdmin y PanelVendedor.
 * Mantiene todos los iconos contenidos dentro de la cápsula en cualquier resolución
 * mediante flex-1 min-h-0 + scroll interno y tooltip flotante fijo sin recortes.
 */
export const PanelDockSidebar = ({
  dockItems = [],
  activeTab,
  onSelectTab,
  sidebarOpen = false,
  onCloseSidebar,
  onSync,
  onLogout,
  externalLink,
  syncTitle = 'Sincronizar datos',
  logoutTitle = 'Cerrar sesión',
}) => {
  const [hoveredTooltip, setHoveredTooltip] = useState(null)

  const showTooltip = (e, label) => {
    if (!label) return
    const rect = e.currentTarget.getBoundingClientRect()
    setHoveredTooltip({
      label,
      top: rect.top + rect.height / 2,
      left: rect.right + 12,
    })
  }

  const hideTooltip = () => setHoveredTooltip(null)

  return (
    <>
      {sidebarOpen && onCloseSidebar && (
        <div
          onClick={onCloseSidebar}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[1px] lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-24 bg-white border border-slate-200/90 text-slate-700 px-2.5 py-3 flex flex-col items-center shadow-xl shadow-slate-200/50 transition-transform duration-300 rounded-r-[32px] lg:sticky lg:top-3 lg:self-start lg:translate-x-0 lg:w-20 lg:h-[calc(100vh-1.5rem)] lg:max-h-[calc(100vh-1.5rem)] lg:rounded-[32px] overflow-hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo Isotipo Mercatto */}
        <div className="flex flex-col items-center gap-2 pt-0.5 pb-2 shrink-0">
          <Link
            to="/"
            onMouseEnter={(e) => showTooltip(e, 'Ir al inicio de Mercatto')}
            onMouseLeave={hideTooltip}
            aria-label="Ir al inicio de Mercatto"
            className="w-10 h-10 xl:w-11 xl:h-11 rounded-2xl bg-violet-50 hover:bg-violet-100 text-violet-700 flex items-center justify-center transition-all hover:scale-105 shadow-xs"
          >
            <MercattoLogo size={26} showText={false} />
          </Link>
          <div className="w-8 h-[1px] bg-slate-100" />
        </div>

        {/* Center: Lista de Iconos con scroll interno si la altura es reducida */}
        <nav
          onScroll={hideTooltip}
          className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden py-1 flex flex-col items-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex flex-col items-center gap-1.5 xl:gap-2 w-full my-auto">
            {dockItems.map((item) => {
              const Icon = item.icon
              const activo = activeTab === item.id
              return (
                <div key={item.id} className="w-full flex justify-center shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id)
                      if (onCloseSidebar) onCloseSidebar()
                    }}
                    onMouseEnter={(e) => showTooltip(e, item.label)}
                    onMouseLeave={hideTooltip}
                    aria-label={item.label}
                    className={`relative w-10 h-10 xl:w-11 xl:h-11 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      activo
                        ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25 scale-105'
                        : 'text-slate-500 hover:text-violet-700 hover:bg-violet-50'
                    }`}
                  >
                    {Icon && <Icon size={19} strokeWidth={activo ? 2.5 : 2} />}
                    {Boolean(item.badge) && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-violet-600 border-2 border-white" />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </nav>

        {/* Bottom: Enlace externo, Recargar y Salir */}
        <div className="flex flex-col items-center gap-1.5 xl:gap-2 pt-2.5 pb-0.5 border-t border-slate-100 w-full mt-auto shrink-0">
          {externalLink && (
            <Link
              to={externalLink.to}
              target="_blank"
              onMouseEnter={(e) => showTooltip(e, externalLink.title)}
              onMouseLeave={hideTooltip}
              aria-label={externalLink.title}
              className="w-10 h-10 xl:w-11 xl:h-11 rounded-2xl text-slate-400 hover:text-violet-700 hover:bg-violet-50 flex items-center justify-center transition-all shrink-0"
            >
              {externalLink.icon}
            </Link>
          )}

          <button
            type="button"
            onClick={onSync}
            onMouseEnter={(e) => showTooltip(e, syncTitle)}
            onMouseLeave={hideTooltip}
            aria-label={syncTitle}
            className="w-10 h-10 xl:w-11 xl:h-11 rounded-2xl text-slate-400 hover:text-violet-700 hover:bg-violet-50 flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <RefreshCw size={18} />
          </button>

          <button
            type="button"
            onClick={onLogout}
            onMouseEnter={(e) => showTooltip(e, logoutTitle)}
            onMouseLeave={hideTooltip}
            aria-label={logoutTitle}
            className="w-10 h-10 xl:w-11 xl:h-11 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {hoveredTooltip && (
        <div
          style={{ top: hoveredTooltip.top, left: hoveredTooltip.left }}
          className="fixed z-50 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold whitespace-nowrap pointer-events-none shadow-xl hidden lg:block"
        >
          {hoveredTooltip.label}
        </div>
      )}
    </>
  )
}

export default PanelDockSidebar
