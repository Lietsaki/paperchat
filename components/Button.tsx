import styles from 'styles/components/button.module.scss'

const { button_outer, button_inner } = styles

type ButtonProps = {
  text: string
  onClick: () => void
}

const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} className={button_outer}>
      <div className={button_inner}>{text}</div>
    </button>
  )
}

export default Button
