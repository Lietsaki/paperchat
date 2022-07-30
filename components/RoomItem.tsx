import styles from 'styles/components/room-item.module.scss'

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
  pencil_dots,
} = styles

type RoomItemProps = {
  name?: string
  users?: number
}

const Button = ({ name, users }: RoomItemProps) => {
  return (
    <div className={room_item}>
      <div className={letter_segment}>
        <div className={letter}>A</div>
        <div className={pencil}>
          <div className={pencil_body}>
            <div className={pencil_neck_line}></div>
            <div className={pencil_head}></div>
            <div className={pencil_dots}></div>
          </div>
        </div>
      </div>

      <div className={name_segment}>Chat Room A999</div>

      <div className={users_segment}>
        <div className={user_number_box}>
          <div className={user_icon}>
            <img src="/icons/room-item-user.png" alt="user icon" />
          </div>
          <div className={users_number}>0/16</div>
        </div>
      </div>
    </div>
  )
}

export default Button
