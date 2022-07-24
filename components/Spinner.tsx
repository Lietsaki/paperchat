import { Fragment, useState, useEffect } from 'react'

type SpinnerProps = {
  speed?: number
}

const Spinner = ({ speed = 80 }: SpinnerProps) => {
  const spin = () => {
    if (displayingGrid === 'leftPyramid') {
      setDisplayingGrid('leftColumn')
    } else if (displayingGrid === 'leftColumn') {
      setDisplayingGrid('leftPyramidInverse')
    } else if (displayingGrid === 'leftPyramidInverse') {
      setDisplayingGrid('topRow')
    } else if (displayingGrid === 'topRow') {
      setDisplayingGrid('rightPyramidInverse')
    } else if (displayingGrid === 'rightPyramidInverse') {
      setDisplayingGrid('rightColumn')
    } else if (displayingGrid === 'rightColumn') {
      setDisplayingGrid('rightPyramid')
    } else if (displayingGrid === 'rightPyramid') {
      setDisplayingGrid('bottomRow')
    } else if (displayingGrid === 'bottomRow') {
      setDisplayingGrid('leftPyramid')
    }
  }

  const leftPyramid = (
    <Fragment>
      <div className="top-left"></div>
      <div className="top-mid bg-transparent"></div>
      <div className="top-right bg-transparent"></div>

      <div className="mid-left"></div>
      <div className="mid-mid"></div>
      <div className="mid-right bg-transparent"></div>

      <div className="bot-left"></div>
      <div className="bot-mid"></div>
      <div className="bot-right"></div>
    </Fragment>
  )

  const leftColumn = (
    <Fragment>
      <div className="top-left"></div>
      <div className="top-mid"></div>
      <div className="top-right bg-transparent"></div>

      <div className="mid-left"></div>
      <div className="mid-mid"></div>
      <div className="mid-right bg-transparent"></div>

      <div className="bot-left"></div>
      <div className="bot-mid"></div>
      <div className="bot-right bg-transparent"></div>
    </Fragment>
  )

  const leftPyramidInverse = (
    <Fragment>
      <div className="top-left"></div>
      <div className="top-mid"></div>
      <div className="top-right"></div>

      <div className="mid-left"></div>
      <div className="mid-mid"></div>
      <div className="mid-right bg-transparent"></div>

      <div className="bot-left"></div>
      <div className="bot-mid bg-transparent"></div>
      <div className="bot-right bg-transparent"></div>
    </Fragment>
  )

  const topRow = (
    <Fragment>
      <div className="top-left"></div>
      <div className="top-mid"></div>
      <div className="top-right"></div>

      <div className="mid-left"></div>
      <div className="mid-mid"></div>
      <div className="mid-right"></div>

      <div className="bot-left bg-transparent"></div>
      <div className="bot-mid bg-transparent"></div>
      <div className="bot-right bg-transparent"></div>
    </Fragment>
  )

  const rightPyramidInverse = (
    <Fragment>
      <div className="top-left"></div>
      <div className="top-mid"></div>
      <div className="top-right"></div>

      <div className="mid-left bg-transparent"></div>
      <div className="mid-mid"></div>
      <div className="mid-right"></div>

      <div className="bot-left bg-transparent"></div>
      <div className="bot-mid bg-transparent"></div>
      <div className="bot-right"></div>
    </Fragment>
  )

  const rightColumn = (
    <Fragment>
      <div className="top-left bg-transparent"></div>
      <div className="top-mid"></div>
      <div className="top-right"></div>

      <div className="mid-left bg-transparent"></div>
      <div className="mid-mid"></div>
      <div className="mid-right"></div>

      <div className="bot-left bg-transparent"></div>
      <div className="bot-mid"></div>
      <div className="bot-right"></div>
    </Fragment>
  )

  const rightPyramid = (
    <Fragment>
      <div className="top-left bg-transparent"></div>
      <div className="top-mid bg-transparent"></div>
      <div className="top-right"></div>

      <div className="mid-left bg-transparent"></div>
      <div className="mid-mid"></div>
      <div className="mid-right"></div>

      <div className="bot-left"></div>
      <div className="bot-mid"></div>
      <div className="bot-right"></div>
    </Fragment>
  )

  const bottomRow = (
    <Fragment>
      <div className="top-left bg-transparent"></div>
      <div className="top-mid bg-transparent"></div>
      <div className="top-right bg-transparent"></div>

      <div className="mid-left"></div>
      <div className="mid-mid"></div>
      <div className="mid-right"></div>

      <div className="bot-left"></div>
      <div className="bot-mid"></div>
      <div className="bot-right"></div>
    </Fragment>
  )

  const grids = {
    leftPyramid,
    leftColumn,
    leftPyramidInverse,
    topRow,
    rightPyramidInverse,
    rightColumn,
    rightPyramid,
    bottomRow,
  }

  const [displayingGrid, setDisplayingGrid] =
    useState<keyof typeof grids>('leftPyramid')

  useEffect(() => {
    const timer = setTimeout(() => spin(), speed)
    return () => clearTimeout(timer)
  }, [displayingGrid])

  return <div className="spinner-grid">{grids[displayingGrid]}</div>
}

export default Spinner
