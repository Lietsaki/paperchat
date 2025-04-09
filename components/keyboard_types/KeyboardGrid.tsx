import styles from 'styles/components/keyboard.module.scss'
import { createFloatingKey, removeFloatingKey } from 'helpers/floatingKey'
import { useState, useRef } from 'react'
import { Keys, GridSpecialKeys } from 'types/Keyboard'
import { EventPos } from 'types/Position'
import { playSound } from 'helpers/helperFunctions'

const { keyboard_grid, key_container, regular_key, dragging } = styles

type KeyboardGridProps = {
  typeKey: (key: string) => void
  typeSpace: () => void
  typeEnter: () => void
  typeDel: () => void
  keySet: Keys
}

const KeyboardGrid = ({ typeKey, typeSpace, typeEnter, typeDel, keySet }: KeyboardGridProps) => {
  const [activeKey, setActiveKey] = useState('')
  const [draggingKey, setDragginKey] = useState('')
  const draggingKeyRef = useRef('')
  draggingKeyRef.current = draggingKey

  const specialKeyMethods = {
    DEL: () => typeDel(),
    ENTER: () => typeEnter(),
    SPACE: () => typeSpace()
  }

  const getSpecialKeyImg = (specialKey: string) => {
    const processed_key = specialKey === 'ENTER' ? 'ENTER_2' : specialKey
    return `/special-keys/${processed_key}.png`
  }

  const handlePointerDown = (key: string) => {
    setActiveKey(key)

    // Listen for mouseup in the whole document, as the text will be dragged outside the key.
    // Otherwise onMouseUp would only fire within the key, not when dragged into the canvas, for example.
    document.addEventListener('mouseup', handlePointerUp)
    document.addEventListener('touchend', handlePointerUp)
    document.body.style.cursor = 'grabbing'
    playSound('keydown', 0.1)
  }

  const handleKeyLeave = (key: string, e: EventPos) => {
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

  const handlePointerUp = () => {
    if (!draggingKeyRef.current) playSound('keyup', 0.1)
    setActiveKey('')
    setDragginKey('')
    document.removeEventListener('mouseup', handlePointerUp)
    document.removeEventListener('touchend', handlePointerUp)
    document.body.style.cursor = 'auto'
    removeFloatingKey()
  }

  const specialMethodKeydown = () => {
    playSound('keydown', 0.1)
  }

  const specialMethodKeyup = (specialKey: GridSpecialKeys) => {
    playSound('keyup', 0.1)
    specialKeyMethods[specialKey]()
  }

  const getKeys = () => {
    return keySet.map((key) => {
      if (key.specialKey) {
        return (
          <div
            onPointerDown={specialMethodKeydown}
            onPointerUp={() => specialMethodKeyup(key.specialKey!)}
            key={key.specialKey}
            className={`${styles.special_key} ${styles[key.specialKey]}`}
          >
            <img src={getSpecialKeyImg(key.specialKey)} alt={key.specialKey} draggable="false" />
            <div className="active_color"></div>
          </div>
        )
      } else {
        return (
          <div
            onMouseLeave={(e) => handleKeyLeave(key.text, e)}
            onTouchMove={(e) => handleTouchMove(key.text, e)}
            onPointerDown={() => handlePointerDown(key.text)}
            onTouchStart={() => handlePointerDown(key.text)}
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
