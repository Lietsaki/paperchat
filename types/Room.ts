type roomContent = {
  userEntering?: string
  userLeaving?: string
  color?: string
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
  justCreated?: boolean
}

type currentRooms = {
  [key: string]: localStorageRoom
}

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
  privateCode?: string
  id?: string
}

type firebaseMessage = {
  imageURL?: string
  color?: string
  author: string
  userEntering?: string
  userLeaving?: string
  localID: string
  createdOn: number
}

type roomMessages = {
  messages: firebaseMessage[]
}

type queryResult<T> = {
  [key: string]: T
}

export type {
  roomContent,
  contentIndicators,
  canvasData,
  onlineUser,
  room,
  firebaseMessage,
  roomMessages,
  queryResult,
  localStorageRoom,
  currentRooms
}
