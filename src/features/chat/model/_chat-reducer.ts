// ----- Reducer -----
// export const chatReducer = (state: ChatState = initialState, action: Actions) => {
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


// ----- Action Creates -----
// export const messagesReceived = (messages: Message[]) => ({
//   type: 'MESSAGES-RECEIVED',
//   messages
// }) as const
//
// export const newMessageReceived = (newMessage: Message) => ({
//   type: 'NEW-MESSAGE-RECEIVED',
//   newMessage
// }) as const
//
// export const typingUserAdded = (user: User) => ({
//   type: 'TYPING-USER-ADDED',
//   user
// }) as const
//
// export const typingUserRemoved = (user: User) => ({
//   type: 'TYPING-USER-REMOVED',
//   user
// }) as const
//
// export const setConnectionStatus = (status: ServerStatusType) => ({
//   type: 'CONNECTION-STATUS-UPDATED',
//   status
// }) as const
//
// export const setReadyToSendMessages = (isReady: boolean) => ({
//   type: 'READY-TO-SEND-MESSAGES',
//   isReady
// }) as const


// ----- Thunks -----
// export const createConnection = () => (dispatch: Dispatch<Actions>) => {
//   chatApi.createConnection()
//   dispatch(setConnectionStatus('online'))
//
//   chatApi.subscribe(
//     (messages: Message[]) => {
//       dispatch(messagesReceived(messages))
//       dispatch(setReadyToSendMessages(true))
//     },
//     (newMessage: Message) => dispatch(newMessageReceived(newMessage)),
//     (user: User) => dispatch(typingUserAdded(user)),
//     (user: User) => dispatch(typingUserRemoved(user)),
//   )
//
//   chatApi.onDisconnect(() => {
//     dispatch(setConnectionStatus('offline'))
//     dispatch(setReadyToSendMessages(false))
//   })
// }
//
// export const sendClientName = (name: string) => () => {
//   chatApi.sendName(name)
// }
//
// export const typeMessage = () => () => {
//   chatApi.typeMessage()
// }
//
// export const stopTypingMessage = () => () => {
//   chatApi.stopTyping()
// }
//
// export const sendClientMessage = (message: string) => () => {
//   chatApi.sendMessage(message)
// }
//
// export const destroyConnection = () => (dispatch: Dispatch<Actions>) => {
//   chatApi.destroyConnection()
//   dispatch(setConnectionStatus('offline'))
// }


// ----- Typification -----
// type MessagesReceivedAT = ReturnType<typeof messagesReceived>
// type NewMessageReceivedAT = ReturnType<typeof newMessageReceived>
// type TypingUserAddedAT = ReturnType<typeof typingUserAdded>
// type TypingUserRemovedAT = ReturnType<typeof typingUserRemoved>
// type SetConnectionStatusAT = ReturnType<typeof setConnectionStatus>
// type SetReadyToSendMessagesAT = ReturnType<typeof setReadyToSendMessages>
//
// type Actions =
//   | MessagesReceivedAT
//   | NewMessageReceivedAT
//   | TypingUserAddedAT
//   | TypingUserRemovedAT
//   | SetConnectionStatusAT
//   | SetReadyToSendMessagesAT
