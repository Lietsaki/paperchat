import general_styles from 'styles/options-screen/options.module.scss'
import RoomItem from 'components/RoomItem'
import PaperchatOctagon from 'components/PaperchatOctagon'
import Button from 'components/Button'
import { useRouter } from 'next/router'

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
  bottom_btn_container,
} = general_styles

const FindRooms = () => {
  const router = useRouter()

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
          <div className={bottom_content}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <RoomItem />
            </div>
          </div>
          <div className={bottom_bottom}>
            <div className={bottom_btn_container}>
              <Button onClick={() => router.push('/')} text="Cancel" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FindRooms
