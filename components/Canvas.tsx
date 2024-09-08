import styles from 'styles/components/canvas.module.scss'
import React, { useEffect, useState, useRef } from 'react'
import emitter from 'helpers/MittEmitter'
import { clientPos, positionObj, historyStroke } from 'types/Position'
import {
  getPercentage,
  dropPosOffset,
  getHighestAndLowestPoints,
  removeColor,
  getLighterHslaShade,
  loadImage,
  playSound
} from 'helpers/helperFunctions'

const { canvas_outline, canvas_content, usernameRectangle } = styles

type canvasProps = {
  usingThickStroke: boolean
  usingPencil: boolean
  roomColor: string
  username: string
  clearCanvas: (clearEvenEmpty?: boolean, skipSound?: boolean) => void
}

interface textData {
  isSpace?: boolean
  isEnter?: boolean
  isKey?: boolean
  x: number
  y: number
  keyWidth?: number
  keyHeight?: number
}

const soundTriggeringDistance = 25
const averageLetterHeight = 15
const prudentialStrokeWait = 300

const Canvas = ({
  usingThickStroke,
  usingPencil,
  roomColor,
  username,
  clearCanvas
}: canvasProps) => {
  // REFS
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const firstLineYRef = useRef(0)

  // DRAWING STATE
  const [pos, setPos] = useState<positionObj>({ x: 0, y: 0 })
  const [keyPos, setKeyPos] = useState<positionObj>({ x: 0, y: 0 })
  const [draggingKey, setDraggingKey] = useState('')
  const [textHistory, setTextHistory] = useState<textData[]>([])
  const [ctx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [nameContainerWidth, setNameContainerWidth] = useState(0)
  const [divisionsHeight, setDivisionsHeight] = useState(0)
  const [consecutiveStrokes, setConsecutiveStrokes] = useState<historyStroke[]>([])
  const [latestFiredStrokeSound, setLatestFiredStrokeSound] = useState(0)

  // COLOR DATA
  const canvasBgColor = '#FDFDFD'
  const canvasBgColorArr = [253, 253, 253]
  const strokeColor = '#111'
  const strokeRGBArray = [17, 17, 17]
  const smallDevice = typeof window !== 'undefined' ? window.screen.width < 800 : false
  const smallerDevice = smallDevice && window.screen.width < 550
  const newLineStartX = smallerDevice ? 15 : 5

  const getNextYDivision = (y: number) => {
    const nextDivision = y + divisionsHeight
    if (nextDivision > canvasRef.current!.height) return firstLineYRef.current
    return nextDivision
  }

  const getPreviousYDivision = (y: number) => {
    const previousDivision = y - divisionsHeight
    if (0 > previousDivision) return 0
    return previousDivision
  }

  const getStartOfDivision = (y: number) => {
    let division = 0

    while (division + divisionsHeight < y) {
      division += divisionsHeight
    }

    return division
  }

  const getLineWidth = () => {
    const pxSize = window.devicePixelRatio || 1

    if (usingThickStroke) {
      if (pxSize >= 3) return pxSize * 2.5
      if (pxSize >= 2) return pxSize * 3
      return pxSize * 4
    } else {
      if (pxSize >= 3) return pxSize * 1
      if (pxSize >= 2) return pxSize * 1.2
      return pxSize * 1.5
    }
  }

  const getPosition = (e: clientPos) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect() // abs. size of element
    const scaleX = canvas.width / rect.width // relationship bitmap vs. element for x
    const scaleY = canvas.height / rect.height // relationship bitmap vs. element for y

    // Scale mouse coordinates after they have been adjusted to be relative to the element
    return {
      x: Math.floor((e.clientX - rect.left) * scaleX),
      y: Math.floor((e.clientY - rect.top) * scaleY)
    }
  }

  const resetPosition = () => setPos({ x: 0, y: 0 })

  const getFontSize = () => getPercentage(canvasRef.current!.width > 295 ? 88 : 94, divisionsHeight)

  // starting X refers to the end of the username rectangle, where the first line of user-generated text can begin
  const getStartingX = () => {
    return (
      nameContainerWidth +
      getPercentage(smallerDevice ? 3 : smallDevice ? 2 : 3, canvasRef.current!.width)
    )
  }

  const posOverflowsX = (pos: positionObj) => pos.x >= getPercentage(98, canvasRef.current!.width)

  const divionsHeightWithMargin = () => divisionsHeight + 6
  const nameContainerWidthWithMargin = () => nameContainerWidth + 8

  const isWithinUsername = (pos: positionObj) => {
    return pos.x < nameContainerWidthWithMargin() && pos.y < divionsHeightWithMargin()
  }

  const handleTextInsert = (key: string, posToUse?: positionObj) => {
    if (!ctx) return
    const keyPosition = posToUse || keyPos
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = strokeColor
    const textMetrics = ctx.measureText(key)
    const nextKeyPos = { x: Math.round(keyPosition.x + textMetrics.width), y: keyPosition.y }
    const marginRight = smallerDevice ? 12 : 0
    const nextKeyWillOverflowCanvas = posOverflowsX({
      x: nextKeyPos.x + marginRight,
      y: nextKeyPos.y
    })

    if (nextKeyWillOverflowCanvas) {
      nextKeyPos.x = newLineStartX
      nextKeyPos.y = getNextYDivision(keyPosition.y)

      const wouldKeysBeWithinUsername = isWithinUsername({
        x: newLineStartX,
        y: nextKeyPos.y - averageLetterHeight
      })
      if (wouldKeysBeWithinUsername) nextKeyPos.x = getStartingX()
    }

    setTextHistory([
      ...textHistory,
      {
        isKey: true,
        x: keyPosition.x,
        y: keyPosition.y,
        keyWidth: textMetrics.width,
        keyHeight: textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent
      }
    ])

    ctx.fillText(key, keyPosition.x, keyPosition.y)
    setKeyPos(nextKeyPos)
  }

  const typeKey = (key: string) => {
    if (!ctx || keyPos.y === -1) return
    handleTextInsert(key)
  }

  const typeSpace = () => {
    if (keyPos.y === -1) return
    const spaceVal = smallerDevice ? 12 : 5
    const nextKeyPos = { x: keyPos.x + spaceVal, y: keyPos.y }
    const nextKeyWillOverflowCanvas = posOverflowsX(nextKeyPos)

    if (nextKeyWillOverflowCanvas) {
      nextKeyPos.x = newLineStartX
      nextKeyPos.y = getNextYDivision(keyPos.y)

      const wouldKeysBeWithinUsername = isWithinUsername({
        x: newLineStartX,
        y: nextKeyPos.y - averageLetterHeight
      })
      if (wouldKeysBeWithinUsername) nextKeyPos.x = getStartingX()
    }

    setKeyPos(nextKeyPos)
    setTextHistory([...textHistory, { isSpace: true, x: nextKeyPos.x, y: nextKeyPos.y }])
  }

  const typeEnter = () => {
    const nextKeyPos = { x: newLineStartX, y: getNextYDivision(keyPos.y) }
    const wouldKeysBeWithinUsername = isWithinUsername({
      x: newLineStartX,
      y: nextKeyPos.y - averageLetterHeight
    })

    if (wouldKeysBeWithinUsername) nextKeyPos.x = getStartingX()

    setKeyPos(nextKeyPos)
    setTextHistory([...textHistory, { isEnter: true, x: nextKeyPos.x, y: nextKeyPos.y }])
  }

  const typeDel = () => {
    if (!ctx || !textHistory.length) return
    const lastKey = textHistory[textHistory.length - 1]

    if (lastKey.isKey) {
      ctx.clearRect(
        lastKey.x - 1,
        lastKey.y - (lastKey.keyHeight! - (smallDevice ? 4 : 3)),
        lastKey.keyWidth! + 1,
        lastKey.keyHeight! + 1
      )
      setKeyPos({ x: lastKey.x, y: lastKey.y })
    } else if (lastKey.isSpace) {
      setKeyPos({ x: lastKey.x - 5, y: lastKey.y })
    } else if (lastKey.isEnter) {
      let previousX = getStartingX()
      let previousY = getPreviousYDivision(lastKey.y)
      const keyBehindPrevious = textHistory[textHistory.length - 2]

      if (keyBehindPrevious) {
        const { x, y, keyWidth } = keyBehindPrevious
        previousX = keyWidth ? x + keyWidth : x
        previousY = y
      }

      setKeyPos({ x: previousX, y: previousY })
    }

    setTextHistory(textHistory.slice(0, -1))
  }

  const dropDraggingKey = (posToDropIn: clientPos, draggingKey: string) => {
    if (!draggingKey || !ctx) return

    const { height, width } = canvasRef.current!
    const offsetPos = dropPosOffset(getPosition(posToDropIn), width, height)
    const { x, y } = offsetPos
    const droppedOutsideCanvas = y >= height || 8 >= y || x >= width || 8 >= x

    if (isWithinUsername(offsetPos) || droppedOutsideCanvas) return
    handleTextInsert(draggingKey, offsetPos)
    playSound('drop-key', 0.2)
  }

  const drawDivisions = () => {
    const divisionsCanvas = document.createElement('canvas')
    const divCtx = divisionsCanvas.getContext('2d')!
    divisionsCanvas.width = containerRef.current!.offsetWidth * (window.devicePixelRatio || 1)
    divisionsCanvas.height = containerRef.current!.offsetHeight * (window.devicePixelRatio || 1)

    divCtx.fillStyle = canvasBgColor
    divCtx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    divCtx.strokeStyle = roomColor.replace('1.0', '0.6')
    divCtx.lineWidth = 1

    for (let i = 1; i < 5; i++) {
      divCtx.beginPath()
      divCtx.moveTo(3, divisionsHeight * i)
      divCtx.lineTo(canvasRef.current!.width - 3, divisionsHeight * i)
      divCtx.stroke()
    }

    const dataUrl = divisionsCanvas.toDataURL('image/png')
    const existingDivisions = document.getElementById('canvasDivisions')
    if (existingDivisions) existingDivisions.remove()
    const img = new Image()
    img.id = 'canvasDivisions'
    img.src = dataUrl
    img.draggable = false
    containerRef.current!.append(img)
  }

  const drawUsernameRectangle = (
    ctx: CanvasRenderingContext2D,
    loadFont?: boolean,
    appendImgToCanvas?: boolean
  ) => {
    if (!ctx || !canvasRef.current) return
    const usernameCanvas = document.createElement('canvas')
    const usernameCtx = usernameCanvas.getContext('2d')!
    const ctxToUse = appendImgToCanvas ? usernameCtx : ctx

    if (appendImgToCanvas) {
      usernameCanvas.width = nameContainerWidthWithMargin()
      usernameCanvas.height = divionsHeightWithMargin()
    } else {
      ctxToUse.fillStyle = canvasBgColor
      ctxToUse.fillRect(0, 0, nameContainerWidth + 5, divisionsHeight + 5)
    }

    const lineWidth =
      (window.devicePixelRatio || 1) >= 2
        ? window.devicePixelRatio * 1
        : (window.devicePixelRatio || 1) * 1.5

    ctxToUse.globalCompositeOperation = 'source-over'
    ctxToUse.lineJoin = 'bevel'
    ctxToUse.imageSmoothingEnabled = false
    let pixelBorderSize = canvasRef.current!.width >= 400 ? 3 : 2
    ctxToUse.lineWidth = lineWidth
    ctxToUse.fillStyle = getLighterHslaShade(roomColor)
    ctxToUse.strokeStyle = roomColor
    ctxToUse.beginPath()
    ctxToUse.moveTo(0, divisionsHeight)
    ctxToUse.lineTo(nameContainerWidth, divisionsHeight)
    ctxToUse.lineTo(nameContainerWidth, divisionsHeight - pixelBorderSize)
    ctxToUse.lineTo(nameContainerWidth + pixelBorderSize, divisionsHeight - pixelBorderSize)
    ctxToUse.lineTo(nameContainerWidth + pixelBorderSize, divisionsHeight - pixelBorderSize * 2)
    ctxToUse.lineTo(nameContainerWidth + pixelBorderSize * 2, divisionsHeight - pixelBorderSize * 2)
    // Send the line above the canvas (-5 y) to hide the top stroke, which we don't want to show.
    ctxToUse.lineTo(nameContainerWidth + pixelBorderSize * 2, -5)
    ctxToUse.lineTo(0, -5)
    ctxToUse.fill()
    ctxToUse.stroke()
    ctxToUse.fillStyle = roomColor

    // Write username making sure our font loaded first
    const f = new FontFace('nds', 'url(/fonts/nds.ttf)')

    const writeUsername = () => {
      if (!ctx || !canvasRef.current) return
      ctxToUse.font = `${getFontSize()}px 'nds', roboto, sans-serif`
      ctx.font = `${getFontSize()}px 'nds', roboto, sans-serif`
      const firstLineY = getPercentage(80, divisionsHeight)
      ctxToUse.fillText(username, smallerDevice ? 18 : smallDevice ? 10 : 8, firstLineY - 1.5)
      setKeyPos({ x: getStartingX(), y: firstLineY })

      firstLineYRef.current = firstLineY

      if (appendImgToCanvas) {
        const dataUrl = usernameCanvas.toDataURL('image/png')
        const existingUserRect = document.getElementById(usernameRectangle)
        if (existingUserRect) existingUserRect.remove()
        const img = new Image()
        img.id = usernameRectangle
        img.src = dataUrl
        img.draggable = false
        containerRef.current!.append(img)
      }
    }

    if (loadFont) f.load().then((font) => writeUsername())
    else writeUsername()
  }

  const draw = (e: React.PointerEvent) => {
    e.preventDefault()
    if (draggingKey) return
    const pointerIsMakingContact = e.buttons === 1
    if (!ctx || !pointerIsMakingContact || isWithinUsername(pos)) return setPos(getPosition(e))

    ctx.beginPath()
    ctx.globalCompositeOperation = usingPencil ? 'source-over' : 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineWidth = getLineWidth()
    ctx.strokeStyle = strokeColor

    ctx.moveTo(pos.x, pos.y)
    const newPos = getPosition(e)
    setPos(newPos)
    ctx.lineTo(newPos.x, newPos.y)
    ctx.stroke()

    const updatedStrokes = [...consecutiveStrokes, { ...newPos, ts: Date.now() }]
    setConsecutiveStrokes(updatedStrokes)
    checkLatestStrokes(updatedStrokes)
  }

  let soundsThisRender = 0
  const checkLatestStrokes = (strokes: historyStroke[]) => {
    const lastHalfSecond = Date.now() - 500
    const timespanStrokes = strokes.filter((stroke) => stroke.ts > lastHalfSecond)

    const firstStroke = timespanStrokes[0]
    const lastStroke = timespanStrokes[timespanStrokes.length - 1]

    if (latestFiredStrokeSound && lastStroke.ts < latestFiredStrokeSound + prudentialStrokeWait) {
      return
    }

    const xDiff = Math.abs(lastStroke.x - firstStroke.x)
    const yDiff = Math.abs(lastStroke.y - firstStroke.y)

    const distanceToUse = xDiff > yDiff ? xDiff : yDiff

    // Prevent sounds from accidentally firing twice (or thrice) in a row
    if (distanceToUse >= soundTriggeringDistance && soundsThisRender < 1) {
      soundsThisRender++
      setLatestFiredStrokeSound(lastStroke.ts)
      let volume = usingThickStroke ? 0.3 : 0.15

      if (smallDevice) volume = 0.6
      if (usingPencil) return playSound('pencil-stroke', volume)
      return playSound('eraser-stroke', volume)
    }
  }

  const endDrawing = (e: React.PointerEvent) => {
    e.preventDefault()
    setConsecutiveStrokes([])
  }

  const drawDot = (e: React.PointerEvent) => {
    e.preventDefault()
    if (draggingKey) return
    const posToUse = e.pointerType !== 'mouse' ? getPosition(e) : pos
    const usedMouseNoLeftBtn = e.pointerType === 'mouse' && e.buttons !== 1

    if (!ctx || usedMouseNoLeftBtn || isWithinUsername(posToUse)) return setPos(getPosition(e))
    if (e.pointerType !== 'mouse') setPos(posToUse)

    ctx.beginPath()
    ctx.globalCompositeOperation = usingPencil ? 'source-over' : 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineWidth = getLineWidth()
    ctx.strokeStyle = strokeColor

    ctx.moveTo(posToUse.x, posToUse.y)
    ctx.lineTo(posToUse.x, posToUse.y)
    ctx.stroke()

    if (usingPencil) {
      playSound('draw-dot', 0.04)
    } else {
      playSound('erase-dot', 0.04)
    }
  }

  const copyCanvas = async (imgUri: string) => {
    if (!ctx || !canvasRef.current) return
    const dpr = window.devicePixelRatio || 1

    // Use a different content (imgCtx) to draw the received image and remove its white background
    // If we removed it in ctx, it'd cause lag on mobile.
    const imgCanvas = document.createElement('canvas')
    imgCanvas.width = ctx.canvas.width * dpr
    imgCanvas.height = ctx.canvas.height * dpr
    const imgCtx = imgCanvas.getContext('2d')!

    const receivedImg = await loadImage(imgUri)
    const ratio = receivedImg.naturalWidth / receivedImg.naturalHeight

    // Draw the received image which will have a white background
    imgCtx.drawImage(
      receivedImg,
      0,
      0,
      receivedImg.width * dpr,
      receivedImg.height * dpr,
      0,
      0,
      ctx.canvas.width * dpr,
      (ctx.canvas.width / ratio) * dpr
    )

    removeColor(imgCtx, canvasBgColorArr)
    const transparentDataURL = imgCanvas.toDataURL()
    const transparentImg = await loadImage(transparentDataURL)

    // Draw the transparent image into our ctx
    ctx.drawImage(
      transparentImg,
      0,
      0,
      transparentImg.width,
      transparentImg.height,
      0,
      0,
      transparentImg.width,
      transparentImg.height
    )
    playSound('copy-last-canvas', 0.3)
  }

  const sendMessage = () => {
    if (!ctx) return

    const msgCanvas = document.createElement('canvas')
    const msgCtx = msgCanvas.getContext('2d')!
    const minHeight = divisionsHeight
    msgCanvas.width = ctx.canvas.width

    const nameContainerPos = { x: nameContainerWidth, y: divisionsHeight }
    const { highestPoint, lowestPoint, conflictingPoints } = getHighestAndLowestPoints(
      ctx,
      strokeRGBArray,
      nameContainerPos
    )

    clearCanvas(true, true)
    if (highestPoint && lowestPoint) {
      const contentHeight = lowestPoint[1] - highestPoint[1]
      let sourceY = 0
      let destinationY = 0
      const margin = 10

      const isNextToUsername =
        lowestPoint[0] > nameContainerWidth &&
        highestPoint[0] > nameContainerWidth &&
        lowestPoint[1] < divionsHeightWithMargin() &&
        highestPoint[1] < divionsHeightWithMargin()

      const hPointNextToUsername =
        !isNextToUsername &&
        highestPoint[0] > nameContainerWidth &&
        highestPoint[1] < divionsHeightWithMargin()

      const hPointUnderAndOutsideUsername =
        highestPoint[0] > nameContainerWidth && highestPoint[1] > divionsHeightWithMargin()

      const hPointUnderAndWithinUsername =
        highestPoint[0] < nameContainerWidth && highestPoint[1] > divionsHeightWithMargin()

      if (isNextToUsername) {
        msgCanvas.height = minHeight
      }

      if (hPointNextToUsername) {
        msgCanvas.height = lowestPoint[1] + margin + margin / 2
      }

      if (hPointUnderAndOutsideUsername && !conflictingPoints) {
        const contentSmallerThanMinHeight = contentHeight <= minHeight - 4
        const startOfDivision = getStartOfDivision(highestPoint[1])
        const endOfDivision = startOfDivision + divisionsHeight

        if (
          contentSmallerThanMinHeight &&
          highestPoint[1] > startOfDivision &&
          lowestPoint[1] < endOfDivision
        ) {
          msgCanvas.height = minHeight
          sourceY = startOfDivision
        } else {
          // We need extra margin in this case, so multiply it by 2
          msgCanvas.height = lowestPoint[1] + margin * 2 - (highestPoint[1] - margin * 2)
          sourceY = highestPoint[1] - margin * 2

          // Prevent the original username rectangle from appearing on top of the one we're gonna draw
          if (sourceY < divisionsHeight) {
            msgCanvas.height = lowestPoint[1] + margin - divionsHeightWithMargin()
            sourceY = divionsHeightWithMargin()
          }
        }
      }

      if (hPointUnderAndWithinUsername || (conflictingPoints && !hPointNextToUsername)) {
        sourceY = highestPoint[1] - margin
        destinationY = minHeight

        const contentSmallerThanMinHeight = contentHeight <= minHeight - 4
        const startOfDivision = getStartOfDivision(highestPoint[1])
        const endOfDivision = startOfDivision + divisionsHeight

        if (
          contentSmallerThanMinHeight &&
          highestPoint[1] > startOfDivision &&
          lowestPoint[1] < endOfDivision
        ) {
          msgCanvas.height = minHeight * 2
        } else {
          msgCanvas.height = minHeight + (lowestPoint[1] + margin - (highestPoint[1] - margin))
        }
      }

      msgCtx.fillStyle = canvasBgColor
      msgCtx.fillRect(0, 0, msgCanvas.width, msgCanvas.height)

      msgCtx.drawImage(
        ctx.canvas,
        0,
        sourceY,
        ctx.canvas.width,
        msgCanvas.height,
        0,
        destinationY,
        msgCanvas.width,
        msgCanvas.height
      )

      drawUsernameRectangle(msgCtx, false, false)

      emitter.emit('canvasData', {
        dataUrl: msgCanvas.toDataURL(),
        height: msgCanvas.height,
        width: msgCanvas.width
      })
      playSound('send-message', 0.5)
    } else {
      playSound('btn-denied', 0.4)
    }
  }

  // CANVAS SETUP - Happens on mounted
  useEffect(() => {
    const canvas = canvasRef.current!

    if (!canvas.getContext) return
    canvas.width = containerRef.current!.offsetWidth * (window.devicePixelRatio || 1)
    canvas.height = containerRef.current!.offsetHeight * (window.devicePixelRatio || 1)
    const ctx = canvas.getContext('2d')!

    setCanvasCtx(ctx)
    setDivisionsHeight(Math.floor(canvas.height / 5))
    setNameContainerWidth(getPercentage(25, canvas.width))
  }, [])

  useEffect(() => drawDivisions(), [divisionsHeight])
  useEffect(() => drawUsernameRectangle(ctx!, true, true), [nameContainerWidth, username])

  useEffect(() => {
    emitter.on('canvasToCopy', copyCanvas)
    emitter.on('draggingKey', (key: string) => setDraggingKey(key))
    emitter.on('sendMessage', sendMessage)

    return () => {
      emitter.off('canvasToCopy')
      emitter.off('draggingKey')
      emitter.off('sendMessage')
    }
  }, [ctx, username])

  useEffect(() => {
    const handleMouseKeyDrop = (e: MouseEvent) => dropDraggingKey(e, draggingKey)
    const handleTouchKeyDrop = (e: TouchEvent) => {
      const { clientX, clientY } = e.changedTouches[0]
      dropDraggingKey({ clientX, clientY }, draggingKey)
    }

    document.querySelector('html')!.addEventListener('mouseup', handleMouseKeyDrop)
    document.querySelector('html')!.addEventListener('touchend', handleTouchKeyDrop)
    return () => {
      document.querySelector('html')!.removeEventListener('mouseup', handleMouseKeyDrop)
      document.querySelector('html')!.removeEventListener('touchend', handleTouchKeyDrop)
    }
  }, [draggingKey])

  useEffect(() => {
    emitter.on('typeKey', typeKey)
    emitter.on('typeSpace', typeSpace)
    emitter.on('typeEnter', typeEnter)
    emitter.on('typeDel', typeDel)

    return () => {
      emitter.off('typeKey')
      emitter.off('typeSpace')
      emitter.off('typeEnter')
      emitter.off('typeDel')
    }
  }, [keyPos, textHistory])

  return (
    <div className={`${canvas_outline} active_bg_color`}>
      <div ref={containerRef} className={canvas_content}>
        <canvas
          id="roomCanvas"
          onPointerUp={endDrawing}
          onPointerDown={drawDot}
          onPointerMove={draw}
          onMouseEnter={(e) => setPos(getPosition(e))}
          onMouseLeave={resetPosition}
          onTouchStart={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
          onTouchEnd={(e) => e.preventDefault()}
          ref={canvasRef}
        >
          <p>Please use a browser that supports the canvas element</p>
        </canvas>
      </div>
    </div>
  )
}

export default Canvas
