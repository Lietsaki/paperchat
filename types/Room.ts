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

export type { roomContent, contentIndicators, canvasData }
