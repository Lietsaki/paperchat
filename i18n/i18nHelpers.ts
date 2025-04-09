import { I18nConfig, LocaleCode } from 'types/Multilang'

const i18nConfig: I18nConfig = {
  locales: ['en', 'es', 'cat', 'de', 'cn'],
  defaultLocale: 'en'
}

const getCurrentLocale = () => {
  let localeFromStorage = localStorage.getItem('locale')

  if (!localeFromStorage || !i18nConfig.locales.includes(localeFromStorage as LocaleCode)) {
    localeFromStorage = i18nConfig.defaultLocale
  }

  return localeFromStorage as LocaleCode
}

export { i18nConfig, getCurrentLocale }
