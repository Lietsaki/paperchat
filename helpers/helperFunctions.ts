import { PositionObj } from 'types/Position'
import { store } from 'store/store'
import { Capacitor } from '@capacitor/core'
import { Howl } from 'howler'
import { usernameMinLength, usernameMaxLength } from 'store/initializer'

const getRandomNumber = (min: number, max: number) => Math.round(Math.random() * (max - min) + min)

const getSimpleId = () => Date.now() + '-' + (getRandomNumber(100, 999) + '')

const getRandomColor = () => {
  return `hsla(${getRandomNumber(0, 255)}, ${getRandomNumber(30, 65)}%, ${getRandomNumber(
    40,
    65
  )}%, 1.0)`
}

const wait = (ms: number) => {
  return new Promise<'timeout'>((resolve) => {
    setTimeout(() => resolve('timeout'), ms)
  })
}

const isFirefoxDesktop = () => {
  const ua = navigator.userAgent.toLowerCase()
  const isFirefox = ua.includes('firefox')
  const isMobile = /mobi|android|tablet|ipad|iphone/.test(ua)

  return isFirefox && !isMobile
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

const dropPosOffset = (dropPos: PositionObj, width: number, height: number) => {
  const offsetAppliedPos = { ...dropPos }
  const smallDevice = window.innerWidth < 500

  // Mid-large mobile phones
  if (width > 1000 && height > 350) {
    offsetAppliedPos.x -= getPercentage(3, width)
    offsetAppliedPos.y += getPercentage(0.4, height)

    // Tablets and desktop
  } else if (width > 600 && height > 168 && !smallDevice) {
    const y = isFirefoxDesktop() ? 6 : 3
    offsetAppliedPos.x -= getPercentage(2, width)
    offsetAppliedPos.y += getPercentage(y, height)

    // Small mobile phones
  } else if (width > 600 && height > 200) {
    offsetAppliedPos.x -= getPercentage(3, width)
    offsetAppliedPos.y -= 0.5

    // Extremely small devices / Fallback
  } else {
    offsetAppliedPos.x -= getPercentage(2.4, width)
    offsetAppliedPos.y += 4
  }

  return offsetAppliedPos
}

const getHighestAndLowestPoints = (
  ctx: CanvasRenderingContext2D,
  color: number[],
  belowThisPos?: PositionObj
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

// Takes an array with an rgb color for the exception, in our case it'll be the white canvas background
const keepOnlyShadesOfGray = (ctx: CanvasRenderingContext2D, exception: number[]) => {
  const canvasData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  const pix = canvasData.data

  for (let i = 0; i < pix.length; i += 4) {
    const r = pix[i]
    const g = pix[i + 1]
    const b = pix[i + 2]
    const isException = r === exception[0] && g === exception[1] && b === exception[2]

    // Check if the color is a shade of gray: R, G, and B values should be the same
    const isGray = Math.abs(r - g) === 0 && Math.abs(r - b) === 0 && Math.abs(g - b) === 0

    // Set the pixel's alpha channel to 0 (make transparent)
    if (!isGray || isException) {
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
    img.onerror = (err) => reject(err)
    img.src = url
  })
}

const isColorValid = (color: string) => {
  if (typeof color !== 'string' || !color || !color.startsWith('hsla') || !color.endsWith('1.0)'))
    return false

  const testElement = document.createElement('div')
  testElement.style.borderColor = color
  const colorToTest = testElement.style.borderColor

  if (colorToTest.length == 0) return false
  return true
}

const isUsernameValid = (username: string) => {
  if (
    !username ||
    typeof username !== 'string' ||
    username.trim().length < usernameMinLength ||
    username.trim().length > usernameMaxLength
  ) {
    return false
  }

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
    (document.hidden && Capacitor.isNativePlatform()) || // Never play on the mobile app if hidden (push notifications notify users of new messages)
    (document.hidden && !playEvenHidden) // Allow playing on non-native if playEvenHidden is true (e.g. when notifying of a new message)
  ) {
    return
  }

  const sound = new Howl({
    src: [`/sounds/${filename}.mp3`],
    volume
  })

  sound.play()
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
  isColorValid,
  keepOnlyShadesOfGray,
  areDatesOnTheSameDay,
  playSound,
  getLighterHslaShade,
  loadImage,
  calculateAspectRatioFit,
  isUsernameValid,
  wait
}
