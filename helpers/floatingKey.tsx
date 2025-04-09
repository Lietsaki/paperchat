import emitter from './MittEmitter'
import { EventPos } from 'types/Position'

const createFloatingKey = (key: string, e: EventPos, sampleKey: Element) => {
  if ((e.pageX === undefined || e.pageY === undefined) && !e.touches) return

  const pageX = typeof e.pageX === 'number' ? e.pageX : Math.round(e.touches![0].pageX)
  const pageY = typeof e.pageY === 'number' ? e.pageY : Math.round(e.touches![0].pageY)

  const main = document.querySelector('.main')
  const floatingKey = document.createElement('div')
  floatingKey.innerText = key
  floatingKey.classList.add('floating_key')
  main!.append(floatingKey)

  floatingKey.style.left = pageX - 10 + 'px'
  floatingKey.style.top = pageY - 15 + 'px'

  const computedFontSize = getComputedStyle(sampleKey).fontSize
  floatingKey.style.fontSize = computedFontSize

  document.addEventListener('mousemove', updateFloatingKeyPostion)
  document.addEventListener('touchmove', updateFloatingKeyPostion)
  emitter.emit('draggingKey', key)
}

const updateFloatingKeyPostion = (e: EventPos) => {
  if ((e.pageX === undefined || e.pageY === undefined) && !e.touches) return

  const pageX = typeof e.pageX === 'number' ? e.pageX : Math.round(e.touches![0].pageX)
  const pageY = typeof e.pageY === 'number' ? e.pageY : Math.round(e.touches![0].pageY)

  const floatingKey = document.querySelector('.floating_key') as HTMLDivElement
  floatingKey.style.left = pageX - 10 + 'px'
  floatingKey.style.top = pageY - 15 + 'px'
}

const removeFloatingKey = () => {
  const floatingKeys = document.getElementsByClassName('floating_key')
  document.removeEventListener('mousemove', updateFloatingKeyPostion)
  document.removeEventListener('touchmove', updateFloatingKeyPostion)

  if (floatingKeys.length) {
    Array.from(floatingKeys).forEach((el) => el.remove())
    emitter.emit('draggingKey', '')
  }
}

export { createFloatingKey, removeFloatingKey }
