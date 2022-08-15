import general_styles from 'styles/options-screen/options.module.scss'
import page_styles from 'styles/room/room.module.scss'
import PaperchatOctagon from 'components/PaperchatOctagon'
import Keyboard from 'components/Keyboard'
import Canvas from 'components/Canvas'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { getRandomColor } from 'helpers/helperFunctions'
import keyboard from 'types/Keyboard'
import emitter from 'helpers/MittEmitter'

const { top, left_column, right_column, top_section, bottom_section } = general_styles

const {
  bottom,
  tools_column,
  canvas_column,
  canvas_area,
  canvas_bg,
  keyboard_area,
  top_arrow,
  down_arrow,
  send_buttons,
  send_buttons_bg,
  send,
  last_canvas,
  tool_container,
  active,
  active_on_click,
  pixelated_top_left,
  pencil,
  eraser,
  thick_stroke,
  thin_stroke,
  margin_bottom_sm,
  close_btn
} = page_styles

const FindRooms = () => {
  const router = useRouter()
  const [usingPencil, setUsingPencil] = useState(true)
  const [usingThickStroke, setUsingThickStroke] = useState(true)
  const [currentKeyboard, setCurrentKeyboard] = useState<keyboard>('alphanumeric')
  const [roomColor, setRoomColor] = useState(getRandomColor())

  const getButton = (condition: boolean, name: string) =>
    condition ? `/tool-buttons/selected/${name}.png` : `/tool-buttons/${name}.png`

  const clearCanvas = () => emitter.emit('clearCanvas', '')
  const typeKey = (key: string) => emitter.emit('typeKey', key)
  const typeSpace = () => emitter.emit('typeSpace', '')
  const typeEnter = () => emitter.emit('typeEnter', '')
  const typeDel = () => emitter.emit('typeDel', '')

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
            <div className={`${tool_container} ${top_arrow} ${active_on_click}`}>
              <img src="/tool-buttons/top-arrow.png" alt="top arrow button" />
              <img
                src="/tool-buttons/active/top-arrow.png"
                alt="active top button"
                className={active}
              />
            </div>

            <div className={`${tool_container} ${down_arrow} ${active_on_click}`}>
              <img
                src="/tool-buttons/down-arrow.png"
                alt="down arrow button"
                className={active_on_click}
              />
              <img
                src="/tool-buttons/active/down-arrow.png"
                alt="active down arrow button"
                className={active}
              />
            </div>

            <div className={`${tool_container} ${pencil}`} onClick={() => setUsingPencil(true)}>
              <img src={getButton(usingPencil, 'pencil')} alt="pencil button" />
            </div>

            <div className={`${tool_container} ${eraser}`} onClick={() => setUsingPencil(false)}>
              <img src={getButton(!usingPencil, 'eraser')} alt="eraser button" />
            </div>

            <div
              className={`${tool_container} ${thick_stroke}`}
              onClick={() => setUsingThickStroke(true)}
            >
              <img src={getButton(usingThickStroke, 'thick-stroke')} alt="thick stroke button" />
            </div>

            <div
              className={`${tool_container} ${thin_stroke}`}
              onClick={() => setUsingThickStroke(false)}
            >
              <img src={getButton(!usingThickStroke, 'thin-stroke')} alt="thin stroke button" />
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${margin_bottom_sm}`}
              onClick={() => setCurrentKeyboard('alphanumeric')}
            >
              <img
                src={getButton(currentKeyboard === 'alphanumeric', 'alphanumeric')}
                alt="alphanumeric button"
              />
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${margin_bottom_sm}`}
              onClick={() => setCurrentKeyboard('accents')}
            >
              <img src={getButton(currentKeyboard === 'accents', 'accents')} alt="accents button" />
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left} ${margin_bottom_sm}`}
              onClick={() => setCurrentKeyboard('symbols')}
            >
              <img src={getButton(currentKeyboard === 'symbols', 'symbols')} alt="symbols button" />
            </div>

            <div
              className={`${tool_container} ${pixelated_top_left}`}
              onClick={() => setCurrentKeyboard('smileys')}
            >
              <img src={getButton(currentKeyboard === 'smileys', 'smileys')} alt="smileys button" />
            </div>
          </div>

          <div className={`${close_btn} ${active_on_click}`}>
            <img src="/tool-buttons/close.png" alt="close button" />
            <img
              src="/tool-buttons/active/close.png"
              alt="active close button"
              className={active}
            />
          </div>
          <div className={canvas_column}>
            <div className={canvas_area}>
              <div className={canvas_bg}>
                <Canvas
                  usingPencil={usingPencil}
                  roomColor={roomColor}
                  usingThickStroke={usingThickStroke}
                />
              </div>

              <div className={keyboard_area}>
                <Keyboard
                  typeKey={typeKey}
                  typeSpace={typeSpace}
                  typeEnter={typeEnter}
                  typeDel={typeDel}
                  currentKeyboard={currentKeyboard}
                />
              </div>

              <div className={send_buttons}>
                <div className={send_buttons_bg}>
                  <div className={`${send} ${active_on_click}`}>
                    <img src="/send-buttons/SEND.png" alt="send button" />
                    <img
                      src="/send-buttons/active/SEND.png"
                      alt="active send button"
                      className={active}
                    />
                  </div>
                  <div className={`${last_canvas} ${active_on_click}`}>
                    <img src="/send-buttons/LAST-CANVAS.png" alt="last canvas button" />
                    <img
                      src="/send-buttons/active/LAST-CANVAS.png"
                      alt="active last canvas button"
                      className={active}
                    />
                  </div>
                  <div className={`${active_on_click}`} onClick={clearCanvas}>
                    <img src="/send-buttons/CLEAR.png" alt="clear button" />
                    <img
                      src="/send-buttons/active/CLEAR.png"
                      alt="active clear button"
                      className={active}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FindRooms
