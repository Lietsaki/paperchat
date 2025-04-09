import en from '../public/locales/en/common.json'
import es from '../public/locales/es/common.json'
import cat from '../public/locales/cat/common.json'
import de from '../public/locales/de/common.json'
import cn from '../public/locales/cn/common.json'
import { getCurrentLocale } from './i18nHelpers'

const locales = {
  en,
  es,
  cat,
  de,
  cn
}

// Function to get a translation function without hooks
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
