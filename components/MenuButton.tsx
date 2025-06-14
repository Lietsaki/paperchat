import styles from 'styles/components/menu-button.module.scss'
import useTranslation from 'i18n/useTranslation'

const { menu_button, ja } = styles

type MenuButtonProps = {
  text: string
  onClick: () => void
}

const MenuButton = ({ text, onClick }: MenuButtonProps) => {
  const { locale } = useTranslation()

  return (
    <button onClick={onClick} className={`${menu_button} ${locale === 'ja' ? ja : ''}`}>
      <div className="">{text}</div>
    </button>
  )
}

export default MenuButton
