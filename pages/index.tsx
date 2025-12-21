import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Capacitor } from '@capacitor/core'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, setUsername } from 'store/slices/userSlice'
import { initializeUsername } from 'store/initializer'
import useTranslation from 'i18n/useTranslation'
import styles from 'styles/home/home.module.scss'
import version from 'store/version'
import Link from 'next/link'
import MenuButton from 'components/MenuButton'
import MuteSoundsButton from 'components/MuteSoundsButton'
import MultilangButton from 'components/MultilangButton'
import MultilangList from 'components/MultilangList'
import Button from 'components/Button'
import UsernameInput from 'components/UsernameInput'
import { isUsernameValid, playSound } from 'helpers/helperFunctions'
import { DialogProps, LANGUAGES_DIALOG } from 'types/Dialog'
import { LocaleCode } from 'types/Multilang'
import { baseDialogData, Dialog } from 'components/Dialog'
import { App } from '@capacitor/app'
import emitter from 'helpers/MittEmitter'
import Head from 'next/head'

const {
  top,
  title,
  icon,
  title_text,
  attribution,
  privacy_and_credits,
  bottom,
  play_store_btn,
  btn_search_rooms,
  btn_create_room,
  btn_join,
  pressed,
  username_form,
  username_input,
  editing_username,
  back_to_corner,
  save_username_btn_container,
  ja,
  sounds_btn,
  multilang_btn
} = styles

