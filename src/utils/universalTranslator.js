/**
 * universalTranslator.js
 * Modo seguro: La traducción oficial se gestiona íntegramente mediante i18n
 * (i18next y LanguageContext) para evitar bucles de mutaciones y bloqueos en el navegador.
 */

class UniversalDOMTranslator {
  constructor() {
    this.currentLang = 'ES'
  }

  init(initialLang = 'ES') {
    this.currentLang = (initialLang || 'ES').toUpperCase()
  }

  setLanguage(newLang) {
    this.currentLang = (newLang || 'ES').toUpperCase()
  }

  translateTree() {
    // No-op seguro: la traducción es reactiva con i18next y useLanguage()
  }

  restoreTree() {
    // No-op seguro
  }
}

export const universalTranslator = new UniversalDOMTranslator()
export default universalTranslator
