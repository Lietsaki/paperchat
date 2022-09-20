import getRandomUsername from 'helpers/username-generator/usernameGenerator'
import { store } from 'store/store'
import { setUsername } from 'store/slices/userSlice'

const usernameMinLength = 2
const usernameMaxLength = 11

const initializer = () => {
  const savedUsername = localStorage.getItem('username')

  if (savedUsername) {
    store.dispatch(setUsername(savedUsername))
  } else {
    const username = getRandomUsername()
    localStorage.setItem('username', username)
    store.dispatch(setUsername(username))
  }
}

export { initializer, usernameMinLength, usernameMaxLength }
