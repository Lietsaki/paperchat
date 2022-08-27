import styles from 'styles/components/paperchat-octagon.module.scss'

const { octagon_outside, octagon_outline, octagon_content, blur, paperchat_octagon } = styles

const PaperchatOctagon = () => {
  return (
    <div className={`${octagon_outside} ${blur} ${paperchat_octagon}`}>
      <div className={octagon_outline}>
        <div className={octagon_content}>Paperchat</div>
      </div>
    </div>
  )
}

export default PaperchatOctagon
