type roomContent = {
  userEntering?: string
  userLeaving?: string
  message?: string
  paperchatOctagon?: boolean
  id: string
}

type contentIndicator = {
  isVisible: boolean
}

export type { roomContent, contentIndicator }
