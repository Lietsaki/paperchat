import styles from 'styles/components/keyboard.module.scss'

const { keyboard_bg, keyboard_content } = styles

// type KeyboardProps = {
// }

const Keyboard = () => {
  return (
    <div className={keyboard_bg}>
      <div className={keyboard_content}></div>
    </div>
  )
}

export default Keyboard
