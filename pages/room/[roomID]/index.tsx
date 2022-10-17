import general_styles from 'styles/options-screen/options.module.scss'
import page_styles from 'styles/room/room.module.scss'
import btn_styles from 'styles/components/button.module.scss'
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
import emitter from 'helpers/MittEmitter'
import { useSelector } from 'react-redux'
import { selectUser } from 'store/slices/userSlice'
import {
  ROOMS_LIMIT,
  USERS_LIMIT,
  getMyRooms,
  setEnteredCreatedRoom,
  joinRoom,
  sendMessageToRoom,
  getRoomMessages,
  leaveRoom,
  getPrivateCode
} from 'firebase-config/realtimeDB'
import { dialogOptions } from 'types/Dialog'
import { baseDialogData, shouldDisplayDialog } from 'components/Dialog'
import Button from 'components/Button'

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
  close_btn,
  top_buttons_row
} = page_styles

const Room = () => {
  const defaultColor = 'hsla(204, 44%, 52%, 1.0)'
  const router = useRouter()
  const [roomUsers, setRoomUsers] = useState<string[]>([])
  const [usingPencil, setUsingPencil] = useState(true)
  const [usingThickStroke, setUsingThickStroke] = useState(true)
  const [currentKeyboard, setCurrentKeyboard] = useState<keyboard>('Alphanumeric')
  const [roomContent, setRoomContent] = useState<roomContent[]>([
    { paperchatOctagon: true, id: 'paperchat_octagon' }
  ])
  const [roomColor, setRoomColor] = useState(defaultColor)
  const [adjacentMessages, setAdjacentMessages] = useState({ up: '', down: '' })
  const [user] = useState(useSelector(selectUser))
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const [dialogData, setDialogData] = useState<dialogOptions>(baseDialogData)
  const [viewingUsers, setViewingUsers] = useState(false)
  const [roomPrivateCode, setRoomPrivateCode] = useState('')
  const [loadedRoom, setLoadedRoom] = useState(false)
  let roomCode = ''

  const clearCanvas = () => emitter.emit('clearCanvas', '')
  const typeKey = (key: string) => emitter.emit('typeKey', key)
  const typeSpace = () => emitter.emit('typeSpace', '')
  const typeEnter = () => emitter.emit('typeEnter', '')
  const typeDel = () => emitter.emit('typeDel', '')
  const sendMessage = () => emitter.emit('sendMessage', '')

  useEffect(() => {
    if (!router.query.roomID) return

    showLoadingDialog()
    const myRooms = getMyRooms()
    const roomData = myRooms ? myRooms[router.query.roomID as string] : null

    if (!myRooms || !roomData || (roomData && !roomData.enteringMessage)) {
      console.log('must join room')
      // 1) Check if the current room exists
      if (router.query.roomID.length !== 20) return showRoomNotFoundDialog()
      tryToJoinRoom(router.query.roomID as string)
    } else {
      console.log('created room')
      const { code, color, id, enteringMessage } = roomData
      roomCode = code[0]
      if (color && isValidColor(color)) setRoomColor(color)
      setRoomPrivateCode(getPrivateCode(router.query.roomID as string) || '')

      if (enteringMessage) {
        setRoomContent([
          ...roomContent,
          { animate: true, id: enteringMessage.localID, userEntering: enteringMessage.userEntering }
        ])
      }

      setRoomUsers([user.username])
      setDialogData(baseDialogData)
      setLoadedRoom(true)
      setEnteredCreatedRoom(id)
    }

    emitter.on('lostConnection', showLostConnectionDialog)
    emitter.on('backOnline', showBackOnlineDialog)
    emitter.on('disbandedRoom', showBackOnlineDisbandedDialog)

    return () => {
      emitter.off('disbandedRoom')
      emitter.off('backOnline')
      emitter.off('canvasData')
    }
  }, [router.isReady])

  useEffect(() => {
    return () => {
      if (loadedRoom) leaveRoom()
    }
  }, [loadedRoom])

  useEffect(() => createActiveColorClass(roomColor), [roomColor])

  useEffect(() => {
    emitter.on('canvasData', receiveCanvasData)
    emitter.on('receivedFirebaseMessages', receiveFirebaseMessages)
    setTimeout(() => scrollContent(), 100)

    return () => {
      emitter.off('canvasData')
      emitter.off('receivedFirebaseMessages')
    }
  }, [roomContent, loadedRoom])

  useEffect(() => {
    // Refresh user list in the user dialog
    if (viewingUsers) {
      setDialogData({
        open: true,
        largeDialog: true,
        text: getUserList(),
        showSpinner: false,
        rightBtnText: 'Accept',
        rightBtnFn: () => {
          setDialogData(baseDialogData)
          setViewingUsers(false)
        }
      })
    }
  }, [roomUsers])

  const tryToJoinRoom = async (roomID: string) => {
    const res = await joinRoom(roomID)

    if (res === '404') return showRoomNotFoundDialog(true)
    if (res === 'error') return showErrorDialog()
    if (res === 'full-room') return showFullRoomDialog()
    if (res === 'joined-already') return showJoinedAlreadyDialog()
    if (res === 'hit-rooms-limit') return showRoomsLimitDialog()
    if (res === 'invalid-code') return showRoomInvalidCodeDialog()

    const myRooms = getMyRooms()
    const roomData = myRooms![router.query.roomID as string]
    const { code, color } = roomData
    roomCode = code[0]
    if (color && isValidColor(color)) setRoomColor(color)
    setRoomPrivateCode(getPrivateCode(router.query.roomID as string) || '')
    checkForPreviousMessages()
  }

  const checkForPreviousMessages = async () => {
    const messages = await getRoomMessages()
    if (messages === 'error') return showErrorDialog()

    const parsedMessages = await Promise.all(messages.map((message) => parseToRoomContent(message)))

    setRoomContent([...roomContent, ...parsedMessages])
    setTimeout(() => scrollContent(), 300)
    setLoadedRoom(true)
    setDialogData(baseDialogData)
  }

  const scrollContent = () => {
    const container = document.getElementById('messages-container')
    container!.scroll({ top: container!.scrollHeight, behavior: 'smooth' })
  }

  const receiveFirebaseMessages = async (receivedMessages: firebaseMessage[]) => {
    if (!loadedRoom) return
    const updatedMessages = [...roomContent]
    type posToSplice = { [key: number]: Promise<roomContent> }
    const messagesToSplice: posToSplice = {}

    for (let i = 0; i < receivedMessages.length; i++) {
      const msg = receivedMessages[i]
      const msgInRoom = updatedMessages[i + 1] // account for the paperchat octagon

      // Check for possible duplicate messages
      if (updatedMessages.find((item) => item.id === msg.localID)) continue

      // Insert the latest received message
      if (i === receivedMessages.length - 1 && !msgInRoom) {
        updatedMessages.push(await parseToRoomContent(msg))
        break
      }

      // Check for previous messages we didn't sync (For example, if we lost our connection)
      if (msg.userEntering && !msgInRoom.userEntering) {
        updatedMessages.splice(i + 1, 0, {
          id: msg.localID,
          userEntering: msg.userEntering
        })
      }
      if (msg.userLeaving && !msgInRoom.userLeaving) {
        updatedMessages.splice(i + 1, 0, {
          id: msg.localID,
          userLeaving: msg.userLeaving
        })
      }

      // Messages with imageURL need to pre-load their images. Do so in an async function with Promise.all
      if (msg.imageURL && (!msgInRoom || !msgInRoom.message)) {
        messagesToSplice[i + 1] = parseToRoomContent(msg)
      }
    }

    const messagesToSpliceVals = Object.values(messagesToSplice)

    if (messagesToSpliceVals.length) {
      const spliceVals = await Promise.all(messagesToSpliceVals)
      const spliceKeys = Object.keys(messagesToSplice)

      for (let i = 0; i < spliceKeys.length; i++) {
        updatedMessages.splice(Number(spliceKeys[i]), 0, spliceVals[i])
      }
    }

    setRoomContent(updatedMessages)
  }

  const parseToRoomContent = async (message: firebaseMessage) => {
    const { imageURL, userEntering, userLeaving, localID, color } = message

    const roomMessage: roomContent = { id: localID }
    let messageHeight = 0

    if (userEntering || userLeaving) {
      if (userEntering) {
        roomMessage.userEntering = userEntering
        setRoomUsers([...roomUsers, userEntering])
      }

      if (userLeaving) {
        roomMessage.userLeaving = userLeaving

        // Filter this way to remove only the first occurrence of a name (in case there are users with the same name)
        const i = roomUsers.findIndex((user) => user === userLeaving)
        const filteredUsers = [...roomUsers]
        filteredUsers.splice(i, 1)
        setRoomUsers(filteredUsers)
      }

      messageHeight = window.innerWidth > 500 ? 43 : 28
    }

    if (imageURL && color) {
      roomMessage.message = imageURL
      roomMessage.color = color

      const img = await getImageData(imageURL)
      messageHeight = img.height
    }

    roomMessage.animate = !willContainerBeOverflowed(
      messagesContainerRef.current!,
      0,
      4.5,
      messageHeight
    )

    return roomMessage
  }

  const receiveCanvasData = ({ dataUrl, height }: canvasData) => {
    const messagesWillTriggerScroll = willContainerBeOverflowed(
      messagesContainerRef.current!,
      0,
      4,
      height
    )
    const localID = getSimpleId()
    sendMessageToRoom(dataUrl, localID, roomColor)

    setRoomContent([
      ...roomContent,
      { message: dataUrl, id: localID, animate: !messagesWillTriggerScroll, color: roomColor }
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
  }

  const copyLastCanvas = () => {
    const roomMessages = roomContent.filter((item) => item.message)
    if (!roomMessages.length) return
    const lastMessage = roomMessages[roomMessages.length - 1]
    emitter.emit('canvasToCopy', lastMessage.message!)
  }

  const getRoomLinkButton = () => {
    if (roomPrivateCode) {
      return (
        <Button
          classes={btn_styles.room_top_row_btn}
          text={`Get Room Code`}
          onClick={showPrivateCodeDialog}
        />
      )
    }

    return (
      <Button
        classes={btn_styles.room_top_row_btn}
        text={`Get Room Link`}
        onClick={() => router.push('/')}
      />
    )
  }

  const showLoadingDialog = () => {
    setDialogData({
      open: true,
      text: 'Loading...',
      showSpinner: true
    })
  }

  const showErrorDialog = () => {
    setDialogData({
      open: true,
      text: 'There was an error.',
      showSpinner: false,
      rightBtnText: 'Go home',
      rightBtnFn: () => router.push('/')
    })
  }

  const showFullRoomDialog = () => {
    setDialogData({
      open: true,
      text: 'Sorry, but the room is full.',
      showSpinner: false,
      rightBtnText: 'Go home',
      rightBtnFn: () => router.push('/')
    })
  }

  const showJoinedAlreadyDialog = () => {
    setDialogData({
      open: true,
      text: "You're already in this room",
      showSpinner: false,
      rightBtnText: 'Go home',
      rightBtnFn: () => router.push('/')
    })
  }

  const showRoomsLimitDialog = () => {
    setDialogData({
      open: true,
      text: `You can be in up to ${ROOMS_LIMIT} rooms at the same time.`,
      showSpinner: false,
      rightBtnText: 'Go home',
      rightBtnFn: () => router.push('/')
    })
  }

  const showRoomInvalidCodeDialog = () => {
    setDialogData({
      open: true,
      text: 'Invalid code, please try again.',
      showSpinner: false,
      rightBtnText: 'Go home',
      rightBtnFn: () => router.push('/')
    })
  }

  const showRoomNotFoundDialog = (addMaybe?: boolean) => {
    setDialogData({
      open: true,
      text: addMaybe ? 'Room not found. Maybe it was disbanded.' : 'Room not found.',
      showSpinner: false,
      rightBtnText: 'Go home',
      rightBtnFn: () => router.push('/')
    })
  }

  const showAskExitRoomDialog = () => {
    setDialogData({
      open: true,
      text: 'Leave room?',
      showSpinner: false,
      leftBtnText: 'Cancel',
      rightBtnText: 'Accept',
      rightBtnFn: () => {
        setDialogData(baseDialogData)
        router.push('/')
      },
      leftBtnFn: () => {
        setDialogData(baseDialogData)
      }
    })
  }

  const showLostConnectionDialog = () => {
    setDialogData({
      open: true,
      text: 'Connection lost. Reconnecting...',
      showSpinner: true
    })
  }

  const showBackOnlineDialog = () => {
    setDialogData({
      open: true,
      text: 'Back online!',
      showSpinner: false
    })
    setTimeout(() => {
      setDialogData(baseDialogData)
      setTimeout(() => scrollContent(), 200)
    }, 2000)
  }

  const showBackOnlineDisbandedDialog = () => {
    setDialogData({
      open: true,
      text: 'Back online. Your room was disbanded since it was empty.',
      showSpinner: false,
      rightBtnText: 'Go home',
      rightBtnFn: () => router.push('/')
    })
  }

  const getUserList = () => {
    return (
      <div className="user_list">
        <div className="title">
          Room users ({roomUsers.length}/{USERS_LIMIT})
        </div>

        <ol className="scrollify">
          {roomUsers.map((user, i) => (
            <li key={i}>{user}</li>
          ))}
        </ol>
      </div>
    )
  }

  const showUsersDialog = () => {
    setViewingUsers(true)
    setDialogData({
      open: true,
      largeDialog: true,
      text: getUserList(),
      showSpinner: false,
      rightBtnText: 'Accept',
      rightBtnFn: () => {
        setDialogData(baseDialogData)
        setViewingUsers(false)
      }
    })
  }

  const showPrivateCodeDialog = () => {
    setDialogData({
      open: true,
      text: 'hey! ' + roomPrivateCode,
      showSpinner: false,
      rightBtnText: 'Accept',
      rightBtnFn: () => setDialogData(baseDialogData)
    })
  }

  return (
    <div className="main">
      <div className="screens_section">
        <div className={`screen ${top}`}>
          <div className={left_column}>
            <div className={top_section}></div>
            <ContentIndicator roomContent={roomContent} setAdjacentMessages={setAdjacentMessages} />
            <div className={bottom_section}></div>
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

          <div className={top_buttons_row}>
            {getRoomLinkButton()}

            <Button
              classes={btn_styles.room_top_row_btn}
              text={`Room users (${roomUsers.length}/${USERS_LIMIT})`}
              onClick={showUsersDialog}
            />

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
