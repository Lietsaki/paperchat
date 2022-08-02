import styles from 'styles/components/keyboard.module.scss'

const { alphanumeric } = styles

const keys = [
  {
    text: '1',
    shift_text: '!',
  },
  {
    text: '2',
    shift_text: '@',
  },
  {
    text: '3',
    shift_text: '#',
  },
  {
    text: '4',
    shift_text: '$',
  },
  {
    text: '5',
    shift_text: '%',
  },
  {
    text: '6',
    shift_text: '^',
  },
  {
    text: '7',
    shift_text: '&',
  },
  {
    text: '8',
    shift_text: '*',
  },
  {
    text: '9',
    shift_text: '(',
  },
  {
    text: '0',
    shift_text: ')',
  },
  {
    text: '-',
    shift_text: '_',
  },
  {
    text: '=',
    shift_text: '+',
  },
  {
    text: 'q',
  },
  {
    text: 'w',
  },
  {
    text: 'e',
  },
  {
    text: 'r',
  },
  {
    text: 't',
  },
  {
    text: 'y',
  },
  {
    text: 'u',
  },
  {
    text: 'i',
  },
  {
    text: 'o',
  },
  {
    text: 'p',
  },
  {
    special_key: 'delete',
  },
  {
    special_key: 'caps',
  },
  {
    text: 'a',
  },
  {
    text: 's',
  },
  {
    text: 'd',
  },
  {
    text: 'f',
  },
  {
    text: 'g',
  },
  {
    text: 'h',
  },
  {
    text: 'j',
  },
  {
    text: 'k',
  },
  {
    text: 'l',
  },
  {
    special_key: 'enter',
  },
  {
    special_key: 'enter',
  },
  {
    text: 'z',
  },
  {
    text: 'x',
  },
  {
    text: 'c',
  },
  {
    text: 'v',
  },
  {
    text: 'b',
  },
  {
    text: 'n',
  },
  {
    text: 'm',
  },
  {
    text: ',',
    shift_text: '<',
  },
  {
    text: '.',
    shift_text: '>',
  },
  {
    text: '/',
    shift_text: '?',
  },
  {
    text: ';',
    shift_text: ':',
  },
  {
    text: '´',
    shift_text: '~',
  },
  {
    special_key: 'space',
  },
  {
    text: '[',
    shift_text: '{',
  },
  {
    text: ']',
    shift_text: '}',
  },
]

const Keyboard = () => {
  return <div className={alphanumeric}></div>
}

export default Keyboard
