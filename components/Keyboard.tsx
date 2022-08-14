import styles from 'styles/components/keyboard.module.scss'
import Alphanumeric from './keyboard_types/Alphanumeric'
import Accents from './keyboard_types/Accents'
import Symbols from './keyboard_types/Symbols'
import Smileys from './keyboard_types/Smileys'
import keyboard from 'types/Keyboard'

const { keyboard_bg, keyboard_content } = styles

type keyboardProps = {
  currentKeyboard: keyboard
  typeKey: (key: string) => void
  typeSpace: () => void
}

const Keyboard = ({ typeKey, typeSpace, currentKeyboard }: keyboardProps) => {
  const typeFunctions = { typeKey, typeSpace }

  const getKeyboard = () => {
    if (currentKeyboard === 'alphanumeric') return <Alphanumeric {...typeFunctions} />
    if (currentKeyboard === 'accents') return <Accents {...typeFunctions} />
    if (currentKeyboard === 'symbols') return <Symbols {...typeFunctions} />
    if (currentKeyboard === 'smileys') return <Smileys {...typeFunctions} />
  }

  return (
    <div className={keyboard_bg}>
      <div className={keyboard_content}>{getKeyboard()}</div>
    </div>
  )
}

export default Keyboard
