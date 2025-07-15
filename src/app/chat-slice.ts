import { api } from '../common/api/api.ts'
import { createAppSlice } from '../common/utils/createAppSlice.ts'
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

export const chatSlice = createAppSlice({
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

    createConnection: create.asyncThunk(async (_, { dispatch }) => {
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
    }),
    sendClientName: create.asyncThunk(async (name: string) => {
      api.sendName(name)
    }),
    typeMessage: create.asyncThunk(async () => {
      api.typeMessage()
    }),
    stopTypingMessage: create.asyncThunk(async () => {
      api.stopTyping()
    }),
    sendClientMessage: create.asyncThunk(async (message: string) => {
      api.sendMessage(message)
    }),
    destroyConnection: create.asyncThunk(async (_, { dispatch }) => {
      api.destroyConnection()
      dispatch(setConnectionStatus('offline'))
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
  createConnection,
  sendClientName,
  typeMessage,
  stopTypingMessage,
  sendClientMessage,
  destroyConnection,
} = chatSlice.actions

export const { selectMessages, selectTypingUsers, selectConnectionStatus, selectReadyToSendMessagesStatus } =
  chatSlice.selectors

export const chatReducer = chatSlice.reducer
