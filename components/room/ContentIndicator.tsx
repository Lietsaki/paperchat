import styles from 'styles/options-screen/options.module.scss'
import { useState, useEffect, useRef } from 'react'
import { roomContent, contentIndicators } from 'types/Room'
import { willContainerBeOverflowed } from 'helpers/helperFunctions'

const {
  content_indicator,
  indicator,
  invisible,
  overflowed_1,
  overflowed_2,
  main_container,
  indictor_container
} = styles

type ContentIndicatorProps = {
  roomContent: roomContent[]
}

const ContentIndicator = ({ roomContent }: ContentIndicatorProps) => {
  const indicatorIdPrefix = 'i-'
  const [indicators, setIndicators] = useState<contentIndicators>({})
  const [latestOverflowedLength, setLatestOverflowedLength] = useState(0)

  const [overflowed1OldestIndicator, setOverflowed1OldestIndicator] = useState('')
  const [overflowed1NewestIndicator, setOverflowed1NewestIndicator] = useState('')
  const [overflowed2OldestIndicator, setOverflowed2OldestIndicator] = useState('')
  const [overflowed2NewestIndicator, setOverflowed2NewestIndicator] = useState('')

  const middleIndicatorsRef = useRef<HTMLDivElement>(null)
  const indicatorsContainerRef = useRef<HTMLDivElement>(null)
  const indicatorsRef = useRef<contentIndicators>()
  indicatorsRef.current = indicators
  let observer: IntersectionObserver | null = null

  const oldestIndicators = [overflowed2OldestIndicator, overflowed1OldestIndicator]
  const newestIndicators = [overflowed1NewestIndicator, overflowed2NewestIndicator]
  const middleIndicatorKeys = Object.keys(indicators).filter(
    (key) => !oldestIndicators.includes(key) && !newestIndicators.includes(key)
  )

  const setupObserver = () => {
    observer = new IntersectionObserver(
      (entries) => {
        let newIndicators = { ...indicatorsRef.current }
        let latestVisibleId = ''

        for (const entry of entries) {
          const { id } = entry.target

          if (entry.intersectionRatio > 0) {
            if (!newIndicators[id]) {
              newIndicators[id] = { isVisible: true }
            } else {
              newIndicators[id].isVisible = true
              latestVisibleId = id

              if (newIndicators[id].isOverflowedIndicator1) {
                newIndicators = handleOverflowedIndicatorView(id, newIndicators)
              }
            }
          } else {
            if (!newIndicators[id]) {
              newIndicators[id] = { isVisible: false }
            } else {
              newIndicators[id].isVisible = false
            }
          }
        }

        if (overflowed2OldestIndicator && latestVisibleId) {
          scrollMiddleIndicatorForVisibility(latestVisibleId)
        }

        if (willContainerBeOverflowed(indicatorsContainerRef.current!, 10)) {
          newIndicators = handleOverflowedContainer(newIndicators)
        }

        setIndicators(newIndicators)
      },
      { threshold: [0] }
    )

    roomContent.map((item) => {
      const el = document.getElementById(item.id)
      if (el && observer) observer.observe(el)
    })
  }

  const handleOverflowedContainer = (indicatorsToHandle: contentIndicators) => {
    const indicators = { ...indicatorsToHandle }
    const indicatorKeys = Object.keys(indicators)

    const mustAssignOverflowed1ToOldestIndicator =
      !indicators[indicatorKeys[0]].isVisible &&
      !overflowed1OldestIndicator &&
      !overflowed1NewestIndicator

    const mustAssignOverflowed2ToOldestIndicator =
      !indicators[indicatorKeys[0]].isVisible &&
      !indicators[indicatorKeys[1]].isVisible &&
      overflowed1OldestIndicator &&
      !indicators[indicatorKeys[1]].isOverflowedIndicator1

    const mustReassignNewestIndicators =
      overflowed2NewestIndicator &&
      latestOverflowedLength &&
      indicatorKeys.length > latestOverflowedLength

    if (mustAssignOverflowed1ToOldestIndicator) {
      indicators[indicatorKeys[0]].isOverflowedIndicator1 = true
      setLatestOverflowedLength(indicatorKeys.length)
      setOverflowed1OldestIndicator(indicatorKeys[0])
      setOverflowed1NewestIndicator(indicatorKeys[indicatorKeys.length - 1])
    }

    if (
      mustAssignOverflowed2ToOldestIndicator &&
      latestOverflowedLength &&
      indicatorKeys.length > latestOverflowedLength
    ) {
      indicators[indicatorKeys[0]].isOverflowedIndicator1 = false
      indicators[indicatorKeys[0]].isOverflowedIndicator2 = true
      indicators[indicatorKeys[1]].isOverflowedIndicator1 = true
      setLatestOverflowedLength(indicatorKeys.length)
      setOverflowed2OldestIndicator(indicatorKeys[0])
      setOverflowed1OldestIndicator(indicatorKeys[1])
      setOverflowed1NewestIndicator(indicatorKeys[indicatorKeys.length - 2])
      setOverflowed2NewestIndicator(indicatorKeys[indicatorKeys.length - 1])
    }

    if (mustReassignNewestIndicators) {
      setLatestOverflowedLength(indicatorKeys.length)
      setOverflowed1NewestIndicator(indicatorKeys[indicatorKeys.length - 2])
      setOverflowed2NewestIndicator(indicatorKeys[indicatorKeys.length - 1])
      indicators[indicatorKeys[indicatorKeys.length - 3]].isOverflowedIndicator1 = false
      indicators[indicatorKeys[indicatorKeys.length - 2]].isOverflowedIndicator2 = false

      indicators[indicatorKeys[0]].isOverflowedIndicator2 = true
      indicators[indicatorKeys[1]].isOverflowedIndicator1 = true
    }

    return indicators
  }

  const handleOverflowedIndicatorView = (
    indicatorId: string,
    indicatorsToHandle: contentIndicators
  ) => {
    const indicators = { ...indicatorsToHandle }
    const viewingOldIndicator1 = overflowed1OldestIndicator === indicatorId
    const viewingNewIndicator1 = overflowed1NewestIndicator === indicatorId
    const viewingOldIndicator2 = overflowed2OldestIndicator === indicatorId
    const viewingNewIndicator2 = overflowed2NewestIndicator === indicatorId
    indicators[indicatorId] = { isVisible: true }

    if (viewingOldIndicator1) {
      if (overflowed2NewestIndicator) {
        indicators[overflowed2OldestIndicator].isOverflowedIndicator1 = true
        indicators[overflowed2OldestIndicator].isOverflowedIndicator2 = false

        indicators[overflowed2NewestIndicator].isOverflowedIndicator1 = true
        indicators[overflowed1NewestIndicator].isOverflowedIndicator1 = false
      } else {
        indicators[overflowed1NewestIndicator].isOverflowedIndicator1 = true
      }
    }

    if (viewingNewIndicator1) {
      indicators[overflowed1OldestIndicator].isOverflowedIndicator1 = true

      if (overflowed2OldestIndicator && overflowed2NewestIndicator) {
        indicators[overflowed2NewestIndicator].isOverflowedIndicator2 = false
        indicators[overflowed2NewestIndicator].isOverflowedIndicator1 = true

        indicators[overflowed1OldestIndicator].isOverflowedIndicator1 = false
        indicators[overflowed2OldestIndicator].isOverflowedIndicator1 = true
      }
    }

    if (viewingNewIndicator2) {
      indicators[overflowed1OldestIndicator].isOverflowedIndicator1 = true
      indicators[overflowed2OldestIndicator].isOverflowedIndicator1 = false
      indicators[overflowed2OldestIndicator].isOverflowedIndicator2 = true
    }

    if (viewingOldIndicator2) {
      indicators[overflowed1NewestIndicator].isOverflowedIndicator1 = true
      indicators[overflowed2NewestIndicator].isOverflowedIndicator1 = false
      indicators[overflowed2NewestIndicator].isOverflowedIndicator2 = true
    }

    return indicators
  }

  useEffect(() => {
    setupObserver()
    setTimeout(() => scrollMiddleIndicators(), 50)

    return () => {
      observer?.disconnect()
      observer = null
    }
  }, [
    roomContent,
    overflowed1OldestIndicator,
    overflowed1NewestIndicator,
    overflowed2OldestIndicator,
    overflowed2NewestIndicator,
    latestOverflowedLength
  ])

  const scrollMiddleIndicators = () => {
    const container = middleIndicatorsRef.current!
    container.scroll({ top: container.scrollHeight, behavior: 'smooth' })
  }

  const isIndicatorOverflowed = (indicator: Element) => {
    const contRect = middleIndicatorsRef.current!.getBoundingClientRect()
    const indRect = indicator.getBoundingClientRect()

    const overFlowedToTheBottom = indRect.bottom > contRect.bottom
    const overFlowedToTheTop = contRect.top > indRect.top
    return overFlowedToTheBottom || overFlowedToTheTop
  }

  const scrollMiddleIndicatorForVisibility = (latestVisibleId: string) => {
    const item = document.getElementById(indicatorIdPrefix + latestVisibleId)
    if (isIndicatorOverflowed(item!)) item!.scrollIntoView({ behavior: 'auto', block: 'nearest' })
  }

  const renderIndicators = (indicatorKeys: string[]) => {
    return indicatorKeys.map((id) => {
      const ind = indicators[id]
      if (!ind) return ''
      return (
        <div
          key={id}
          id={indicatorIdPrefix + id}
          className={`${indicator} ${ind.isVisible ? '' : invisible} ${
            ind.isOverflowedIndicator1 ? overflowed_1 : ''
          } ${ind.isOverflowedIndicator2 ? overflowed_2 : ''}`}
        ></div>
      )
    })
  }

  return (
    <div className={content_indicator} ref={indicatorsContainerRef}>
      <div className={indictor_container}> {renderIndicators(oldestIndicators)}</div>
      <div
        ref={middleIndicatorsRef}
        className={`${indictor_container} ${overflowed2OldestIndicator ? main_container : ''}`}
      >
        {renderIndicators(middleIndicatorKeys)}
      </div>
      <div className={indictor_container}> {renderIndicators(newestIndicators)}</div>
    </div>
  )
}

export default ContentIndicator
