type LocaleCode = 'en' | 'es' | 'cat' | 'de' | 'cn'

type LocaleDataObj = {
  code: LocaleCode
  label: string
}

interface I18nConfig {
  locales: LocaleCode[]
  defaultLocale: LocaleCode
}

export type { LocaleCode, LocaleDataObj, I18nConfig }
