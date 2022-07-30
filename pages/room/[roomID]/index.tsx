import general_styles from 'styles/options-screen/options.module.scss'
import page_styles from 'styles/room/room.module.scss'
import PaperchatOctagon from 'components/PaperchatOctagon'
import { useRouter } from 'next/router'

const { top, left_column, right_column, top_section, bottom_section } =
  general_styles

const {
  bottom,
  tools_column,
  canvas_column,
  tool_container,
  active,
  active_on_click,
} = page_styles

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
          <div className={tools_column}>
            <div className={tool_container}>
              <img
                src="/tool-buttons/top-arrow.png"
                alt="arrow top button"
                className={active_on_click}
              />
              <img
                src="/tool-buttons/active/top-arrow.png"
                alt="arrow top button active"
                className={active}
              />
            </div>
            <div className={tool_container}>
              <img
                src="/tool-buttons/down-arrow.png"
                alt="arrow down button"
                className={active_on_click}
              />
              <img
                src="/tool-buttons/active/down-arrow.png"
                alt="arrow down button active"
                className={active}
              />
            </div>
            <div className={tool_container}>
              <img
                src="/tool-buttons/selected/pencil.png"
                alt="pencil button"
              />
            </div>
            <div className={tool_container}>
              <img src="/tool-buttons/eraser.png" alt="eraser button" />
            </div>
            <div className={tool_container}>
              <img
                src="/tool-buttons/selected/thick-stroke.png"
                alt="thick stroke button"
              />
            </div>
          </div>
          <div className={canvas_column}></div>
        </div>
      </div>
    </div>
  )
}

export default FindRooms
