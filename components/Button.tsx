import styles from 'styles/components/button.module.scss'
import { useState, useEffect } from 'react'
import { DialogDebouncedActionNames } from 'types/Dialog'
import useTranslation from 'i18n/useTranslation'

const { button_outer, button_inner, smaller_font, ja, ja_smaller } = styles

type ButtonProps = {
  text: string
  onClick: () => void
  debounce?: number
  name?: DialogDebouncedActionNames
  debounceMounted?: boolean
  classes?: string
  id?: string
  useJaSmaller?: boolean
}

const Button = ({
  text,
  onClick,
  name,
  debounce = 0,
  debounceMounted,
  classes,
  id,
  useJaSmaller
}: ButtonProps) => {
  const { locale } = useTranslation()
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

  const getLocaleClass = () => {
    if (locale === 'ja') {
      if (useJaSmaller) return ja_smaller
      return ja
    }

    if (locale !== 'en') return smaller_font

    return ''
  }

  return (
    <button
      onClick={triggerBtn}
      className={`${button_outer} ${time ? smaller_font : ''} ${time ? 'disabled_opacity' : ''} ${
        classes || ''
      } ${getLocaleClass()}`}
      disabled={!!time}
      type="button"
      id={id}
    >
      <div className={button_inner}>
        <span>{text}</span> {time ? <span>&nbsp;({time})</span> : ''}
      </div>
    </button>
  )
}

export default Button
