import styles from 'styles/options-screen/options.module.scss'
import PaperchatOctagon from 'components/PaperchatOctagon'
import Button from 'components/Button'

const {
  top,
  bottom,
  left_column,
  right_column,
  top_section,
  bottom_section,
  bottom_top,
  bottom_content,
  bottom_bottom,
} = styles

const Home = () => {
  return (
    <div className="main">
      <div className="main_section">
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
          <div className={bottom_top}></div>
          <div className={bottom_content}></div>
          <div className={bottom_bottom}>
            <Button text="Cancel" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
