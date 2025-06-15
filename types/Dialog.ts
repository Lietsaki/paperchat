import { JSX } from 'react'

type DialogDebouncedActionNames = 'roomSearch' | 'retryRoomSearch' | 'retryJoinPrivateRoomAttempt'

type DialogProps = {
  open: boolean
  dialogName?: string
  text: string | JSX.Element
  showSpinner?: boolean
  largeDialog?: boolean
  skipSmallJaText?: boolean

  leftBtnText?: string
  leftBtnFn?: () => void
  hideOnLeftBtn?: boolean

  rightBtnText?: string
  rightBtnFn?: () => void
  hideOnRightBtn?: boolean

  rightBtnDebounce?: number
  rightBtnName?: DialogDebouncedActionNames
  rightBtnDebounceMounted?: boolean
}

const LANGUAGES_DIALOG = 'languages_dialog'
const BASE_DIALOG = 'base_dialog'

export type { DialogProps, DialogDebouncedActionNames }
export { LANGUAGES_DIALOG, BASE_DIALOG }
