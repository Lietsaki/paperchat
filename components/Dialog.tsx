import Spinner from './Spinner'
import Button from './Button'
import { dialogOptions } from 'types/Dialog'

type DialogProps = {
  text: string
  showSpinner?: boolean
  leftBtnText?: string
  rightBtnText?: string
  leftBtnFn?: () => void
  rightBtnFn?: () => void
  hideOnLeftBtn?: boolean
  hideOnRightBtn?: boolean
}

const Dialog = ({
  showSpinner,
  text,
  leftBtnText,
  rightBtnText,
  leftBtnFn,
  rightBtnFn,
  hideOnLeftBtn = true,
  hideOnRightBtn = true
}: DialogProps) => {
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
          {leftBtnFn ? (
            <div className="options__left">
              <Button text={leftBtnText!} onClick={triggerLeftBtn} />
            </div>
          ) : (
            ''
          )}

          {rightBtnFn ? (
            <div className="options__right">
              <Button text={rightBtnText!} onClick={triggerRightBtn} />
            </div>
          ) : (
            ''
          )}
        </div>
      )
    }
  }

  return (
    <div className="dialog_layer_1 go_up">
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
