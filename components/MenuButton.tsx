import styles from 'styles/components/menu-button.module.scss'

const { menu_button } = styles

type MenuButtonProps = {
  text: string
  onClick: () => void
}

const MenuButton = ({ text, onClick }: MenuButtonProps) => {
  return (
    <button onClick={onClick} className={menu_button}>
      <div className="">{text}</div>
    </button>
  )
}

export default MenuButton
