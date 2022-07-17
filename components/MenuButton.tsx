import styles from 'styles/components/menu-button.module.scss'

const { menu_button } = styles

type MenuButtonProps = {
  text: string
}

const MenuButton = ({ text }: MenuButtonProps) => {
  return (
    <button className={menu_button}>
      <div className="">{text}</div>
    </button>
  )
}

export default MenuButton
