import styles from 'styles/components/keyboard.module.scss'

const { accents, active } = styles

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

const Keyboard = () => {
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

  const getKeys = () => {
    return keys.map((key) => {
      if (key.specialKey) {
        return (
          <div
            onClick={specialKeyMethods[key.specialKey]}
            key={key.specialKey}
            className={`${styles.special_key} ${styles[key.specialKey]}`}
          >
            <img src={`/special-keys/${key.specialKey}.png`} alt={key.specialKey} />
            <img
              src={`/special-keys/active/${key.specialKey}.png`}
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

  return <div className={accents}>{getKeys()}</div>
}

export default Keyboard
