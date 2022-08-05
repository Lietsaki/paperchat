import styles from 'styles/components/keyboard.module.scss'
import Alphanumeric from './keyboard_types/Alphanumeric'
import Accents from './keyboard_types/Accents'

const { keyboard_bg, keyboard_content } = styles

// type KeyboardProps = {
// }

const Keyboard = () => {
  return (
    <div className={keyboard_bg}>
      <div className={keyboard_content}>
        {/* <Alphanumeric /> */}
        <Accents />
      </div>
    </div>
  )
}

export default Keyboard
