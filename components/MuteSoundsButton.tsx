import styles from 'styles/components/menu-button.module.scss'
import { useEffect } from 'react'
import useTranslation from 'i18n/useTranslation'
import { selectUser, setMuteSounds } from 'store/slices/userSlice'
import { useSelector, useDispatch } from 'react-redux'

const { audio_button, small_version } = styles

type AudioButtonProps = {
  useSmallVersion?: boolean
}

const MuteSoundsButton = ({ useSmallVersion }: AudioButtonProps) => {
  const { t } = useTranslation()
  const { muteSounds } = useSelector(selectUser)
  const dispatch = useDispatch()

  const toggleAudio = () => {
    dispatch(setMuteSounds(!muteSounds))
    localStorage.setItem('muteSounds', JSON.stringify(!muteSounds))
  }

  useEffect(() => {
    const savedMuteValue = localStorage.getItem('muteSounds')

    try {
      if (savedMuteValue && JSON.parse(savedMuteValue)) {
        dispatch(setMuteSounds(true))
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <button
      aria-label={t('HOME.TOGGLE_AUDIO')}
      onClick={toggleAudio}
      className={`${audio_button} ${useSmallVersion ? small_version : ''}`}
    >
      {muteSounds ? (
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width="512.000000pt"
          height="512.000000pt"
          viewBox="0 0 512.000000 512.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
            <path
              d="M2110 4955 l0 -165 -165 0 -165 0 0 -170 0 -170 -165 0 -165 0 0
-165 0 -165 -170 0 -170 0 0 -170 0 -170 -390 0 -390 0 0 -165 0 -165 -165 0
-165 0 0 -890 0 -890 165 0 165 0 0 -165 0 -165 390 0 390 0 0 -170 0 -170
170 0 170 0 0 -165 0 -165 165 0 165 0 0 -170 0 -170 165 0 165 0 0 -165 0
-165 335 0 335 0 0 165 0 165 168 2 167 3 0 2225 0 2225 -167 3 -168 2 0 165
0 165 -335 0 -335 0 0 -165z"
            />
            <path d="M3450 3285 l0 -165 165 0 165 0 0 165 0 165 -165 0 -165 0 0 -165z" />
            <path d="M4790 3285 l0 -165 165 0 165 0 0 165 0 165 -165 0 -165 0 0 -165z" />
            <path
              d="M3784 3107 c-2 -7 -3 -82 -2 -167 l3 -155 168 -3 167 -2 0 -165 0
-165 -167 -2 -168 -3 0 -165 0 -165 165 0 165 0 3 168 2 167 165 0 165 0 2
-167 3 -168 165 0 165 0 3 168 2 167 -170 0 -170 0 0 165 0 165 168 2 167 3 0
165 0 165 -167 3 -168 2 0 -170 0 -170 -165 0 -165 0 0 170 0 170 -165 0
c-126 0 -167 -3 -171 -13z"
            />
            <path d="M3450 1945 l0 -165 165 0 165 0 0 165 0 165 -165 0 -165 0 0 -165z" />
            <path d="M4790 1945 l0 -165 165 0 165 0 0 165 0 165 -165 0 -165 0 0 -165z" />
          </g>
        </svg>
      ) : (
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width="512.000000pt"
          height="512.000000pt"
          viewBox="0 0 512.000000 512.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
            <path
              d="M2110 4955 l0 -165 -165 0 -165 0 0 -170 0 -170 -165 0 -165 0 0
       -165 0 -165 -170 0 -170 0 0 -170 0 -170 -390 0 -390 0 0 -165 0 -165 -165 0
       -165 0 0 -890 0 -890 165 0 165 0 0 -165 0 -165 390 0 390 0 0 -170 0 -170
       170 0 170 0 0 -165 0 -165 165 0 165 0 0 -170 0 -170 165 0 165 0 0 -165 0
       -165 335 0 335 0 0 165 0 165 168 2 167 3 0 2225 0 2225 -167 3 -168 2 0 165
       0 165 -335 0 -335 0 0 -165z"
            />
            <path
              d="M4790 2560 l0 -1780 165 0 165 0 0 1780 0 1780 -165 0 -165 0 0
       -1780z"
            />
            <path
              d="M4120 2560 l0 -1340 165 0 165 0 0 1340 0 1340 -165 0 -165 0 0
       -1340z"
            />
            <path d="M3450 2560 l0 -780 165 0 165 0 0 780 0 780 -165 0 -165 0 0 -780z" />
          </g>
        </svg>
      )}
    </button>
  )
}

export default MuteSoundsButton
