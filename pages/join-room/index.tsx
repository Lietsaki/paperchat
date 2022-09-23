import general_styles from 'styles/options-screen/options.module.scss'
import PaperchatOctagon from 'components/PaperchatOctagon'
import Button from 'components/Button'
import { useRouter } from 'next/router'
import JoinRoomInput from 'components/JoinRoomInput'
import page_styles from 'styles/join-room/join-room.module.scss'
import Dialog from 'components/Dialog'

const {
  top,
  bottom,
  left_column,
  right_column,
  top_section,
  bottom_section,
  bottom_top,
  bottom_bottom,
  bottom_btn_container
} = general_styles

const { midsection } = page_styles

const JoinWithACode = () => {
  const router = useRouter()
  const join = (code: string) => {
    console.log('we want to join with this code ', code)
  }

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
            <p>Join a private room with an invitation code</p>
          </div>
          <div className={midsection}>
            {/* <JoinRoomInput handleCodeSubmit={join} /> */}
            <Dialog />
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

export default JoinWithACode
