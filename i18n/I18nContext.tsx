import { createContext, useState, ReactNode, useContext } from 'react'
import { LocaleCode } from 'types/Multilang'

// Create Context
const I18nContext = createContext<
  { locale: LocaleCode; setLocale: (localeCode: LocaleCode) => void } | undefined
>(undefined)

// Provider Component
const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<LocaleCode>('en')
  return <I18nContext.Provider value={{ locale, setLocale }}>{children}</I18nContext.Provider>
}

// Hook to consume the context
const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within a I18nProvider')
  }

  return context
}

export { I18nProvider, useI18n }
