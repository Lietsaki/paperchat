type dialogDebouncedActionNames = 'roomSearch' | 'retryRoomSearch' | 'retryJoinPrivateRoomAttempt'

type dialogOptions = {
  open: boolean
  text: string
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
  text: string
  showSpinner?: boolean

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
