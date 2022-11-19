type roomContent = {
  userEntering?: string
  userLeaving?: string
  color?: string
  imageURL?: string
  paperchatOctagon?: boolean
  animate?: boolean
  author: string
  id: string
  serverTs: number
}

type contentIndicators = {
  [key: string]: {
    isVisible: boolean
    isOverflowedIndicator1?: boolean
    isOverflowedIndicator2?: boolean
  }
}

type contentIndicator = {
  isVisible: boolean
}

type canvasData = { dataUrl: string; height: number; width: number }

// Types used in Firebase Realtime DB
type onlineUser = {
  username: string
  createdOn: number
  publicRooms?: string[]
  privateRooms?: string[]
}

type room = {
  code: string
  users: string[]
  usersNumber: number
  createdOn: number
  privateCode?: string
  id?: string
}

type firebaseMessage = {
  imageURL?: string
  color?: string
  author: string
  userEntering?: string
  userLeaving?: string
  id: string
  serverTs: number
}

type roomMessages = { createdOn: number; messages: firebaseMessage[] }

type queryResult<T> = {
  [key: string]: T
}

export type {
  roomContent,
  contentIndicators,
  contentIndicator,
  canvasData,
  onlineUser,
  room,
  firebaseMessage,
  roomMessages,
  queryResult
}
