import general_styles from 'styles/options-screen/options.module.scss'
import RoomItem from 'components/RoomItem'
import PaperchatOctagon from 'components/PaperchatOctagon'
import Button from 'components/Button'
import { room } from 'types/Room'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { dialogOptions } from 'types/Dialog'
import { baseDialogData, shouldDisplayDialog } from 'components/Dialog'
import { searchForRooms, createRoom } from 'firebase-config/realtimeDB'

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
  bottom_btn_container
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
      rightBtnDebounceMounted: true,

      leftBtnText: 'Create room',
      leftBtnFn: () => createPublicRoom(),
      hideOnLeftBtn: false
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

  const renderRetryBtn = () => {
    if (!rooms.length) return ''

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

  return (
    <div className="main">
      <div className="screens_section">
        <div className={`screen ${top}`}>
          <div className={left_column}>
            <div className={top_section}></div>
            <div className="mid_section"></div>
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

          <div className={`${bottom_bottom} ${rooms.length ? 'justify_evenly' : ''}`}>
            <div className={bottom_btn_container}>
              <Button onClick={() => router.push('/')} text="Cancel" />
            </div>

            {renderRetryBtn()}
          </div>

          {shouldDisplayDialog(dialogData)}
        </div>
      </div>
    </div>
  )
}

export default FindRooms
