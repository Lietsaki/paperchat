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
const SHARE_LINK_DIALOG = 'share_link_dialog'
const USER_LIST_DIALOG = 'user_list_dialog'
const EXIT_ROOM_DIALOG = 'exit_room_dialog'

export type { DialogProps, DialogDebouncedActionNames }
export { LANGUAGES_DIALOG, SHARE_LINK_DIALOG, USER_LIST_DIALOG, EXIT_ROOM_DIALOG }
