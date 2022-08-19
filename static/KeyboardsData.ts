import { keys, alphaKeys } from 'types/Keyboard'

const Alphanumeric: alphaKeys = [
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

const Accents: keys = [
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

const Symbols: keys = [
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

const Smileys: keys = [
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

export { Accents, Symbols, Smileys, Alphanumeric }
