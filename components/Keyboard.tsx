import styles from 'styles/components/keyboard.module.scss'
import Alphanumeric from './keyboard_types/Alphanumeric'
import KeyboardGrid from './keyboard_types/KeyboardGrid'
import { keyboard } from 'types/Keyboard'
import { Accents, Smileys, Symbols } from 'static/KeyboardsData'

const { keyboard_bg, keyboard_content } = styles

type keyboardProps = {
  currentKeyboard: keyboard
  typeKey: (key: string) => void
  typeSpace: () => void
  typeEnter: () => void
  typeDel: () => void
}

const Keyboard = ({ typeKey, typeSpace, typeEnter, typeDel, currentKeyboard }: keyboardProps) => {
  const typeFunctions = { typeKey, typeSpace, typeEnter, typeDel }
  const keySets = { Accents, Smileys, Symbols }

  const getKeyboard = () => {
    if (currentKeyboard === 'Alphanumeric') return <Alphanumeric {...typeFunctions} />
    return <KeyboardGrid {...typeFunctions} keySet={keySets[currentKeyboard]} />
  }

  return (
    <div className={keyboard_bg}>
      <div className={keyboard_content}>{getKeyboard()}</div>
    </div>
  )
}

export default Keyboard
