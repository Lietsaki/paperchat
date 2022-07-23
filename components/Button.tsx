import styles from 'styles/components/button.module.scss'

const { button_outer, button_inner, smaller } = styles

type ButtonProps = {
  is_small?: Boolean
  text: string
  onClick: () => void
}

const Button = ({ text, is_small, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${button_outer} ${is_small ? smaller : ''} `}
    >
      <div className={button_inner}>{text}</div>
    </button>
  )
}

export default Button
