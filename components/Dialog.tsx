import Spinner from './Spinner'
import Button from './Button'
import { dialogOptions, DialogProps } from 'types/Dialog'
import { useState, useEffect } from 'react'
import { store } from 'store/store'
import { App } from '@capacitor/app'

const Dialog = ({
  showSpinner,
  text,
  largeDialog,

  leftBtnText,
  leftBtnFn,
  hideOnLeftBtn = true,

  rightBtnText,
  rightBtnFn,
  hideOnRightBtn = true,

  rightBtnDebounce,
  rightBtnName,
  rightBtnDebounceMounted
}: DialogProps) => {
  const [audio, setAudio] = useState<null | HTMLAudioElement>(null)

  useEffect(() => {
    if (showSpinner && !store.getState().user.muteSounds) {
      setAudio(new Audio('/sounds/loading.m4a'))
    } else {
      audio?.pause()
      setAudio(null)
    }
  }, [showSpinner])

  useEffect(() => {
    if (audio) {
      audio.loop = true
      audio.play()

      // Stop the sound when the app is in the foreground, and play it back when the user returns
      // We have to do this in all places where a looping sound is played, that is, only here.
      App.addListener('appStateChange', ({ isActive }) => {
        if (!isActive) {
          audio.loop = false
        } else {
          audio.loop = true
          audio.play()
        }
      })
    }

    return () => {
      if (audio) {
        audio.loop = false
        audio.currentTime = 1
        App.removeAllListeners()
      }
    }
  }, [audio])

  const triggerLeftBtn = () => {
    if (!leftBtnFn) return
    if (hideOnLeftBtn) {
      document.querySelector('.dialog_layer_1')?.classList.add('go_down')
      return setTimeout(() => leftBtnFn(), 400)
    }
    leftBtnFn()
  }

  const triggerRightBtn = () => {
    if (!rightBtnFn) return
    if (hideOnRightBtn) {
      document.querySelector('.dialog_layer_1')?.classList.add('go_down')
      return setTimeout(() => rightBtnFn(), 400)
    }
    rightBtnFn()
  }

  const getOptions = () => {
    if (leftBtnFn || rightBtnFn) {
      return (
        <div className={`options ${leftBtnFn && rightBtnFn ? 'justify_between_around' : ''}`}>
          {leftBtnFn && leftBtnText ? (
            <div className="options__left">
              <Button text={leftBtnText} onClick={triggerLeftBtn} />
            </div>
          ) : (
            ''
          )}

          {rightBtnFn && rightBtnText ? (
            <div className="options__right">
              <Button
                text={rightBtnText}
                onClick={triggerRightBtn}
                debounce={rightBtnDebounce}
                name={rightBtnName}
                debounceMounted={rightBtnDebounceMounted}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      )
    }
  }

  return (
    <div className={`dialog_layer_1 go_up ${largeDialog ? 'large_dialog' : ''}`}>
      <div className="dialog_layer_2">
        <div className="dialog_content">
          <div className="spinner-area-left">{showSpinner ? <Spinner /> : null}</div>
          <div className="text">{text}</div>
          <div className="spinner-area-right">{showSpinner ? <Spinner /> : null}</div>

          {getOptions()}
        </div>
      </div>
    </div>
  )
}

const baseDialogData: dialogOptions = { text: '', open: false, showSpinner: false }

const shouldDisplayDialog = (dialogData: dialogOptions) => {
  const { open, ...restOfProps } = dialogData
  if (!open) return

  return (
    <div className="dialog_container">
      <Dialog {...restOfProps} />
    </div>
  )
}

export { Dialog, baseDialogData, shouldDisplayDialog }
