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

const getHighestAndLowestPoints = (ctx: CanvasRenderingContext2D, color: number[]) => {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  const data = ctx.getImageData(0, 0, w, h) // get image data
  const buffer = data.data // and its pixel buffer
  const len = buffer.length // cache length
  let y = 0
  let p = 0
  let px = 0 // for iterating

  let highestPoint = null
  let lowestPoint = null

  /// iterating x/y instead of forward to get position the easy way
  for (; y < h; y++) {
    /// common value for all x
    p = y * 4 * w

    for (let x = 0; x < w; x++) {
      /// next pixel (skipping 4 bytes as each pixel is RGBA bytes)
      px = p + x * 4

      /// if red component match check the others
      if (buffer[px] === color[0]) {
        if (buffer[px + 1] === color[1] && buffer[px + 2] === color[2]) {
          if (!highestPoint) highestPoint = [x, y]
          else lowestPoint = [x, y]
        }
      }
    }
  }
  return { highestPoint, lowestPoint }
}

export { getRandomColor, getPercentage, dropPosOffset, getHighestAndLowestPoints }
