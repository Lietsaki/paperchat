import styles from 'styles/components/canvas.module.scss'
import { useEffect, useState, useRef } from 'react'
import emitter from 'helpers/MittEmitter'

const { canvas_outline, canvas_content } = styles

type canvasProps = {
  usingThickStroke: boolean
  usingPencil: boolean
  roomColor: string
}

interface positionObj {
  x: number
  y: number
}

const Canvas = ({ usingThickStroke, usingPencil, roomColor }: canvasProps) => {
  // REFS
  const outlineRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // DRAWING STATE
  const [pos, setPos] = useState<positionObj>({ x: 0, y: 0 })
  const [ctx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [nameContainerWidth, setNameContainerWidth] = useState(0)
  const [divisionsHeight, setDivisionsHeight] = useState(0)

  // COLOR DATA
  const strokeColor = '#111'

  const clearCanvas = () => {
    console.log(ctx)
    if (!ctx) return
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    drawUsernameRectangle()
  }

  const drawDivisions = () => {
    if (!ctx) return
    ctx.strokeStyle = roomColor.replace('1.0', '0.6')

    for (let i = 1; i < 5; i++) {
      ctx.beginPath()
      ctx.moveTo(3, divisionsHeight * i)
      ctx.lineTo(canvasRef.current!.width - 3, divisionsHeight * i)
      ctx.stroke()
    }

    const data_url = canvasRef.current!.toDataURL('image/png')
    const img = new Image()
    img.src = data_url
    containerRef.current!.append(img)
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
  }

  const drawUsernameRectangle = () => {
    if (!ctx) return
    let pixelBorderSize = canvasRef.current!.width >= 400 ? 3 : 2
    ctx.lineWidth = 1
    ctx.fillStyle = roomColor.replace('1.0', '0.3')
    ctx.strokeStyle = roomColor
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

    const f = new FontFace('nds', 'url(/fonts/nds.ttf)')
    console.log(f.status)

    f.load().then((font) => {
      ctx.fillStyle = roomColor
      ctx.font = `${divisionsHeight}px 'nds', roboto, sans-serif`
      console.log()
      ctx.fillText('Johnny', 5, Math.floor((80 / 100) * divisionsHeight))
    })
  }

  const getPosition = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const draw = (e: React.MouseEvent) => {
    // e.buttons !== 1 makes sure the mouse left button is pressed
    const isWithinUsername = pos.x < nameContainerWidth + 8 && pos.y < divisionsHeight + 6
    if (!ctx || e.buttons !== 1 || isWithinUsername) return setPos(getPosition(e))

    ctx.beginPath()
    ctx.globalCompositeOperation = usingPencil ? 'source-over' : 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineWidth = usingThickStroke ? 3 : 1.2
    ctx.strokeStyle = strokeColor

    ctx.moveTo(pos.x, pos.y)
    const newPos = getPosition(e)
    setPos(newPos)
    ctx.lineTo(newPos.x, newPos.y)
    ctx.stroke()
  }

  const drawDot = (e: React.MouseEvent) => {
    if (!ctx || e.buttons !== 1) return
    if (pos.x < nameContainerWidth + 8 && pos.y < divisionsHeight + 6) return setPos(getPosition(e))

    ctx.beginPath()
    ctx.globalCompositeOperation = usingPencil ? 'source-over' : 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineWidth = usingThickStroke ? 3 : 1.2
    ctx.strokeStyle = strokeColor

    ctx.moveTo(pos.x, pos.y)
    ctx.lineTo(pos.x + 1, pos.y + 1)
    ctx.stroke()
  }

  // CANVAS SETUP - Happens on mounted
  useEffect(() => {
    console.log(roomColor)
    const canvas = canvasRef.current!
    outlineRef.current!.style.backgroundColor = roomColor

    if (!canvas.getContext) return
    const context = canvas.getContext('2d')
    setCanvasCtx(context)

    const resize = () => {
      canvas.width = containerRef.current!.offsetWidth
      canvas.height = containerRef.current!.offsetHeight
    }

    resize()
    setDivisionsHeight(Math.floor(canvas.height / 5))
    setNameContainerWidth(Math.floor((25 / 100) * canvas.width))
  }, [])

  useEffect(() => drawDivisions(), [divisionsHeight])
  useEffect(() => drawUsernameRectangle(), [nameContainerWidth])
  useEffect(() => {
    emitter.on('clearCanvas', clearCanvas)

    return () => {
      emitter.off('clearCanvas')
    }
  }, [ctx])

  return (
    <div ref={outlineRef} className={canvas_outline}>
      <div ref={containerRef} className={canvas_content}>
        <canvas
          onMouseDown={drawDot}
          onMouseMove={draw}
          onMouseEnter={(e) => setPos(getPosition(e))}
          ref={canvasRef}
        >
          <p>Please use a browser that supports the canvas element</p>
        </canvas>
      </div>
    </div>
  )
}

export default Canvas