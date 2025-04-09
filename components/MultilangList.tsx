import useTranslation from 'i18n/useTranslation'
import { LocaleCode, LocaleDataObj } from 'types/Multilang'

type MultilangListProps = {
  selectedLang: LocaleCode
  setSelectedLang: (localeCode: LocaleCode) => void
}

const MultilangList = ({ selectedLang, setSelectedLang }: MultilangListProps) => {
  const { t } = useTranslation()

  const selectLanguage = (selectedLocale: LocaleCode) => {
    setSelectedLang(selectedLocale)
  }

  const langs: LocaleDataObj[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'cat', label: 'Català' },
    { code: 'cn', label: '中文' },
    { code: 'de', label: 'Deutsch' }
  ]

  return (
    <div className="language_list">
      <div className="title">{t('HOME.SWITCH_LANGUAGE')}</div>

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
