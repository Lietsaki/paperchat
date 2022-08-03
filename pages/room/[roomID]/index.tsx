import general_styles from 'styles/options-screen/options.module.scss'
import page_styles from 'styles/room/room.module.scss'
import PaperchatOctagon from 'components/PaperchatOctagon'
import Keyboard from 'components/Keyboard'
import { useRouter } from 'next/router'
import { useState } from 'react'

const { top, left_column, right_column, top_section, bottom_section } = general_styles

const {
  bottom,
  tools_column,
  canvas_column,
  canvas_area,
  canvas_bg,
  canvas_outline,
  canvas_content,
  keyboard_area,
  keyboard_bg,
  send_buttons,
  tool_container,
  active,
  active_on_click,
  pixelated_top_left,
  arrows_section,
  pencil_section,
  pencil_and_eraser,
  strokes,
  keyboards_section,
  close_btn
} = page_styles

type keyboard = 'alphanumeric' | 'accents' | 'symbols' | 'smileys'

const FindRooms = () => {
  const router = useRouter()
  const [usingPencil, setUsingPencil] = useState(true)
  const [usingThickStroke, setUsingThickStroke] = useState(true)
  const [currentKeyboard, setCurrentKeyboard] = useState<keyboard>('alphanumeric')

  const getButton = (condition: boolean, name: string) =>
    condition ? `/tool-buttons/selected/${name}.png` : `/tool-buttons/${name}.png`

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
            <div className={arrows_section}>
              <div className={`${tool_container} ${active_on_click}`}>
                <img src="/tool-buttons/top-arrow.png" alt="arrow top button" />
                <img
                  src="/tool-buttons/active/top-arrow.png"
                  alt="arrow top button active"
                  className={active}
                />
              </div>
              <div className={`${tool_container} ${active_on_click}`}>
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
            </div>
            <div className={pencil_section}>
              <div className={pencil_and_eraser}>
                <div className={tool_container} onClick={() => setUsingPencil(true)}>
                  <img src={getButton(usingPencil, 'pencil')} alt="pencil button" />
                </div>
                <div className={tool_container} onClick={() => setUsingPencil(false)}>
                  <img src={getButton(!usingPencil, 'eraser')} alt="eraser button" />
                </div>
              </div>
              <div className={strokes}>
                <div className={tool_container} onClick={() => setUsingThickStroke(true)}>
                  <img
                    src={getButton(usingThickStroke, 'thick-stroke')}
                    alt="thick stroke button"
                  />
                </div>
                <div className={tool_container} onClick={() => setUsingThickStroke(false)}>
                  <img src={getButton(!usingThickStroke, 'thin-stroke')} alt="thin stroke button" />
                </div>
              </div>
            </div>

            <div className={keyboards_section}>
              <div
                className={`${tool_container} ${pixelated_top_left}`}
                onClick={() => setCurrentKeyboard('alphanumeric')}
              >
                <img
                  src={getButton(currentKeyboard === 'alphanumeric', 'alphanumeric')}
                  alt="alphanumeric button"
                />
              </div>
              <div
                className={`${tool_container} ${pixelated_top_left}`}
                onClick={() => setCurrentKeyboard('accents')}
              >
                <img
                  src={getButton(currentKeyboard === 'accents', 'accents')}
                  alt="accents button"
                />
              </div>
              <div
                className={`${tool_container} ${pixelated_top_left}`}
                onClick={() => setCurrentKeyboard('symbols')}
              >
                <img
                  src={getButton(currentKeyboard === 'symbols', 'symbols')}
                  alt="symbols button"
                />
              </div>
              <div
                className={`${tool_container} ${pixelated_top_left}`}
                onClick={() => setCurrentKeyboard('smileys')}
              >
                <img
                  src={getButton(currentKeyboard === 'smileys', 'smileys')}
                  alt="smileys button"
                />
              </div>
            </div>
          </div>
          <div className={close_btn}>
            <img src="/tool-buttons/close.png" alt="arrow top button" className={active_on_click} />
            <img
              src="/tool-buttons/active/close.png"
              alt="arrow top button active"
              className={active}
            />
          </div>
          <div className={canvas_column}>
            <div className={canvas_area}>
              <div className={canvas_bg}>
                <div className={canvas_outline}>
                  <div className={canvas_content}></div>
                </div>
              </div>

              <div className={keyboard_area}>
                <Keyboard />
              </div>

              <div className={send_buttons}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FindRooms
