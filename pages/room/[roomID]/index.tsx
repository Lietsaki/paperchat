import general_styles from 'styles/options-screen/options.module.scss'
import page_styles from 'styles/room/room.module.scss'
import PaperchatOctagon from 'components/PaperchatOctagon'
import UserInfoOctagon from 'components/room/UserInfoOctagon'
import MessageOctagon from 'components/room/MessageOctagon'
import Keyboard from 'components/Keyboard'
import Canvas from 'components/Canvas'
import ContentIndicator from 'components/room/ContentIndicator'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import {
  getSimpleId,
  createActiveColorClass,
  willContainerBeOverflowed,
  getImageData,
  isValidColor
} from 'helpers/helperFunctions'
import { keyboard } from 'types/Keyboard'
import { roomContent, canvasData, firebaseMessage } from 'types/Room'
import { dialogOptions } from 'types/Dialog'
import emitter from 'helpers/MittEmitter'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser } from 'store/slices/userSlice'
import {
  getRoomData,
  startMessageListener,
  sendMessageToRoom,
  getRoomMessages,
  leaveRoom
} from 'firebase-config/realtimeDB'
import Dialog from 'components/Dialog'

const { top, left_column, right_column, top_section, bottom_section } = general_styles

const {
  bottom,
  tools_column,
  canvas_column,
  canvas_area,
  canvas_bg,
  keyboard_area,
  top_arrow,
  down_arrow,
  send_buttons,
  send_buttons_bg,
  send,
  last_canvas,
  tool_container,
  active,
  active_on_click,
  pixelated_top_left,
  pencil,
  eraser,
  thick_stroke,
  thin_stroke,
  margin_bottom_sm,
  close_btn
} = page_styles

