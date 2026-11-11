import React from 'react'
import { useLanguage } from '@/hooks/useLanguage'

/**
 * MercattoLogo - Componente de marca oficial de Mercatto.
 * - Modo Completo (por defecto): Muestra la palabra "Mercatto" con su tipografía fluida y audaz en violeta,
 *   con el eslogan oficial debajo: "Del barrio a tu pantalla" (adaptado según idioma ES / EN).
 * - Modo Isotipo (showText={false}): Muestra únicamente la "M" estilizada para barras laterales,
 *   docks cuadrados (w-10 h-10) y avatares compactos sin desbordamiento.
 */
export const MercattoLogo = ({ 
  className = '', 
  showText = true, 
  size = 28, 
  showSlogan = true,
  sloganClassName = '',
  variant = 'default'
}) => {
  // Obtenemos la función de traducción para el eslogan
  let t = (clave) => (clave === 'eslogan' ? 'Del barrio a tu pantalla' : clave)
  try {
    const lang = useLanguage()
    if (lang && lang.t) t = lang.t
  } catch (e) {
    // Fallback si se usa fuera de LanguageProvider
  }

  if (!showText) {
    return (
      <span 
        className={`inline-flex items-center justify-center font-['Pacifico',cursive] font-normal text-violet-600 dark:text-violet-400 select-none leading-none ${className}`}
        style={{
          fontFamily: "'Pacifico', 'Caveat', cursive, sans-serif",
          fontSize: `${size}px`,
          lineHeight: 1
        }}
        title="Mercatto"
      >
        M
      </span>
    )
  }

  const isWhite = variant === 'white' || variant === 'light'
  const isWhiteBorder = variant === 'whiteBorder' || variant === 'onDark'

  const brandTextColor = isWhite
    ? 'text-white group-hover:text-slate-100 drop-shadow-[0_2px_12px_rgba(255,255,255,0.3)]'
    : isWhiteBorder
    ? 'text-violet-600 font-normal'
    : 'text-violet-600 dark:text-violet-400 group-hover:text-violet-500'

  const defaultSloganColor = isWhite
    ? 'text-white font-medium'
    : isWhiteBorder
    ? 'text-violet-600 font-bold'
    : 'text-violet-600 dark:text-violet-400 font-semibold'

  return (
    <div className="flex flex-col items-start leading-none select-none group">
      <span 
        className={`inline-block font-['Pacifico',cursive] text-2xl sm:text-[28px] font-normal ${brandTextColor} transition-all duration-200 tracking-wide group-hover:scale-102 ${className}`}
        style={{
          fontFamily: "'Pacifico', 'Caveat', cursive, sans-serif",
          ...(size ? { fontSize: `${size}px` } : {}),
          ...(isWhiteBorder ? {
            color: '#7C3AED',
            WebkitTextStroke: '2px #FFFFFF',
            paintOrder: 'stroke fill',
            textShadow: '-1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF, 0 2px 10px rgba(255,255,255,0.35)'
          } : {})
        }}
      >
        Mercatto
      </span>
      {showSlogan && (
        <span 
          className={`text-[9.5px] xs:text-[11px] sm:text-[12.5px] font-bold ${/\btext-(white|slate|violet|purple|indigo|gray|zinc|amber|rose|emerald|black|mercatto)/.test(sloganClassName) ? '' : defaultSloganColor} tracking-wide ${sloganClassName.includes('mt-') || sloganClassName.includes('pt-') || sloganClassName.includes('my-') ? '' : '-mt-0.5 sm:-mt-1'} whitespace-nowrap truncate max-w-[200px] xs:max-w-[280px] sm:max-w-[340px] select-none ${sloganClassName || 'block'}`}
          style={{
            fontFamily: "'Pacifico', 'Caveat', cursive, sans-serif",
            ...(sloganClassName.includes('mt-') ? { marginTop: undefined } : {}),
            ...(isWhiteBorder ? {
              color: '#7C3AED',
              WebkitTextStroke: '0.5px #FFFFFF',
              paintOrder: 'stroke fill',
              textShadow: '-0.8px -0.8px 0 #FFFFFF, 0.8px -0.8px 0 #FFFFFF, -0.8px 0.8px 0 #FFFFFF, 0.8px 0.8px 0 #FFFFFF, 0 -0.8px 0 #FFFFFF, 0 0.8px 0 #FFFFFF, -0.8px 0 0 #FFFFFF, 0.8px 0 0 #FFFFFF, 0 1px 4px rgba(255,255,255,0.4)'
            } : {})
          }}
        >
          {t('eslogan')}
        </span>
      )}
    </div>
  )
}

export default MercattoLogo
