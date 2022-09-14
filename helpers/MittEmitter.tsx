import mitt, { Emitter } from 'mitt'
import { canvasData } from 'types/Room'

type Events = {
  clearCanvas: string
  typeKey: string
  typeSpace: string
  typeEnter: string
  typeDel: string
  draggingKey: string
  sendMessage: string
  canvasData: canvasData
}

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
