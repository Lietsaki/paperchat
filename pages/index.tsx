import styles from 'styles/home/home.module.scss'

const { top, bottom } = styles

const Home = () => {
  return (
    <div className="main">
      <div className="screens_section">
        <div className={`screen ${top}`}></div>
        <div className={`screen ${bottom}`}>
          <div>Find Rooms</div>
          <div>Create a Room</div>
          <div>I have a code</div>

          <div>
            <div>Username</div>
            <div>Cat12345</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
