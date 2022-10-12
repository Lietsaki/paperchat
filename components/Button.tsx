import styles from 'styles/components/button.module.scss'
import { useState, useEffect } from 'react'
import { dialogDebouncedActionNames } from 'types/Dialog'

const { button_outer, button_inner, smaller_font } = styles

type ButtonProps = {
  text: string
  onClick: () => void
  debounce?: number
  name?: dialogDebouncedActionNames
  debounceMounted?: boolean
}

const Button = ({ text, onClick, name, debounce = 0, debounceMounted }: ButtonProps) => {
  const [time, setTime] = useState<null | number>(null)

  useEffect(() => {
    if (debounceMounted && debounce && name) {
      const latestDebounce = localStorage.getItem(name)
      setTime(Number(latestDebounce) ? Number(latestDebounce) : debounce)
    }
  }, [debounce])

  useEffect(() => {
    if (!time || !name) return

    setTimeout(() => {
      setTime(time - 1)
      localStorage.setItem(name, time - 1 + '')
    }, 1000)
  }, [time])

  const triggerBtn = () => {
    onClick()
    if (debounce) setTime(debounce)
  }

  return (
    <button
      onClick={triggerBtn}
      className={`${button_outer} ${time ? smaller_font : ''} ${time ? 'disabled_opacity' : ''}`}
      disabled={!!time}
    >
      <div className={button_inner}>
        <span>{text}</span> {time ? <span>&nbsp;({time})</span> : ''}
      </div>
    </button>
  )
}

export default Button
