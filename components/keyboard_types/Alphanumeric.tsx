import styles from 'styles/components/keyboard.module.scss'
import { useState, useCallback } from 'react'

const { alphanumeric, key_row, active, dragging, floating_key } = styles

type alphanumericProps = {
  typeKey: (key: string) => void
  typeSpace: () => void
  typeEnter: () => void
  typeDel: () => void
}
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

const AlphanumericKeyboard = ({ typeKey, typeSpace, typeEnter, typeDel }: alphanumericProps) => {
  const [usingCaps, setCaps] = useState(false)
  const [usingShift, setShift] = useState(false)
  const [activeKey, setActiveKey] = useState('')

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

  const getText = (key: regularKey) => {
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
    document.body.style.cursor = 'grabbing'
  }

  const updateFloatingKeyPostion = (e: MouseEvent) => {
    const floatingKey = document.querySelector(`.${floating_key}`) as HTMLDivElement
    floatingKey.style.left = e.pageX - 10 + 'px'
    floatingKey.style.top = e.pageY - 15 + 'px'
  }

  const mousemoveCallback = useCallback((e: MouseEvent) => updateFloatingKeyPostion(e), [])

  const handleMouseLeave = (key: string, e: React.MouseEvent) => {
    if (activeKey === key) {
      const main = document.querySelector('.main')
      const floatingKey = document.createElement('div')
      floatingKey.innerText = key
      floatingKey.classList.add(floating_key)
      main!.append(floatingKey)
      floatingKey.style.left = e.pageX - 10 + 'px'
      floatingKey.style.top = e.pageY - 15 + 'px'

      const row = document.getElementsByClassName(key_row)
      const sampleKey = row[0].children[0]
      const computedFontSize = getComputedStyle(sampleKey).fontSize
      floatingKey.style.fontSize = computedFontSize

      document.addEventListener('mousemove', mousemoveCallback)
    }

    console.log('mouse left')
  }

  const handleMouseUp = () => {
    setActiveKey('')
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'auto'
    const floatingKey = document.querySelector(`.${floating_key}`)

    if (floatingKey) {
      document.removeEventListener('mousemove', mousemoveCallback)
      floatingKey.remove()
    }
  }

  const getKeys = () => {
    return keys.map((row, i) => {
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
                  <img
                    src={`/special-keys/active/${key.specialKey}.png`}
                    className={active}
                    alt={key.specialKey}
                  />
                </div>
              )
            } else {
              const keyText = getText(key)

              return (
                <div
                  onMouseLeave={(e) => handleMouseLeave(keyText, e)}
                  onMouseDown={() => handleMouseDown(keyText)}
                  onClick={() => performType(keyText)}
                  key={key.text}
                >
                  {keyText}
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
