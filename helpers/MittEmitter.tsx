import mitt, { Emitter } from 'mitt'

type Events = {
  clearCanvas: string
  typeKey: string
  typeSpace: string
}

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
