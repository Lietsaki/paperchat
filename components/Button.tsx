import styles from 'styles/components/button.module.scss'
import { useState, useEffect } from 'react'

const { button_outer, button_inner, smaller_font } = styles

type ButtonProps = {
  text: string
  onClick: () => void
  debounce?: number
  name?: string
  debounceMounted?: boolean
}

const Button = ({ text, onClick, name, debounce = 0, debounceMounted }: ButtonProps) => {
  const [time, setTime] = useState<null | number>(null)

  useEffect(() => {
    if (debounceMounted && debounce && name) {
      const latestDebounce = localStorage.getItem(name)
      setTime(latestDebounce ? Number(latestDebounce) : debounce)
    }
  }, [])

  useEffect(() => {
    if (!time) return

    setTimeout(() => {
      setTime(time - 1)
      localStorage.setItem(name, time - 1)
    }, 1000)
  }, [time])

  const triggerBtn = () => {
    onClick()
    if (debounce) setTime(debounce)
  }

  return (
    <button
      onClick={triggerBtn}
      className={`${button_outer} ${debounce ? smaller_font : ''} ${
        time ? 'disabled_opacity' : ''
      }`}
      disabled={!!time}
    >
      <div className={button_inner}>
        <span>{text}</span> {time ? <span>&nbsp;({time})</span> : ''}
      </div>
    </button>
  )
}

export default Button
