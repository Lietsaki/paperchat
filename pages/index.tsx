import styles from 'styles/home/home.module.scss'
import MenuButton from 'components/MenuButton'
import Button from 'components/Button'
import UsernameInput from 'components/UsernameInput'
import { useState } from 'react'

const {
  top,
  bottom,
  btn_search_rooms,
  btn_create_room,
  btn_join,
  username_input,
  editing_username,
  back_to_corner,
} = styles

const Home = () => {
  const [editingUsername, setEditingUsername] = useState(false)
  const [usernameAreaClasses, setUsernameAreaClasses] = useState(username_input)

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

  const saveUsername = () => {
    console.log('save username!')
  }

  return (
    <div className="main">
      <div className="screens_section">
        <div className={`screen ${top}`}></div>
        <div className={`screen ${bottom}`}>
          <div className={btn_search_rooms}>
            <MenuButton text="Search rooms" />
          </div>
          <div className={btn_create_room}>
            <MenuButton text="Create a room" />
          </div>
          <div className={btn_join}>
            <MenuButton text="Join with a code" />
          </div>

          <div onClick={editUsername} className={usernameAreaClasses}>
            <UsernameInput editing={editingUsername} />
            {editingUsername ? (
              <Button onClick={saveUsername} text="Save" />
            ) : null}
          </div>

          {editingUsernameModalCover()}
        </div>
      </div>
    </div>
  )
}

export default Home
