import { io, Socket } from 'socket.io-client'
import type { Message, User } from '../types'

const socket = 'https://chat-on-websocket-back.onrender.com'

const EVENTS = {
  INIT_MESSAGES: 'init-messages-published',
  NEW_MESSAGE: 'new-message-sent',
  USER_TYPING: 'user-typing',
  USER_STOP_TYPING: 'user-stopped-typing',
  USERS_COUNT_UPDATING: 'users-count-updated',
  DISCONNECT: 'disconnect',
  CLIENT_TIMEZONE_SENT: 'client-timezone-sent',
  CLIENT_NAME_SENT: 'client-name-sent',
  CLIENT_MESSAGE_SENT: 'client-message-sent',
  CLIENT_TYPED: 'client-typed',
  CLIENT_STOPPED_TYPING: 'client-stopped-typing',
} as const

export const api = {
  socket: null as Socket | null,

  createConnection() {
    this.socket = io(socket, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    })
  },

  sendTimeZone(timeZone: string) {
    this.socket?.emit(EVENTS.CLIENT_TIMEZONE_SENT, timeZone)
  },

  subscribe(
    initMessagesHandler: (messages: Message[]) => void,
    newMessageSentHandler: (newMessage: Message) => void,
    userTypingHandler: (user: User) => void,
    userStopTypingHandler: (user: User) => void,
    usersCountHandler: (count: number) => void,
  ) {
    this.socket?.on(EVENTS.INIT_MESSAGES, initMessagesHandler)
    this.socket?.on(EVENTS.NEW_MESSAGE, newMessageSentHandler)
    this.socket?.on(EVENTS.USER_TYPING, userTypingHandler)
    this.socket?.on(EVENTS.USER_STOP_TYPING, userStopTypingHandler)
    if (usersCountHandler) {
      this.socket?.on(EVENTS.USERS_COUNT_UPDATING, usersCountHandler)
    }
  },

  unsubscribe() {
    this.socket?.off(EVENTS.INIT_MESSAGES)
    this.socket?.off(EVENTS.NEW_MESSAGE)
    this.socket?.off(EVENTS.USER_TYPING)
    this.socket?.off(EVENTS.USER_STOP_TYPING)
    this.socket?.off(EVENTS.USERS_COUNT_UPDATING)
  },

  onDisconnect(disconnectHandler: () => void) {
    this.socket?.on(EVENTS.DISCONNECT, disconnectHandler)
  },

  destroyConnection() {
    this.stopTyping()
    this.unsubscribe()
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
