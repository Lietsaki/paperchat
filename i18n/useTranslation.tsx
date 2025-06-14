import { useEffect } from 'react'
import { LocaleCode } from 'types/Multilang'
import { useI18n } from './I18nContext'
import { getCurrentLocale } from './i18nHelpers'
import en from '../public/locales/en/common.json'
import es from '../public/locales/es/common.json'
import pt from '../public/locales/pt/common.json'
import fr from '../public/locales/fr/common.json'
import de from '../public/locales/de/common.json'
import ja from '../public/locales/ja/common.json'

const locales = {
  en,
  es,
  pt,
  fr,
  de,
  ja
}

interface UseTranslationReturn {
  t: (key: string, values?: { [key: string]: string | number }) => string
  locale: LocaleCode
  changeLocale: (newLocale: LocaleCode) => void
}

const useTranslation = (): UseTranslationReturn => {
  const { locale, setLocale } = useI18n()

  useEffect(() => setLocale(getCurrentLocale()), [locale])

  // Translation function that supports interpolation
  const t = (key: string, values: { [key: string]: string | number } = {}): string => {
    const translation = key.split('.').reduce((acc: any, part) => acc && acc[part], locales[locale])

    // Fallback to the key if translation is missing
    if (!translation) return key

    // Handle interpolation (e.g., {{KEY}})
    return translation.replace(/{{(.*?)}}/g, (fullMatch: string, match: string) => {
      return String(values[match]) || ''
    })
  }

  const changeLocale = (newLocale: LocaleCode) => {
    localStorage.setItem('locale', newLocale)
    setLocale(newLocale)
  }

  return { t, locale, changeLocale }
}

export default useTranslation
