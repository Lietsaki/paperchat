const getRandomRGBNumber = () => Math.round(Math.random() * 255)

const getRandomColor = () => {
  return `rgba(${getRandomRGBNumber()}, ${getRandomRGBNumber()}, ${getRandomRGBNumber()}, 0.8)`
}

export { getRandomColor }
