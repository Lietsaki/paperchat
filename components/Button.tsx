import styles from 'styles/components/button.module.scss'
import { useEffect } from 'react'

const { button_outer, button_inner } = styles

type ButtonProps = {
  text: string
  onClick: () => void
  debounce?: number
}

const Button = ({ text, onClick, debounce }: ButtonProps) => {
  const intervalID: null = null

  useEffect(() => {
    if (!debounce) return
  }, [])

  setInterval(() => {})

  const triggerBtn = () => {
    onClick()
  }

  return (
    <button onClick={triggerBtn} className={button_outer}>
      <div className={button_inner}>{text}</div>
    </button>
  )
}

export default Button
