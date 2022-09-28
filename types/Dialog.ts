type dialogOptions = {
  text: string
  open: boolean
  showSpinner: boolean
  leftBtnText?: string
  rightBtnText?: string
  leftBtnFn?: () => void
  rightBtnFn?: () => void
  hideOnLeftBtn?: boolean
  hideOnRightBtn?: boolean
}

export type { dialogOptions }
