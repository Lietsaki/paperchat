type roomContent = {
  userEntering?: string
  userLeaving?: string
  message?: string
  paperchatOctagon?: boolean
  animate?: boolean
  id: string
}

type contentIndicators = {
  [key: string]: {
    isVisible: boolean
    isOverflowedIndicator1?: boolean
    isOverflowedIndicator2?: boolean
  }
}

type canvasData = { dataUrl: string; height: number }

type localStorageRoom = {
  code: string
  id: string
  color: string
}

// Types used in Firebase Realtime DB
type room = {
  code: string
  users: string[]
  privateCode?: string
}

type firebaseMessage = {
  imageURL?: string
  author: string
  userEntering?: string
  userLeaving?: string
  localID: string
  createdOn: number
}

type queryResult<T> = {
  [key: string]: T
}

export type {
  roomContent,
  contentIndicators,
  canvasData,
  room,
  firebaseMessage,
  queryResult,
  localStorageRoom
}
