const getRandomNumber = (min: number, max: number) => Math.round(Math.random() * (max - min) + min)

const getRandomColor = () => {
  return `hsla(${getRandomNumber(0, 255)},
   ${getRandomNumber(30, 80)}%, ${getRandomNumber(40, 65)}%, 1.0)`
}

export { getRandomColor }
