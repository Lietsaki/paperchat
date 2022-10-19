import getRandomUsername from 'helpers/username-generator/usernameGenerator'
import { store } from 'store/store'
import { setUsername } from 'store/slices/userSlice'

const usernameMinLength = 2
const usernameMaxLength = 11

const initializer = () => {
  const savedUsername = localStorage.getItem('username')

  if (savedUsername) {
    store.dispatch(setUsername(savedUsername.substring(0, usernameMaxLength).trim()))
  } else {
    const username = getRandomUsername()
    localStorage.setItem('username', username)
    store.dispatch(setUsername(username))
  }
}

export { initializer, usernameMinLength, usernameMaxLength }
