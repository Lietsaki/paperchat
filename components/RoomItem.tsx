import styles from 'styles/components/room-item.module.scss'
import { USERS_LIMIT } from 'firebase-config/realtimeDB'

const {
  room_item,
  letter_segment,
  name_segment,
  users_segment,
  user_number_box,
  user_icon,
  users_number,
  letter,
  pencil,
  pencil_body,
  pencil_neck_line,
  pencil_head,
  pencil_dots
} = styles

type RoomItemProps = {
  code: string
  usersNumber: number
  onClick: () => void
}

const Button = ({ code, usersNumber, onClick }: RoomItemProps) => {
  return (
    <div className={room_item} onClick={onClick}>
      <div className={letter_segment}>
        <div className={letter}>{code[0]}</div>
        <div className={pencil}>
          <div className={pencil_body}>
            <div className={pencil_neck_line}></div>
            <div className={pencil_head}></div>
            <div className={pencil_dots}></div>
          </div>
        </div>
      </div>

      <div className={name_segment}>Chat Room {code}</div>

      <div className={users_segment}>
        <div className={user_number_box}>
          <div className={user_icon}>
            <img src="/icons/room-item-user.png" alt="user icon" />
          </div>
          <div className={users_number}>
            {usersNumber}/{USERS_LIMIT}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Button
