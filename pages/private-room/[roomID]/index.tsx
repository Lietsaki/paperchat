import general_styles from 'styles/options-screen/options.module.scss'
import page_styles from 'styles/room/room.module.scss'
import home_styles from 'styles/home/home.module.scss'
import btn_styles from 'styles/components/button.module.scss'
import MultilangButton from 'components/MultilangButton'
import MultilangList from 'components/MultilangList'
import MuteSoundsButton from 'components/MuteSoundsButton'
import PaperchatOctagon from 'components/PaperchatOctagon'
import UserInfoOctagon from 'components/room/UserInfoOctagon'
import MessageOctagon from 'components/room/MessageOctagon'
import Keyboard from 'components/Keyboard'
import Canvas from 'components/Canvas'
import ContentIndicator from 'components/room/ContentIndicator'
import ConnectionIndicator from 'components/room/ConnectionIndicator'
import { useRouter } from 'next/router'
import useTranslation from 'i18n/useTranslation'
import { useState, useEffect, useRef, FormEvent } from 'react'
import {
  createActiveColorClass,
  willContainerBeOverflowed,
  getImageData,
  getRandomColor,
  getHighestAndLowestPoints,
  playSound,
  getSimpleId,
  calculateAspectRatioFit,
  isUsernameValid
} from 'helpers/helperFunctions'
import { KeyboardType } from 'types/Keyboard'
import { RoomContent, CanvasData, FirebaseMessage } from 'types/Room'
import emitter from 'helpers/MittEmitter'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, setUsername } from 'store/slices/userSlice'
import {
  SIMULTANEOUS_ROOMS_LIMIT,
  USERS_LIMIT,
  getCurrentRoomData,
  joinRoom,
  sendMessageToRoom,
  leaveRoom,
  getCurrentUserID,
  listenForDisconnectAndMessages,
  updateRoomMessages
} from 'firebase-config/realtimeDB'
import { usernameMaxLength } from 'store/initializer'
import {
  DialogProps,
  EXIT_ROOM_DIALOG,
  LANGUAGES_DIALOG,
  SHARE_LINK_DIALOG,
  USER_LIST_DIALOG
} from 'types/Dialog'
import { LocaleCode } from 'types/Multilang'
import { baseDialogData, Dialog } from 'components/Dialog'
import Button from 'components/Button'
import UsernameInput from 'components/UsernameInput'
import getRandomUsername from 'helpers/username-generator/usernameGenerator'
import { Clipboard } from '@capacitor/clipboard'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { notifyNow } from 'helpers/localNotifications'

