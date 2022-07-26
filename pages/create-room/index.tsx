import general_styles from 'styles/options-screen/options.module.scss'
import PaperchatOctagon from 'components/PaperchatOctagon'
import Button from 'components/Button'
import { useRouter } from 'next/router'
import page_styles from 'styles/create-room/create-room.module.scss'
// import lock_icon from 'public/'

const {
  top,
  bottom,
  left_column,
  right_column,
  top_section,
  bottom_section,
  bottom_top,
  bottom_bottom,
  bottom_btn_container,
} = general_styles

const { option_cards, card, card__inner, title_row, title, icon, description } =
  page_styles

const JoinWithACode = () => {
  const router = useRouter()
  const selectRoom = (type: 'public' | 'private') => {
    console.log('We want to create a room with this type ', type)
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
            <p>What room type do you want to create?</p>
          </div>
          <div className={option_cards}>
            <div className={card}>
              <div className={card__inner}>
                <div className={title_row}>
                  <div className={title}>Public</div>
                  <div className={icon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="682.667"
                      height="682.667"
                      viewBox="0 0 512 512"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path d="M278 55.5V72l16.8.2 16.7.3.3 16.7.2 16.8h16.5H345v116.5V339h11 11l.2 50.3.3 50.2 72.3.3 72.2.2v-50.5V339h-16.5H479v-16.5V306h-33.5H412v-16.5V273h16.5H445v-17-17h17 17v-66.5V106h-17-17V89 72h-16.5H412V55.5 39h-67-67v16.5zM100 89v17H83.5 67v16.5V139H50 33l.2 66.7.3 66.8 16.8.3 16.7.2v16.5V306h16.5H100v16.5V339l-33.2.2-33.3.3-.3 16.7L33 373H16.5 0v50 50h167 167v-50-50h-16.5H301l-.2-16.7-.3-16.8-33.2-.3-33.3-.2v-16.5V306h16.5H267v-16.5V273l16.8-.2 16.7-.3V206v-66.5l-16.7-.3-16.8-.2v-16.5V106h-16.5H234l-.2-16.8-.3-16.7-66.7-.3L100 72v17z" />
                    </svg>
                  </div>
                </div>
                <div className={description}>
                  Your room will be listed and anyone can join
                </div>
              </div>
            </div>
            <div className={card}>
              <div className={card__inner}>
                <div className={title_row}>
                  <div className={title}>Private</div>
                  <div className={icon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="682.667"
                      height="682.667"
                      viewBox="0 0 512 512"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path d="M191 93v16h-16.5H158v32.5V174l-16.2.2-16.3.3-.3 16.2-.2 16.3h-16-16v98 98h16 16v16 16h131 131v-16-16h16 16v-98-98h-16-16l-.2-16.3-.3-16.2-16.2-.3-16.3-.2v-32.5V109h-16.5H321V93 77h-65-65v16zm130 48.5V174h-16-49-49-16v-32.5V109h65 65v32.5zM387 305v98H256 125v-98-98h131 131v98zm-163.5-31.8c-.3.7-.4 15.5-.3 32.8l.3 31.5H256h32.5V305v-32.5l-32.3-.3c-25.4-.2-32.4 0-32.7 1z" />
                    </svg>
                  </div>
                </div>
                <div className={description}>
                  Hidden room. Users join with an invitation code
                </div>
              </div>
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

export default JoinWithACode
