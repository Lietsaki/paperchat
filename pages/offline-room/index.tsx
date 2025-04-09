import general_styles from 'styles/options-screen/options.module.scss'
import page_styles from 'styles/room/room.module.scss'
import home_styles from 'styles/home/home.module.scss'
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
  getSimpleId,
  createActiveColorClass,
  willContainerBeOverflowed,
  getHighestAndLowestPoints,
  getRandomColor,
  playSound,
  calculateAspectRatioFit,
  isUsernameValid
} from 'helpers/helperFunctions'
import { KeyboardType } from 'types/Keyboard'
import { RoomContent, CanvasData } from 'types/Room'
import emitter from 'helpers/MittEmitter'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, setUsername } from 'store/slices/userSlice'
import { usernameMaxLength } from 'store/initializer'
import { DialogOptions } from 'types/Dialog'
import { LocaleCode } from 'types/Multilang'
import { baseDialogData, shouldDisplayDialog } from 'components/Dialog'
import Button from 'components/Button'
import UsernameInput from 'components/UsernameInput'
import getRandomUsername from 'helpers/username-generator/usernameGenerator'
import { App } from '@capacitor/app'

const {
  username_form,
  username_input,
  editing_username,
  save_username_btn_container,
  cn: cn_home,
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
  const [userLocalID] = useState(getSimpleId())
  const [shouldShowCanvas, setShouldShowCanvas] = useState(true)
  const [usingPencil, setUsingPencil] = useState(true)
  const [usingThickStroke, setUsingThickStroke] = useState(true)
  const [currentKeyboard, setCurrentKeyboard] = useState<KeyboardType>('Alphanumeric')
  const [roomContent, setRoomContent] = useState<RoomContent[]>([
    { paperchatOctagon: true, id: 'paperchat_octagon', serverTs: 1, author: userLocalID }
  ])
  const [roomColor] = useState(getRandomColor())
  const [adjacentMessages, setAdjacentMessages] = useState({ up: '', down: '' })
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()

  const [dialogData, setDialogData] = useState<DialogOptions>(baseDialogData)
  const [langToSwitchTo, setLangToSwitchTo] = useState<LocaleCode>(locale)

  const [mustSetUsername, setMustSetUsername] = useState(false)
  const [roomCode] = useState('A')

  const [usernameInputValue, setUsernameInputValue] = useState('')
  const [usernameBeingEdited, setUsernameBeingEdited] = useState('')
  const strokeRGBArray = [17, 17, 17]

  const typeKey = (key: string) => emitter.emit('typeKey', key)
  const typeSpace = () => emitter.emit('typeSpace', '')
  const typeEnter = () => emitter.emit('typeEnter', '')
  const typeDel = () => emitter.emit('typeDel', '')
  const sendMessage = () => emitter.emit('sendMessage', '')

  useEffect(() => {
    showLoadingDialog()
    const savedUsername = localStorage.getItem('username')

    if (!savedUsername || !isUsernameValid(savedUsername)) {
      setDialogData(baseDialogData)
      const randomUsername = getRandomUsername()
      setMustSetUsername(true)
      setUsernameInputValue(randomUsername)
      setUsernameBeingEdited(randomUsername)
    } else {
      dispatch(setUsername(savedUsername.substring(0, usernameMaxLength).trim()))
      initializeRoom(savedUsername)
    }

    App.addListener('backButton', () => showAskExitRoomDialog())

    return () => {
      App.removeAllListeners()
      emitter.emit('removedAllCapacitorListeners', '')
    }
  }, [])

  useEffect(() => createActiveColorClass(roomColor), [roomColor])

  useEffect(() => {
    emitter.on('canvasData', receiveCanvasData)
    setTimeout(() => scrollContent(), 100)

    return () => {
      emitter.off('canvasData')
    }
  }, [roomContent])

  const initializeRoom = (username: string) => {
    setRoomContent([
      ...roomContent,
      { animate: true, id: getSimpleId(), userEntering: username, serverTs: 1, author: userLocalID }
    ])

    playEnteredSound()
    setDialogData(baseDialogData)
  }

  const scrollContent = () => {
    const container = document.getElementById('messages-container')
    container!.scroll({ top: container!.scrollHeight, behavior: 'smooth' })
  }

  const receiveCanvasData = ({ dataUrl, width, height }: CanvasData) => {
    let messagesWillTriggerScroll = true

    if (messagesContainerRef.current) {
      // Calculate how big the image will be when we put it in our messagesContainer
      const messageHeight = calculateAspectRatioFit(
        width,
        height,
        messagesContainerRef.current!.clientWidth,
        9999
      ).height

      // Check if the image would overflow it
      messagesWillTriggerScroll = willContainerBeOverflowed(
        messagesContainerRef.current!,
        0,
        4,
        messageHeight
      )
    }

    setRoomContent([
      ...roomContent,
      {
        imageURL: dataUrl,
        id: getSimpleId(),
        author: userLocalID,
        animate: !messagesWillTriggerScroll,
        color: roomColor,
        serverTs: Date.now()
      }
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

  const showAskExitRoomDialog = () => {
    playSound('cancel', 0.5)

    setDialogData({
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

  const showLoadingDialog = () => {
    setDialogData({
      open: true,
      text: t('COMMON.LOADING'),
      showSpinner: true
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
    initializeRoom(trimmedUsername)
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

            <div className={`${save_username_btn_container} ${locale === 'cn' ? cn_home : ''}`}>
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
      open: open || dialogData.open,
      largeDialog: true,
      text: <MultilangList selectedLang={langToSwitchTo} setSelectedLang={setLangToSwitchTo} />,
      skipSmallCnText: locale === 'cn',
      showSpinner: false,
      leftBtnText: t('COMMON.CANCEL'),
      leftBtnFn: () => {
        setDialogData(baseDialogData)
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

  useEffect(() => {
    setLangToSwitchTo(locale)
  }, [locale])

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
                  <div onClick={sendMessage} className={`${send} ${active_on_click}`}>
                    <img src="/send-buttons/SEND.png" alt={t('IMAGE_ALTS.SEND_MESSAGE_BUTTON')} />
                    <img src="/send-buttons/active/SEND.png" alt="" className={active} />
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
          {shouldDisplayDialog(dialogData)}
        </div>
      </div>
    </div>
  )
}

export default Room
