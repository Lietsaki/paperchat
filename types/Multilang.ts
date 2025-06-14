type LocaleCode = 'en' | 'es' | 'pt' | 'fr' | 'de' | 'ja'

type LocaleDataObj = {
  code: LocaleCode
  label: string
}

interface I18nConfig {
  locales: LocaleCode[]
  defaultLocale: LocaleCode
}

export type { LocaleCode, LocaleDataObj, I18nConfig }
