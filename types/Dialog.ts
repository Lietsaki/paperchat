import { JSX } from 'react'

type DialogDebouncedActionNames = 'roomSearch' | 'retryRoomSearch' | 'retryJoinPrivateRoomAttempt'

type DialogOptions = {
  open: boolean
  text: string | JSX.Element
  largeDialog?: boolean
  skipSmallCnText?: boolean
  showSpinner: boolean

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

type DialogProps = {
  text: string | JSX.Element
  showSpinner?: boolean
  largeDialog?: boolean
  skipSmallCnText?: boolean

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

export type { DialogOptions, DialogProps, DialogDebouncedActionNames }
