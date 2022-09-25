import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface userState {
  username: string
  onlineID: string
}

const initialState: userState = {
  username: '',
  onlineID: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload
    },
    setOnlineID: (state, action: PayloadAction<string>) => {
      state.onlineID = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setUsername, setOnlineID } = userSlice.actions

// Export selectors - These are functions that allow us to get the state values of the slice. We can simply return the state,
// or perform operations on it and then return the result. Selectors essentially act as store getters.
export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
