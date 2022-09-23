import styles from 'styles/components/paperchat-octagon.module.scss'

const { octagon_outside, octagon_outline, octagon_content, blur, paperchat_octagon } = styles
type PaperchatOctagonProps = { id?: string }

const PaperchatOctagon = ({ id }: PaperchatOctagonProps) => {
  return (
    <div className={`${octagon_outside} ${blur} ${paperchat_octagon}`} id={id}>
      <div className={octagon_outline}>
        <div className={octagon_content}>Paperchat</div>
      </div>
    </div>
  )
}

export default PaperchatOctagon
