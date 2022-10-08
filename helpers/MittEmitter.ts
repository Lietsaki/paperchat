import mitt, { Emitter } from 'mitt'
import { canvasData, firebaseMessage } from 'types/Room'

type Events = {
  clearCanvas: string
  typeKey: string
  typeSpace: string
  typeEnter: string
  typeDel: string
  draggingKey: string
  sendMessage: string
  canvasData: canvasData
  receivedFirebaseMessage: firebaseMessage
  lostConnection: string
  backOnline: string
  disbandedRoom: string
}

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
