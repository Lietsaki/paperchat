import mitt, { Emitter } from 'mitt'
import { CanvasData, FirebaseMessage } from 'types/Room'

type Events = {
  typeKey: string
  typeSpace: string
  typeEnter: string
  typeDel: string
  draggingKey: string
  sendMessage: string
  canvasData: CanvasData
  receivedFirebaseMessages: FirebaseMessage[]
  lostConnection: string
  backOnline: string
  disbandedRoom: string
  otherError: string
  canvasToCopy: string
  removedAllCapacitorListeners: string
  disbandedInactive: string
}

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
