import styles from 'styles/components/keyboard.module.scss'
import { createFloatingKey, removeFloatingKey } from 'helpers/floatingKey'
import { useState } from 'react'

const { keyboard_grid, active, dragging } = styles

type symbolsProps = {
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
    text: '!'
  },
  {
    text: '?'
  },
  {
    text: '&'
  },
  {
    text: '"'
  },
  {
    text: `'`
  },
  {
    text: '～'
  },
  {
    text: ':'
  },
  {
    text: ';'
  },
  {
    text: '@'
  },
  {
    text: '~'
  },
  {
    text: '_'
  },
  {
    text: '+'
  },
  {
    text: '-'
  },
  {
    text: '*'
  },
  {
    text: '/'
  },
  {
    text: '×'
  },
  {
    text: '÷'
  },
  {
    text: '='
  },
  {
    text: '→'
  },
  {
    text: '←'
  },
  {
    text: '↑'
  },
  {
    text: '↓'
  },
  {
    specialKey: 'DEL'
  },
  {
    text: '「'
  },
  {
    text: '」'
  },
  {
    text: '“'
  },
  {
    text: '”'
  },
  {
    text: '('
  },
  {
    text: ')'
  },
  {
    text: '<'
  },
  {
    text: '>'
  },
  {
    text: '{'
  },
  {
    text: '}'
  },
  {
    text: '•'
  },
  {
    specialKey: 'ENTER'
  },
  {
    text: '%'
  },
  {
    text: '※'
  },
  {
    text: '〒'
  },
  {
    text: '♯'
  },
  {
    text: '♭'
  },
  {
    text: '♩'
  },
  {
    text: '±'
  },
  {
    text: '$'
  },
  {
    text: '¢'
  },
  {
    text: '£'
  },
  {
    text: '\\'
  },
  {
    text: '^'
  },
  {
    text: '°'
  },
  {
    text: '|'
  },
  {
    text: '／'
  },
  {
    text: '＼'
  },
  {
    text: '∞'
  },
  {
    text: '∴'
  },
  {
    text: '…'
  },
  {
    text: '™'
  },
  {
    text: '©'
  },
  {
    text: '®'
  },
  {
    specialKey: 'SPACE'
  }
]

const SymbolsKeyboard = ({ typeKey, typeSpace, typeEnter, typeDel }: symbolsProps) => {
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

export default SymbolsKeyboard
