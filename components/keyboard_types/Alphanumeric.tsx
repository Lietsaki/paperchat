import styles from 'styles/components/keyboard.module.scss'
import room_styles from 'styles/room/room.module.scss'
import { useState } from 'react'

const { alphanumeric, key_row, active } = styles

type specialKeys = 'DEL' | 'CAPS' | 'ENTER' | 'SHIFT' | 'SPACE'
type regularKey =
  | {
      text: string
      specialkey?: undefined
      shiftText?: undefined
    }
  | {
      text: string
      shiftText: string
      specialkey?: undefined
    }
type specialkey = {
  specialkey: specialKeys
  text?: undefined
  shiftText?: undefined
}

type keys = (specialkey | regularKey)[][]

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
      specialkey: 'DEL'
    }
  ],
  [
    {
      specialkey: 'CAPS'
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
      specialkey: 'ENTER'
    }
  ],
  [
    {
      specialkey: 'SHIFT'
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
      specialkey: 'SPACE'
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
  type keysWithMethods = 'CAPS' | 'SHIFT'

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
            if (key.specialkey) {
              return (
                <div
                  onClick={specialKeyMethods[key.specialkey]}
                  key={key.specialkey}
                  className={`${styles.special_key} ${styles[key.specialkey]} ${isKeyActive(
                    key.specialkey
                  )}`}
                >
                  <img src={`/special-keys/${key.specialkey}.png`} alt={key.specialkey} />
                  <img
                    src={`/special-keys/active/${key.specialkey}.png`}
                    className={active}
                    alt={key.specialkey}
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
