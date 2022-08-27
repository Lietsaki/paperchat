import styles from 'styles/components/keyboard.module.scss'
import { createFloatingKey, removeFloatingKey } from 'helpers/floatingKey'
import React, { useState } from 'react'
import { eventPos } from 'types/Position'
import { regularAlphaKey } from 'types/Keyboard'
import { Alphanumeric } from 'static/KeyboardsData'

const { alphanumeric, key_row, key_container, regular_key, dragging } = styles

type alphanumericProps = {
  typeKey: (key: string) => void
  typeSpace: () => void
  typeEnter: () => void
  typeDel: () => void
}

const AlphanumericKeyboard = ({ typeKey, typeSpace, typeEnter, typeDel }: alphanumericProps) => {
  const [usingCaps, setCaps] = useState(false)
  const [usingShift, setShift] = useState(false)
  const [activeKey, setActiveKey] = useState('')
  const [draggingKey, setDragginKey] = useState('')

  const specialKeyMethods = {
    DEL: () => {
      typeDel()
    },
    CAPS: () => {
      setCaps(!usingCaps)
      setShift(false)
    },
    ENTER: () => {
      typeEnter()
    },
    SHIFT: () => {
      setShift(!usingShift)
      setCaps(false)
    },
    SPACE: () => {
      typeSpace()
    }
  }

  const isKeyActive = (key: string) => {
    if (key === 'CAPS' && usingCaps) return styles.selected
    if (key === 'SHIFT' && usingShift) return styles.selected
    return ''
  }

  const getText = (key: regularAlphaKey) => {
    if (usingCaps) return key.text.toUpperCase()
    if (usingShift) return key.shiftText || key.text.toUpperCase()
    return key.text
  }

  const performType = (key: string) => {
    if (usingShift) setShift(false)
    typeKey(key)
  }

  const handleMouseDown = (key: string) => {
    setActiveKey(key)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)
    document.body.style.cursor = 'grabbing'
  }

  const handleKeyLeave = (key: string, e: eventPos) => {
    if (activeKey === key && !draggingKey) {
      setDragginKey(key)
      const row = document.getElementsByClassName(key_row)
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
    return Alphanumeric.map((row, i) => {
      return (
        <div className={`${key_row} ${activeKey ? dragging : ''}`} key={i}>
          {row.map((key) => {
            if (key.specialKey) {
              return (
                <div
                  onClick={specialKeyMethods[key.specialKey]}
                  key={key.specialKey}
                  className={`${styles.special_key} ${styles[key.specialKey]} ${isKeyActive(
                    key.specialKey
                  )}`}
                >
                  <img src={`/special-keys/${key.specialKey}.png`} alt={key.specialKey} />
                  <div className="active_color"></div>
                </div>
              )
            } else {
              const keyText = getText(key)

              return (
                <div
                  onMouseLeave={(e) => handleKeyLeave(keyText, e)}
                  onTouchMove={(e) => handleTouchMove(keyText, e)}
                  onMouseDown={() => handleMouseDown(keyText)}
                  onTouchStart={() => handleMouseDown(keyText)}
                  onClick={() => performType(keyText)}
                  className={key_container}
                  key={key.text}
                >
                  <div className={regular_key}>{keyText}</div>
                  <div className="active_color"></div>
                </div>
              )
            }
          })}
        </div>
      )
    })
  }

  return <div className={alphanumeric}>{getKeys()}</div>
}

export default AlphanumericKeyboard
