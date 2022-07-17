import styles from 'styles/home/home.module.scss'
import MenuButton from 'components/MenuButton'
import UsernameInput from 'components/UsernameInput'

const {
  top,
  bottom,
  btn_search_rooms,
  btn_create_room,
  btn_join,
  username_input,
} = styles

const Home = () => {
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

          <div className={username_input}>
            <UsernameInput />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
