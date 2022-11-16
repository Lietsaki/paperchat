import { positionObj } from 'types/Position'
import { store } from 'store/store'
import { Capacitor } from '@capacitor/core'

const getRandomNumber = (min: number, max: number) => Math.round(Math.random() * (max - min) + min)

const getSimpleId = () => Date.now() + '-' + (getRandomNumber(100, 999) + '')

const getRandomColor = () => {
  return `hsla(${getRandomNumber(0, 255)}, ${getRandomNumber(30, 65)}%, ${getRandomNumber(
    40,
    65
  )}%, 1.0)`
}

// Color is a string obtained from getRandomColor()
const getLighterHslaShade = (color: string) => {
  const lightIndex = color.lastIndexOf('%')
  const lightness = Number(color.substring(lightIndex - 2, lightIndex))
  let amount = 30
  if (lightness >= 60) amount = 25
  if (lightness <= 50) amount = 40

  return `${color.substring(0, lightIndex - 2)}${lightness + amount}${color.substring(lightIndex)}`
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

const getHighestAndLowestPoints = (
  ctx: CanvasRenderingContext2D,
  color: number[],
  belowThisPos?: positionObj
) => {
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
  let conflictingPoints = false

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

          if (belowThisPos && x < belowThisPos.x && y > belowThisPos.y) conflictingPoints = true
        }
      }
    }
  }
  return { highestPoint, lowestPoint, conflictingPoints }
}

// Takes an array with an rgb color. For example: [0, 0, 255] would remove blue.
const removeColor = (ctx: CanvasRenderingContext2D, color: number[]) => {
  const canvasData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  const pix = canvasData.data

  for (var i = 0, n = pix.length; i < n; i += 4) {
    if (pix[i] === color[0] && pix[i + 1] === color[1] && pix[i + 2] === color[2]) {
      pix[i + 3] = 0
    }
  }

  ctx.putImageData(canvasData, 0, 0)
}

const createActiveColorClass = (hslaColor: string) => {
  const styleID = 'active_color_style'
  const previousStyle = document.getElementById(styleID)
  if (previousStyle) previousStyle.remove()

  const style = document.createElement('style')
  style.id = styleID

  style.innerHTML = `
    .active_color {
      background-color: ${hslaColor};
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 5;
      opacity: 0.5;
      filter: brightness(0.8);
      left: 0;
      top: 0;
    }

    .active_bg_color {
      background-color: ${hslaColor};
    }
    
    .active_color.bright {
      filter: brightness(1.05);
      opacity: 0.4;
    }
  `
  document.head.appendChild(style)
}

// Check if a container will be overflowed after adding a new item to it.
// This operation is performed BEFORE adding the new item, that's why we
// use it as the initial value for .reduce()
const willContainerBeOverflowed = (
  container: HTMLDivElement,
  containerHeightOffset: number = 0,
  childrenMargin?: number,
  newItemHeight?: number
) => {
  if (!container) return false
  const children = Array.from(container.children)

  let baseHeight = 0
  if (newItemHeight) baseHeight = newItemHeight
  else baseHeight = children[0] ? children[0].clientHeight : 0

  let childMargin = 0
  if (childrenMargin) childMargin = childrenMargin
  else childMargin = children[0] ? children[0].clientHeight + 1 : 0

  const computedStyle = getComputedStyle(container)
  const containerHeight =
    container.clientHeight -
    (parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)) -
    containerHeightOffset

  const childrenHeight = children.reduce(
    (count, child) => count + child.clientHeight + childMargin,
    baseHeight
  )

  return childrenHeight > containerHeight
}

const getImageData = (url: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    let img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject()
    img.src = url
  })
}

const isValidColor = (color: string) => {
  if (typeof color !== 'string' || !color || !color.startsWith('hsla') || !color.endsWith('1.0)'))
    return false

  const testElement = document.createElement('div')
  testElement.style.borderColor = color
  const colorToTest = testElement.style.borderColor

  if (colorToTest.length == 0) return false
  return true
}

const areDatesOnTheSameDay = (first: Date, second: Date) => {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

const calculateAspectRatioFit = (
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
) => {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)

  return { width: Math.ceil(srcWidth * ratio), height: Math.ceil(srcHeight * ratio) }
}

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const image = new Image()

    // Allow bringing data from a cross origin (image urls from firebase storage)
    image.crossOrigin = 'Anonymous'
    image.addEventListener('load', () => resolve(image))

    image.src = url
    if (image.complete) resolve(image)
  })
}

const playSound = (filename: string, volume = 1, playEvenHidden?: boolean) => {
  if (
    store.getState().user.muteSounds || // Never play if the user explicitly muted the app
    (document.hidden && Capacitor.isNativePlatform()) || // Never play on native if hidden
    (document.hidden && !playEvenHidden) // Allow playing on non-native if playEvenHidden is true
  ) {
    return
  }

  const audio = new Audio(`/sounds/${filename}.m4a`)
  audio.volume = volume
  audio.play()
}

export {
  getRandomNumber,
  getSimpleId,
  getRandomColor,
  getPercentage,
  dropPosOffset,
  getHighestAndLowestPoints,
  createActiveColorClass,
  willContainerBeOverflowed,
  getImageData,
  isValidColor,
  removeColor,
  areDatesOnTheSameDay,
  playSound,
  getLighterHslaShade,
  loadImage,
  calculateAspectRatioFit
}
