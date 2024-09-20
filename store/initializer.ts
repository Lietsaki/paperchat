import getRandomUsername from 'helpers/username-generator/usernameGenerator'
import { store } from 'store/store'
import { setUsername } from 'store/slices/userSlice'
import { isUsernameValid } from 'helpers/helperFunctions'

const usernameMinLength = 2
const usernameMaxLength = 10

const initializeUsername = () => {
  const savedUsername = localStorage.getItem('username')

  if (savedUsername && isUsernameValid(savedUsername)) {
    store.dispatch(setUsername(savedUsername))
  } else {
    const username = getRandomUsername()
    localStorage.setItem('username', username)
    store.dispatch(setUsername(username))
  }
}

export { initializeUsername, usernameMinLength, usernameMaxLength }
