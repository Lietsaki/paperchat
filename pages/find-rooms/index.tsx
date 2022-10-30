import general_styles from 'styles/options-screen/options.module.scss'
import RoomItem from 'components/RoomItem'
import PaperchatOctagon from 'components/PaperchatOctagon'
import Button from 'components/Button'
import { room } from 'types/Room'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { dialogOptions } from 'types/Dialog'
import { baseDialogData, shouldDisplayDialog } from 'components/Dialog'
import {
  searchForRooms,
  createRoom,
  SIMULTANEOUS_ROOMS_LIMIT,
  DAILY_ROOMS_LIMIT
} from 'firebase-config/realtimeDB'
import { playSound } from 'helpers/helperFunctions'
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
  higher_z_index
} = general_styles

const FindRooms = () => {
  const router = useRouter()

  const [rooms, setRooms] = useState<room[]>([])
  const [dialogData, setDialogData] = useState<dialogOptions>(baseDialogData)

  useEffect(() => {
    searchRooms()
  }, [])

  const searchRooms = async () => {
    setDialogData({ text: 'Searching for rooms...', open: true, showSpinner: true })
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
      text: 'An error occurred. Try again?',
      showSpinner: false,
      rightBtnText: 'Accept',
      rightBtnFn: () => searchRooms(),

      leftBtnText: 'Go home',
      leftBtnFn: () => router.push('/'),
      hideOnRightBtn: false
    })
  }

  const showNoRoomsDialog = () => {
    setDialogData({
      open: true,
      text: 'Found no rooms.',
      showSpinner: false,
      rightBtnText: 'Retry',
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
      text: `You can create up to ${DAILY_ROOMS_LIMIT} rooms per day. Try again tomorrow.`,
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

  const showCreateRoomErrorDialog = () => {
    setDialogData({
      open: true,
      text: 'There was an error. Please try again later.',
      showSpinner: false,
      rightBtnFn: () => router.push('/'),
      rightBtnText: 'Go home'
    })
  }

  const createPublicRoom = async () => {
    setDialogData({
      open: true,
      text: 'Creating your public room',
      showSpinner: true
    })
    const roomID = await createRoom(false)
    if (roomID === 'hit-creation-limit') return showCreationLimitDialog()
    if (roomID === 'joined-already') return showJoinedAlreadyDialog()
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
          <Button name="roomSearch" onClick={() => createPublicRoom()} text="Create room" />
        </div>
      )

    return (
      <div className={bottom_btn_container}>
        <Button
          name="roomSearch"
          debounce={30}
          debounceMounted
          onClick={() => searchRooms()}
          text="Search again"
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
        <title>Paperchat - Find Rooms</title>
        <meta
          name="description"
          content="Find online rooms to chat and draw in real time in this online Pictochat spiritual successor."
        />
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

        <div className={`screen ${bottom}`}>
          <div className={bottom_top}>
            <p>Choose a Chat Room to join</p>
          </div>

          {renderRooms()}

          <div className={`${bottom_bottom} ${higher_z_index} justify_evenly`}>
            <div className={bottom_btn_container}>
              <Button onClick={goHome} text="Cancel" />
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
