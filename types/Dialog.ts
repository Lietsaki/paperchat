type dialogDebouncedActionNames = 'roomSearch' | 'retryRoomSearch' | 'retryJoinPrivateRoomAttempt'

type dialogOptions = {
  open: boolean
  text: string | JSX.Element
  largeDialog?: boolean
  showSpinner: boolean

  leftBtnText?: string
  leftBtnFn?: () => void
  hideOnLeftBtn?: boolean

  rightBtnText?: string
  rightBtnFn?: () => void
  hideOnRightBtn?: boolean

  rightBtnDebounce?: number
  rightBtnName?: dialogDebouncedActionNames
  rightBtnDebounceMounted?: boolean
}

type DialogProps = {
  text: string | JSX.Element
  showSpinner?: boolean
  largeDialog?: boolean

  leftBtnText?: string
  leftBtnFn?: () => void
  hideOnLeftBtn?: boolean

  rightBtnText?: string
  rightBtnFn?: () => void
  hideOnRightBtn?: boolean

  rightBtnDebounce?: number
  rightBtnName?: dialogDebouncedActionNames
  rightBtnDebounceMounted?: boolean
}

export type { dialogOptions, DialogProps, dialogDebouncedActionNames }
