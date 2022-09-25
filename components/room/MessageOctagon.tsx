import { useRef, useState } from 'react'
import styles from 'styles/components/paperchat-octagon.module.scss'

const {
  octagon_outside,
  octagon_outline,
  octagon_content,
  message,
  short_message,
  animate_growth
} = styles

type messageOctagonProps = { img_uri: string; color: string; id: string; shouldAnimate: boolean }

const messageOctagon = ({ img_uri, color, id, shouldAnimate }: messageOctagonProps) => {
  const outlineRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [shortMessage, setShortMessage] = useState(false)

  const handleLoad = () => {
    const rect = imgRef.current!.getBoundingClientRect()
    if (rect.height <= 60 && outlineRef.current && containerRef.current) {
      outlineRef.current.style.padding = '1.5px 0'
      outlineRef.current.style.height = '93%'
      containerRef.current.style.height = '99%'
      setShortMessage(true)
    }
  }

  return (
    <div
      className={`${octagon_outside} ${message} ${shortMessage ? short_message : ''} ${
        shouldAnimate ? animate_growth : ''
      }`}
      id={id}
    >
      <div className={octagon_outline} ref={outlineRef} style={{ backgroundColor: color }}>
        <div className={octagon_content} ref={containerRef}>
          <img src={img_uri} onLoad={handleLoad} ref={imgRef} />
        </div>
      </div>
    </div>
  )
}

export default messageOctagon
