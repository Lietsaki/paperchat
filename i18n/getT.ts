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

// Function to get a translation string without hooks
const getT = (key: string, values: { [key: string]: string | number } = {}): string => {
  const currentLocale = getCurrentLocale()

  const translation = key
    .split('.')
    .reduce((acc: any, part) => acc && acc[part], locales[currentLocale])

  // Fallback to the key if translation is missing
  if (!translation) return key

  // Handle interpolation (e.g., {{KEY}})
  return translation.replace(/{{(.*?)}}/g, (fullMatch: string, match: string) => {
    return String(values[match]) || ''
  })
}

export default getT
