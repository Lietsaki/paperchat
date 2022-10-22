import styles from 'styles/room/room.module.scss'
import { useState, useEffect } from 'react'
import emitter from 'helpers/MittEmitter'

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
  const [connectionLevel, setConnectionLevel] = useState(2)

  const getConnectionClass = () => {
    if (connectionLevel === 2) return ''
    if (connectionLevel === 1) return mid_connection
    if (connectionLevel === 0) return no_connection
  }

  useEffect(() => {
    emitter.on('lostConnection', () => setConnectionLevel(0))
    emitter.on('backOnline', () => setConnectionLevel(2))

    return () => {
      emitter.off('lostConnection')
      emitter.off('backOnline')
    }
  }, [])

  return (
    <div className={`${connection_indicator} ${getConnectionClass()}`}>
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
