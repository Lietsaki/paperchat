import styles from 'styles/components/keyboard.module.scss'
import Alphanumeric from './keyboard_types/Alphanumeric'

const { keyboard_bg, keyboard_content } = styles

// type KeyboardProps = {
// }

const Keyboard = () => {
  return (
    <div className={keyboard_bg}>
      <div className={keyboard_content}>
        <Alphanumeric />
      </div>
    </div>
  )
}

export default Keyboard
