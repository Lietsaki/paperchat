import styles from 'styles/components/keyboard.module.scss'
import { createFloatingKey, removeFloatingKey } from 'helpers/floatingKey'
import { useState } from 'react'
import { keys } from 'types/Keyboard'
import { eventPos } from 'types/Position'

const { keyboard_grid, key_container, regular_key, dragging } = styles

type keyboardGridProps = {
  typeKey: (key: string) => void
  typeSpace: () => void
  typeEnter: () => void
  typeDel: () => void
  keySet: keys
}

const KeyboardGrid = ({ typeKey, typeSpace, typeEnter, typeDel, keySet }: keyboardGridProps) => {
  const [activeKey, setActiveKey] = useState('')
  const [draggingKey, setDragginKey] = useState('')

  const specialKeyMethods = {
    DEL: () => typeDel(),
    ENTER: () => typeEnter(),
    SPACE: () => typeSpace()
  }

  const getSpecialKeyImg = (specialKey: string) => {
    const processed_key = specialKey === 'ENTER' ? 'ENTER_2' : specialKey
    return `/special-keys/${processed_key}.png`
  }

  const handleMouseDown = (key: string) => {
    setActiveKey(key)

    // Listen for mouseup in the whole document, as the text will be dragged outside the key.
    // onMouseUp would only fire within the key, not when dragged into the canvas, for example.
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)
    document.body.style.cursor = 'grabbing'
  }

  const handleKeyLeave = (key: string, e: eventPos) => {
    if (activeKey === key && !draggingKey) {
      setDragginKey(key)
      const row = document.getElementsByClassName(keyboard_grid)
      const sampleKey = row[0].children[0]
      createFloatingKey(key, e, sampleKey)
    }
  }

  const handleTouchMove = (key: string, e: React.TouchEvent) => {
    handleKeyLeave(key, { touches: e.nativeEvent.touches })
  }

  const handleMouseUp = () => {
    setActiveKey('')
    setDragginKey('')
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('touchend', handleMouseUp)
    document.body.style.cursor = 'auto'
    removeFloatingKey()
  }

  const getKeys = () => {
    return keySet.map((key) => {
      if (key.specialKey) {
        return (
          <div
            onClick={specialKeyMethods[key.specialKey]}
            key={key.specialKey}
            className={`${styles.special_key} ${styles[key.specialKey]}`}
          >
            <img src={getSpecialKeyImg(key.specialKey)} alt={key.specialKey} />
            <div className="active_color"></div>
          </div>
        )
      } else {
        return (
          <div
            onMouseLeave={(e) => handleKeyLeave(key.text, e)}
            onTouchMove={(e) => handleTouchMove(key.text, e)}
            onMouseDown={() => handleMouseDown(key.text)}
            onTouchStart={() => handleMouseDown(key.text)}
            onClick={() => typeKey(key.text)}
            className={key_container}
            key={key.text}
          >
            <div className={regular_key}>{key.text}</div>
            <div className="active_color"></div>
          </div>
        )
      }
    })
  }

  return <div className={`${keyboard_grid} ${activeKey ? dragging : ''}`}>{getKeys()}</div>
}

export default KeyboardGrid
