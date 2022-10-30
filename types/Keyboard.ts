// KEYBOARD TYPES
type keyboard = 'Alphanumeric' | 'Accents' | 'Symbols' | 'Smileys'

// Types for the Alphanumeric Keyboard
type allSpecialKeys = 'DEL' | 'CAPS' | 'ENTER' | 'SHIFT' | 'SPACE'

type regularAlphaKey = {
  text: string
  shiftText?: string
  specialKey?: allSpecialKeys
}

type specialAlphaKey = { specialKey: allSpecialKeys }
type alphaKeys = (regularAlphaKey | specialAlphaKey)[][]

// Types for all other Keyboards
type gridSpecialKeys = 'DEL' | 'ENTER' | 'SPACE'
type regularKey = { text: string; specialKey?: gridSpecialKeys }
type specialKey = { specialKey: gridSpecialKeys }

type keys = (regularKey | specialKey)[]

export type { keyboard, regularAlphaKey, alphaKeys, keys, allSpecialKeys, gridSpecialKeys }
