import general_styles from 'styles/options-screen/options.module.scss'
import page_styles from 'styles/room/room.module.scss'
import home_styles from 'styles/home/home.module.scss'
import btn_styles from 'styles/components/button.module.scss'
import MuteSoundsButton from 'components/MuteSoundsButton'
import PaperchatOctagon from 'components/PaperchatOctagon'
import UserInfoOctagon from 'components/room/UserInfoOctagon'
import MessageOctagon from 'components/room/MessageOctagon'
import Keyboard from 'components/Keyboard'
import Canvas from 'components/Canvas'
import ContentIndicator from 'components/room/ContentIndicator'
import ConnectionIndicator from 'components/room/ConnectionIndicator'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef, FormEvent } from 'react'
import {
  getSimpleId,
  createActiveColorClass,
  willContainerBeOverflowed,
  getImageData,
  getRandomColor,
  playSound
} from 'helpers/helperFunctions'
import { keyboard } from 'types/Keyboard'
import { roomContent, canvasData, firebaseMessage } from 'types/Room'
import emitter from 'helpers/MittEmitter'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, setUsername } from 'store/slices/userSlice'
import {
  SIMULTANEOUS_ROOMS_LIMIT,
  USERS_LIMIT,
  getCurrentRoomData,
  joinRoom,
  sendMessageToRoom,
  getRoomMessages,
  leaveRoom
} from 'firebase-config/realtimeDB'
import { usernameMinLength, usernameMaxLength } from 'store/initializer'
import { dialogOptions } from 'types/Dialog'
import { baseDialogData, shouldDisplayDialog } from 'components/Dialog'
import Button from 'components/Button'
import UsernameInput from 'components/UsernameInput'
import getRandomUsername from 'helpers/username-generator/usernameGenerator'

