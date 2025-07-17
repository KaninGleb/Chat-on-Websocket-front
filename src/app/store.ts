import { chatSlice, chatReducer } from '../features/chat/model/chat-slice.ts'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    [chatSlice.name]: chatReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
