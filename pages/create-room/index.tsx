import general_styles from 'styles/options-screen/options.module.scss'
import PaperchatOctagon from 'components/PaperchatOctagon'
import Button from 'components/Button'
import { useRouter } from 'next/router'
import page_styles from 'styles/create-room/create-room.module.scss'
import { useState, useEffect } from 'react'
import { createRoom, SIMULTANEOUS_ROOMS_LIMIT, DAILY_ROOMS_LIMIT } from 'firebase-config/realtimeDB'
import { DialogOptions } from 'types/Dialog'
import { baseDialogData, shouldDisplayDialog } from 'components/Dialog'
import { playSound } from 'helpers/helperFunctions'
import { initializeUsername } from 'store/initializer'
import useTranslation from 'i18n/useTranslation'
import Head from 'next/head'

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
  dotted_border,
  ja: ja_general_styles
} = general_styles

const {
  option_cards,
  card,
  card__inner,
  title,
  icon,
  dino,
  description,
  double_cards,
  ja,
  fr,
  smaller_title,
  smaller_description
} = page_styles

const CreateRoom = () => {
  const router = useRouter()
  const { t, locale } = useTranslation()
  const getTitleText = () => `Paperchat - ${t('CREATE_ROOM_SCREEN.PAGE_TITLE')}`

  const [dialogData, setDialogData] = useState<DialogOptions>(baseDialogData)

  useEffect(() => {
    initializeUsername()
  }, [])

  const createPublicRoom = async () => {
    setDialogData({
      open: true,
      text: t('CREATE_ROOM_SCREEN.CREATING_YOUR_PUBLIC_ROOM'),
      showSpinner: true
    })

    const roomID = await createRoom(false)
    if (roomID === 'hit-creation-limit') return showCreationLimitDialog()
    if (roomID === 'already-joined') return showAlreadyJoinedDialog()
    if (roomID === 'hit-rooms-limit') return showRoomsLimitDialog()
    if (roomID === 'error') return showErrorDialog()
    setDialogData(baseDialogData)
    router.push(`room/${roomID}`)
  }

  const createPrivateRoom = async () => {
    setDialogData({
      open: true,
      text: t('CREATE_ROOM_SCREEN.CREATING_YOUR_PRIVATE_ROOM'),
      showSpinner: true
    })
    const roomURL = await createRoom(true)
    if (roomURL === 'hit-creation-limit') return showCreationLimitDialog()
    if (roomURL === 'already-joined') return showAlreadyJoinedDialog()
    if (roomURL === 'hit-rooms-limit') return showRoomsLimitDialog()
    if (roomURL === 'error') return showErrorDialog()
    setDialogData(baseDialogData)

    router.push(`private-room/${roomURL}`)
  }

  const goToOfflineRoom = async () => {
    router.push('offline-room')
  }

  const showCreationLimitDialog = () => {
    setDialogData({
      open: true,
      text: t('COMMON.ERRORS.DAILY_ROOMS_LIMIT', { DAILY_ROOMS_LIMIT }),
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

  const showErrorDialog = () => {
    setDialogData({
      open: true,
      text: t('COMMON.ERRORS.GENERIC'),
      showSpinner: false,
      rightBtnFn: () => setDialogData(baseDialogData),
      rightBtnText: t('COMMON.ACCEPT')
    })
  }

  const goHome = () => {
    playSound('cancel', 0.5)
    router.push('/')
  }

  const getMainTitleClass = () => {
    if (locale === 'en') return title
    return `${title} ${smaller_title}`
  }

  const getDescriptionClass = () => {
    if (locale === 'en') return description
    return `${description} ${smaller_description}`
  }

  return (
    <div className="main">
      <Head>
        <title>{getTitleText()}</title>
        <meta name="description" content={t('CREATE_ROOM_SCREEN.META_DESCRIPTION')} />
        <meta
          name="keywords"
          content="paperchat create rooms, pictochat online, drawing online, live drawing app, nintendo pictochat, DS drawing app, by lietsaki"
        />
      </Head>

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

        <div className={`screen ${bottom} ${locale === 'ja' ? ja_general_styles : ''}`}>
          <div className={bottom_top}>
            <p>{t('CREATE_ROOM_SCREEN.SECTION_TITLE')}</p>
          </div>

          <div
            className={`${option_cards} ${locale === 'ja' ? ja : ''} ${locale === 'fr' ? fr : ''}`}
          >
            <div className={card} onClick={createPublicRoom}>
              <div className={card__inner}>
                <div className={getMainTitleClass()}>{t('CREATE_ROOM_SCREEN.PUBLIC.TITLE')}</div>
                <div className={icon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="682.667"
                    height="682.667"
                    viewBox="0 0 512 512"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path d="M278 55.5V72l16.8.2 16.7.3.3 16.7.2 16.8h16.5H345v116.5V339h11 11l.2 50.3.3 50.2 72.3.3 72.2.2v-50.5V339h-16.5H479v-16.5V306h-33.5H412v-16.5V273h16.5H445v-17-17h17 17v-66.5V106h-17-17V89 72h-16.5H412V55.5 39h-67-67v16.5zM100 89v17H83.5 67v16.5V139H50 33l.2 66.7.3 66.8 16.8.3 16.7.2v16.5V306h16.5H100v16.5V339l-33.2.2-33.3.3-.3 16.7L33 373H16.5 0v50 50h167 167v-50-50h-16.5H301l-.2-16.7-.3-16.8-33.2-.3-33.3-.2v-16.5V306h16.5H267v-16.5V273l16.8-.2 16.7-.3V206v-66.5l-16.7-.3-16.8-.2v-16.5V106h-16.5H234l-.2-16.8-.3-16.7-66.7-.3L100 72v17z" />
                  </svg>
                </div>

                <div className={description}>{t('CREATE_ROOM_SCREEN.PUBLIC.DESCRIPTION')}</div>
              </div>
            </div>

            <div className={double_cards}>
              <div className={card} onClick={goToOfflineRoom}>
                <div className={card__inner}>
                  <div className={title}>{t('CREATE_ROOM_SCREEN.OFFLINE.TITLE')}</div>
                  <div className={`${icon} ${dino}`}>
                    <svg
                      width="144"
                      height="144"
                      viewBox="0 0 144 144"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0,142L8,142L8,144L0,144L0,142ZM28,142L32,142L32,144L28,144L28,142ZM96,142L104,142L104,144L96,144L96,142ZM80,100L76,100L76,114L72,114L72,120L68,120L68,124L64,124L64,140L68,140L68,144L60,144L60,132L56,132L56,128L52,128L52,132L48,132L48,136L44,136L44,140L48,140L48,144L40,144L40,128L36,128L36,124L32,124L32,120L28,120L28,116L24,116L24,112L20,112L20,88L24,88L24,96L28,96L28,100L32,100L32,104L40,104L40,100L44,100L44,96L50,96L50,92L56,92L56,88L60,88L60,62L64,62L64,58L96,58L96,62L100,62L100,80L80,80L80,84L92,84L92,88L76,88L76,96L84,96L84,104L80,104L80,100ZM82,140L84,140L84,142L82,142L82,140ZM12,136L20,136L20,138L12,138L12,136ZM110,134L116,134L116,136L110,136L110,134ZM0,128L32,128L32,130L0,130L0,128ZM72,128L128,128L128,130L72,130L72,128ZM68,64L68,68L72,68L72,64L68,64Z"
                        stroke="none"
                        fill="#535353"
                      />
                    </svg>
                  </div>

                  <div className={description}>{t('CREATE_ROOM_SCREEN.OFFLINE.DESCRIPTION')}</div>
                </div>
              </div>

              <div className={card} onClick={createPrivateRoom}>
                <div className={card__inner}>
                  <div className={title}>{t('CREATE_ROOM_SCREEN.PRIVATE.TITLE')}</div>
                  <div className={icon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="682.667"
                      height="682.667"
                      viewBox="0 0 512 512"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path d="M191 93v16h-16.5H158v32.5V174l-16.2.2-16.3.3-.3 16.2-.2 16.3h-16-16v98 98h16 16v16 16h131 131v-16-16h16 16v-98-98h-16-16l-.2-16.3-.3-16.2-16.2-.3-16.3-.2v-32.5V109h-16.5H321V93 77h-65-65v16zm130 48.5V174h-16-49-49-16v-32.5V109h65 65v32.5zM387 305v98H256 125v-98-98h131 131v98zm-163.5-31.8c-.3.7-.4 15.5-.3 32.8l.3 31.5H256h32.5V305v-32.5l-32.3-.3c-25.4-.2-32.4 0-32.7 1z" />
                    </svg>
                  </div>

                  <div className={getDescriptionClass()}>
                    {t('CREATE_ROOM_SCREEN.PRIVATE.DESCRIPTION')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={bottom_bottom}>
            <div className={bottom_btn_container}>
              <Button onClick={goHome} text={t('COMMON.CANCEL')} />
            </div>
          </div>

          {shouldDisplayDialog(dialogData)}
        </div>
      </div>
    </div>
  )
}

export default CreateRoom