const {
  username_form,
  username_input,
  editing_username,
  save_username_btn_container,
  skip_username_animation
} = home_styles

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
  const user = useSelector(selectUser)
  const [roomUsers, setRoomUsers] = useState<string[]>([])
  const [usingPencil, setUsingPencil] = useState(true)
  const [usingThickStroke, setUsingThickStroke] = useState(true)
  const [currentKeyboard, setCurrentKeyboard] = useState<keyboard>('Alphanumeric')
  const [roomContent, setRoomContent] = useState<roomContent[]>([
    { paperchatOctagon: true, id: 'paperchat_octagon' }
  ])
  const [roomColor] = useState(getRandomColor())
  const [adjacentMessages, setAdjacentMessages] = useState({ up: '', down: '' })
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()

  const [dialogData, setDialogData] = useState<dialogOptions>(baseDialogData)
  const [viewingUsers, setViewingUsers] = useState(false)
  const [mustSetUsername, setMustSetUsername] = useState(false)
  const [loadedRoom, setLoadedRoom] = useState(false)
  const [roomCode, setRoomCode] = useState('?')

  const [usernameInputValue, setUsernameInputValue] = useState('')
  const [usernameBeingEdited, setUsernameBeingEdited] = useState('')

  const clearCanvas = () => emitter.emit('clearCanvas', '')
  const typeKey = (key: string) => emitter.emit('typeKey', key)
  const typeSpace = () => emitter.emit('typeSpace', '')
  const typeEnter = () => emitter.emit('typeEnter', '')
  const typeDel = () => emitter.emit('typeDel', '')
  const sendMessage = () => emitter.emit('sendMessage', '')

  useEffect(() => {
    if (!router.query.roomID) return
    showLoadingDialog()
    const savedUsername = localStorage.getItem('username')

    if (!savedUsername) {
      const randomUsername = getRandomUsername()
      setMustSetUsername(true)
      setUsernameInputValue(randomUsername)
      setUsernameBeingEdited(randomUsername)
      setDialogData(baseDialogData)
    } else {
      dispatch(setUsername(savedUsername.substring(0, usernameMaxLength).trim()))
      initializeRoom(router.query.roomID as string)
    }

    emitter.on('lostConnection', showLostConnectionDialog)
    emitter.on('backOnline', showBackOnlineDialog)
    emitter.on('disbandedRoom', showBackOnlineDisbandedDialog)
    emitter.on('otherError', showErrorDialog)

    return () => {
      emitter.off('lostConnection')
      emitter.off('backOnline')
      emitter.off('disbandedRoom')
      emitter.off('otherError')
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
    // Refresh user list in the user dialog if it's open
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

  const initializeRoom = (id: string) => {
    const currentRoom = getCurrentRoomData()

    if (!currentRoom.code) {
      console.log('must join room')
      if (id.length !== 20) return showRoomNotFoundDialog()
      tryToJoinRoom(id)
    } else {
      console.log('created room')
      checkForPreviousMessages(currentRoom.code)
    }
  }

  const tryToJoinRoom = async (roomID: string) => {
    if (!router.query.code) return showMissingCodeDialog()

    if (typeof router.query.code !== 'string' || router.query.code.length !== 5) {
      return showRoomInvalidCodeDialog()
    }

    const res = await joinRoom(roomID, router.query.code)
    const currentRoom = getCurrentRoomData()

    if (res === '404') return showRoomNotFoundDialog(true)
    if (res === 'full-room') return showFullRoomDialog()
    if (res === 'joined-already') return showJoinedAlreadyDialog()
    if (res === 'hit-rooms-limit') return showRoomsLimitDialog()
    if (res === 'invalid-code') return showRoomInvalidCodeDialog()
    if (res === 'error' || !currentRoom.code) return showErrorDialog()

    checkForPreviousMessages(currentRoom.code)
  }

  const checkForPreviousMessages = async (code: string) => {
    const messages = await getRoomMessages()
    if (messages === 'error') return showErrorDialog()

    setRoomCode(code)
    await receiveFirebaseMessages(messages)
    setTimeout(() => scrollContent(), 300)
    setLoadedRoom(true)
    playEnteredSound()
    setDialogData(baseDialogData)
  }

  const scrollContent = () => {
    const container = document.getElementById('messages-container')
    container!.scroll({ top: container!.scrollHeight, behavior: 'smooth' })
  }

  const receiveFirebaseMessages = async (receivedMessages: firebaseMessage[]) => {
    const parsedMessages = await Promise.all(
      receivedMessages.map((message) => parseToRoomContent(message))
    )

    // Set room users
    const leaveEnterMessages = parsedMessages.filter((msg) => msg.userEntering || msg.userLeaving)
    const users = []
    for (const msg of leaveEnterMessages) {
      if (msg.userEntering) {
        users.push(msg.userEntering)
      }
      if (msg.userLeaving) {
        const index = users.indexOf(msg.userLeaving)
        users.splice(index, 1)
      }
    }

    setRoomContent([{ paperchatOctagon: true, id: 'paperchat_octagon' }, ...parsedMessages])
    setRoomUsers(users)
  }

  const parseToRoomContent = async (message: firebaseMessage) => {
    const { imageURL, userEntering, userLeaving, localID, color } = message

    const roomMessage: roomContent = { id: localID }
    let messageHeight = 0

    if (userEntering || userLeaving) {
      if (userEntering) {
        roomMessage.userEntering = userEntering
      }

      if (userLeaving) {
        roomMessage.userLeaving = userLeaving
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
    if (!adjacentMessages[to]) return playSound('btn-denied', 0.4)
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
    if (!roomMessages.length) return playSound('btn-denied', 0.4)
    const lastMessage = roomMessages[roomMessages.length - 1]
    emitter.emit('canvasToCopy', lastMessage.message!)
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
      text: `You can be in up to ${SIMULTANEOUS_ROOMS_LIMIT} rooms at the same time.`,
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

  const showMissingCodeDialog = (addMaybe?: boolean) => {
    setDialogData({
      open: true,
      text: 'Room not found: private code missing in URL.',
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
    playSound('cancel', 0.5)

    setDialogData({
      open: true,
      text: 'Leave room?',
      showSpinner: false,
      leftBtnText: 'Cancel',
      rightBtnText: 'Accept',
      rightBtnFn: () => {
        playSound('leave-room', 0.3)
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
      text: 'Share your code with others to let them join your room!',
      showSpinner: false,
      rightBtnText: 'Copy Code',
      hideOnRightBtn: false,
      rightBtnFn: () => {
        navigator.clipboard.writeText(router.query.code as string)

        setDialogData({
          open: true,
          text: 'Copied to clipboard!',
          showSpinner: false
        })

        setTimeout(() => {
          document.querySelector('.dialog_layer_1')?.classList.add('go_down')
          setTimeout(() => setDialogData(baseDialogData), 400)
        }, 2000)
      },

      leftBtnText: 'Get Full Link',
      hideOnLeftBtn: false,
      leftBtnFn: () => {
        navigator.clipboard.writeText(window.location.href)

        setDialogData({
          open: true,
          text: 'Copied to clipboard!',
          showSpinner: false
        })

        setTimeout(() => {
          document.querySelector('.dialog_layer_1')?.classList.add('go_down')
          setTimeout(() => setDialogData(baseDialogData), 400)
        }, 2000)
      }
    })
  }

  const handleUsernameSubmit = (e: FormEvent) => {
    e.preventDefault()
    saveUsername()
  }

  const saveUsername = () => {
    if (usernameBeingEdited.length < usernameMinLength) return
    showLoadingDialog()

    dispatch(setUsername(usernameBeingEdited))
    localStorage.setItem('username', usernameBeingEdited)
    setUsernameInputValue(usernameBeingEdited)

    setMustSetUsername(false)
    initializeRoom(router.query.roomID as string)
  }

  const editingUsernameModalCover = () => {
    if (!mustSetUsername) return ''

    return (
      <>
        <div className={`${username_input} ${editing_username} ${skip_username_animation}`}>
          <form className={username_form} onSubmit={handleUsernameSubmit}>
            <UsernameInput
              editing={true}
              receivedValue={usernameInputValue}
              setUsernameBeingEdited={setUsernameBeingEdited}
            />

            <div className={save_username_btn_container}>
              <Button onClick={() => saveUsername()} text="Save" />
            </div>
          </form>
        </div>

        <div className="modal_cover" />
      </>
    )
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
              <ConnectionIndicator />
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

            <Button
              classes={btn_styles.room_top_row_btn}
              text={`Get Invitation`}
              onClick={showPrivateCodeDialog}
            />

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

          {editingUsernameModalCover()}
          {shouldDisplayDialog(dialogData)}
        </div>
      </div>
    </div>
  )
}

export default Room
