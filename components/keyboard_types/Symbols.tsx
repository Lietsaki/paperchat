import styles from 'styles/components/keyboard.module.scss'

const { keyboard_grid, active } = styles

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

const SymbolsKeyboard = () => {
  const specialKeyMethods = {
    DEL: () => {
      return ''
    },
    ENTER: () => {
      return ''
    },
    SPACE: () => {
      return ''
    }
  }

  const getSpecialKeyImg = (specialKey: string, active: Boolean) => {
    const processed_key = specialKey === 'ENTER' ? 'ENTER_2' : specialKey
    if (!active) return `/special-keys/${processed_key}.png`
    if (active) return `/special-keys/active/${processed_key}.png`
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
        return <div key={key.text}>{key.text}</div>
      }
    })
  }

  return <div className={keyboard_grid}>{getKeys()}</div>
}

export default SymbolsKeyboard
