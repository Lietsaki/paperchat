import { useEffect } from 'react'

type SpinnerProps = {
  speed?: number
}

const Spinner = ({ speed = 70 }: SpinnerProps) => {
  const spin = () => {
    const hiddenSquares = document.querySelectorAll('.bg-transparent')
    const hiddenOne = hiddenSquares[0].classList[0]
    const hiddenTwo = hiddenSquares[1].classList[0]
    const hiddenThree = hiddenSquares[2].classList[0]

    const leftPyramid =
      hiddenOne === 'top-mid' &&
      hiddenTwo === 'top-right' &&
      hiddenThree === 'mid-right'

    const leftColumn =
      hiddenOne === 'top-right' &&
      hiddenTwo === 'mid-right' &&
      hiddenThree === 'bot-right'

    const leftPyramidInverse =
      hiddenOne === 'mid-right' &&
      hiddenTwo === 'bot-mid' &&
      hiddenThree === 'bot-right'

    const topRow =
      hiddenOne === 'bot-left' &&
      hiddenTwo === 'bot-mid' &&
      hiddenThree === 'bot-right'

    const rightPyramidInverse =
      hiddenOne === 'mid-left' &&
      hiddenTwo === 'bot-left' &&
      hiddenThree === 'bot-mid'

    const rightColumn =
      hiddenOne === 'top-left' &&
      hiddenTwo === 'mid-left' &&
      hiddenThree === 'bot-left'

    const rightPyramid =
      hiddenOne === 'top-left' &&
      hiddenTwo === 'top-mid' &&
      hiddenThree === 'mid-left'

    const bottomRow =
      hiddenOne === 'top-left' &&
      hiddenTwo === 'top-mid' &&
      hiddenThree === 'top-right'

    if (leftPyramid) {
      document.querySelector('.top-mid')?.classList.remove('bg-transparent')
      document.querySelector('.bot-right')?.classList.add('bg-transparent')
    }

    if (leftColumn) {
      document.querySelector('.top-right')?.classList.remove('bg-transparent')
      document.querySelector('.mid-right')?.classList.add('bg-transparent')
      document.querySelector('.bot-right')?.classList.add('bg-transparent')
      document.querySelector('.bot-mid')?.classList.add('bg-transparent')
    }

    if (leftPyramidInverse) {
      document.querySelector('.bot-left')?.classList.add('bg-transparent')
      document.querySelector('.mid-right')?.classList.remove('bg-transparent')
    }

    if (topRow) {
      document.querySelector('.mid-left')?.classList.add('bg-transparent')
      document.querySelector('.bot-left')?.classList.add('bg-transparent')
      document.querySelector('.bot-right')?.classList.remove('bg-transparent')
    }

    if (rightPyramidInverse) {
      document.querySelector('.top-left')?.classList.add('bg-transparent')
      document.querySelector('.bot-mid')?.classList.remove('bg-transparent')
    }

    if (rightColumn) {
      document.querySelector('.top-mid')?.classList.add('bg-transparent')
      document.querySelector('.bot-left')?.classList.remove('bg-transparent')
    }

    if (rightPyramid) {
      document.querySelector('.mid-left')?.classList.remove('bg-transparent')
      document.querySelector('.top-right')?.classList.add('bg-transparent')
    }

    if (bottomRow) {
      document.querySelector('.mid-right')?.classList.add('bg-transparent')
      document.querySelector('.top-left')?.classList.remove('bg-transparent')
    }
  }

  useEffect(() => {
    let interval = setInterval(() => {
      spin()
    }, speed)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="spinner-grid">
      <div className="top-left"></div>
      <div className="top-mid bg-transparent"></div>
      <div className="top-right bg-transparent"></div>

      <div className="mid-left"></div>
      <div className="mid-mid"></div>
      <div className="mid-right bg-transparent"></div>

      <div className="bot-left"></div>
      <div className="bot-mid"></div>
      <div className="bot-right"></div>
    </div>
  )
}

export default Spinner
