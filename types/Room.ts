type RoomContent = {
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

type ContentIndicators = {
  [key: string]: {
    isVisible: boolean
    isOverflowedIndicator1?: boolean
    isOverflowedIndicator2?: boolean
  }
}

type CanvasData = { dataUrl: string; height: number; width: number }

// Types used in Firebase Realtime DB
type OnlineUser = {
  username: string
  createdOn: number
  publicRooms?: string[]
  privateRooms?: string[]
}

type Room = {
  code: string
  users: string[]
  usersNumber: number
  createdOn: number
  privateCode?: string
  id?: string
}

type FirebaseMessage = {
  imageURL?: string
  color?: string
  author: string
  userEntering?: string
  userLeaving?: string
  id: string
  serverTs: number
}

type RoomMessages = { createdOn: number; messages: FirebaseMessage[] }
type RoomMessagesObj = { [key: string]: RoomMessages }

type QueryResult<T> = {
  [key: string]: T
}

export type {
  RoomContent,
  ContentIndicators,
  CanvasData,
  OnlineUser,
  Room,
  FirebaseMessage,
  RoomMessages,
  RoomMessagesObj,
  QueryResult
}
