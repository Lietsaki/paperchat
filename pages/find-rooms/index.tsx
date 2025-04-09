import general_styles from 'styles/options-screen/options.module.scss'
import RoomItem from 'components/RoomItem'
import PaperchatOctagon from 'components/PaperchatOctagon'
import Button from 'components/Button'
import { Room } from 'types/Room'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { DialogOptions } from 'types/Dialog'
import { baseDialogData, shouldDisplayDialog } from 'components/Dialog'
import {
  searchForRooms,
  createRoom,
  SIMULTANEOUS_ROOMS_LIMIT,
  DAILY_ROOMS_LIMIT
} from 'firebase-config/realtimeDB'
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
  room_list,
  bottom_bottom,
  bottom_btn_container,
  dotted_border,
  higher_z_index,
  cn: cn_general_styles
} = general_styles

const FindRooms = () => {
  const router = useRouter()
  const { t, locale } = useTranslation()
  const getTitleText = () => `Paperchat - ${t('SEARCH_ROOMS_SCREEN.PAGE_TITLE')}`

  const [rooms, setRooms] = useState<Room[]>([])
  const [dialogData, setDialogData] = useState<DialogOptions>(baseDialogData)

  useEffect(() => {
    searchRooms()
  }, [])

  const searchRooms = async () => {
    setDialogData({ text: t('SEARCH_ROOMS_SCREEN.SEARCHING'), open: true, showSpinner: true })
    const rooms = await searchForRooms()
    if (rooms === 'error') return showSearchErrorDialog()

    setRooms(rooms)
    if (!rooms.length) {
      showNoRoomsDialog()
    } else {
      setDialogData(baseDialogData)
    }
  }

  const showSearchErrorDialog = () => {
    setDialogData({
      open: true,
      text: t('SEARCH_ROOMS_SCREEN.ERROR_TRY_AGAIN'),
      showSpinner: false,
      rightBtnText: t('COMMON.ACCEPT'),
      rightBtnFn: () => searchRooms(),

      leftBtnText: t('COMMON.GO_HOME'),
      leftBtnFn: () => router.push('/'),
      hideOnRightBtn: false
    })
  }

  const showNoRoomsDialog = () => {
    setDialogData({
      open: true,
      text: t('SEARCH_ROOMS_SCREEN.NO_ROOMS'),
      showSpinner: false,
      rightBtnText: t('COMMON.RETRY'),
      rightBtnFn: () => searchRooms(),
      hideOnRightBtn: false,

      rightBtnDebounce: 20,
      rightBtnName: 'retryRoomSearch',
      rightBtnDebounceMounted: true
    })
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

  const showCreateRoomErrorDialog = () => {
    setDialogData({
      open: true,
      text: t('COMMON.ERRORS.GENERIC'),
      showSpinner: false,
      rightBtnFn: () => router.push('/'),
      rightBtnText: t('COMMON.GO_HOME')
    })
  }

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
    if (roomID === 'error') return showCreateRoomErrorDialog()
    setDialogData(baseDialogData)
    router.push(`room/${roomID}`)
  }

  const renderRooms = () => {
    return (
      <div className={`${room_list} scrollify`}>
        {rooms.map((room) => {
          return (
            <RoomItem
              key={room.id}
              code={room.code}
              usersNumber={room.usersNumber}
              onClick={() => goToRoom(room.id!)}
            />
          )
        })}
      </div>
    )
  }

  const renderRightBtn = () => {
    if (!rooms.length)
      return (
        <div className={bottom_btn_container}>
          <Button
            name="roomSearch"
            onClick={() => createPublicRoom()}
            text={t('SEARCH_ROOMS_SCREEN.CREATE_ROOM')}
          />
        </div>
      )

    return (
      <div className={bottom_btn_container}>
        <Button
          name="roomSearch"
          debounce={30}
          debounceMounted
          onClick={() => searchRooms()}
          text={t('SEARCH_ROOMS_SCREEN.SEARCH_AGAIN')}
        />
      </div>
    )
  }

  const goToRoom = async (roomID: string) => router.push('room/' + roomID)

  const goHome = () => {
    playSound('cancel', 0.5)
    router.push('/')
  }

  return (
    <div className="main">
      <Head>
        <title>{getTitleText()}</title>
        <meta name="description" content={t('SEARCH_ROOMS_SCREEN.META_DESCRIPTION')} />
        <meta
          name="keywords"
          content="paperchat find rooms, pictochat online, drawing online, live drawing app, nintendo pictochat, DS drawing app, by lietsaki"
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

        <div className={`screen ${bottom} ${locale === 'cn' ? cn_general_styles : ''}`}>
          <div className={bottom_top}>
            <p>{t('SEARCH_ROOMS_SCREEN.SECTION_TITLE')}</p>
          </div>

          {renderRooms()}

          <div className={`${bottom_bottom} ${higher_z_index} justify_evenly`}>
            <div className={bottom_btn_container}>
              <Button onClick={goHome} text={t('COMMON.CANCEL')} />
            </div>

            {renderRightBtn()}
          </div>

          {shouldDisplayDialog(dialogData)}
        </div>
      </div>
    </div>
  )
}

export default FindRooms
