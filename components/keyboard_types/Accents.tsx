import styles from 'styles/components/keyboard.module.scss'
import { createFloatingKey, removeFloatingKey } from 'helpers/floatingKey'
import { useState } from 'react'

const { keyboard_grid, active, dragging } = styles

type accentsProps = {
  typeKey: (key: string) => void
  typeSpace: () => void
  typeEnter: () => void
  typeDel: () => void
}
type specialKeys = 'DEL' | 'ENTER' | 'SPACE'
type specialKey = { specialKey: specialKeys }
type regularKey = { text: string; specialKey?: specialKeys }
type keys = (specialKey | regularKey)[]

const keys: keys = [
  {
    text: 'à'
  },
  {
    text: 'á'
  },
  {
    text: 'â'
  },
  {
    text: 'ä'
  },
  {
    text: 'è'
  },
  {
    text: 'é'
  },
  {
    text: 'ê'
  },
  {
    text: 'ë'
  },
  {
    text: 'ì'
  },
  {
    text: 'í'
  },
  {
    text: 'î'
  },
  {
    text: 'ï'
  },
  {
    text: 'ò'
  },
  {
    text: 'ó'
  },
  {
    text: 'ô'
  },
  {
    text: 'ö'
  },
  {
    text: 'œ'
  },
  {
    text: 'ù'
  },
  {
    text: 'ú'
  },
  {
    text: 'û'
  },
  {
    text: 'ü'
  },
  {
    text: 'ç'
  },
  {
    specialKey: 'DEL'
  },
  {
    text: 'ñ'
  },
  {
    text: 'ß'
  },
  {
    text: 'À'
  },
  {
    text: 'Á'
  },
  {
    text: 'Â'
  },
  {
    text: 'Ä'
  },
  {
    text: 'È'
  },
  {
    text: 'É'
  },
  {
    text: 'Ê'
  },
  {
    text: 'Ë'
  },
  {
    text: 'Ì'
  },
  {
    specialKey: 'ENTER'
  },
  {
    text: 'Í'
  },
  {
    text: 'Î'
  },
  {
    text: 'Ï'
  },
  {
    text: 'Ò'
  },
  {
    text: 'Ó'
  },
  {
    text: 'Ô'
  },
  {
    text: 'Ö'
  },
  {
    text: 'Œ'
  },
  {
    text: 'Ù'
  },
  {
    text: 'Ú'
  },
  {
    text: 'Û'
  },
  {
    text: 'Ü'
  },
  {
    text: 'Ç'
  },
  {
    text: 'Ñ'
  },
  {
    text: '¡'
  },
  {
    text: '¿'
  },
  {
    text: '€'
  },
  {
    text: '¢'
  },
  {
    text: '£'
  },
  {
    specialKey: 'SPACE'
  }
]

const AccentsKeyboard = ({ typeKey, typeSpace, typeEnter, typeDel }: accentsProps) => {
  const [activeKey, setActiveKey] = useState('')
  const [draggingKey, setDragginKey] = useState('')

  const specialKeyMethods = {
    DEL: () => {
      typeDel()
    },
    ENTER: () => {
      typeEnter()
    },
    SPACE: () => {
      typeSpace()
    }
  }

  const getSpecialKeyImg = (specialKey: string, active: Boolean) => {
    const processed_key = specialKey === 'ENTER' ? 'ENTER_2' : specialKey
    if (!active) return `/special-keys/${processed_key}.png`
    if (active) return `/special-keys/active/${processed_key}.png`
  }

  const handleMouseDown = (key: string) => {
    setActiveKey(key)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'grabbing'
  }

  const handleMouseLeave = (key: string, e: React.MouseEvent) => {
    if (activeKey === key && !draggingKey) {
      setDragginKey(key)
      const row = document.getElementsByClassName(keyboard_grid)
      const sampleKey = row[0].children[0]
      createFloatingKey(key, e, sampleKey)
    }
  }

  const handleMouseUp = () => {
    setActiveKey('')
    setDragginKey('')
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'auto'
    removeFloatingKey()
  }

  const getKeys = () => {
    return keys.map((key) => {
      if (key.specialKey) {
        return (
          <div
            onClick={specialKeyMethods[key.specialKey]}
            key={key.specialKey}
            className={`${styles.special_key} ${styles[key.specialKey]}`}
          >
            <img src={getSpecialKeyImg(key.specialKey, false)} alt={key.specialKey} />
            <img
              src={getSpecialKeyImg(key.specialKey, true)}
              className={active}
              alt={key.specialKey}
            />
          </div>
        )
      } else {
        return (
          <div
            onMouseLeave={(e) => handleMouseLeave(key.text, e)}
            onMouseDown={() => handleMouseDown(key.text)}
            onClick={() => typeKey(key.text)}
            key={key.text}
          >
            {key.text}
          </div>
        )
      }
    })
  }

  return <div className={`${keyboard_grid} ${activeKey ? dragging : ''}`}>{getKeys()}</div>
}

export default AccentsKeyboard
