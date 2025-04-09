type EventPos = {
  pageX?: number
  pageY?: number
  touches?: TouchList
}

type ClientPos = {
  clientX: number
  clientY: number
}

interface PositionObj {
  x: number
  y: number
}

interface HistoryStroke {
  x: number
  y: number
  ts: number
}

export type { EventPos, ClientPos, PositionObj, HistoryStroke }
