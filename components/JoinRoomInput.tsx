import { useRef, useState, useEffect, BaseSyntheticEvent } from 'react'
import useTranslation from 'i18n/useTranslation'
import Button from 'components/Button'
import { PRIVATE_CODE_LENGTH } from 'firebase-config/realtimeDB'
import styles from 'styles/join-room/join-room.module.scss'
import { Capacitor } from '@capacitor/core'
const { input_area, join_area } = styles

type JoinRoomInputProps = {
  handleCodeSubmit: (code: string) => void
}

const BTN_ID = 'joinRoomBtn'
const JOIN_ROOM_DEBOUNCE = 10

const JoinRoomInput = ({ handleCodeSubmit }: JoinRoomInputProps) => {
  const { t, locale } = useTranslation()
  const [code, setCode] = useState('')
  const [latestDebounce, setLatestDebounce] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current!.focus()
    const savedDebounce = localStorage.getItem('retryJoinPrivateRoomAttempt')
    if (savedDebounce) setLatestDebounce(Number(savedDebounce))
  }, [])

  const handleCodeSubmitWithCheck = (e: React.FormEvent, code: string) => {
    e.preventDefault()
    const btn = document.getElementById(BTN_ID) as HTMLButtonElement
    btn.click()
  }

  const handleChange = (e: BaseSyntheticEvent) => {
    if (e.target.value.length > PRIVATE_CODE_LENGTH) return
    setCode(e.target.value.trim().toUpperCase())
  }

  const handleFocus = () => {
    if (Capacitor.isNativePlatform()) {
      document.documentElement.classList.remove('no-scroll-y')
    }

    inputRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  const handleBlur = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (Capacitor.isNativePlatform()) {
      document.documentElement.classList.add('no-scroll-y')
    }
  }

  return (
    <div className={join_area}>
      <div>
        <form className={input_area} onSubmit={(e) => handleCodeSubmitWithCheck(e, code)}>
          <div className={`input_container simple_width make_complete_rectangle ${locale}`}>
            <div className="title extra_pad_left">{t('COMMON.CODE')}</div>
            <input
              ref={inputRef}
              value={code}
              onChange={handleChange}
              type="text"
              placeholder="ABC12"
              maxLength={PRIVATE_CODE_LENGTH}
              autoComplete="off"
              onFocus={handleFocus}
              onBlur={handleBlur}
            ></input>
          </div>

          <Button
            text={t('JOIN_WITH_CODE_SCREEN.JOIN')}
            onClick={() => handleCodeSubmit(code)}
            name="retryJoinPrivateRoomAttempt"
            debounce={
              latestDebounce || (code && code.length === PRIVATE_CODE_LENGTH)
                ? JOIN_ROOM_DEBOUNCE
                : 0
            }
            debounceMounted={!!latestDebounce}
            id={BTN_ID}
          />
        </form>
      </div>
    </div>
  )
}

export default JoinRoomInput
