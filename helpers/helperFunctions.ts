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

const getUserAgentData = () => {
  const ua = navigator.userAgent.toLowerCase()
  const isFirefox = ua.includes('firefox')
  const isMobile = /mobi|android|tablet|ipad|iphone/.test(ua)

  return { isFirefox, isMobile }
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

const getPercentageRaw = (percentage: number, of: number) => (percentage / 100) * of

const dropPosOffset = (dropPos: PositionObj) => {
  const dpr = Number((window.devicePixelRatio || 1).toFixed(2))

  let offsetX = -10
  let offsetY = dpr === 1 ? 4 : 6
  const isPhone = window.innerWidth < 500
  const isPhoneLandscape = window.innerHeight < 500 && window.innerWidth > 500
  const { isFirefox, isMobile } = getUserAgentData()

  if (isMobile) {
    if (dpr > 3.5) {
      offsetX = -9.5
      offsetY = -0.8

      if (isPhoneLandscape) {
        offsetY = 5
      }
    } else if (dpr >= 3) {
      offsetX = -9.5
      offsetY = -0.3

      if (isPhoneLandscape) {
        offsetY = 5
      }
    } else if (dpr >= 2) {
      offsetX = -10
      offsetY = 5

      if (isPhone) {
        offsetX = -9.6
        offsetY = 0.6
      }

      if (isPhoneLandscape) {
        offsetY = 4
      }
    }
  }

  if (isFirefox && !isMobile) {
    offsetY = getPercentageRaw(1, window.innerHeight)
  }

  return {
    x: dropPos.x + offsetX * dpr,
    y: dropPos.y + offsetY * dpr
  }
}

const getHighestAndLowestPoints = (
  ctx: CanvasRenderingContext2D,
  color: number[],
  belowThisPos?: PositionObj
) => {
  const { width } = ctx.canvas
  const { height } = ctx.canvas
  const data = ctx.getImageData(0, 0, width, height) // get image data
  const buffer = data.data // and its pixel buffer

  let highestPoint: [number, number] | null = null
  let lowestPoint: [number, number] | null = null
  let pointsBelowPos = false

  for (let y = 0; y < height; y++) {
    // Byte position where row y starts (each row has w pixels × 4 bytes)
    const p = y * 4 * width

    for (let x = 0; x < width; x++) {
      // Next pixel (skipping 4 bytes as each pixel is RGBA bytes)
      const px = p + x * 4

      // Check if pixel matches the target color
      if (buffer[px] === color[0] && buffer[px + 1] === color[1] && buffer[px + 2] === color[2]) {
        if (!highestPoint || y < highestPoint[1]) {
          highestPoint = [x, y]
        }

        if (!lowestPoint || y > lowestPoint[1]) {
          lowestPoint = [x, y]
        }

        if (belowThisPos && x < belowThisPos.x && y > belowThisPos.y) {
          pointsBelowPos = true
        }
      }
    }
  }

  return { highestPoint, lowestPoint, pointsBelowPos }
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

const containsNonLatinChars = (text: string) => {
  for (const char of text) {
    const code = char.codePointAt(0)!
    // Everything above Latin Extended
    if (code > 0x024f) return true
  }
  return false
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
  wait,
  containsNonLatinChars
}
