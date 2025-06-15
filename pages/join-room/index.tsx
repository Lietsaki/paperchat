import general_styles from 'styles/options-screen/options.module.scss'
import page_styles from 'styles/join-room/join-room.module.scss'
import PaperchatOctagon from 'components/PaperchatOctagon'
import JoinRoomInput from 'components/JoinRoomInput'
import Button from 'components/Button'
import { PRIVATE_CODE_LENGTH, requestJoinPrivateRoom } from 'firebase-config/realtimeDB'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { DialogProps } from 'types/Dialog'
import { baseDialogData, Dialog } from 'components/Dialog'
import { playSound } from 'helpers/helperFunctions'
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
  ja,
  smaller_section_title
} = general_styles

const { midsection } = page_styles

const JoinWithACode = () => {
  const router = useRouter()
  const { t, locale } = useTranslation()
  const getTitleText = () => `Paperchat - ${t('JOIN_WITH_CODE_SCREEN.PAGE_TITLE')}`

  const [dialogData, setDialogData] = useState<DialogProps>(baseDialogData)

  const join = async (code: string) => {
    if (!code || !code.trim()) return
    if (code.trim().length !== PRIVATE_CODE_LENGTH) return showCodeLengthDialog()
    showLoadingDialog()

    const roomIDAndCode = await requestJoinPrivateRoom(code)
    if (roomIDAndCode === 'error') return showErrorDialog()
    if (roomIDAndCode === 'not-found') return showNotFoundDialog()

    setDialogData(baseDialogData)
    setTimeout(() => {
      localStorage.setItem('retryJoinPrivateRoomAttempt', '0')
    }, 1500)
    router.push(`private-room/${roomIDAndCode}`)
  }

  const showCodeLengthDialog = () => {
    setDialogData({
      open: true,
      text: t('JOIN_WITH_CODE_SCREEN.ERRORS.INVALID_CODE_CHARACTERS', { PRIVATE_CODE_LENGTH }),
      showSpinner: false,
      rightBtnFn: () => setDialogData(baseDialogData),
      rightBtnText: t('COMMON.ACCEPT')
    })
  }

  const showLoadingDialog = () => {
    setDialogData({
      open: true,
      text: t('JOIN_WITH_CODE_SCREEN.JOINING_ROOM'),
      showSpinner: true
    })
  }

  const showNotFoundDialog = () => {
    setDialogData({
      open: true,
      text: t('COMMON.ERRORS.ROOM_NOT_FOUND'),
      showSpinner: false,
      rightBtnFn: () => setDialogData(baseDialogData),
      rightBtnText: t('COMMON.ACCEPT')
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

  const getSectionTitleClass = () => {
    if (locale === 'ja' || locale === 'en') return ''
    return smaller_section_title
  }

  return (
    <div className="main">
      <Head>
        <title>{getTitleText()}</title>
        <meta name="description" content={t('JOIN_WITH_CODE_SCREEN.META_DESCRIPTION')} />
        <meta
          name="keywords"
          content="paperchat join private room, pictochat online, drawing online, live drawing app, nintendo pictochat, DS drawing app, by lietsaki"
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

        <div className={`screen ${bottom} ${locale === 'ja' ? ja : ''} ${getSectionTitleClass()}`}>
          <div className={bottom_top}>
            <p>{t('JOIN_WITH_CODE_SCREEN.SECTION_TITLE')}</p>
          </div>
          <div className={midsection}>
            <JoinRoomInput handleCodeSubmit={join} />
          </div>
          <div className={bottom_bottom}>
            <div className={bottom_btn_container}>
              <Button onClick={goHome} text={t('COMMON.CANCEL')} />
            </div>
          </div>

          <Dialog {...dialogData} />
        </div>
      </div>
    </div>
  )
}

export default JoinWithACode
