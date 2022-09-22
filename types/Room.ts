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

// Types used in Firebase Realtime DB
type room = {
  code: string
  users: string[]
  privateCode?: string
}

type user = {
  username: string
}

export type { roomContent, contentIndicators, canvasData, room, user }
