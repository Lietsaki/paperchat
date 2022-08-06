import styles from 'styles/components/keyboard.module.scss'
import Alphanumeric from './keyboard_types/Alphanumeric'
import Accents from './keyboard_types/Accents'
import Symbols from './keyboard_types/Symbols'
import Smileys from './keyboard_types/Smileys'
import keyboard from 'types/Keyboard'

const { keyboard_bg, keyboard_content } = styles

type keyboardProps = {
  currentKeyboard: keyboard
}

const Keyboard = ({ currentKeyboard }: keyboardProps) => {
  const getKeyboard = () => {
    if (currentKeyboard === 'alphanumeric') return <Alphanumeric />
    if (currentKeyboard === 'accents') return <Accents />
    if (currentKeyboard === 'symbols') return <Symbols />
    if (currentKeyboard === 'smileys') return <Smileys />
  }

  return (
    <div className={keyboard_bg}>
      <div className={keyboard_content}>{getKeyboard()}</div>
    </div>
  )
}

export default Keyboard
