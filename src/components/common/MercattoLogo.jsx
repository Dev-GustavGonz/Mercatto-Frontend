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
  sloganClassName = '' 
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

  return (
    <div className="flex flex-col items-start leading-none select-none group">
      <span 
        className={`inline-block font-['Pacifico',cursive] text-2xl sm:text-[28px] font-normal text-violet-600 dark:text-violet-400 group-hover:text-violet-500 transition-all duration-200 tracking-wide group-hover:scale-102 drop-shadow-[0_1px_6px_rgba(139,92,246,0.18)] ${className}`}
        style={{
          fontFamily: "'Pacifico', 'Caveat', cursive, sans-serif"
        }}
      >
        Mercatto
      </span>
      {showSlogan && (
        <span className={`text-[9px] sm:text-[9.5px] font-bold text-violet-700/85 dark:text-violet-300 tracking-tight font-sans -mt-0.5 sm:-mt-1 whitespace-nowrap ${sloganClassName}`}>
          {t('eslogan')}
        </span>
      )}
    </div>
  )
}

export default MercattoLogo
