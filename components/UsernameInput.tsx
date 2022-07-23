import { useRef, useEffect } from 'react'

type UsernameInputProps = {
  editing: boolean
}

const UsernameInput = ({ editing }: UsernameInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const shouldBeCompleteRectangle = () => {
    return editing ? 'make_complete_rectangle' : ''
  }

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  return (
    <div className={`input_container ${shouldBeCompleteRectangle()}`}>
      <div className="title">Username</div>
      <input ref={inputRef} type="text"></input>
    </div>
  )
}

export default UsernameInput
