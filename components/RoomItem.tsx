import styles from 'styles/components/room-item.module.scss'

const {
  room_item,
  letter_segment,
  name_segment,
  users_segment,
  user_number_box,
  user_icon,
  users_number,
} = styles

type RoomItemProps = {
  name?: string
  users?: number
}

const Button = ({ name, users }: RoomItemProps) => {
  return (
    <div className={room_item}>
      <div className={letter_segment}></div>

      <div className={name_segment}>Chat Room A999</div>

      <div className={users_segment}>
        <div className={user_number_box}>
          <div className={user_icon}>
            <img src="/room-item-user.png" alt="user icon" />
          </div>
          <div className={users_number}>0/16</div>
        </div>
      </div>
    </div>
  )
}

export default Button
