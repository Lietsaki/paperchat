import React, { useRef, useState } from 'react'
import styles from 'styles/components/paperchat-octagon.module.scss'

const {
  octagon_outside,
  octagon_outline,
  octagon_content,
  message,
  short_message,
  animate_growth,
  options_modal,
  download_message,
  hide_options,
  smaller_options
} = styles

type messageOctagonProps = { img_uri: string; color: string; id: string; shouldAnimate: boolean }

const messageOctagon = ({ img_uri, color, id, shouldAnimate }: messageOctagonProps) => {
  const outlineRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [shortMessage, setShortMessage] = useState(false)
  const [showingOptions, setShowingOptions] = useState(false)

  const handleLoad = () => {
    const rect = imgRef.current!.getBoundingClientRect()
    if (rect.height <= 60 && outlineRef.current && containerRef.current) {
      outlineRef.current.style.padding = '1.5px 0'
      outlineRef.current.style.height = '93%'
      containerRef.current.style.height = '99%'
      setShortMessage(true)
    }
  }

  const hideOptions = () => {
    const container = document.getElementById('messages-container')!
    document.removeEventListener('pointerdown', hideOptions)
    container.removeEventListener('scroll', hideOptions)
    const optionsModal = document.querySelector(`.${options_modal}`)
    optionsModal?.classList.add(hide_options)

    setTimeout(() => {
      setShowingOptions(false)
    }, 180)
  }

  const showOptions = (e: React.PointerEvent) => {
    if (showingOptions || e.button === 2) return
    setShowingOptions(true)

    // Curious note: If we used 'click' instead of 'pointerdown' here, hideOptions would fire immediately with
    // the same click that invoked showOptions. We'd have to setup the listeners in a timeout.
    // 'pointerdown' hides the options when the user starts drawing in the canvas, so it's more convenient.
    const container = document.getElementById('messages-container')
    document.addEventListener('pointerdown', hideOptions)
    container!.addEventListener('scroll', hideOptions)
  }

  const renderOptionsModal = () => {
    if (showingOptions) {
      return (
        <div className={`${options_modal} ${shortMessage ? smaller_options : ''}`}>
          <a className={download_message} href={img_uri} download={`paperchat-${id}.png`}>
            <span>Save Image</span>
            <img src="/icons/download-arrow.svg" />
          </a>
        </div>
      )
    }
    return ''
  }

  return (
    <div
      className={`${octagon_outside} ${message} ${shortMessage ? short_message : ''} ${
        shouldAnimate ? animate_growth : ''
      }`}
      id={id}
      onPointerUp={showOptions}
    >
      {renderOptionsModal()}
      <div className={octagon_outline} ref={outlineRef} style={{ backgroundColor: color }}>
        <div className={octagon_content} ref={containerRef}>
          <img src={img_uri} onLoad={handleLoad} ref={imgRef} />
        </div>
      </div>
    </div>
  )
}

export default messageOctagon
