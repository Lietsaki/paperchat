import styles from 'styles/components/paperchat-octagon.module.scss'

const {
  paperchat_octagon_outside,
  paperchat_octagon_white,
  paperchat_octagon_inside,
} = styles

const PaperchatOctagon = () => {
  return (
    <div className={paperchat_octagon_outside}>
      <div className={paperchat_octagon_white}>
        <div className={paperchat_octagon_inside}>Paperchat</div>
      </div>
    </div>
  )
}

export default PaperchatOctagon
