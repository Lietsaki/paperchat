import styles from 'styles/components/menu-button.module.scss'
import useTranslation from 'i18n/useTranslation'

const { multilang_button, small_version } = styles

type LanguageButtonProps = {
  useSmallVersion?: boolean
  onButtonClick: () => void
}

const MultilangButton = ({ useSmallVersion, onButtonClick }: LanguageButtonProps) => {
  const { t } = useTranslation()

  return (
    <button
      aria-label={t('HOME.SWITCH_LANGUAGE')}
      onClick={onButtonClick}
      className={`${multilang_button} ${useSmallVersion ? small_version : ''}`}
    >
      <img src="/icons/multilang.png" alt={t('HOME.SWITCH_LANGUAGE')} />
    </button>
  )
}

export default MultilangButton
