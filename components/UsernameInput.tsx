import React, { useRef, useEffect, useState, BaseSyntheticEvent, FormEvent } from 'react'
import { usernameMinLength, usernameMaxLength } from '../store/initializer'

type UsernameInputProps = {
  editing: boolean
  receivedValue: string
  setUsernameBeingEdited: (val: string) => void
}

const UsernameInput = ({ editing, receivedValue, setUsernameBeingEdited }: UsernameInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  let [inputValue, setInputValue] = useState('')

  const handleChange = (e: BaseSyntheticEvent) => {
    setInputValue(e.target.value)
    setUsernameBeingEdited(e.target.value)
  }

  useEffect(() => {
    if (editing) return inputRef.current!.focus()
    if (receivedValue !== inputValue) setInputValue('')
    inputRef.current!.blur()
  }, [editing])

  useEffect(() => {
    setInputValue(receivedValue)
  }, [receivedValue])

  const shouldBeCompleteRectangle = () => {
    return editing ? 'make_complete_rectangle' : ''
  }

  return (
    <div className={`input_container ${shouldBeCompleteRectangle()}`}>
      <div className="title">Username</div>
      <input
        type="text"
        spellCheck="false"
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        maxLength={usernameMaxLength}
        minLength={usernameMinLength}
      ></input>
    </div>
  )
}

export default UsernameInput
