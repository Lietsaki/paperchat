import styles from 'styles/options-screen/options.module.scss'
import {} from 'helpers/helperFunctions'
import { roomContent, contentIndicator } from 'types/Room'

const { content_indicator, indicator, invisible } = styles

type ContentIndicatorProps = {
  roomContent: roomContent[]
}

const ContentIndicator = ({ roomContent }: ContentIndicatorProps) => {
  const renderIndicators = () => {
    if (typeof window === 'undefined') return []

    const isVisible = true

    return roomContent.map((content) => {
      return <div key={content.id} className={`${indicator} ${isVisible ? '' : invisible}`}></div>
    })
  }

  return <div className={content_indicator}>{renderIndicators()}</div>
}

export default ContentIndicator
