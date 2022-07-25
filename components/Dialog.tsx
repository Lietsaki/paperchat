import Spinner from './Spinner'
import Button from './Button'

type DialogProps = {
  showSpinner?: boolean
  hasOptions?: boolean
  // text: string
}

const MenuButton = ({
  showSpinner = false,
  hasOptions = true,
}: DialogProps) => {
  const cancel = () => {
    console.log('user hit cancel')
    document.querySelector('.dialog_layer_1')?.classList.add('go_down')
  }
  const accept = () => {
    console.log('user accepted')
    document.querySelector('.dialog_layer_1')?.classList.add('go_down')
  }

  const getOptions = () => {
    if (hasOptions) {
      return (
        <div className="options">
          <div className="options__left">
            <Button text="Cancel" onClick={cancel} />
          </div>
          <div className="options__right">
            <Button text="Accept" onClick={accept} />
          </div>
        </div>
      )
    }
  }

  return (
    <div className="dialog_layer_1 go_up">
      <div className="dialog_layer_2">
        <div className="dialog_content">
          <div className="spinner-area-left">
            {showSpinner ? <Spinner /> : null}
          </div>
          <div className="text">Do you want to download this?</div>
          <div className="spinner-area-right">
            {showSpinner ? <Spinner /> : null}
          </div>

          {getOptions()}
        </div>
      </div>
    </div>
  )
}

export default MenuButton
