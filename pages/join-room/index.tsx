import general_styles from 'styles/options-screen/options.module.scss'
import page_styles from 'styles/join-room/join-room.module.scss'
import PaperchatOctagon from 'components/PaperchatOctagon'
import JoinRoomInput from 'components/JoinRoomInput'
import Button from 'components/Button'
import { PRIVATE_CODE_LENGTH, requestJoinPrivateRoom } from 'firebase-config/realtimeDB'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { dialogOptions } from 'types/Dialog'
import { baseDialogData, shouldDisplayDialog } from 'components/Dialog'
import { playSound } from 'helpers/helperFunctions'

const {
  top,
  bottom,
  left_column,
  right_column,
  top_section,
  bottom_section,
  bottom_top,
  bottom_bottom,
  bottom_btn_container,
  dotted_border
} = general_styles

const { midsection } = page_styles

const JoinWithACode = () => {
  const router = useRouter()
  const [dialogData, setDialogData] = useState<dialogOptions>(baseDialogData)

  const join = async (code: string) => {
    if (!code || !code.trim()) return
    if (code.trim().length !== PRIVATE_CODE_LENGTH) return showCodeLengthDialog()
    showLoadingDialog()

    const roomIDAndCode = await requestJoinPrivateRoom(code)
    if (roomIDAndCode === 'error') return showErrorDialog()
    if (roomIDAndCode === 'not-found') return showNotFoundDialog()

    localStorage.setItem('retryJoinPrivateRoomAttempt', '0')
    setDialogData(baseDialogData)
    router.push(`private-room/${roomIDAndCode}`)
  }

  const showCodeLengthDialog = () => {
    setDialogData({
      open: true,
      text: `The code must have ${PRIVATE_CODE_LENGTH} characters.`,
      showSpinner: false,
      rightBtnFn: () => setDialogData(baseDialogData),
      rightBtnText: 'Accept'
    })
  }

  const showLoadingDialog = () => {
    setDialogData({
      open: true,
      text: 'Joining room...',
      showSpinner: true
    })
  }

  const showNotFoundDialog = () => {
    setDialogData({
      open: true,
      text: 'Room not found.',
      showSpinner: false,
      rightBtnFn: () => setDialogData(baseDialogData),
      rightBtnText: 'Accept'
    })
  }

  const showErrorDialog = () => {
    setDialogData({
      open: true,
      text: 'There was an error. Please try again later.',
      showSpinner: false,
      rightBtnFn: () => setDialogData(baseDialogData),
      rightBtnText: 'Accept'
    })
  }

  const goHome = () => {
    playSound('cancel', 0.5)
    router.push('/')
  }

  return (
    <div className="main">
      <div className="screens_section">
        <div className={`screen ${top}`}>
          <div className={left_column}>
            <div className={top_section}></div>
            <div className={dotted_border}></div>
            <div className=""></div>
            <div className={dotted_border}></div>
            <div className={bottom_section}></div>
          </div>
          <div className={right_column}>
            <PaperchatOctagon />
          </div>
        </div>

        <div className={`screen ${bottom}`}>
          <div className={bottom_top}>
            <p>Join a private room with an invitation code</p>
          </div>
          <div className={midsection}>
            <JoinRoomInput handleCodeSubmit={join} />
          </div>
          <div className={bottom_bottom}>
            <div className={bottom_btn_container}>
              <Button onClick={goHome} text="Cancel" />
            </div>
          </div>

          {shouldDisplayDialog(dialogData)}
        </div>
      </div>
    </div>
  )
}

export default JoinWithACode
