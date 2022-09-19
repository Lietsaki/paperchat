import { customAnimals, customAdjectives } from './dictionaries'
import { getRandomNumber } from 'helpers/helperFunctions'

const getRandomUsername = () => {
  const useShortName = getRandomNumber(0, 100) >= 50

  if (useShortName) {
    const shortNameAnimals = customAnimals.filter((animal) => animal.length < 5)
    const randomShortAnimal = shortNameAnimals[getRandomNumber(0, shortNameAnimals.length)]
    const randomAdjective = customAdjectives[getRandomNumber(0, customAdjectives.length)]

    return `${randomAdjective[0].toUpperCase() + randomAdjective.slice(1)} ${
      randomShortAnimal[0].toUpperCase() + randomShortAnimal.slice(1)
    }`
  } else {
    const shortAdjectives = customAdjectives.filter((adj) => adj.length < 5)
    const randomShortAdjective = shortAdjectives[getRandomNumber(0, shortAdjectives.length)]
    const randomAnimal = customAnimals[getRandomNumber(0, customAnimals.length)]

    return `${randomShortAdjective[0].toUpperCase() + randomShortAdjective.slice(1)} ${
      randomAnimal[0].toUpperCase() + randomAnimal.slice(1)
    }`
  }
}

export default getRandomUsername
