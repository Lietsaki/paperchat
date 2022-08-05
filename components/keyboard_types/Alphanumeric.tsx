import styles from 'styles/components/keyboard.module.scss'
import { useState } from 'react'

const { alphanumeric, key_row, active } = styles

type specialKeys = 'DEL' | 'CAPS' | 'ENTER' | 'SHIFT' | 'SPACE'
type specialKey = { specialKey: specialKeys }
type regularKey =
  | {
      text: string
      specialKey?: specialKeys
      shiftText?: string
    }
  | {
      text: string
      shiftText: string
      specialKey?: specialKeys
    }

type keys = (specialKey | regularKey)[][]

const keys: keys = [
  [
    {
      text: '1',
      shiftText: '!'
    },
    {
      text: '2',
      shiftText: '@'
    },
    {
      text: '3',
      shiftText: '#'
    },
    {
      text: '4',
      shiftText: '$'
    },
    {
      text: '5',
      shiftText: '%'
    },
    {
      text: '6',
      shiftText: '^'
    },
    {
      text: '7',
      shiftText: '&'
    },
    {
      text: '8',
      shiftText: '*'
    },
    {
      text: '9',
      shiftText: '('
    },
    {
      text: '0',
      shiftText: ')'
    },
    {
      text: '-',
      shiftText: '_'
    },
    {
      text: '=',
      shiftText: '+'
    }
  ],
  [
    {
      text: 'q'
    },
    {
      text: 'w'
    },
    {
      text: 'e'
    },
    {
      text: 'r'
    },
    {
      text: 't'
    },
    {
      text: 'y'
    },
    {
      text: 'u'
    },
    {
      text: 'i'
    },
    {
      text: 'o'
    },
    {
      text: 'p'
    },
    {
      specialKey: 'DEL'
    }
  ],
  [
    {
      specialKey: 'CAPS'
    },
    {
      text: 'a'
    },
    {
      text: 's'
    },
    {
      text: 'd'
    },
    {
      text: 'f'
    },
    {
      text: 'g'
    },
    {
      text: 'h'
    },
    {
      text: 'j'
    },
    {
      text: 'k'
    },
    {
      text: 'l'
    },
    {
      specialKey: 'ENTER'
    }
  ],
  [
    {
      specialKey: 'SHIFT'
    },
    {
      text: 'z'
    },
    {
      text: 'x'
    },
    {
      text: 'c'
    },
    {
      text: 'v'
    },
    {
      text: 'b'
    },
    {
      text: 'n'
    },
    {
      text: 'm'
    },
    {
      text: ',',
      shiftText: '<'
    },
    {
      text: '.',
      shiftText: '>'
    },
    {
      text: '/',
      shiftText: '?'
    }
  ],
  [
    {
      text: ';',
      shiftText: ':'
    },
    {
      text: '´',
      shiftText: '~'
    },
    {
      specialKey: 'SPACE'
    },
    {
      text: '[',
      shiftText: '{'
    },
    {
      text: ']',
      shiftText: '}'
    }
  ]
]

const Keyboard = () => {
  const [usingCaps, setCaps] = useState(false)
  const [usingShift, setShift] = useState(false)

  const specialKeyMethods = {
    DEL: () => {
      return ''
    },
    CAPS: () => {
      setCaps(!usingCaps)
      setShift(false)
    },
    ENTER: () => {
      return ''
    },
    SHIFT: () => {
      setShift(!usingShift)
      setCaps(false)
    },
    SPACE: () => {
      return ''
    }
  }

  const isKeyActive = (key: string) => {
    if (key === 'CAPS' && usingCaps) return styles.selected
    if (key === 'SHIFT' && usingShift) return styles.selected
    return ''
  }

  const getText = (key: regularKey) => {
    if (usingCaps) return key.text.toUpperCase()
    if (usingShift) return key.shiftText || key.text.toUpperCase()
    return key.text
  }

  const getKeys = () => {
    return keys.map((row, i) => {
      return (
        <div className={key_row} key={i}>
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
                  <img
                    src={`/special-keys/active/${key.specialKey}.png`}
                    className={active}
                    alt={key.specialKey}
                  />
                </div>
              )
            } else {
              return <div key={key.text}>{getText(key)}</div>
            }
          })}
        </div>
      )
    })
  }

  return <div className={alphanumeric}>{getKeys()}</div>
}

export default Keyboard
