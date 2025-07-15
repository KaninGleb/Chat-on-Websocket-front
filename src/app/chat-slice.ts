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

// export const _messagesReceived = (messages: Message[]) => ({
//   type: 'MESSAGES-RECEIVED',
//   messages
// }) as const

// export const _newMessageReceived = (newMessage: Message) => ({
//   type: 'NEW-MESSAGE-RECEIVED',
//   newMessage
// }) as const

// export const _typingUserAdded = (user: User) => ({
//   type: 'TYPING-USER-ADDED',
//   user
// }) as const

// export const _typingUserRemoved = (user: User) => ({
//   type: 'TYPING-USER-REMOVED',
//   user
// }) as const

// export const _setConnectionStatus = (status: ServerStatusType) => ({
//   type: 'CONNECTION-STATUS-UPDATED',
//   status
// }) as const

// export const _setReadyToSendMessages = (isReady: boolean) => ({
//   type: 'READY-TO-SEND-MESSAGES',
//   isReady
// }) as const

// export const _chatReducer = (state: ChatState = initialState, action: Actions) => {
//   switch (action.type) {
//     case 'MESSAGES-RECEIVED': {
//       return { ...state, messages: action.messages }
//     }
//
//     case 'NEW-MESSAGE-RECEIVED': {
//       if (state.messages.some((m) => m.id === action.newMessage.id)) {
//         return state
//       }
//       return {
//         ...state,
//         messages: [...state.messages, action.newMessage],
//         typingUsers: state.typingUsers.filter((u) => u.id !== action.newMessage.user.id),
//       }
//     }
//
//     case 'TYPING-USER-ADDED': {
//       return {
//         ...state,
//         typingUsers: [...state.typingUsers.filter((u) => u.id !== action.user.id), action.user],
//       }
//     }
//
//     case 'TYPING-USER-REMOVED': {
//       return {
//         ...state,
//         typingUsers: state.typingUsers.filter((u) => u.id !== action.user.id),
//       }
//     }
//
//     case 'CONNECTION-STATUS-UPDATED': {
//       return { ...state, connectionStatus: action.status }
//     }
//
//     case 'READY-TO-SEND-MESSAGES': {
//       return { ...state, readyToSendMessages: action.isReady }
//     }
//
//     default:
//       return state
//   }
// }

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

type MessagesReceivedAT = ReturnType<typeof messagesReceived>
type NewMessageReceivedAT = ReturnType<typeof newMessageReceived>
type TypingUserAddedAT = ReturnType<typeof typingUserAdded>
type TypingUserRemovedAT = ReturnType<typeof typingUserRemoved>
type SetConnectionStatusAT = ReturnType<typeof setConnectionStatus>
type SetReadyToSendMessagesAT = ReturnType<typeof setReadyToSendMessages>

type Actions =
  | MessagesReceivedAT
  | NewMessageReceivedAT
  | TypingUserAddedAT
  | TypingUserRemovedAT
  | SetConnectionStatusAT
  | SetReadyToSendMessagesAT
