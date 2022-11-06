import { useRef, useState, useEffect, BaseSyntheticEvent } from 'react'
import Button from 'components/Button'
import { PRIVATE_CODE_LENGTH } from 'firebase-config/realtimeDB'
import styles from 'styles/join-room/join-room.module.scss'
const { input_area, join_area } = styles

type JoinRoomInputProps = {
  handleCodeSubmit: (code: string) => void
}

const JoinRoomInput = ({ handleCodeSubmit }: JoinRoomInputProps) => {
  const [code, setCode] = useState('')
  const [latestDebounce, setLatestDebounce] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const btnID = 'joinRoomBtn'

  useEffect(() => {
    inputRef.current!.focus()
    const savedDebounce = localStorage.getItem('retryJoinPrivateRoomAttempt')
    console.log('latest debounce!', savedDebounce)
    if (savedDebounce) setLatestDebounce(Number(savedDebounce))
  }, [])

  const handleCodeSubmitWithCheck = (e: React.FormEvent, code: string) => {
    e.preventDefault()
    const btn = document.getElementById(btnID) as HTMLButtonElement
    btn.click()
  }

  const handleChange = (e: BaseSyntheticEvent) => {
    if (e.target.value.length > PRIVATE_CODE_LENGTH) return
    setCode(e.target.value.trim().toUpperCase())
  }

  return (
    <div className={join_area}>
      <div>
        <form className={input_area} onSubmit={(e) => handleCodeSubmitWithCheck(e, code)}>
          <div className="input_container simple_width make_complete_rectangle">
            <div className="title">Code</div>
            <input
              ref={inputRef}
              value={code}
              onChange={handleChange}
              type="text"
              placeholder="ABC12"
              maxLength={PRIVATE_CODE_LENGTH}
              autoComplete="off"
            ></input>
          </div>

          <Button
            text="Join"
            onClick={() => handleCodeSubmit(code)}
            name="retryJoinPrivateRoomAttempt"
            debounce={latestDebounce || (code && code.length === PRIVATE_CODE_LENGTH) ? 30 : 0}
            debounceMounted={!!latestDebounce}
            id={btnID}
          />
        </form>
      </div>
    </div>
  )
}

export default JoinRoomInput