const Home = () => {
  const router = useRouter()
  const { t, locale, changeLocale } = useTranslation()
  const { username } = useSelector(selectUser)
  const dispatch = useDispatch()

  const [editingUsername, setEditingUsername] = useState(false)
  const [usernameAreaClasses, setUsernameAreaClasses] = useState(username_input)
  const [showPlayStoreLink, setShowPlayStoreLink] = useState(false)

  const [usernameInputValue, setUsernameInputValue] = useState('')
  const [usernameBeingEdited, setUsernameBeingEdited] = useState('')

  const [dialogData, setDialogData] = useState<DialogProps>(baseDialogData)
  const [langToSwitchTo, setLangToSwitchTo] = useState<LocaleCode>(locale)

  const PLAY_STORE_LINK = 'https://play.google.com/store/apps/details?id=net.paperchat.app'
  const getTitleText = () => `Paperchat - ${t('HOME.PAGE_TITLE')}`

  const editUsername = () => {
    if (editingUsername) return
    setEditingUsername(true)
    setUsernameBeingEdited(usernameInputValue)
    setUsernameAreaClasses(`${username_input} ${editing_username}`)
  }

  const finishEditingUsername = () => {
    setEditingUsername(false)
    setUsernameAreaClasses(`${username_input} ${back_to_corner}`)
  }

  const editingUsernameModalCover = () => {
    return editingUsername ? (
      <div onClick={() => finishEditingUsername()} className="modal_cover" />
    ) : null
  }

  const saveUsername = () => {
    const trimmedUsername = usernameBeingEdited.trim()
    if (!isUsernameValid(trimmedUsername)) return

    dispatch(setUsername(trimmedUsername))
    localStorage.setItem('username', trimmedUsername)
    finishEditingUsername()
  }

  const handleUsernameSubmit = (e: FormEvent) => {
    e.preventDefault()
    saveUsername()
  }

  useEffect(() => {
    initializeUsername()
    if (!Capacitor.isNativePlatform()) setShowPlayStoreLink(true)
  }, [])

  useEffect(() => {
    if (usernameInputValue && editingUsername) {
      finishEditingUsername()
    }
  }, [usernameInputValue])

  useEffect(() => {
    setUsernameInputValue(username)
  }, [username])

  useEffect(() => {
    if (editingUsername) {
      App.addListener('backButton', () => finishEditingUsername())
    } else if (dialogData.dialogName === LANGUAGES_DIALOG) {
      App.addListener('backButton', () => {
        document.querySelector('.dialog_layer_1')?.classList.add('go_down')

        setTimeout(() => {
          setDialogData(baseDialogData)
          setLangToSwitchTo(locale)
        }, 450)
      })
    } else {
      App.addListener('backButton', () => App.exitApp())
    }

    return () => {
      App.removeAllListeners()
      emitter.emit('removedAllCapacitorListeners', '')
    }
  }, [editingUsername, dialogData])

  const goToFindRooms = () => {
    document.querySelector(`.${btn_search_rooms}`)?.classList.add(pressed)
    playSound('main-selection', 0.3)
    setTimeout(() => router.push('/find-rooms'), 280)
  }

  const goToCreateRoom = () => {
    document.querySelector(`.${btn_create_room}`)?.classList.add(pressed)
    playSound('main-selection', 0.3)
    setTimeout(() => router.push('/create-room'), 380)
  }

  const goToJoinRoom = () => {
    document.querySelector(`.${btn_join}`)?.classList.add(pressed)
    playSound('main-selection', 0.3)
    setTimeout(() => router.push('/join-room'), 390)
  }

  const renderPlayStoreButton = () => {
    if (!showPlayStoreLink) return ''

    return (
      <a href={PLAY_STORE_LINK} className={play_store_btn} target="_blank" rel="noreferrer">
        <button>
          <img src="/icons/play-store.png" alt={t('IMAGE_ALTS.PLAY_STORE_ICON')} />
        </button>
      </a>
    )
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
      <Head>
        <title>{getTitleText()}</title>
        <meta name="description" content={t('HOME.META_DESCRIPTION')} />
      </Head>

      <div className="screens_section">
        <div className={`screen ${top}`}>
          <div className={title}>
            <span className={icon}>☺</span> <span className={title_text}>paperchat</span>
          </div>

          <div className={attribution}>
            <a href="https://www.linkedin.com/in/ricardo-sandez/" target="_blank" rel="noreferrer">
              Ricardo Sandez
            </a>
            <span>-</span>
            <a href="https://github.com/lietsaki/paperchat" target="_blank" rel="noreferrer">
              Fork me!
            </a>
          </div>

          <div className={privacy_and_credits}>
            <span>v{version}</span>
            <span> - </span>
            <Link href="/privacy" className={`${locale === 'ja' ? ja : ''}`}>
              {t('HOME.PRIVACY')}
            </Link>
            <span> - </span>
            <Link href="/credits" className={`${locale === 'ja' ? ja : ''}`}>
              {t('HOME.CREDITS')}
            </Link>
          </div>
        </div>

        <div className={`screen ${bottom}`}>
          {renderPlayStoreButton()}

          <div className={multilang_btn}>
            <MultilangButton onButtonClick={openLanguageModal} />
          </div>

          <div className={btn_search_rooms}>
            <MenuButton onClick={goToFindRooms} text={t('HOME.SEARCH_ROOMS')} />
          </div>
          <div className={btn_create_room}>
            <MenuButton onClick={goToCreateRoom} text={t('HOME.CREATE_ROOM')} />
          </div>
          <div className={btn_join}>
            <MenuButton onClick={goToJoinRoom} text={t('HOME.JOIN_WITH_CODE')} />
          </div>

          <div onClick={editUsername} className={usernameAreaClasses}>
            <form className={username_form} onSubmit={handleUsernameSubmit}>
              <UsernameInput
                editing={editingUsername}
                receivedValue={usernameInputValue}
                setUsernameBeingEdited={setUsernameBeingEdited}
              />

              {editingUsername ? (
                <div className={`${save_username_btn_container} ${locale === 'ja' ? ja : ''}`}>
                  <Button onClick={saveUsername} text={t('COMMON.SAVE')} />
                </div>
              ) : null}
            </form>
          </div>

          <div className={sounds_btn}>
            <MuteSoundsButton />
          </div>

          {editingUsernameModalCover()}
          <Dialog {...dialogData} />
        </div>
      </div>
    </div>
  )
}

export default Home
