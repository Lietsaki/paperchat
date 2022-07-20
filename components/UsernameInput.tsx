import { useRef, useEffect } from 'react'
import styles from 'styles/components/username-input.module.scss'

const { input_container, title, username_input, make_complete_rectangle } =
  styles

type UsernameInputProps = {
  editing: boolean
}

const UsernameInput = ({ editing }: UsernameInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const shouldBeCompleteRectangle = () => {
    return editing ? make_complete_rectangle : ''
  }

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  return (
    <div className={`${input_container} ${shouldBeCompleteRectangle()}`}>
      <div className={title}>Username</div>
      <input ref={inputRef} type="text" className={username_input}></input>
    </div>
  )
}

export default UsernameInput
