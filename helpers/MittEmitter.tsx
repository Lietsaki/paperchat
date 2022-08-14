import mitt, { Emitter } from 'mitt'

type Events = {
  clearCanvas: string
}

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
