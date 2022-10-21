import styles from 'styles/room/room.module.scss'

const {
  connection_indicator,
  top_line,
  center,
  antenna,
  head,
  stick,
  low_bar,
  mid_bar,
  high_bar,
  bottom_line,
  mid_connection,
  no_connection
} = styles

type ConnectionIndicatorProps = {}

const ConnectionIndicator = ({}: ConnectionIndicatorProps) => {
  return (
    <div className={`${connection_indicator}`}>
      <div className={top_line}></div>
      <div className={center}>
        <div className={antenna}>
          <div className={head}></div>
          <div className={stick}></div>
        </div>
        <div className={low_bar}></div>
        <div className={mid_bar}></div>
        <div className={high_bar}></div>
      </div>
      <div className={bottom_line}></div>
    </div>
  )
}

export default ConnectionIndicator
