import styles from 'styles/home/home.module.scss'
import MenuButton from 'components/MenuButton'
import Button from 'components/Button'
import UsernameInput from 'components/UsernameInput'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, setUsername } from 'store/slices/userSlice'
import { usernameMinLength } from 'store/initializer'
import { playSound } from 'helpers/helperFunctions'

const {
  top,
  bottom,
  btn_search_rooms,
  btn_create_room,
  btn_join,
  pressed,
  username_form,
  username_input,
  editing_username,
  back_to_corner,
  save_username_btn_container
} = styles

const Home = () => {
  const router = useRouter()
  const [editingUsername, setEditingUsername] = useState(false)
  const [usernameAreaClasses, setUsernameAreaClasses] = useState(username_input)

  const [usernameInputValue, setUsernameInputValue] = useState(useSelector(selectUser).username)
  const [usernameBeingEdited, setUsernameBeingEdited] = useState('')
  const dispatch = useDispatch()

  const editUsername = () => {
    setEditingUsername(true)
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

  const saveUsername = (savedUsername: string) => {
    if (savedUsername.length < usernameMinLength) return
    setUsernameInputValue(savedUsername)
    dispatch(setUsername(savedUsername))
    localStorage.setItem('username', savedUsername)
    finishEditingUsername()
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    saveUsername(usernameBeingEdited)
  }

  useEffect(() => {
    if (usernameInputValue && editingUsername) {
      finishEditingUsername()
    }
  }, [usernameInputValue])

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

  return (
    <div className="main">
      <div className="screens_section">
        <div className={`screen ${top}`}></div>
        <div className={`screen ${bottom}`}>
          <div className={btn_search_rooms}>
            <MenuButton onClick={goToFindRooms} text="Search rooms" />
          </div>
          <div className={btn_create_room}>
            <MenuButton onClick={goToCreateRoom} text="Create a room" />
          </div>
          <div className={btn_join}>
            <MenuButton onClick={goToJoinRoom} text="Join with a code" />
          </div>

          <div onClick={editUsername} className={usernameAreaClasses}>
            <form className={username_form} onSubmit={handleFormSubmit}>
              <UsernameInput
                editing={editingUsername}
                receivedValue={usernameInputValue}
                setUsernameBeingEdited={setUsernameBeingEdited}
              />

              {editingUsername ? (
                <div className={save_username_btn_container}>
                  <Button onClick={() => saveUsername(usernameBeingEdited)} text="Save" />
                </div>
              ) : null}
            </form>
          </div>

          {editingUsernameModalCover()}
        </div>
      </div>
    </div>
  )
}

export default Home
