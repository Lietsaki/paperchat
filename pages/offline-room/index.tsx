import general_styles from 'styles/options-screen/options.module.scss'
import page_styles from 'styles/room/room.module.scss'
import MuteSoundsButton from 'components/MuteSoundsButton'
import PaperchatOctagon from 'components/PaperchatOctagon'
import UserInfoOctagon from 'components/room/UserInfoOctagon'
import MessageOctagon from 'components/room/MessageOctagon'
import Keyboard from 'components/Keyboard'
import Canvas from 'components/Canvas'
import ContentIndicator from 'components/room/ContentIndicator'
import ConnectionIndicator from 'components/room/ConnectionIndicator'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import {
  getSimpleId,
  createActiveColorClass,
  willContainerBeOverflowed,
  getRandomColor,
  playSound
} from 'helpers/helperFunctions'
import { keyboard } from 'types/Keyboard'
import { roomContent, canvasData } from 'types/Room'
import emitter from 'helpers/MittEmitter'
import { useSelector } from 'react-redux'
import { selectUser } from 'store/slices/userSlice'
import { dialogOptions } from 'types/Dialog'
import { baseDialogData, shouldDisplayDialog } from 'components/Dialog'

const { top, left_column, right_column, top_section, bottom_section, dotted_border } =
  general_styles

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
  close_btn,
  top_buttons_row,
  code_badge,
  letter
} = page_styles

