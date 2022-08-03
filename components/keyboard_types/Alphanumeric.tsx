import styles from 'styles/components/keyboard.module.scss'

const { alphanumeric, key_row } = styles

const keys = [
  [
    {
      text: '1',
      shift_text: '!'
    },
    {
      text: '2',
      shift_text: '@'
    },
    {
      text: '3',
      shift_text: '#'
    },
    {
      text: '4',
      shift_text: '$'
    },
    {
      text: '5',
      shift_text: '%'
    },
    {
      text: '6',
      shift_text: '^'
    },
    {
      text: '7',
      shift_text: '&'
    },
    {
      text: '8',
      shift_text: '*'
    },
    {
      text: '9',
      shift_text: '('
    },
    {
      text: '0',
      shift_text: ')'
    },
    {
      text: '-',
      shift_text: '_'
    },
    {
      text: '=',
      shift_text: '+'
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
      special_key: 'DEL'
    }
  ],
  [
    {
      special_key: 'CAPS'
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
      special_key: 'ENTER'
    }
  ],
  [
    {
      special_key: 'SHIFT'
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
      shift_text: '<'
    },
    {
      text: '.',
      shift_text: '>'
    },
    {
      text: '/',
      shift_text: '?'
    }
  ],
  [
    {
      text: ';',
      shift_text: ':'
    },
    {
      text: '´',
      shift_text: '~'
    },
    {
      special_key: 'SPACE'
    },
    {
      text: '[',
      shift_text: '{'
    },
    {
      text: ']',
      shift_text: '}'
    }
  ]
]

const getKeys = () => {
  return keys.map((row) => {
    return (
      <div className={key_row}>
        {row.map((key) => {
          if (key.special_key) {
            return (
              <div className={`${styles.special_key} ${styles[key.special_key]}`}>
                <img src={`/special-keys/${key.special_key}.png`} alt={key.special_key} />
              </div>
            )
          } else {
            return <div>{key.text}</div>
          }
        })}
      </div>
    )
  })
}

const Keyboard = () => {
  return <div className={alphanumeric}>{getKeys()}</div>
}

export default Keyboard
