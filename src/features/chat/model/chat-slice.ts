import { createAppSlice } from '@/common/utils'
import { chatApi } from '@/features/chat/api'
import type { Message, User, ServerStatusType } from '@/common/types'

type ChatState = {
  messages: Message[]
  typingUsers: User[]
  connectionStatus: ServerStatusType
  readyToSendMessagesStatus: boolean
  usersCount: number
}

export const chatSlice = createAppSlice({
  name: 'chatSlice',
  initialState: {
    messages: [],
    typingUsers: [],
    connectionStatus: 'offline' as ServerStatusType,
    readyToSendMessagesStatus: false,
    usersCount: 0,
  } as ChatState,
  selectors: {
    selectMessages: (s) => s.messages,
    selectTypingUsers: (s) => s.typingUsers,
    selectConnectionStatus: (s) => s.connectionStatus,
    selectReadyToSendMessagesStatus: (s) => s.readyToSendMessagesStatus,
    selectUsersCount: (s) => s.usersCount,
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
    usersCountUpdated: create.reducer<number>((state, action) => {
      state.usersCount = action.payload
    }),

    createConnection: create.asyncThunk(async (_, { dispatch }) => {
      dispatch(setConnectionStatus('connecting'))
      chatApi.createConnection()

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      chatApi.sendTimeZone(timeZone)

      chatApi.subscribe(
        (messages: Message[]) => {
          dispatch(messagesReceived(messages))
          dispatch(setReadyToSendMessages(true))
        },
        (newMessage: Message) => dispatch(newMessageReceived(newMessage)),
        (user: User) => dispatch(typingUserAdded(user)),
        (user: User) => dispatch(typingUserRemoved(user)),
        (count: number) => dispatch(usersCountUpdated(count)),
      )

      chatApi.onDisconnect(() => {
        chatApi.stopTyping()
        dispatch(setConnectionStatus('offline'))
        dispatch(setReadyToSendMessages(false))
        dispatch(usersCountUpdated(0))
      })
    }),
    sendClientName: create.asyncThunk(async (name: string) => {
      chatApi.sendName(name)
    }),
    typeMessage: create.asyncThunk(async () => {
      chatApi.typeMessage()
    }),
    stopTypingMessage: create.asyncThunk(async () => {
      chatApi.stopTyping()
    }),
    sendClientMessage: create.asyncThunk(async (message: string) => {
      chatApi.sendMessage(message)
    }),
    destroyConnection: create.asyncThunk(async (_, { dispatch }) => {
      chatApi.destroyConnection()
      dispatch(setConnectionStatus('offline'))
      dispatch(usersCountUpdated(0))
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
  usersCountUpdated,
  createConnection,
  sendClientName,
  typeMessage,
  stopTypingMessage,
  sendClientMessage,
  destroyConnection,
} = chatSlice.actions

export const {
  selectMessages,
  selectTypingUsers,
  selectConnectionStatus,
  selectReadyToSendMessagesStatus,
  selectUsersCount,
} = chatSlice.selectors

export const chatReducer = chatSlice.reducer
