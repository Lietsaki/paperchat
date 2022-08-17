import React from 'react'
import emitter from './MittEmitter'

const createFloatingKey = (key: string, e: React.MouseEvent, sampleKey: Element) => {
  const main = document.querySelector('.main')
  const floatingKey = document.createElement('div')
  floatingKey.innerText = key
  floatingKey.classList.add('floating_key')
  main!.append(floatingKey)
  floatingKey.style.left = e.pageX - 10 + 'px'
  floatingKey.style.top = e.pageY - 15 + 'px'

  const computedFontSize = getComputedStyle(sampleKey).fontSize
  floatingKey.style.fontSize = computedFontSize

  document.addEventListener('mousemove', updateFloatingKeyPostion)
  emitter.emit('draggingKey', key)
}

const updateFloatingKeyPostion = (e: MouseEvent) => {
  const floatingKey = document.querySelector('.floating_key') as HTMLDivElement
  floatingKey.style.left = e.pageX - 10 + 'px'
  floatingKey.style.top = e.pageY - 15 + 'px'
}

const removeFloatingKey = () => {
  const floatingKeys = document.getElementsByClassName('floating_key')
  document.removeEventListener('mousemove', updateFloatingKeyPostion)

  if (floatingKeys.length) {
    Array.from(floatingKeys).forEach((el) => el.remove())
    emitter.emit('draggingKey', '')
  }
}

export { createFloatingKey, removeFloatingKey }
