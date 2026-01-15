import Spinner from './Spinner'
import Button from './Button'
import { DialogProps } from 'types/Dialog'
import { useState, useEffect } from 'react'
import { store } from 'store/store'
import { App } from '@capacitor/app'
import emitter from 'helpers/MittEmitter'
import useTranslation from 'i18n/useTranslation'
import { Howl } from 'howler'

const baseDialogData: DialogProps = { text: '', open: false, showSpinner: false }

const Dialog = ({
  open,
  showSpinner,
  text,
  largeDialog,
  skipSmallJaText,

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
  const { locale } = useTranslation()
  const [audio] = useState<Howl>(new Howl({ src: ['/sounds/loading.mp3'], loop: true }))

  useEffect(() => {
    if (showSpinner && !store.getState().user.muteSounds && document.hidden === false) {
      audio.play()

      // Stop the sound when the app is in the foreground, and play it back when the user returns
      // We have to do this in all places where a looping sound is played, that is, only here.
      App.addListener('appStateChange', ({ isActive }) => {
        isActive ? audio.play() : audio.pause()
      })
    } else {
      audio.pause()
    }

    return () => {
      audio.pause()
      App.removeAllListeners()
      emitter.emit('removedAllCapacitorListeners', '')
    }
  }, [showSpinner])

  const triggerLeftBtn = () => {
    if (!leftBtnFn) return
    if (hideOnLeftBtn) {
      document.querySelector('.dialog_layer_1')?.classList.add('go_down')
      return setTimeout(() => leftBtnFn(), 450)
    }
    leftBtnFn()
  }

  const triggerRightBtn = () => {
    if (!rightBtnFn) return
    if (hideOnRightBtn) {
      document.querySelector('.dialog_layer_1')?.classList.add('go_down')
      return setTimeout(() => rightBtnFn(), 450)
    }
    rightBtnFn()
  }

  const getButtonSpacingClass = () => {
    if (leftBtnFn && rightBtnFn && !largeDialog) {
      return 'justify_between_around'
    }

    if (leftBtnFn && rightBtnFn && largeDialog) {
      return 'justify_around'
    }

    return ''
  }

  const getJaTextClass = () => {
    if (locale !== 'ja' || skipSmallJaText) return ''
    return 'ja'
  }

  const getOptions = () => {
    if (leftBtnFn || rightBtnFn) {
      return (
        <div className={`options ${getButtonSpacingClass()}`}>
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

  if (!open) return null

  return (
    <div className="dialog_container">
      <div className={`dialog_layer_1 go_up ${largeDialog ? 'large_dialog' : ''} ${locale}`}>
        <div className="dialog_layer_2">
          <div className="dialog_content">
            <div className="spinner-area-left">{showSpinner ? <Spinner /> : null}</div>
            <div className={`text ${getJaTextClass()}`}>{text}</div>
            <div className="spinner-area-right">{showSpinner ? <Spinner /> : null}</div>

            {getOptions()}
          </div>
        </div>
      </div>
    </div>
  )
}

export { Dialog, baseDialogData }
