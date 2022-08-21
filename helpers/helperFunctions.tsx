import { positionObj } from 'types/Position'

const getRandomNumber = (min: number, max: number) => Math.round(Math.random() * (max - min) + min)

const getRandomColor = () => {
  return `hsla(${getRandomNumber(0, 255)},
   ${getRandomNumber(30, 80)}%, ${getRandomNumber(40, 65)}%, 1.0)`
}

const getPercentage = (percentage: number, of: number) => Math.floor((percentage / 100) * of)

const dropPosOffset = (dropPos: positionObj, width: number, height: number) => {
  const offsetAppliedPos = { ...dropPos }

  // Tablets and desktop
  if (width > 380 && height > 168) {
    offsetAppliedPos.x -= getPercentage(2.2, width)
    offsetAppliedPos.y += getPercentage(3, height)

    // Large mobile phones
  } else if (width > 338 && height > 116) {
    offsetAppliedPos.x -= getPercentage(3.2, width)
    offsetAppliedPos.y -= 0.4

    // Small mobile phones
  } else if (width > 290 && height > 100) {
    offsetAppliedPos.x -= getPercentage(3.5, width)
    offsetAppliedPos.y -= 0.4

    // Extremely small phones/fallback
  } else {
    offsetAppliedPos.x -= getPercentage(3, width)
    offsetAppliedPos.y += -0.5
  }

  return offsetAppliedPos
}

export { getRandomColor, getPercentage, dropPosOffset }
