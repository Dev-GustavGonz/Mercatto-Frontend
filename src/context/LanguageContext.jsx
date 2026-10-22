import React, { createContext, useContext, useState, useEffect } from 'react'
import i18n from '@/i18n'
import { translations } from '@/utils/translations'

const LanguageContext = createContext(null)

export const LanguageProvider = ({ children }) => {
  const [idioma, setIdioma] = useState(() => {
    return (localStorage.getItem('mercatto_idioma') || 'es').toLowerCase()
  })

  useEffect(() => {
    const lang = (idioma || 'es').toLowerCase()
    localStorage.setItem('mercatto_idioma', lang)
    document.documentElement.lang = lang
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [idioma])

  const cambiarIdioma = (nuevoIdioma) => {
    const lang = (nuevoIdioma || 'es').toLowerCase()
    setIdioma(lang)
    localStorage.setItem('mercatto_idioma', lang)
    document.documentElement.lang = lang
    i18n.changeLanguage(lang)
  }

  const t = (clave, params) => {
    if (!clave) return ''
    const currentLang = (idioma || 'es').toLowerCase()
    
    // 1. Intento por i18next directo
    const translated = i18n.t(clave, params)
    if (translated && translated !== clave) {
      return translated
    }

    // 2. Búsqueda en el diccionario estructurado de translations.js
    const dict = translations[currentLang] || {}
    if (dict[clave]) return dict[clave]

    // 3. Fallback con clave normalizada (minúsculas y sin espacios laterales)
    const normalized = String(clave).trim().toLowerCase()
    if (dict[normalized]) return dict[normalized]

    return clave
  }

  return (
    <LanguageContext.Provider value={{ idioma: idioma.toUpperCase(), cambiarIdioma, t, i18n }}>
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
