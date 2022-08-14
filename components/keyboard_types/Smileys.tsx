import styles from 'styles/components/keyboard.module.scss'

const { keyboard_grid, active } = styles

type smileysProps = {
  typeKey: (key: string) => void
  typeSpace: () => void
}
type specialKeys = 'DEL' | 'ENTER' | 'SPACE'
type specialKey = { specialKey: specialKeys }
type regularKey = { text: string; specialKey?: specialKeys }
type keys = (specialKey | regularKey)[]

const keys: keys = [
  {
    text: '1'
  },
  {
    text: '2'
  },
  {
    text: '3'
  },
  {
    text: '4'
  },
  {
    text: `5`
  },
  {
    text: '6'
  },
  {
    text: '7'
  },
  {
    text: '8'
  },
  {
    text: '9'
  },
  {
    text: '0'
  },
  {
    text: '='
  },
  {
    text: '☺'
  },
  {
    text: '☻'
  },
  {
    text: '☹'
  },
  {
    text: '⚀'
  },
  {
    text: '☼'
  },
  {
    text: '☁'
  },
  {
    text: '☂'
  },
  {
    text: '☃'
  },
  {
    text: '✉'
  },
  {
    text: '☎'
  },
  {
    text: '∱'
  },
  {
    specialKey: 'DEL'
  },
  {
    text: 'Ⓐ'
  },
  {
    text: 'Ⓑ'
  },
  {
    text: 'Ⓧ'
  },
  {
    text: 'Ⓨ'
  },
  {
    text: 'Ⓛ'
  },
  {
    text: 'Ⓡ'
  },
  {
    text: '✚'
  },
  {
    text: '♠'
  },
  {
    text: '♦'
  },
  {
    text: '♥'
  },
  {
    text: '♣'
  },
  {
    specialKey: 'ENTER'
  },
  {
    text: '①'
  },
  {
    text: '⑦'
  },
  {
    text: '+'
  },
  {
    text: '-'
  },
  {
    text: '☆'
  },
  {
    text: '○'
  },
  {
    text: '◇'
  },
  {
    text: '□'
  },
  {
    text: '△'
  },
  {
    text: '▽'
  },
  {
    text: '⦾'
  },
  {
    text: '➡'
  },
  {
    text: '⬅'
  },
  {
    text: '⬆'
  },
  {
    text: '⬇'
  },
  {
    text: '★'
  },
  {
    text: '●'
  },
  {
    text: '◆'
  },
  {
    text: '■'
  },
  {
    text: '▲'
  },
  {
    text: '▼'
  },
  {
    text: '☓'
  },
  {
    specialKey: 'SPACE'
  }
]

const SmileysKeyboard = ({ typeKey, typeSpace }: smileysProps) => {
  const specialKeyMethods = {
    DEL: () => {
      return ''
    },
    ENTER: () => {
      return ''
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
          <div onClick={() => typeKey(key.text)} key={key.text}>
            {key.text}
          </div>
        )
      }
    })
  }

  return <div className={keyboard_grid}>{getKeys()}</div>
}

export default SmileysKeyboard
