import styles from 'styles/components/paperchat-octagon.module.scss'

const { octagon_outside, octagon_outline, octagon_content, blur, info, now_entering, now_leaving } =
  styles

type userInfoOctagonProps = {
  userEntering?: string
  userLeaving?: string
  id: string
}

const UserInfoOctagon = ({ id, userEntering, userLeaving }: userInfoOctagonProps) => {
  const leaving = (
    <>
      <span className={now_leaving}>Now leaving</span>: {userLeaving}
    </>
  )

  const entering = (
    <>
      <span className={now_entering}>Now entering</span>: {userEntering}
    </>
  )

  return (
    <div className={`${octagon_outside} ${blur} ${info}`} id={id}>
      <div className={octagon_outline}>
        <div className={octagon_content}>{userEntering ? entering : leaving}</div>
      </div>
    </div>
  )
}

export default UserInfoOctagon
