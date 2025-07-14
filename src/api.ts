import { io, Socket } from 'socket.io-client'
import type { Message, User } from './chat-reducer.ts'

const socket = 'https://chat-on-websocket-back.onrender.com'

const EVENTS = {
  INIT_MESSAGES: 'init-messages-published',
  NEW_MESSAGE: 'new-message-sent',
  USER_TYPING: 'user-typing',
  USER_STOP_TYPING: 'user-stopped-typing',
  DISCONNECT: 'disconnect',
  CLIENT_NAME_SENT: 'client-name-sent',
  CLIENT_MESSAGE_SENT: 'client-message-sent',
  CLIENT_TYPED: 'client-typed',
  CLIENT_STOPPED_TYPING: 'client-stopped-typing',
} as const

export const api = {
  socket: null as Socket | null,

  createConnection() {
    this.socket = io(socket)
  },

  subscribe(
    initMessagesHandler: (messages: Message[]) => void,
    newMessageSentHandler: (newMessage: Message) => void,
    userTypingHandler: (user: User) => void,
    userStopTypingHandler: (user: User) => void,
  ) {
    this.socket?.on(EVENTS.INIT_MESSAGES, initMessagesHandler)
    this.socket?.on(EVENTS.NEW_MESSAGE, newMessageSentHandler)
    this.socket?.on(EVENTS.USER_TYPING, userTypingHandler)
    this.socket?.on(EVENTS.USER_STOP_TYPING, userStopTypingHandler)
  },

  onDisconnect(disconnectHandler: () => void) {
    this.socket?.on(EVENTS.DISCONNECT, disconnectHandler)
  },

  destroyConnection() {
    this.socket?.disconnect()
    this.socket = null
  },

  sendName(name: string) {
    this.socket?.emit(EVENTS.CLIENT_NAME_SENT, name)
  },

  sendMessage(message: string) {
    this.socket?.emit(EVENTS.CLIENT_MESSAGE_SENT, message)
  },

  typeMessage() {
    this.socket?.emit(EVENTS.CLIENT_TYPED)
  },

  stopTyping() {
    this.socket?.emit(EVENTS.CLIENT_STOPPED_TYPING)
  },
}
