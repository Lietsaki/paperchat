import styles from 'styles/options-screen/options.module.scss'
import { useState, useEffect, useRef } from 'react'
import { RoomContent, ContentIndicators } from 'types/Room'
import { willContainerBeOverflowed } from 'helpers/helperFunctions'

const {
  content_indicator,
  animate,
  indicator,
  invisible,
  overflowed_1,
  overflowed_2,
  main_container,
  indictor_container
} = styles

type AdjacentIndicators = { up: string; down: string }

type ContentIndicatorProps = {
  roomContent: RoomContent[]
  setAdjacentMessages: (adjacentIndicatorsData: AdjacentIndicators) => void
}

const ContentIndicator = ({ roomContent, setAdjacentMessages }: ContentIndicatorProps) => {
  const indicatorIdPrefix = 'i-'
  const [indicators, setIndicators] = useState<ContentIndicators>({})
  const [latestOverflowedLength, setLatestOverflowedLength] = useState(0)
  const animatedIndicators = useRef<{ [key: string]: boolean }>({})

  const [overflowed2OldestIndicator, setOverflowed2OldestIndicator] = useState('')
  const [overflowed1OldestIndicator, setOverflowed1OldestIndicator] = useState('')
  const [overflowed1NewestIndicator, setOverflowed1NewestIndicator] = useState('')
  const [overflowed2NewestIndicator, setOverflowed2NewestIndicator] = useState('')
  const [finishedFirstRender, setFinishedFirstRender] = useState(false)

  const prevFirstKeyRef = useRef<string | null>(null)

  const middleIndicatorsRef = useRef<HTMLDivElement>(null)
  const indicatorsContainerRef = useRef<HTMLDivElement>(null)
  const indicatorsRef = useRef<ContentIndicators>(undefined)
  indicatorsRef.current = indicators
  let observer: IntersectionObserver | null = null

  const oldestIndicators = [overflowed2OldestIndicator, overflowed1OldestIndicator]
  const newestIndicators = [overflowed1NewestIndicator, overflowed2NewestIndicator]
  // Even when roomContent already comes sorted, we still have to sort the indicators to prevent inconsistencies
  const middleIndicatorKeys = Object.keys(indicators)
    .filter((key) => !oldestIndicators.includes(key) && !newestIndicators.includes(key))
    .sort((a, b) => {
      const aItem: RoomContent | undefined = roomContent.find((item) => item.id === a)
      const bItem: RoomContent | undefined = roomContent.find((item) => item.id === b)

      if (!aItem) return -1
      if (!bItem) return 1

      return aItem.serverTs - bItem.serverTs
    })

  const setupObserver = () => {
    observer = new IntersectionObserver(
      (entries) => {
        let newIndicators = { ...indicatorsRef.current }
        const newIndKeys = Object.keys(newIndicators)
        let latestVisibleId = ''

        const contentIds = roomContent.map((item) => item.id)

        for (const key of Object.keys(newIndicators)) {
          if (!contentIds.includes(key)) {
            delete newIndicators[key]
          }
        }

        for (const entry of entries) {
          const { id } = entry.target

          if (entry.intersectionRatio >= 0.4) {
            if (!newIndicators[id]) {
              newIndicators[id] = { isVisible: true }
            } else {
              newIndicators[id].isVisible = true
              latestVisibleId = id

              if (
                newIndicators[id].isOverflowedIndicator1 ||
                newIndicators[id].isOverflowedIndicator2
              ) {
                // This if statement handles an edge case: When scrolling too fast in mobile devices, the
                // overflowed 2 oldest indicator would be evaluated here, but the overflowed 1 oldest would be skipped.
                if (newIndKeys[0] === id) {
                  newIndicators = handleOverflowedIndicatorView(newIndKeys[1], newIndicators)
                }

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
      { threshold: [0.4] }
    )

    roomContent.map((item) => {
      const el = document.getElementById(item.id + '')
      if (el && observer) observer.observe(el)
    })
  }

  const handleOverflowedContainer = (indicatorsToHandle: ContentIndicators) => {
    const indicators = { ...indicatorsToHandle }
    const indicatorKeys = Object.keys(indicators)

    const oldestKeyChanged = prevFirstKeyRef.current && prevFirstKeyRef.current !== indicatorKeys[0]
    prevFirstKeyRef.current = indicatorKeys[0]

    // If a new item has not been added/changed after the first render completed, return.
    // We might overflow without reaching the threshold to delete the oldest messages,
    // so that's why we also need to check for latestOverflowedLength.
    if (
      latestOverflowedLength &&
      indicatorKeys.length === latestOverflowedLength &&
      finishedFirstRender &&
      !oldestKeyChanged
    ) {
      return indicators
    }

    const mustAssignOverflowed1ToOldestIndicator = !overflowed1OldestIndicator

    const mustAssignOverflowed2ToOldestIndicator =
      overflowed1OldestIndicator && !overflowed2OldestIndicator

    const mustReassignIndicators = overflowed2NewestIndicator

    if (mustAssignOverflowed1ToOldestIndicator) {
      indicators[indicatorKeys[0]].isOverflowedIndicator1 = true
      setLatestOverflowedLength(indicatorKeys.length)
      setOverflowed1OldestIndicator(indicatorKeys[0])
      setOverflowed1NewestIndicator(indicatorKeys[indicatorKeys.length - 1])
    }

    if (mustAssignOverflowed2ToOldestIndicator) {
      indicators[indicatorKeys[0]].isOverflowedIndicator1 = false
      indicators[indicatorKeys[0]].isOverflowedIndicator2 = true
      indicators[indicatorKeys[1]].isOverflowedIndicator1 = true
      setLatestOverflowedLength(indicatorKeys.length)
      setOverflowed2OldestIndicator(indicatorKeys[0])
      setOverflowed1OldestIndicator(indicatorKeys[1])
      setOverflowed1NewestIndicator(indicatorKeys[indicatorKeys.length - 2])
      setOverflowed2NewestIndicator(indicatorKeys[indicatorKeys.length - 1])
    }

    if (mustReassignIndicators) {
      setLatestOverflowedLength(indicatorKeys.length)

      setOverflowed2OldestIndicator(indicatorKeys[0])
      setOverflowed1OldestIndicator(indicatorKeys[1])
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
    indicatorsToHandle: ContentIndicators
  ) => {
    const indicators = { ...indicatorsToHandle }
    const viewingOldIndicator1 = overflowed1OldestIndicator === indicatorId
    const viewingNewIndicator1 = overflowed1NewestIndicator === indicatorId
    const viewingOldIndicator2 = overflowed2OldestIndicator === indicatorId
    const viewingNewIndicator2 = overflowed2NewestIndicator === indicatorId
    indicators[indicatorId] = { isVisible: true }

    if (viewingOldIndicator1) {
      if (indicators[overflowed2NewestIndicator]) {
        indicators[overflowed2OldestIndicator].isOverflowedIndicator1 = true
        indicators[overflowed2OldestIndicator].isOverflowedIndicator2 = false

        indicators[overflowed2NewestIndicator].isOverflowedIndicator1 = true
        indicators[overflowed1NewestIndicator].isOverflowedIndicator1 = false
      } else {
        indicators[overflowed1NewestIndicator].isOverflowedIndicator1 = true
      }
    }

    if (viewingNewIndicator1 && indicators[overflowed1OldestIndicator]) {
      indicators[overflowed1OldestIndicator].isOverflowedIndicator1 = true

      if (indicators[overflowed2OldestIndicator] && indicators[overflowed2NewestIndicator]) {
        indicators[overflowed2NewestIndicator].isOverflowedIndicator2 = false
        indicators[overflowed2NewestIndicator].isOverflowedIndicator1 = true

        indicators[overflowed1OldestIndicator].isOverflowedIndicator1 = false
        indicators[overflowed2OldestIndicator].isOverflowedIndicator1 = true
      }
    }

    if (
      viewingNewIndicator2 &&
      indicators[overflowed1OldestIndicator] &&
      indicators[overflowed2OldestIndicator]
    ) {
      indicators[overflowed1OldestIndicator].isOverflowedIndicator1 = true
      indicators[overflowed2OldestIndicator].isOverflowedIndicator1 = false
      indicators[overflowed2OldestIndicator].isOverflowedIndicator2 = true
    }

    if (
      viewingOldIndicator2 &&
      indicators[overflowed1NewestIndicator] &&
      indicators[overflowed2NewestIndicator]
    ) {
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
    overflowed2NewestIndicator
  ])

  // finishedFirstRender will be used to check for overflowed indicators when joining a room
  // that potentially has many messages. Here we consider that the first scroll ends in up to 500ms.
  useEffect(() => {
    if (roomContent.length > 2) {
      setTimeout(() => {
        setFinishedFirstRender(true)
      }, 500)
    }
  }, [roomContent])

  useEffect(() => {
    const adjacentIndicators = { up: '', down: '' }
    const indKeys = Object.keys(indicators)
    const visibleIndicators = indKeys.filter((key) => indicators[key].isVisible)

    const firstVisibleIndicatorIndex = indKeys.indexOf(visibleIndicators[0])
    const lastVisibleIndicatorIndex = indKeys.indexOf(
      visibleIndicators[visibleIndicators.length - 1]
    )

    if (firstVisibleIndicatorIndex !== -1 && firstVisibleIndicatorIndex > 0) {
      adjacentIndicators.up = indKeys[firstVisibleIndicatorIndex - 1]
    }
    if (lastVisibleIndicatorIndex !== -1 && lastVisibleIndicatorIndex !== indKeys.length - 1) {
      adjacentIndicators.down = indKeys[lastVisibleIndicatorIndex + 1]
    }

    setAdjacentMessages(adjacentIndicators)
  }, [indicators])

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
    if (item && isIndicatorOverflowed(item)) {
      item.scrollIntoView({ behavior: 'auto', block: 'nearest' })
    }
  }

  const renderIndicators = (indicatorKeys: string[]) => {
    return indicatorKeys.map((id, i) => {
      const ind = indicators[id]
      if (!ind) return ''

      // Set the previous indicator as already animated (because we just rendered it)
      // Keeping track of the animated indicators prevents all indicators from being
      // animated at the same time when calling setIndicators() in setupObserver()
      if (indicatorKeys[i - 1]) {
        animatedIndicators.current[indicatorKeys[i - 1]] = true
      }

      return (
        <div
          key={id}
          id={indicatorIdPrefix + id}
          className={`${indicator} ${animatedIndicators.current[id] ? '' : animate} ${
            ind.isVisible ? '' : invisible
          } ${ind.isOverflowedIndicator1 && !ind.isVisible ? overflowed_1 : ''} ${
            ind.isOverflowedIndicator2 && !ind.isVisible ? overflowed_2 : ''
          }`}
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
