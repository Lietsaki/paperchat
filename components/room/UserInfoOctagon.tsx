import styles from 'styles/components/paperchat-octagon.module.scss'
import useTranslation from 'i18n/useTranslation'
import { containsNonLatinChars } from 'helpers/helperFunctions'

const {
  octagon_outside,
  octagon_outline,
  octagon_content,
  blur,
  info,
  now_entering,
  now_leaving,
  room_code,
  two_dots,
  animate_growth,
  ja,
  small_username_text
} = styles

type UserInfoOctagonProps = {
  userEntering?: string
  userLeaving?: string
  shouldAnimate: boolean
  id: string
  roomCode: string
}

const UserInfoOctagon = ({
  id,
  userEntering,
  userLeaving,
  shouldAnimate,
  roomCode
}: UserInfoOctagonProps) => {
  const { t, locale } = useTranslation()

  const getLeavingMsg = () => {
    const css_class = containsNonLatinChars(userLeaving!) ? small_username_text : ''

    return (
      <>
        <div className={now_leaving}>
          {t('ROOM.NOW_LEAVING')} <span className={room_code}>{roomCode}</span>
        </div>
        <span className={two_dots}>:</span> <span className={css_class}>{userLeaving}</span>
      </>
    )
  }

  const getEnteringMsg = () => {
    const css_class = containsNonLatinChars(userEntering!) ? small_username_text : ''

    return (
      <>
        <div className={now_entering}>
          {t('ROOM.NOW_ENTERING')} <span className={room_code}>{roomCode}</span>
        </div>
        <span className={two_dots}>:</span> <span className={css_class}>{userEntering}</span>
      </>
    )
  }

  return (
    <div
      className={`${octagon_outside} ${blur} ${info} ${shouldAnimate ? animate_growth : ''} ${
        locale === 'ja' ? ja : ''
      }`}
      id={id}
    >
      <div className={octagon_outline}>
        <div className={octagon_content}>{userEntering ? getEnteringMsg() : getLeavingMsg()}</div>
      </div>
    </div>
  )
}

export default UserInfoOctagon
