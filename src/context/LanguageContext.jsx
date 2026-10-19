import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '@/utils/translations'
import { universalTranslator } from '@/utils/universalTranslator'

const LanguageContext = createContext(null)

export const LanguageProvider = ({ children }) => {
  const [idioma, setIdioma] = useState(() => {
    return localStorage.getItem('mercatto_idioma') || 'es'
  })

  // Inicializar y sincronizar el motor universal de traducción con el DOM completo
  useEffect(() => {
    localStorage.setItem('mercatto_idioma', idioma)
    document.documentElement.lang = idioma
    
    // Notificar al traductor universal para que aplique la traducción en todas las páginas
    universalTranslator.init(idioma)
    universalTranslator.setLanguage(idioma)
  }, [idioma])

  const cambiarIdioma = (nuevoIdioma) => {
    const lang = (nuevoIdioma || 'es').toLowerCase()
    setIdioma(lang)
    universalTranslator.setLanguage(lang)
  }

  const t = (clave) => {
    const lang = translations[idioma] || translations.es
    return lang[clave] || translations.es[clave] || clave
  }

  return (
    <LanguageContext.Provider value={{ idioma: idioma.toUpperCase(), cambiarIdioma, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage debe ser usado dentro de LanguageProvider')
  }
  return context
}

export default LanguageContext
