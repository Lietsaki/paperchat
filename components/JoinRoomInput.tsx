import { useRef, useState, useEffect } from 'react'
import Button from 'components/Button'
import styles from 'styles/join-room/join-room.module.scss'
const { input_area, join_area } = styles

type JoinRoomInputProps = {
  handleCodeSubmit: (code: string) => void
}

const JoinRoomInput = ({ handleCodeSubmit }: JoinRoomInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [code, setCode] = useState('')

  useEffect(() => {
    inputRef.current!.focus()
  }, [])

  return (
    <div className={join_area}>
      <div className={input_area}>
        <div className="input_container simple_width make_complete_rectangle">
          <div className="title">Code</div>
          <input
            ref={inputRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="text"
          ></input>
        </div>

        <Button text="Join" onClick={() => handleCodeSubmit(code)} />
      </div>
    </div>
  )
}

export default JoinRoomInput
