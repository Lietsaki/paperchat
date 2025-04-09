import React, { useRef, useEffect, useState, BaseSyntheticEvent } from 'react'
import useTranslation from 'i18n/useTranslation'
import { usernameMinLength, usernameMaxLength } from '../store/initializer'

type UsernameInputProps = {
  editing: boolean
  receivedValue: string
  setUsernameBeingEdited: (val: string) => void
}

const UsernameInput = ({ editing, receivedValue, setUsernameBeingEdited }: UsernameInputProps) => {
  const { t, locale } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  let [inputValue, setInputValue] = useState('')

  const handleChange = (e: BaseSyntheticEvent) => {
    if (e.target.value.length > usernameMaxLength) return
    setInputValue(e.target.value)
    setUsernameBeingEdited(e.target.value)
  }

  useEffect(() => {
    if (editing) return inputRef.current!.focus()
    inputRef.current!.blur()
    setInputValue(receivedValue)
  }, [editing])

  useEffect(() => {
    setInputValue(receivedValue)
  }, [receivedValue])

  const shouldBeCompleteRectangle = () => {
    return editing ? 'make_complete_rectangle' : ''
  }

  return (
    <div
      className={`input_container ${shouldBeCompleteRectangle()} ${locale === 'cn' ? 'cn' : ''}`}
    >
      <div className="title">{t('HOME.USERNAME')}</div>
      <input
        type="text"
        spellCheck="false"
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        maxLength={usernameMaxLength}
        minLength={usernameMinLength}
        autoComplete="off"
      ></input>
    </div>
  )
}

export default UsernameInput
