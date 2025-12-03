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
  platform: string
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
  publicRooms?: { [key: string]: boolean }
  privateRooms?: { [key: string]: boolean }
}

type RoomUser = {
  id: string
  username: string
  joinedAt: number
}

type Room = {
  code: string
  users?: { [key: string]: RoomUser }
  createdOn: number
  privateCode?: string
  id?: string
}

type FirebaseMessage = {
  imageURL?: string
  color?: string
  author: string
  userEntering?: string | null
  userLeaving?: string | null
  id: string
  serverTs: number
  platform: string
}

type RoomMessages = { createdOn: number; messages: { [key: string]: FirebaseMessage } }
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
  RoomUser,
  FirebaseMessage,
  RoomMessages,
  RoomMessagesObj,
  QueryResult
}
