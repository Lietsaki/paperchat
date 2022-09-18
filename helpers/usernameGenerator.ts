import { uniqueNamesGenerator, Config, adjectives, animals } from 'unique-names-generator'
import { usernameMaxLength } from '../store/initializer'
import { useSelector, useDispatch } from 'react-redux'

const config: Config = {
  dictionaries: [adjectives, [...animals, 'doge', 'cheems', 'capy']],
  separator: ' ',
  length: 2,
  style: 'capital'
}

const getRandomUsername = () => {
  let username = ''

  while (!username) {
    const randomUsername = uniqueNamesGenerator(config)
    if (randomUsername.length <= usernameMaxLength) username = randomUsername
  }

  return username
}

export default getRandomUsername
