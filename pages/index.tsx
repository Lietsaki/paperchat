import styles from 'styles/home/home.module.scss'
import MenuButton from 'components/MenuButton'
import MuteSoundsButton from 'components/MuteSoundsButton'
import Button from 'components/Button'
import UsernameInput from 'components/UsernameInput'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, setUsername } from 'store/slices/userSlice'
import { initializeUsername, usernameMinLength } from 'store/initializer'
import { playSound } from 'helpers/helperFunctions'
import Link from 'next/link'

const {
  top,
  title,
  icon,
  title_text,
  attribution,
  privacy_link,
  bottom,
  btn_search_rooms,
  btn_create_room,
  btn_join,
  pressed,
  username_form,
  username_input,
  editing_username,
  back_to_corner,
  save_username_btn_container,
  sounds_btn
} = styles

const Home = () => {
  const router = useRouter()
  const { username } = useSelector(selectUser)
  const dispatch = useDispatch()

  const [editingUsername, setEditingUsername] = useState(false)
  const [usernameAreaClasses, setUsernameAreaClasses] = useState(username_input)

  const [usernameInputValue, setUsernameInputValue] = useState('')
  const [usernameBeingEdited, setUsernameBeingEdited] = useState('')

  const editUsername = () => {
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
    if (usernameBeingEdited.length < usernameMinLength) return
    dispatch(setUsername(usernameBeingEdited))
    localStorage.setItem('username', usernameBeingEdited)
    finishEditingUsername()
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    saveUsername()
  }

  useEffect(() => {
    initializeUsername()
  }, [])

  useEffect(() => {
    if (usernameInputValue && editingUsername) {
      finishEditingUsername()
    }
  }, [usernameInputValue])

  useEffect(() => {
    setUsernameInputValue(username)
  }, [username])

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
        <div className={`screen ${top}`}>
          <div className={title}>
            <span className={icon}>☺</span> <span className={title_text}>paperchat </span>
          </div>

          <div className={attribution}>
            <a href="https://github.com/lietsaki/paperchat" target="_blank">
              By Lietsaki - Fork me!
            </a>
          </div>

          <div className={privacy_link}>
            <span>
              v1.0.0 - <Link href="/privacy">Privacy</Link>
            </span>
          </div>
        </div>

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
                  <Button onClick={saveUsername} text="Save" />
                </div>
              ) : null}
            </form>
          </div>

          <div className={sounds_btn}>
            <MuteSoundsButton />
          </div>

          {editingUsernameModalCover()}
        </div>
      </div>
    </div>
  )
}

export default Home
