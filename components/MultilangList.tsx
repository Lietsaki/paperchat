import useTranslation from 'i18n/useTranslation'
import { useEffect } from 'react'
import { LocaleCode, LocaleDataObj } from 'types/Multilang'

type MultilangListProps = {
  selectedLang: LocaleCode
  setSelectedLang: (localeCode: LocaleCode) => void
}

const MultilangList = ({ selectedLang, setSelectedLang }: MultilangListProps) => {
  const { t, locale } = useTranslation()

  const selectLanguage = (selectedLocale: LocaleCode) => {
    setSelectedLang(selectedLocale)
  }

  useEffect(() => {
    setSelectedLang(locale)
  }, [])

  const langs: LocaleDataObj[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'pt', label: 'Português' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ja', label: '日本語' }
  ]

  return (
    <div className="language_list">
      <div className={`title ${locale}`}>{t('HOME.SWITCH_LANGUAGE')}</div>

      <ul className="scrollify">
        {langs.map((lang, i) => (
          <li
            key={i}
            onClick={() => selectLanguage(lang.code)}
            className={`${lang.code} ${selectedLang === lang.code ? 'selected_lang' : ''}`}
          >
            {lang.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MultilangList