const Room = () => {
  const router = useRouter()
  const [usingPencil, setUsingPencil] = useState(true)
  const [usingThickStroke, setUsingThickStroke] = useState(true)
  const [currentKeyboard, setCurrentKeyboard] = useState<keyboard>('Alphanumeric')
  const [roomContent, setRoomContent] = useState<roomContent[]>([
    { paperchatOctagon: true, id: 'paperchat_octagon' }
  ])
  const [roomColor] = useState(getRandomColor())
  const [adjacentMessages, setAdjacentMessages] = useState({ up: '', down: '' })
  const [user] = useState(useSelector(selectUser))
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const [dialogData, setDialogData] = useState<dialogOptions>(baseDialogData)
  const [roomCode] = useState('A')

  const clearCanvas = () => emitter.emit('clearCanvas', '')
  const typeKey = (key: string) => emitter.emit('typeKey', key)
  const typeSpace = () => emitter.emit('typeSpace', '')
  const typeEnter = () => emitter.emit('typeEnter', '')
  const typeDel = () => emitter.emit('typeDel', '')
  const sendMessage = () => emitter.emit('sendMessage', '')

  useEffect(() => {
    setRoomContent([
      ...roomContent,
      { animate: true, id: getSimpleId(), userEntering: user.username }
    ])

    playEnteredSound()
    setDialogData(baseDialogData)
  }, [])

  useEffect(() => createActiveColorClass(roomColor), [roomColor])

  useEffect(() => {
    emitter.on('canvasData', receiveCanvasData)
    setTimeout(() => scrollContent(), 100)

    return () => {
      emitter.off('canvasData')
    }
  }, [roomContent])

  const scrollContent = () => {
    const container = document.getElementById('messages-container')
    container!.scroll({ top: container!.scrollHeight, behavior: 'smooth' })
  }

  const receiveCanvasData = ({ dataUrl, height }: canvasData) => {
    const messagesWillTriggerScroll = willContainerBeOverflowed(
      messagesContainerRef.current!,
      0,
      4,
      height
    )

    setRoomContent([
      ...roomContent,
      { message: dataUrl, id: getSimpleId(), animate: !messagesWillTriggerScroll, color: roomColor }
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

      if (item.message && item.color) {
        return (
          <MessageOctagon
            key={item.id}
            id={item.id}
            color={item.color}
            img_uri={item.message}
            shouldAnimate={!!item.animate}
          />
        )
      }

      if (item.paperchatOctagon) {
        return <PaperchatOctagon key={item.id} id={item.id} />
      }
    })
  }

  const scrollToAdjacent = (to: 'up' | 'down') => {
    if (!adjacentMessages[to]) return
    const margin = 4
    const target = document.getElementById(adjacentMessages[to])!
    let offsetTop = target.offsetTop - messagesContainerRef.current!.offsetTop

    // Offset top will scroll to the top of the target message
    if (to === 'up') {
      offsetTop -= margin
    } else {
      // Make sure messages are not scrolled to the top when using "down", they
      // must be at the bottom of the container.
      offsetTop -= messagesContainerRef.current!.clientHeight - target.offsetHeight - margin
    }

    messagesContainerRef.current!.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
    playSound('move-messages', 0.2)
  }

  const copyLastCanvas = () => {
    const roomMessages = roomContent.filter((item) => item.message)
    if (!roomMessages.length) return playSound('right-btn-denied', 0.4)
    const lastMessage = roomMessages[roomMessages.length - 1]
    emitter.emit('canvasToCopy', lastMessage.message!)
  }

  const showAskExitRoomDialog = () => {
    playSound('cancel', 0.5)

    setDialogData({
      open: true,
      text: 'Leave room?',
      showSpinner: false,
      leftBtnText: 'Cancel',
      rightBtnText: 'Accept',
      rightBtnFn: () => {
        playSound('leave-room', 0.3)
        setDialogData(baseDialogData)
        router.push('/')
      },
      leftBtnFn: () => {
        setDialogData(baseDialogData)
      }
    })
  }

  const playEnteredSound = () => {
    playSound('entering-room')
  }

  const selectKeyboard = (newKeyboard: keyboard) => {
    playSound('select-keyboard', 0.1)
    setCurrentKeyboard(newKeyboard)
  }

  const selectPencil = () => {
    setUsingPencil(true)
    playSound('select-pencil', 0.2)
  }

  const selectEraser = () => {
    setUsingPencil(false)
    playSound('select-eraser', 0.1)
  }

  const selectThickStroke = () => {
    setUsingThickStroke(true)
    playSound('select-thick-stroke', 0.2)
  }

  const selectThinStroke = () => {
    setUsingThickStroke(false)
    playSound('select-thin-stroke', 0.15)
  }

  return (
    <div className="main">
      <div className="screens_section">
        <div className={`screen ${top}`}>
          <div className={left_column}>
            <div className={top_section}>
              <ConnectionIndicator offlineMode />
            </div>
            <div className={dotted_border}></div>
            <ContentIndicator roomContent={roomContent} setAdjacentMessages={setAdjacentMessages} />
            <div className={dotted_border}></div>
            <div className={bottom_section}>
              <div className={code_badge}>
                <div className={letter}>{roomCode}</div>
              </div>
            </div>
          </div>

          <div ref={messagesContainerRef} className={`${right_column}`} id="messages-container">
            {getRoomContent()}
          </div>
        </div>

        <div className={`screen ${bottom}`}>
          <div className={tools_column}>
            <div
              className={`${tool_container} ${top_arrow} ${active_on_click}`}
              onClick={() => scrollToAdjacent('up')}
            >
              <img src="/tool-buttons/top-arrow.png" alt="top arrow button" />
              <div className="active_color"></div>
            </div>

            <div
              className={`${tool_container} ${down_arrow} ${active_on_click}`}
              onClick={() => scrollToAdjacent('down')}
            >
              <img
                src="/tool-buttons/down-arrow.png"
                alt="down arrow button"
                className={active_on_click}
              />
              <div className="active_color"></div>
            </div>

            <div
              className={`${tool_container} ${pencil} ${usingPencil ? active : ''}`}
              onClick={() => selectPencil()}
            >
              <img src={`/tool-buttons/pencil.png`} alt="pencil button" />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${eraser} ${!usingPencil ? active : ''}`}
              onClick={() => selectEraser()}
            >
              <img src={`/tool-buttons/eraser.png`} alt="eraser button" />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${thick_stroke} ${usingThickStroke ? active : ''}`}
              onClick={() => selectThickStroke()}
            >
              <img src={`/tool-buttons/thick-stroke.png`} alt="thick stroke button" />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${thin_stroke} ${!usingThickStroke ? active : ''}`}
              onClick={() => selectThinStroke()}
            >
              <img src={`/tool-buttons/thin-stroke.png`} alt="thin stroke button" />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${margin_bottom_sm}  ${
                currentKeyboard === 'Alphanumeric' ? active : ''
              }`}
              onClick={() => selectKeyboard('Alphanumeric')}
            >
              <img src={`/tool-buttons/alphanumeric.png`} alt="alphanumeric button" />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${margin_bottom_sm} ${
                currentKeyboard === 'Accents' ? active : ''
              }`}
              onClick={() => selectKeyboard('Accents')}
            >
              <img src={`/tool-buttons/accents.png`} alt="accents button" />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${margin_bottom_sm} ${
                currentKeyboard === 'Symbols' ? active : ''
              }`}
              onClick={() => selectKeyboard('Symbols')}
            >
              <img src={`/tool-buttons/symbols.png`} alt="symbols button" />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${
                currentKeyboard === 'Smileys' ? active : ''
              }`}
              onClick={() => selectKeyboard('Smileys')}
            >
              <img src={`/tool-buttons/smileys.png`} alt="smileys button" />
              <div className="active_color bright"></div>
            </div>
          </div>

          <div className={top_buttons_row}>
            <MuteSoundsButton useSmallVersion />

            <div className={`${close_btn} ${active_on_click}`} onClick={showAskExitRoomDialog}>
              <img src="/tool-buttons/close.png" alt="close button" />
              <div className="active_color bright"></div>
            </div>
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
                  <div className={`${last_canvas} ${active_on_click}`} onClick={copyLastCanvas}>
                    <img src="/send-buttons/LAST-CANVAS.png" alt="last message button" />
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

          {shouldDisplayDialog(dialogData)}
        </div>
      </div>
    </div>
  )
}

export default Room