const Room = () => {
  const defaultColor = 'hsla(204, 44%, 52%, 1.0)'
  const router = useRouter()
  const [usingPencil, setUsingPencil] = useState(true)
  const [usingThickStroke, setUsingThickStroke] = useState(true)
  const [currentKeyboard, setCurrentKeyboard] = useState<keyboard>('Alphanumeric')
  const [roomContent, setRoomContent] = useState<roomContent[]>([
    { paperchatOctagon: true, id: 'paperchat_octagon' }
  ])
  const [roomColor, setRoomColor] = useState(defaultColor)
  const [user] = useState(useSelector(selectUser))
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const baseDialogData = { text: '', open: false, showSpinner: false }
  const [dialogData, setDialogData] = useState<dialogOptions>(baseDialogData)
  let roomCode = ''

  const clearCanvas = () => emitter.emit('clearCanvas', '')
  const typeKey = (key: string) => emitter.emit('typeKey', key)
  const typeSpace = () => emitter.emit('typeSpace', '')
  const typeEnter = () => emitter.emit('typeEnter', '')
  const typeDel = () => emitter.emit('typeDel', '')
  const sendMessage = () => emitter.emit('sendMessage', '')

  useEffect(() => {
    showLoadingDialog()
    const createdRoomData = getRoomData()
    if (!createdRoomData) {
      console.log('HANDLE CURRENT EMPTY CURRENT ROOM')
      return
    }
    const { code, color } = createdRoomData
    roomCode = code
    if (color && isValidColor(color)) setRoomColor(color)

    const checkForPreviousMessages = async () => {
      const messages: firebaseMessage[] = await getRoomMessages()
      const parsedMessages = await Promise.all(
        messages.map((message) => parseToRoomContent(message, true))
      )
      setRoomContent([...roomContent, ...parsedMessages])
      setTimeout(() => scrollContent(), 200)
      startMessageListener()
      setDialogData(baseDialogData)
    }
    checkForPreviousMessages()
  }, [])

  useEffect(() => createActiveColorClass(roomColor), [roomColor])

  useEffect(() => {
    emitter.on('canvasData', receiveCanvasData)
    emitter.on('receivedFirebaseMessage', receiveFirebaseMessage)
    setTimeout(() => scrollContent(), 100)

    return () => {
      emitter.off('canvasData')
      emitter.off('receivedFirebaseMessage')
    }
  }, [roomContent])

  const scrollContent = () => {
    const container = document.querySelector(`.${right_column}`)
    container!.scroll({ top: container!.scrollHeight, behavior: 'smooth' })
  }

  const parseToRoomContent = async (message: firebaseMessage, animate?: boolean) => {
    const { imageURL, userEntering, userLeaving, localID } = message

    const roomMessage: roomContent = { id: localID }

    let messageHeight = 0

    if (userEntering || userLeaving) {
      if (userEntering) roomMessage.userEntering = userEntering
      if (userLeaving) roomMessage.userLeaving = userLeaving
      messageHeight = window.innerWidth > 500 ? 43 : 28
    }

    if (imageURL) {
      roomMessage.message = imageURL
      const img = await getImageData(imageURL)
      messageHeight = img.height
    }

    roomMessage.animate =
      animate !== undefined
        ? animate
        : !willContainerBeOverflowed(messagesContainerRef.current!, 0, 4.5, messageHeight)

    return roomMessage
  }

  const receiveFirebaseMessage = async (receivedMessage: firebaseMessage) => {
    const isAlreadyPresent = roomContent.find((item) => item.id === receivedMessage.localID)
    if (isAlreadyPresent) return

    const roomMessage = await parseToRoomContent(receivedMessage)
    setRoomContent([...roomContent, roomMessage])
  }

  const receiveCanvasData = ({ dataUrl, height }: canvasData) => {
    const messagesWillTriggerScroll = willContainerBeOverflowed(
      messagesContainerRef.current!,
      0,
      4.5,
      height
    )
    const localID = getSimpleId()
    sendMessageToRoom(dataUrl, localID)

    setRoomContent([
      ...roomContent,
      { message: dataUrl, id: localID, animate: !messagesWillTriggerScroll }
    ])
  }

  const getRoomContent = () => {
    return roomContent.map((item, i) => {
      if (item.userEntering || item.userLeaving) {
        return (
          <UserInfoOctagon
            key={item.id}
            id={item.id}
            userEntering={item.userEntering}
            userLeaving={item.userLeaving}
            shouldAnimate={!!item.animate}
          />
        )
      }

      if (item.message) {
        return (
          <MessageOctagon
            key={item.id}
            id={item.id}
            img_uri={item.message}
            color={roomColor}
            shouldAnimate={!!item.animate}
          />
        )
      }

      if (item.paperchatOctagon) {
        return <PaperchatOctagon key={item.id} id={item.id} />
      }
    })
  }

  const shouldDisplayDialog = () => {
    if (!dialogData.open) return
    const { text, showSpinner, onOk, onCancel } = dialogData

    return (
      <div className="dialog_container">
        <Dialog text={text} showSpinner={showSpinner} onOk={onOk} onCancel={onCancel} />
      </div>
    )
  }

  const showLoadingDialog = () => {
    setDialogData({
      open: true,
      text: 'Loading...',
      showSpinner: true
    })
  }

  const showAskExitRoomDialog = () => {
    setDialogData({
      open: true,
      text: 'Leave room?',
      showSpinner: false,
      onCancel: () => {
        setTimeout(() => {
          setDialogData(baseDialogData)
        }, 400)
      },
      onOk: () => exitRoom()
    })
  }

  const exitRoom = () => {
    leaveRoom()

    // router.push('/')
  }

  return (
    <div className="main">
      <div className="screens_section">
        <div className={`screen ${top}`}>
          <div className={left_column}>
            <div className={top_section}></div>
            <ContentIndicator roomContent={roomContent} />
            <div className={bottom_section}></div>
          </div>

          <div ref={messagesContainerRef} className={`${right_column}`}>
            {getRoomContent()}
          </div>
        </div>

        <div className={`screen ${bottom}`}>
          <div className={tools_column}>
            <div className={`${tool_container} ${top_arrow} ${active_on_click}`}>
              <img src="/tool-buttons/top-arrow.png" alt="top arrow button" />
              <div className="active_color"></div>
            </div>

            <div className={`${tool_container} ${down_arrow} ${active_on_click}`}>
              <img
                src="/tool-buttons/down-arrow.png"
                alt="down arrow button"
                className={active_on_click}
              />
              <div className="active_color"></div>
            </div>

            <div
              className={`${tool_container} ${pencil} ${usingPencil ? active : ''}`}
              onClick={() => setUsingPencil(true)}
            >
              <img src={`/tool-buttons/pencil.png`} alt="pencil button" />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${eraser} ${!usingPencil ? active : ''}`}
              onClick={() => setUsingPencil(false)}
            >
              <img src={`/tool-buttons/eraser.png`} alt="eraser button" />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${thick_stroke} ${usingThickStroke ? active : ''}`}
              onClick={() => setUsingThickStroke(true)}
            >
              <img src={`/tool-buttons/thick-stroke.png`} alt="thick stroke button" />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${thin_stroke} ${!usingThickStroke ? active : ''}`}
              onClick={() => setUsingThickStroke(false)}
            >
              <img src={`/tool-buttons/thin-stroke.png`} alt="thin stroke button" />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${margin_bottom_sm}  ${
                currentKeyboard === 'Alphanumeric' ? active : ''
              }`}
              onClick={() => setCurrentKeyboard('Alphanumeric')}
            >
              <img src={`/tool-buttons/alphanumeric.png`} alt="alphanumeric button" />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${margin_bottom_sm} ${
                currentKeyboard === 'Accents' ? active : ''
              }`}
              onClick={() => setCurrentKeyboard('Accents')}
            >
              <img src={`/tool-buttons/accents.png`} alt="accents button" />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${margin_bottom_sm} ${
                currentKeyboard === 'Symbols' ? active : ''
              }`}
              onClick={() => setCurrentKeyboard('Symbols')}
            >
              <img src={`/tool-buttons/symbols.png`} alt="symbols button" />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${
                currentKeyboard === 'Smileys' ? active : ''
              }`}
              onClick={() => setCurrentKeyboard('Smileys')}
            >
              <img src={`/tool-buttons/smileys.png`} alt="smileys button" />
              <div className="active_color bright"></div>
            </div>
          </div>

          <div className={`${close_btn} ${active_on_click}`} onClick={showAskExitRoomDialog}>
            <img src="/tool-buttons/close.png" alt="close button" />
            <div className="active_color bright"></div>
          </div>

          <div className={canvas_column}>
            <div className={canvas_area}>
              <div className={canvas_bg}>
                <Canvas
                  username={user.username}
                  usingPencil={usingPencil}
                  roomColor={roomColor}
                  usingThickStroke={usingThickStroke}
                />
              </div>

              <div className={keyboard_area}>
                <Keyboard
                  typeKey={typeKey}
                  typeSpace={typeSpace}
                  typeEnter={typeEnter}
                  typeDel={typeDel}
                  currentKeyboard={currentKeyboard}
                />
              </div>

              <div className={send_buttons}>
                <div className={send_buttons_bg}>
                  <div onClick={sendMessage} className={`${send} ${active_on_click}`}>
                    <img src="/send-buttons/SEND.png" alt="send button" />
                    <img
                      src="/send-buttons/active/SEND.png"
                      alt="active send button"
                      className={active}
                    />
                  </div>
                  <div className={`${last_canvas} ${active_on_click}`}>
                    <img src="/send-buttons/LAST-CANVAS.png" alt="last canvas button" />
                    <img
                      src="/send-buttons/active/LAST-CANVAS.png"
                      alt="active last canvas button"
                      className={active}
                    />
                  </div>
                  <div className={`${active_on_click}`} onClick={clearCanvas}>
                    <img src="/send-buttons/CLEAR.png" alt="clear button" />
                    <img
                      src="/send-buttons/active/CLEAR.png"
                      alt="active clear button"
                      className={active}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {shouldDisplayDialog()}
        </div>
      </div>
    </div>
  )
}

export default Room