const {
  username_form,
  username_input,
  editing_username,
  save_username_btn_container,
  ja: ja_home,
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
  interact_seal,
  last_canvas,
  clear,
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
  const { t, locale, changeLocale } = useTranslation()
  const user = useSelector(selectUser)
  const [shouldShowCanvas, setShouldShowCanvas] = useState(true)
  const [roomUsers, setRoomUsers] = useState<string[]>([])
  const [usingPencil, setUsingPencil] = useState(true)
  const [usingThickStroke, setUsingThickStroke] = useState(true)
  const [currentKeyboard, setCurrentKeyboard] = useState<KeyboardType>('Alphanumeric')
  const [roomContent, setRoomContent] = useState<RoomContent[]>([
    { paperchatOctagon: true, id: '1', serverTs: 1, author: getCurrentUserID()! }
  ])
  const [roomColor] = useState(getRandomColor())
  const [adjacentMessages, setAdjacentMessages] = useState({ up: '', down: '' })
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()

  const [dialogData, setDialogData] = useState<DialogProps>(baseDialogData)
  const [langToSwitchTo, setLangToSwitchTo] = useState<LocaleCode>(locale)

  const [viewingUsers, setViewingUsers] = useState(false)
  const [mustSetUsername, setMustSetUsername] = useState(false)
  const [loadedRoom, setLoadedRoom] = useState(false)
  const [roomCode, setRoomCode] = useState('?')

  const [usernameInputValue, setUsernameInputValue] = useState('')
  const [usernameBeingEdited, setUsernameBeingEdited] = useState('')
  const [lostConnection, setLostConnection] = useState(false)

  const [msgDebounceTime, setMsgDebounceTime] = useState(0)
  const strokeRGBArray = [17, 17, 17]
  const MSG_DEB_TIME = 5

  const typeKey = (key: string) => emitter.emit('typeKey', key)
  const typeSpace = () => emitter.emit('typeSpace', '')
  const typeEnter = () => emitter.emit('typeEnter', '')
  const typeDel = () => emitter.emit('typeDel', '')
  const sendMessage = () => emitter.emit('sendMessage', '')

  useEffect(() => {
    if (!router.query.roomID) return
    showLoadingDialog()
    const savedUsername = localStorage.getItem('username')

    if (!savedUsername || !isUsernameValid(savedUsername)) {
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
    emitter.on('disbandedInactive', showDisbandedInactiveRoomDialog)

    return () => {
      emitter.off('lostConnection')
      emitter.off('backOnline')
      emitter.off('disbandedRoom')
      emitter.off('otherError')
      emitter.off('disbandedInactive')
      App.removeAllListeners()
      emitter.emit('removedAllCapacitorListeners', '')
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
  }, [roomContent])

  // loadedRoom becomes true after we enter/create a room
  // and receive its first messages snapshot.
  useEffect(() => {
    if (loadedRoom === true) {
      setTimeout(() => scrollContent(), 300)
      playEnteredSound()
      setDialogData(baseDialogData)
    }
  }, [loadedRoom])

  // Refresh user list in the user dialog if it's open
  useEffect(() => {
    if (viewingUsers) {
      setDialogData({
        dialogName: USER_LIST_DIALOG,
        open: true,
        largeDialog: true,
        text: getUserList(),
        skipSmallJaText: true,
        showSpinner: false,
        rightBtnText: t('COMMON.ACCEPT'),
        rightBtnFn: () => {
          setDialogData(baseDialogData)
          setViewingUsers(false)
        }
      })
    }
  }, [roomUsers])

  useEffect(() => {
    if (msgDebounceTime) {
      setTimeout(() => {
        setMsgDebounceTime(msgDebounceTime - 1)
      }, 1000)
    }
  }, [msgDebounceTime])

  useEffect(() => {
    if (
      dialogData.dialogName === EXIT_ROOM_DIALOG ||
      dialogData.dialogName === LANGUAGES_DIALOG ||
      dialogData.dialogName === SHARE_LINK_DIALOG ||
      dialogData.dialogName === USER_LIST_DIALOG
    ) {
      App.addListener('backButton', () => {
        document.querySelector('.dialog_layer_1')?.classList.add('go_down')

        setTimeout(() => {
          setDialogData(baseDialogData)
          setLangToSwitchTo(locale)
          setViewingUsers(false)
        }, 450)
      })
    } else if (dialogData === baseDialogData && !lostConnection) {
      App.addListener('backButton', () => showAskExitRoomDialog())
    }

    return () => {
      App.removeAllListeners()
      emitter.emit('removedAllCapacitorListeners', '')
    }
  }, [dialogData, lostConnection])

  const initializeRoom = (id: string) => {
    const currentRoom = getCurrentRoomData()

    if (!currentRoom.code) {
      if (id.length !== 20) return showRoomNotFoundDialog()
      tryToJoinRoom(id)
    } else {
      try {
        listenForDisconnectAndMessages()
        setRoomCode(currentRoom.code)
      } catch (error) {
        console.log(error)
        return showErrorDialog()
      }
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
    if (res === 'already-joined') return showAlreadyJoinedDialog()
    if (res === 'hit-rooms-limit') return showRoomsLimitDialog()
    if (res === 'invalid-code') return showRoomInvalidCodeDialog()
    if (res === 'error' || !currentRoom.code) return showErrorDialog()

    try {
      listenForDisconnectAndMessages()
      setRoomCode(currentRoom.code)
    } catch (error) {
      console.log(error)
      return showErrorDialog()
    }
  }

  const scrollContent = () => {
    const container = document.getElementById('messages-container')
    container?.scroll({ top: container!.scrollHeight, behavior: 'smooth' })
  }

  const receiveFirebaseMessages = async (receivedMessages: FirebaseMessage[]) => {
    const idsToSkip: { [key: string]: boolean } = {}
    const parsedMessages = await Promise.all(
      receivedMessages.map((message) => parseToRoomContent(message))
    )

    // Set room users
    const leaveEnterMessages = parsedMessages.filter(
      (msg) => (msg.userEntering || msg.userLeaving) && msg.author
    )
    const users: { [key: string]: string } = {}
    for (const msg of leaveEnterMessages) {
      if (msg.userEntering) {
        const userEnteringMsgs = roomContent.filter(
          (item) => item.userEntering && item.author === msg.author && item.id !== msg.id
        )
        const userLeavingMsgs = roomContent.filter(
          (item) => item.userLeaving && item.author === msg.author
        )

        // If a duplicated userEntering message is received, consider only the most recent one.
        if (userEnteringMsgs.length > userLeavingMsgs.length) {
          const lastEnteringMsg = userEnteringMsgs[userEnteringMsgs.length - 1]
          idsToSkip[lastEnteringMsg.id] = true
        }

        if (!users[msg.author!]) users[msg.author!] = msg.userEntering
      } else if (msg.userLeaving) {
        delete users[msg.author!]
      }
    }

    if (roomContent.length === 1 && parsedMessages.length) {
      setLoadedRoom(true)
    }

    // Check for deleted messages (users who disconnected and came back online overwrite
    // the messages sent while they were offline with their 'Now leaving' message)
    const missingMessages = roomContent.filter((msg) => {
      if (msg.paperchatOctagon) return false
      return !parsedMessages.find((item) => item.id === msg.id)
    })

    if (missingMessages.length) {
      for (const missingMsg of missingMessages) {
        const i = roomContent.findIndex((item) => item.id === missingMsg.id)
        parsedMessages.splice(i + 1, 0, missingMsg)
      }
      parsedMessages.sort((a, b) => a.serverTs - b.serverTs)
    }

    const updatedContent: { [key: string]: RoomContent } = {}
    for (const msg of roomContent) {
      if (!idsToSkip[msg.id]) updatedContent[msg.id] = msg
    }
    for (const msg of parsedMessages) {
      if (!idsToSkip[msg.id]) updatedContent[msg.id] = msg
    }

    const updatedContentArr = Object.values(updatedContent)
    updatedContentArr.sort((a, b) => a.serverTs - b.serverTs)
    setRoomContent(updatedContentArr)
    setRoomUsers(Object.values(users))

    const latestMessage = updatedContentArr[updatedContentArr.length - 1]

    if (loadedRoom && latestMessage.author !== getCurrentUserID()) {
      if (latestMessage.imageURL) {
        playSound('received-message', 0.5, true)
      } else if (latestMessage.userEntering) {
        playSound('entering-room', 1, true)
      } else if (latestMessage.userLeaving) {
        playSound('leave-room', 0.3, true)
      }
    }

    if (loadedRoom && latestMessage.author !== getCurrentUserID()) {
      if (Capacitor.isNativePlatform()) {
        if (latestMessage.imageURL) {
          notifyNow({ newMessage: true })
        } else if (latestMessage.userEntering) {
          notifyNow({ userEntering: latestMessage.userEntering })
        } else if (latestMessage.userLeaving) {
          notifyNow({ userLeaving: latestMessage.userLeaving })
        }
      }
    }

    if (missingMessages.length) {
      try {
        updateRoomMessages(parseToFirebaseMessages(Object.values(updatedContent)))
      } catch (error) {
        console.log(error)
      }
    }
  }

  const parseToFirebaseMessages = (messages: RoomContent[]): FirebaseMessage[] => {
    return messages
      .filter((item) => !item.paperchatOctagon)
      .map((item) => {
        return {
          imageURL: item.imageURL || '',
          color: item.color || '',
          author: item.author!,
          userEntering: item.userEntering || '',
          userLeaving: item.userLeaving || '',
          id: item.id,
          serverTs: item.serverTs
        }
      })
  }

  const parseToRoomContent = async (message: FirebaseMessage) => {
    const { imageURL, userEntering, userLeaving, color, serverTs, author } = message

    const roomMessage: RoomContent = { id: message.id, serverTs, author }
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
      roomMessage.imageURL = imageURL
      roomMessage.color = color
      const img = await getImageData(imageURL)

      // Calculate how big the image will be when we put it in our messagesContainer
      messageHeight = messagesContainerRef.current
        ? calculateAspectRatioFit(
            img.width,
            img.height,
            messagesContainerRef.current.clientWidth,
            9999
          ).height
        : 40
    }

    roomMessage.animate = messagesContainerRef.current
      ? !willContainerBeOverflowed(messagesContainerRef.current, 0, 4.5, messageHeight)
      : false

    return roomMessage
  }

  const receiveCanvasData = ({ dataUrl, width, height }: CanvasData) => {
    let messagesWillTriggerScroll = true

    if (messagesContainerRef.current) {
      // Calculate how big the image will be when we put it in our messagesContainer
      const messageHeight = calculateAspectRatioFit(
        width,
        height,
        messagesContainerRef.current.clientWidth,
        9999
      ).height

      // Check if the image would overflow it
      messagesWillTriggerScroll = willContainerBeOverflowed(
        messagesContainerRef.current,
        0,
        4,
        messageHeight
      )
    }

    const id = getSimpleId()
    setRoomContent([
      ...roomContent,
      {
        imageURL: dataUrl,
        serverTs: Date.now(),
        id,
        animate: !messagesWillTriggerScroll,
        color: roomColor,
        author: getCurrentUserID()!
      }
    ])
    sendMessageToRoom(dataUrl, id, roomColor)
    setMsgDebounceTime(MSG_DEB_TIME)
  }

  const getRoomContent = () => {
    return roomContent.map((item) => {
      if (item.userEntering || item.userLeaving) {
        return (
          <UserInfoOctagon
            key={item.id}
            id={item.id}
            userEntering={item.userEntering}
            userLeaving={item.userLeaving}
            shouldAnimate={!!item.animate}
            roomCode={roomCode}
          />
        )
      }

      if (item.imageURL && item.color) {
        return (
          <MessageOctagon
            key={item.id}
            id={item.id}
            color={item.color}
            img_uri={item.imageURL}
            shouldAnimate={!!item.animate}
          />
        )
      }

      if (item.paperchatOctagon) {
        return <PaperchatOctagon key={item.id} id="1" />
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

  const clearCanvas = (clearEvenEmpty?: boolean, skipSound?: boolean) => {
    const canvas = document.getElementById('roomCanvas') as HTMLCanvasElement
    if (!canvas) return

    const performClear = (foundCanvasData: boolean) => {
      setShouldShowCanvas(false)
      setTimeout(() => {
        setShouldShowCanvas(true)
        if (!skipSound && foundCanvasData) playSound('clear-canvas', 0.6)
      }, 30)
    }

    if (clearEvenEmpty) {
      performClear(false)
    } else {
      const { highestPoint, lowestPoint } = getHighestAndLowestPoints(
        canvas.getContext('2d')!,
        strokeRGBArray
      )
      if (!highestPoint && !lowestPoint) playSound('btn-denied', 0.4)
      performClear(!!highestPoint && !!lowestPoint)
    }
  }

  const copyLastCanvas = () => {
    const roomMessages = roomContent.filter((item) => item.imageURL)
    if (!roomMessages.length) return playSound('btn-denied', 0.4)
    const lastMessage = roomMessages[roomMessages.length - 1]
    clearCanvas(true, true)

    setTimeout(() => {
      emitter.emit('canvasToCopy', lastMessage.imageURL!)
    }, 200)
  }

  const showLoadingDialog = () => {
    setDialogData({
      open: true,
      text: t('COMMON.LOADING'),
      showSpinner: true
    })
  }

  const showErrorDialog = () => {
    setDialogData({
      open: true,
      text: t('COMMON.ERRORS.THERE_WAS'),
      showSpinner: false,
      rightBtnText: t('COMMON.GO_HOME'),
      rightBtnFn: () => router.push('/')
    })
  }

  const showDisbandedInactiveRoomDialog = () => {
    setDialogData({
      open: true,
      text: t('ROOM.ERRORS.DISBANDED_DUE_TO_INACTIVITY'),
      showSpinner: false,
      rightBtnText: t('COMMON.GO_HOME'),
      rightBtnFn: () => router.push('/')
    })
  }

  const showFullRoomDialog = () => {
    setDialogData({
      open: true,
      text: t('ROOM.ERRORS.ROOM_IS_FULL'),
      showSpinner: false,
      rightBtnText: t('COMMON.GO_HOME'),
      rightBtnFn: () => router.push('/')
    })
  }

  const showAlreadyJoinedDialog = () => {
    setDialogData({
      open: true,
      text: t('ROOM.ERRORS.ALREADY_JOINED'),
      showSpinner: false,
      rightBtnText: t('COMMON.GO_HOME'),
      rightBtnFn: () => router.push('/')
    })
  }

  const showRoomsLimitDialog = () => {
    setDialogData({
      open: true,
      text: t('ROOM.ERRORS.SIMULTANEOUS_ROOMS_LIMIT', { SIMULTANEOUS_ROOMS_LIMIT }),
      showSpinner: false,
      rightBtnText: t('COMMON.GO_HOME'),
      rightBtnFn: () => router.push('/')
    })
  }

  const showRoomInvalidCodeDialog = () => {
    setDialogData({
      open: true,
      text: t('ROOM.ERRORS.INVALID_CODE'),
      showSpinner: false,
      rightBtnText: t('COMMON.GO_HOME'),
      rightBtnFn: () => router.push('/')
    })
  }

  const showMissingCodeDialog = () => {
    setDialogData({
      open: true,
      text: t('ROOM.ERRORS.NOT_FOUND_MISSING_CODE'),
      showSpinner: false,
      rightBtnText: t('COMMON.GO_HOME'),
      rightBtnFn: () => router.push('/')
    })
  }

  const showRoomNotFoundDialog = (addMaybe?: boolean) => {
    setDialogData({
      open: true,
      text: addMaybe
        ? t('COMMON.ERRORS.ROOM_NOT_FOUND_MAYBE_DISBANDED')
        : t('COMMON.ERRORS.ROOM_NOT_FOUND'),
      showSpinner: false,
      rightBtnText: t('COMMON.GO_HOME'),
      rightBtnFn: () => router.push('/')
    })
  }

  const showAskExitRoomDialog = () => {
    playSound('cancel', 0.5)

    setDialogData({
      dialogName: EXIT_ROOM_DIALOG,
      open: true,
      text: t('ROOM.LEAVE_ROOM'),
      showSpinner: false,
      leftBtnText: t('COMMON.CANCEL'),
      rightBtnText: t('COMMON.ACCEPT'),
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
    setLostConnection(true)

    setDialogData({
      open: true,
      text: t('ROOM.ERRORS.CONNECTION_LOST_RECONNECTING'),
      showSpinner: true
    })
  }

  const showBackOnlineDialog = () => {
    setLostConnection(false)

    setDialogData({
      open: true,
      text: t('ROOM.ERRORS.BACK_ONLINE'),
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
      text: t('ROOM.ERRORS.BACK_ONLINE_DISBANDED'),
      showSpinner: false,
      rightBtnText: t('COMMON.GO_HOME'),
      rightBtnFn: () => router.push('/')
    })
  }

  const getUserList = () => {
    return (
      <div className="user_list">
        <div className="title">
          {t('ROOM.USERS')} ({roomUsers.length}/{USERS_LIMIT})
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
      dialogName: USER_LIST_DIALOG,
      open: true,
      largeDialog: true,
      text: getUserList(),
      skipSmallJaText: true,
      showSpinner: false,
      rightBtnText: t('COMMON.ACCEPT'),
      rightBtnFn: () => {
        setDialogData(baseDialogData)
        setViewingUsers(false)
      }
    })
  }

  const showPrivateCodeDialog = () => {
    setDialogData({
      dialogName: SHARE_LINK_DIALOG,
      open: true,
      text: t('ROOM.GET_PRIVATE_ROOM_CODE_DIALOG'),
      showSpinner: false,
      rightBtnText: t('ROOM.COPY_CODE'),
      hideOnRightBtn: false,
      rightBtnFn: async () => {
        if (Capacitor.isNativePlatform()) {
          await Clipboard.write({ string: router.query.code as string })
        } else {
          navigator.clipboard.writeText(router.query.code as string)
        }

        setDialogData({
          open: true,
          text: t('ROOM.COPIED_TO_CLIPBOARD'),
          showSpinner: false
        })

        setTimeout(() => {
          document.querySelector('.dialog_layer_1')?.classList.add('go_down')
          setTimeout(() => setDialogData(baseDialogData), 450)
        }, 2000)
      },

      leftBtnText: t('ROOM.COPY_LINK'),
      hideOnLeftBtn: false,
      leftBtnFn: async () => {
        const url =
          process.env.NODE_ENV === 'production'
            ? `https://paperchat.net/private-room/${router.query.roomID}?code=${router.query.code}`
            : window.location.href

        if (Capacitor.isNativePlatform()) {
          await Clipboard.write({ url })
        } else {
          navigator.clipboard.writeText(url)
        }

        setDialogData({
          open: true,
          text: t('ROOM.COPIED_TO_CLIPBOARD'),
          showSpinner: false
        })

        setTimeout(() => {
          document.querySelector('.dialog_layer_1')?.classList.add('go_down')
          setTimeout(() => setDialogData(baseDialogData), 450)
        }, 2000)
      }
    })
  }

  const handleUsernameSubmit = (e: FormEvent) => {
    e.preventDefault()
    saveUsername()
  }

  const saveUsername = () => {
    const trimmedUsername = usernameBeingEdited.trim()
    if (!isUsernameValid(trimmedUsername)) return
    showLoadingDialog()

    dispatch(setUsername(trimmedUsername))
    localStorage.setItem('username', trimmedUsername)
    setUsernameInputValue(trimmedUsername)

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

            <div className={`${save_username_btn_container} ${locale === 'ja' ? ja_home : ''}`}>
              <Button onClick={() => saveUsername()} text={t('COMMON.SAVE')} />
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

  const selectKeyboard = (newKeyboard: KeyboardType) => {
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

  const getCanvas = () => {
    if (shouldShowCanvas) {
      return (
        <Canvas
          username={user.username}
          usingPencil={usingPencil}
          roomColor={roomColor}
          usingThickStroke={usingThickStroke}
          clearCanvas={clearCanvas}
        />
      )
    }
  }

  const updateLanguageDialogData = (open?: boolean) => {
    setDialogData({
      dialogName: LANGUAGES_DIALOG,
      open: open || dialogData.open,
      largeDialog: true,
      text: <MultilangList selectedLang={langToSwitchTo} setSelectedLang={setLangToSwitchTo} />,
      skipSmallJaText: true,
      showSpinner: false,
      leftBtnText: t('COMMON.CANCEL'),
      leftBtnFn: () => {
        setDialogData(baseDialogData)
        setLangToSwitchTo(locale)
      },
      rightBtnText: t('COMMON.ACCEPT'),
      rightBtnFn: () => {
        changeLocale(langToSwitchTo)
        setDialogData(baseDialogData)
      }
    })
  }

  const openLanguageModal = () => updateLanguageDialogData(true)

  useEffect(() => {
    updateLanguageDialogData()
  }, [langToSwitchTo])

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
              <img src="/tool-buttons/top-arrow.png" alt={t('IMAGE_ALTS.TOP_ARROW_BUTTON')} />
              <div className="active_color"></div>
            </div>

            <div
              className={`${tool_container} ${down_arrow} ${active_on_click}`}
              onClick={() => scrollToAdjacent('down')}
            >
              <img
                src="/tool-buttons/down-arrow.png"
                alt={t('IMAGE_ALTS.DOWN_ARROW_BUTTON')}
                className={active_on_click}
              />
              <div className="active_color"></div>
            </div>

            <div
              className={`${tool_container} ${pencil} ${usingPencil ? active : ''}`}
              onClick={() => selectPencil()}
            >
              <img src={`/tool-buttons/pencil.png`} alt={t('IMAGE_ALTS.PENCIL_BUTTON')} />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${eraser} ${!usingPencil ? active : ''}`}
              onClick={() => selectEraser()}
            >
              <img src={`/tool-buttons/eraser.png`} alt={t('IMAGE_ALTS.ERASER_BUTTON')} />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${thick_stroke} ${usingThickStroke ? active : ''}`}
              onClick={() => selectThickStroke()}
            >
              <img
                src={`/tool-buttons/thick-stroke.png`}
                alt={t('IMAGE_ALTS.THICK_STROKE_BUTTON')}
              />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${thin_stroke} ${!usingThickStroke ? active : ''}`}
              onClick={() => selectThinStroke()}
            >
              <img src={`/tool-buttons/thin-stroke.png`} alt={t('IMAGE_ALTS.THIN_STROKE_BUTTON')} />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${margin_bottom_sm}  ${
                currentKeyboard === 'Alphanumeric' ? active : ''
              }`}
              onClick={() => selectKeyboard('Alphanumeric')}
            >
              <img
                src={`/tool-buttons/alphanumeric.png`}
                alt={t('IMAGE_ALTS.ALPHANUMERIC_BUTTON')}
              />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${margin_bottom_sm} ${
                currentKeyboard === 'Accents' ? active : ''
              }`}
              onClick={() => selectKeyboard('Accents')}
            >
              <img src={`/tool-buttons/accents.png`} alt={t('IMAGE_ALTS.ACCENTS_BUTTON')} />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${margin_bottom_sm} ${
                currentKeyboard === 'Symbols' ? active : ''
              }`}
              onClick={() => selectKeyboard('Symbols')}
            >
              <img src={`/tool-buttons/symbols.png`} alt={t('IMAGE_ALTS.SYMBOLS_BUTTON')} />
              <div className="active_color bright"></div>
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${
                currentKeyboard === 'Smileys' ? active : ''
              }`}
              onClick={() => selectKeyboard('Smileys')}
            >
              <img src={`/tool-buttons/smileys.png`} alt={t('IMAGE_ALTS.SMILEYS_BUTTON')} />
              <div className="active_color bright"></div>
            </div>
          </div>

          <div className={top_buttons_row}>
            <MultilangButton onButtonClick={openLanguageModal} useSmallVersion />
            <MuteSoundsButton useSmallVersion />

            <Button
              classes={btn_styles.room_top_row_btn}
              text={t('ROOM.GET_INVITATION')}
              onClick={showPrivateCodeDialog}
              useJaSmaller
            />

            <Button
              classes={btn_styles.room_top_row_btn}
              text={`${t('ROOM.USERS')} (${roomUsers.length}/${USERS_LIMIT})`}
              onClick={showUsersDialog}
              useJaSmaller
            />

            <div className={`${close_btn} ${active_on_click}`} onClick={showAskExitRoomDialog}>
              <img src="/tool-buttons/close.png" alt={t('IMAGE_ALTS.CLOSE_BUTTON')} />
              <div className="active_color bright"></div>
            </div>
          </div>

          <div className={canvas_column}>
            <div className={canvas_area}>
              <div className={canvas_bg}>{getCanvas()}</div>

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
                  <div
                    onClick={() => (msgDebounceTime ? '' : sendMessage())}
                    className={`${send} ${active_on_click} ${
                      msgDebounceTime ? 'no_pointer_events' : ''
                    }`}
                  >
                    <img src="/send-buttons/SEND.png" alt={t('IMAGE_ALTS.SEND_MESSAGE_BUTTON')} />
                    <img src="/send-buttons/active/SEND.png" alt="" className={active} />

                    {msgDebounceTime ? <div className={interact_seal}>{msgDebounceTime}</div> : ''}
                  </div>
                  <div className={`${last_canvas} ${active_on_click}`} onClick={copyLastCanvas}>
                    <img
                      src="/send-buttons/LAST-CANVAS.png"
                      alt={t('IMAGE_ALTS.COPY_LAST_MESSAGE_BUTTON')}
                    />
                    <img src="/send-buttons/active/LAST-CANVAS.png" alt="" className={active} />
                  </div>
                  <div className={`${clear} ${active_on_click}`} onClick={() => clearCanvas()}>
                    <img src="/send-buttons/CLEAR.png" alt={t('IMAGE_ALTS.CLEAR_CANVAS_BUTTON')} />
                    <img src="/send-buttons/active/CLEAR.png" alt="" className={active} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {editingUsernameModalCover()}
          <Dialog {...dialogData} />
        </div>
      </div>
    </div>
  )
}

export default Room
