import Spinner from './Spinner'
import Button from './Button'

type DialogProps = {
  showSpinner?: boolean
  text: string
  onOk?: () => void
  onCancel?: () => void
}

const Dialog = ({ showSpinner = false, text, onOk, onCancel }: DialogProps) => {
  const cancel = () => {
    if (!onCancel) return
    onCancel()
    document.querySelector('.dialog_layer_1')?.classList.add('go_down')
  }

  const accept = () => {
    if (!onOk) return
    onOk()
    document.querySelector('.dialog_layer_1')?.classList.add('go_down')
  }

  const getOptions = () => {
    if (onOk || onCancel) {
      return (
        <div className={`options ${onOk && onCancel ? 'justify_between' : ''}`}>
          {onCancel ? (
            <div className="options__left">
              <Button text="Cancel" onClick={cancel} />
            </div>
          ) : (
            ''
          )}

          {onOk ? (
            <div className="options__right">
              <Button text="Accept" onClick={accept} />
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

export default Dialog
