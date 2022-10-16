import styles from 'styles/components/canvas.module.scss'
import React, { useEffect, useState, useRef } from 'react'
import emitter from 'helpers/MittEmitter'
import { clientPos, positionObj } from 'types/Position'
import {
  getPercentage,
  dropPosOffset,
  getHighestAndLowestPoints,
  removeColor
} from 'helpers/helperFunctions'

const { canvas_outline, canvas_content } = styles

type canvasProps = {
  usingThickStroke: boolean
  usingPencil: boolean
  roomColor: string
  username: string
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

const Canvas = ({ usingThickStroke, usingPencil, roomColor, username }: canvasProps) => {
  // REFS
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // DRAWING STATE
  const [pos, setPos] = useState<positionObj>({ x: 0, y: 0 })
  const [keyPos, setKeyPos] = useState<positionObj>({ x: 0, y: 0 })
  const [draggingKey, setDraggingKey] = useState('')
  const [textHistory, setTextHistory] = useState<textData[]>([])
  const [ctx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [nameContainerWidth, setNameContainerWidth] = useState(0)
  const [divisionsHeight, setDivisionsHeight] = useState(0)

  // COLOR DATA
  const [canvasColor, setCanvasColor] = useState(roomColor)
  const colorRef = useRef<string>('')
  colorRef.current = canvasColor
  const canvasBgColor = '#FDFDFD'
  const strokeColor = '#111'
  const strokeRGBArray = [17, 17, 17]

  const clearCanvas = () => {
    if (!ctx) return
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    drawUsernameRectangle(ctx)
  }

  const getNextYDivision = (y: number) => {
    const nextDivision = y + divisionsHeight
    if (nextDivision > canvasRef.current!.height) return -1
    return nextDivision
  }

  const getPreviousYDivision = (y: number) => {
    const previousDivision = y - divisionsHeight
    if (0 > previousDivision) return -1
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
    const smallDevice = window.screen.width < 999

    if (usingThickStroke) {
      if (smallDevice) return 6
      return 4
    } else {
      if (smallDevice) return 3
      return 2
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
  const getStartingX = () => nameContainerWidth + getPercentage(3, canvasRef.current!.width)
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
    const nextKeyWillOverflowCanvas = posOverflowsX(nextKeyPos)

    if (nextKeyWillOverflowCanvas) {
      nextKeyPos.x = 5
      nextKeyPos.y = getNextYDivision(keyPosition.y)
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
    const nextKeyPos = { x: keyPos.x + 5, y: keyPos.y }
    const nextKeyWillOverflowCanvas = posOverflowsX(nextKeyPos)

    if (nextKeyWillOverflowCanvas) {
      nextKeyPos.x = 5
      nextKeyPos.y = getNextYDivision(keyPos.y)
    }

    setKeyPos(nextKeyPos)
    setTextHistory([...textHistory, { isSpace: true, x: nextKeyPos.x, y: nextKeyPos.y }])
  }

  const typeEnter = () => {
    if (keyPos.y === -1) return
    const nextKeyPos = { x: 5, y: getNextYDivision(keyPos.y) }
    const averageLetterHeight = 15
    const wouldKeysBeWithinUsername = isWithinUsername({
      x: 5,
      y: nextKeyPos.y - averageLetterHeight
    })

    if (wouldKeysBeWithinUsername) nextKeyPos.y += getPercentage(6, canvasRef.current!.height)

    if (nextKeyPos.y !== -1) {
      setKeyPos(nextKeyPos)
      setTextHistory([...textHistory, { isEnter: true, x: nextKeyPos.x, y: nextKeyPos.y }])
    }
  }

  const typeDel = () => {
    if (!ctx || !textHistory.length) return
    const lastKey = textHistory[textHistory.length - 1]

    if (lastKey.isKey) {
      ctx.clearRect(
        lastKey.x - 1,
        lastKey.y - (lastKey.keyHeight! - 3),
        lastKey.keyWidth! + 1,
        lastKey.keyHeight!
      )
      setKeyPos({ x: lastKey.x, y: lastKey.y })
    } else if (lastKey.isSpace) {
      setKeyPos({ x: lastKey.x - 5, y: lastKey.y })
    } else if (lastKey.isEnter) {
      let previousX = getStartingX()
      const keyBehindPrevious = textHistory[textHistory.length - 2]

      if (keyBehindPrevious) {
        const { x, keyWidth } = keyBehindPrevious
        previousX = keyWidth ? x + keyWidth : x
      }

      setKeyPos({ x: previousX, y: getPreviousYDivision(keyPos.y) })
    }

    setTextHistory(textHistory.slice(0, -1))
  }

  const dropDraggingKey = (pos: clientPos, draggingKey: string) => {
    if (!draggingKey || !ctx) return

    const { height, width } = canvasRef.current!
    const offsetPos = dropPosOffset(getPosition(pos), width, height)
    const { x, y } = offsetPos
    const droppedOutsideCanvas = y >= height || 8 >= y || x >= width || 8 >= x

    if (isWithinUsername(offsetPos) || droppedOutsideCanvas) return
    handleTextInsert(draggingKey, offsetPos)
  }

  const drawDivisions = () => {
    if (!ctx) return
    ctx.fillStyle = canvasBgColor
    ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    ctx.strokeStyle = colorRef.current.replace('1.0', '0.6')
    ctx.lineWidth = 1

    for (let i = 1; i < 5; i++) {
      ctx.beginPath()
      ctx.moveTo(3, divisionsHeight * i)
      ctx.lineTo(canvasRef.current!.width - 3, divisionsHeight * i)
      ctx.stroke()
    }

    const data_url = canvasRef.current!.toDataURL('image/png')
    const img = new Image()
    img.id = 'canvasDivisions'
    img.src = data_url
    containerRef.current!.append(img)
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
  }

  const drawUsernameRectangle = (ctx: CanvasRenderingContext2D, loadFont?: boolean) => {
    if (!ctx) return
    ctx.globalCompositeOperation = 'source-over'
    ctx.lineJoin = 'bevel'
    ctx.imageSmoothingEnabled = false
    let pixelBorderSize = canvasRef.current!.width >= 400 ? 3 : 2
    ctx.lineWidth = 1
    ctx.fillStyle = colorRef.current.replace('1.0', '0.3')
    ctx.strokeStyle = colorRef.current
    ctx.beginPath()
    ctx.moveTo(0, divisionsHeight)
    ctx.lineTo(nameContainerWidth, divisionsHeight)
    ctx.lineTo(nameContainerWidth, divisionsHeight - pixelBorderSize)
    ctx.lineTo(nameContainerWidth + pixelBorderSize, divisionsHeight - pixelBorderSize)
    ctx.lineTo(nameContainerWidth + pixelBorderSize, divisionsHeight - pixelBorderSize * 2)
    ctx.lineTo(nameContainerWidth + pixelBorderSize * 2, divisionsHeight - pixelBorderSize * 2)
    // Send the line above the canvas (-5 y) to hide the top stroke, which we don't want to show.
    ctx.lineTo(nameContainerWidth + pixelBorderSize * 2, -5)
    ctx.lineTo(0, -5)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = colorRef.current

    // Write username making sure our font loaded first
    const f = new FontFace('nds', 'url(/fonts/nds.ttf)')

    const writeUsername = () => {
      ctx.font = `${getFontSize()}px 'nds', roboto, sans-serif`
      const firstLineY = getPercentage(80, divisionsHeight)
      ctx.fillText(username, 8, firstLineY - 1.5)
      setKeyPos({ x: getStartingX(), y: firstLineY })
    }

    if (loadFont) f.load().then((font) => writeUsername())
    else writeUsername()
  }

  const draw = (e: React.PointerEvent) => {
    if (draggingKey) return
    const pointerIsMakingContact = e.buttons === 1
    if (!ctx || !pointerIsMakingContact || isWithinUsername(pos)) return setPos(getPosition(e))

    ctx.beginPath()
    ctx.globalCompositeOperation = usingPencil ? 'source-over' : 'destination-out'
    ctx.lineCap = 'square'
    ctx.lineWidth = getLineWidth()
    ctx.strokeStyle = strokeColor

    ctx.moveTo(pos.x, pos.y)
    const newPos = getPosition(e)
    setPos(newPos)
    ctx.lineTo(newPos.x, newPos.y)
    ctx.stroke()
  }

  const drawDot = (e: React.PointerEvent) => {
    if (draggingKey) return
    const posToUse = e.pointerType === 'touch' ? getPosition(e) : pos
    const usedMouseNoLeftBtn = e.pointerType === 'mouse' && e.buttons !== 1

    if (!ctx || usedMouseNoLeftBtn || isWithinUsername(posToUse)) return setPos(getPosition(e))
    if (e.pointerType === 'touch') setPos(posToUse)

    ctx.beginPath()
    ctx.globalCompositeOperation = usingPencil ? 'source-over' : 'destination-out'
    ctx.lineCap = 'square'
    ctx.lineWidth = getLineWidth()
    ctx.strokeStyle = strokeColor

    ctx.moveTo(posToUse.x, posToUse.y)
    ctx.lineTo(posToUse.x, posToUse.y)
    ctx.stroke()
  }

  const copyCanvas = (img_uri: string) => {
    if (!ctx) return

    const drawCopiedContent = (img: HTMLImageElement) => {
      {
        clearCanvas()
        ctx.drawImage(
          img,
          0,
          0,
          img.width * (window.devicePixelRatio || 1),
          img.height * (window.devicePixelRatio || 1),
          0,
          0,
          img.width * (window.devicePixelRatio || 1),
          img.height * (window.devicePixelRatio || 1)
        )

        removeColor(ctx, [253, 253, 253])
        ctx.clearRect(0, 0, nameContainerWidth + 7, divisionsHeight)
        drawUsernameRectangle(ctx)
      }
    }

    const img = new Image()
    img.src = img_uri
    // Allow bringing data from a cross origin (image urls from firebase storage)
    img.crossOrigin = 'Anonymous'
    if (img.complete) return drawCopiedContent(img)
    img.onload = () => drawCopiedContent(img)
  }

  const sendMessage = () => {
    if (!ctx) return

    const pic_canvas = document.createElement('canvas')
    const pic_ctx = pic_canvas.getContext('2d')!
    const min_height = divisionsHeight
    pic_canvas.width = ctx.canvas.width

    const nameContainerPos = { x: nameContainerWidth, y: divisionsHeight }
    const { highestPoint, lowestPoint, conflictingPoints } = getHighestAndLowestPoints(
      ctx,
      strokeRGBArray,
      nameContainerPos
    )

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
        pic_canvas.height = min_height
      }

      if (hPointNextToUsername) {
        pic_canvas.height = lowestPoint[1] + margin + margin / 2
      }

      if (hPointUnderAndOutsideUsername && !conflictingPoints) {
        const contentSmallerThanMinHeight = contentHeight <= min_height - 4
        const startOfDivision = getStartOfDivision(highestPoint[1])
        const endOfDivision = startOfDivision + divisionsHeight

        if (
          contentSmallerThanMinHeight &&
          highestPoint[1] > startOfDivision &&
          lowestPoint[1] < endOfDivision
        ) {
          pic_canvas.height = min_height
          sourceY = startOfDivision
        } else {
          // We need extra margin in this case, so multiply it by 2
          pic_canvas.height = lowestPoint[1] + margin * 2 - (highestPoint[1] - margin * 2)
          sourceY = highestPoint[1] - margin * 2

          // Prevent the original username rectangle from appearing on top of the one we're gonna draw
          if (sourceY < divisionsHeight) {
            pic_canvas.height = lowestPoint[1] + margin - divionsHeightWithMargin()
            sourceY = divionsHeightWithMargin()
          }
        }
      }

      if (hPointUnderAndWithinUsername || (conflictingPoints && !hPointNextToUsername)) {
        sourceY = highestPoint[1] - margin
        destinationY = min_height

        const contentSmallerThanMinHeight = contentHeight <= min_height - 4
        const startOfDivision = getStartOfDivision(highestPoint[1])
        const endOfDivision = startOfDivision + divisionsHeight

        if (
          contentSmallerThanMinHeight &&
          highestPoint[1] > startOfDivision &&
          lowestPoint[1] < endOfDivision
        ) {
          pic_canvas.height = min_height * 2
        } else {
          pic_canvas.height = min_height + (lowestPoint[1] + margin - (highestPoint[1] - margin))
        }
      }

      pic_ctx.fillStyle = canvasBgColor
      pic_ctx.fillRect(0, 0, pic_canvas.width, pic_canvas.height)

      if (
        (hPointUnderAndOutsideUsername || hPointUnderAndWithinUsername || conflictingPoints) &&
        !hPointNextToUsername
      ) {
        drawUsernameRectangle(pic_ctx)
      }

      pic_ctx.drawImage(
        ctx.canvas,
        0,
        sourceY,
        ctx.canvas.width,
        pic_canvas.height,
        0,
        destinationY,
        pic_canvas.width,
        pic_canvas.height
      )

      emitter.emit('canvasData', { dataUrl: pic_canvas.toDataURL(), height: pic_canvas.height })
      clearCanvas()
    }
  }

  // CANVAS SETUP - Happens on mounted
  useEffect(() => {
    const canvas = canvasRef.current!

    if (!canvas.getContext) return
    canvas.width = containerRef.current!.offsetWidth * (window.devicePixelRatio || 1)
    canvas.height = containerRef.current!.offsetHeight * (window.devicePixelRatio || 1)
    const ctx = canvas.getContext('2d')
    setCanvasCtx(ctx)
    setDivisionsHeight(Math.floor(canvas.height / 5))
    setNameContainerWidth(getPercentage(25, canvas.width))
  }, [])

  useEffect(() => drawDivisions(), [divisionsHeight])
  useEffect(() => drawUsernameRectangle(ctx!, true), [nameContainerWidth])

  useEffect(() => {
    drawDivisions()
    const oldDivisions = document.getElementById('canvasDivisions')
    oldDivisions?.remove()
    clearCanvas()
  }, [canvasColor])

  useEffect(() => {
    setCanvasColor(roomColor)
  }, [roomColor])

  useEffect(() => {
    emitter.on('clearCanvas', clearCanvas)
    emitter.on('canvasToCopy', copyCanvas)
    emitter.on('draggingKey', (key: string) => setDraggingKey(key))
    emitter.on('sendMessage', sendMessage)

    return () => {
      emitter.off('clearCanvas')
      emitter.off('canvasToCopy')
      emitter.off('draggingKey')
      emitter.off('sendMessage')
    }
  }, [ctx])

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
          onPointerDown={drawDot}
          onPointerMove={draw}
          onMouseEnter={(e) => setPos(getPosition(e))}
          onMouseLeave={resetPosition}
          ref={canvasRef}
        >
          <p>Please use a browser that supports the canvas element</p>
        </canvas>
      </div>
    </div>
  )
}

export default Canvas
