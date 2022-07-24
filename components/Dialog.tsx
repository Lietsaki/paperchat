import Spinner from './Spinner'

type DialogProps = {
  showSpinner?: boolean
  // text: string
}

const MenuButton = ({ showSpinner = true }: DialogProps) => {
  return (
    <div className="dialog_layer_1">
      <div className="dialog_layer_2">
        <div className="dialog_content">
          <div className="spinner-area-left">
            {showSpinner ? <Spinner /> : null}
          </div>
          <div className="text">
            Looking for software available for download
          </div>
          <div className="spinner-area-right">
            {showSpinner ? <Spinner /> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuButton
