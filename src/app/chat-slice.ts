import { createSlice } from '@reduxjs/toolkit'
import { api } from '../common/api/api.ts'
import type { Dispatch } from 'react'
import type { Message, User, ServerStatusType } from '../common/types'

type ChatState = {
  messages: Message[]
  typingUsers: User[]
  connectionStatus: ServerStatusType
  readyToSendMessagesStatus: boolean
}

const initialState: ChatState = {
  messages: [],
  typingUsers: [],
  connectionStatus: 'offline' as ServerStatusType,
  readyToSendMessagesStatus: false,
}

export const chatSlice = createSlice({
  name: 'chatSlice',
  initialState,
  selectors: {
    selectMessages: (s) => s.messages,
    selectTypingUsers: (s) => s.typingUsers,
    selectConnectionStatus: (s) => s.connectionStatus,
    selectReadyToSendMessagesStatus: (s) => s.readyToSendMessagesStatus,
  },
  reducers: (create) => ({
    messagesReceived: create.reducer<Message[]>((state, action) => {
      state.messages = action.payload
    }),
    newMessageReceived: create.reducer<Message>((state, action) => {
      const newMessage = action.payload
      if (state.messages.some((m) => m.id === newMessage.id)) return

      state.messages.push(newMessage)
      state.typingUsers = state.typingUsers.filter((u) => u.id !== newMessage.user.id)
    }),
    typingUserAdded: create.reducer<User>((state, action) => {
      const user = action.payload
      const index = state.typingUsers.findIndex((u) => u.id === user.id)
      if (index !== -1) {
        state.typingUsers[index] = user
      } else {
        state.typingUsers.push(user)
      }
    }),
    typingUserRemoved: create.reducer<User>((state, action) => {
      const user = action.payload
      const index = state.typingUsers.findIndex((u) => u.id === user.id)
      if (index !== -1) {
        state.typingUsers.splice(index, 1)
      }
    }),
    setConnectionStatus: create.reducer<ServerStatusType>((state, action) => {
      state.connectionStatus = action.payload
    }),
    setReadyToSendMessages: create.reducer<boolean>((state, action) => {
      state.readyToSendMessagesStatus = action.payload
    }),
  }),
})

export const {
  messagesReceived,
  newMessageReceived,
  typingUserAdded,
  typingUserRemoved,
  setConnectionStatus,
  setReadyToSendMessages,
} = chatSlice.actions
export const { selectMessages, selectTypingUsers, selectConnectionStatus, selectReadyToSendMessagesStatus } =
  chatSlice.selectors
export const chatReducer = chatSlice.reducer


export const createConnection = () => (dispatch: Dispatch<Actions>) => {
  api.createConnection()
  dispatch(setConnectionStatus('online'))

  api.subscribe(
    (messages: Message[]) => {
      dispatch(messagesReceived(messages))
      dispatch(setReadyToSendMessages(true))
    },
    (newMessage: Message) => dispatch(newMessageReceived(newMessage)),
    (user: User) => dispatch(typingUserAdded(user)),
    (user: User) => dispatch(typingUserRemoved(user)),
  )

  api.onDisconnect(() => {
    dispatch(setConnectionStatus('offline'))
    dispatch(setReadyToSendMessages(false))
  })
}

export const sendClientName = (name: string) => () => {
  api.sendName(name)
}

export const typeMessage = () => () => {
  api.typeMessage()
}

export const stopTypingMessage = () => () => {
  api.stopTyping()
}

export const sendClientMessage = (message: string) => () => {
  api.sendMessage(message)
}

export const destroyConnection = () => (dispatch: Dispatch<Actions>) => {
  api.destroyConnection()
  dispatch(setConnectionStatus('offline'))
}

