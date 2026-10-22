import React, { createContext, useContext, useState, useEffect } from 'react'
import i18n from '@/i18n'

const LanguageContext = createContext(null)

export const LanguageProvider = ({ children }) => {
  const [idioma, setIdioma] = useState(() => {
    return (localStorage.getItem('mercatto_idioma') || 'es').toLowerCase()
  })

  useEffect(() => {
    localStorage.setItem('mercatto_idioma', idioma)
    document.documentElement.lang = idioma
    if (i18n.language !== idioma) {
      i18n.changeLanguage(idioma)
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
    const translation = i18n.t(clave, params)
    return translation || clave
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
