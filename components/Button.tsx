import styles from 'styles/components/button.module.scss'

const { button_outer, button_inner } = styles

type ButtonProps = {
  text: string
}

const Button = ({ text }: ButtonProps) => {
  return (
    <button className={button_outer}>
      <div className={button_inner}>{text}</div>
    </button>
  )
}

export default Button
