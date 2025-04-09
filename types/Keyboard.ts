// KEYBOARD TYPES
type KeyboardType = 'Alphanumeric' | 'Accents' | 'Symbols' | 'Smileys'

// Types for the Alphanumeric Keyboard
type AllSpecialKeys = 'DEL' | 'CAPS' | 'ENTER' | 'SHIFT' | 'SPACE'

type RegularAlphaKey = {
  text: string
  shiftText?: string
  specialKey?: AllSpecialKeys
}

type SpecialAlphaKey = { specialKey: AllSpecialKeys }
type AlphaKeys = (RegularAlphaKey | SpecialAlphaKey)[][]

// Types for all other Keyboards
type GridSpecialKeys = 'DEL' | 'ENTER' | 'SPACE'
type RegularKey = { text: string; specialKey?: GridSpecialKeys }
type SpecialKey = { specialKey: GridSpecialKeys }

type Keys = (RegularKey | SpecialKey)[]

export type { KeyboardType, RegularAlphaKey, AlphaKeys, Keys, AllSpecialKeys, GridSpecialKeys }
