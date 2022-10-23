type eventPos = {
  pageX?: number
  pageY?: number
  touches?: TouchList
}

type clientPos = {
  clientX: number
  clientY: number
}

interface positionObj {
  x: number
  y: number
}

interface historyStroke {
  x: number
  y: number
  ts: number
}

export type { eventPos, clientPos, positionObj, historyStroke }
