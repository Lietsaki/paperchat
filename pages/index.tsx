import styles from 'styles/home/home.module.scss'
import MenuButton from 'components/MenuButton'
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
} = styles

const Home = () => {
  const [editingUsername, setEditingUsername] = useState(false)
  const editUsername = () => (editingUsername ? '' : setEditingUsername(true))

  const editingUsernameModalCover = () => {
    return editingUsername ? (
      <div onClick={() => setEditingUsername(false)} className="modal_cover" />
    ) : (
      ''
    )
  }
  const getUsernameAreaClasses = () => {
    return `${username_input} ${editingUsername ? editing_username : ''}`
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

          <div onClick={editUsername} className={getUsernameAreaClasses()}>
            <UsernameInput editing={editingUsername} />
          </div>

          {editingUsernameModalCover()}
        </div>
      </div>
    </div>
  )
}

export default Home
