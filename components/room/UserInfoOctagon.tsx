import styles from 'styles/components/paperchat-octagon.module.scss'
import useTranslation from 'i18n/useTranslation'

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
  ja
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

  const leaving = (
    <>
      <div className={now_leaving}>
        {t('ROOM.NOW_LEAVING')} <span className={room_code}>{roomCode}</span>
      </div>
      <span className={two_dots}>:</span> {userLeaving}
    </>
  )

  const entering = (
    <>
      <div className={now_entering}>
        {t('ROOM.NOW_ENTERING')} <span className={room_code}>{roomCode}</span>
      </div>
      <span className={two_dots}>:</span> {userEntering}
    </>
  )

  return (
    <div
      className={`${octagon_outside} ${blur} ${info} ${shouldAnimate ? animate_growth : ''} ${
        locale === 'ja' ? ja : ''
      }`}
      id={id}
    >
      <div className={octagon_outline}>
        <div className={octagon_content}>{userEntering ? entering : leaving}</div>
      </div>
    </div>
  )
}

export default UserInfoOctagon
