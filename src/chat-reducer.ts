import { api } from './api.ts'
import type { ServerStatusType } from './components'

export type Message = {
  id: string
  message: string
  user: {
    id: string
    name: string
  }
  time?: string
}


const initialState = {
  messages: [],
  typingUsers: [],
  connectionStatus: 'offline' as ServerStatusType,
}

export const chatReducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case 'MESSAGES-RECEIVED': {
      return { ...state, messages: action.messages }
    }

    case 'NEW-MESSAGE-RECEIVED': {
      if (state.messages.some((m: Message) => m.id === action.newMessage.id)) {
        return state
      }
      return {
        ...state,
        messages: [...state.messages, action.newMessage],
        typingUsers: state.typingUsers.filter((u: any) => u.id !== action.newMessage.user.id),
      }
    }

    case 'TYPING-USER-ADDED': {
      return {
        ...state,
        typingUsers: [...state.typingUsers.filter((u: any) => u.id !== action.user.id), action.user],
      }
    }

    case 'TYPING-USER-REMOVED': {
      return {
        ...state,
        typingUsers: state.typingUsers.filter((u: any) => u.id !== action.user.id),
      }
    }

    case 'CONNECTION-STATUS-UPDATED': {
      return {...state, connectionStatus: action.status}
    }

    default:
      return state
  }
}

export const messagesReceived = (messages: any) => ({ type: 'MESSAGES-RECEIVED', messages }) as const

export const newMessageReceived = (newMessage: any) => ({ type: 'NEW-MESSAGE-RECEIVED', newMessage }) as const

export const typingUserAdded = (user: any) => ({ type: 'TYPING-USER-ADDED', user }) as const

export const typingUserRemoved = (user: any) => ({ type: 'TYPING-USER-REMOVED', user }) as const

export const setConnectionStatus = (status: ServerStatusType) => ({ type: 'CONNECTION-STATUS-UPDATED', status }) as const

export const createConnection = () => (dispatch: any) => {
  api.createConnection()
  dispatch(setConnectionStatus('online'))
  api.subscribe(
    (messages: any) => {
      dispatch(messagesReceived(messages))
    },
    (newMessage: any) => {
      dispatch(newMessageReceived(newMessage))
    },
    (user: any) => {
      dispatch(typingUserAdded(user))
    },
    (user: any) => {
      dispatch(typingUserRemoved(user))
    },
  )

  api.onDisconnect(() => {
    dispatch(setConnectionStatus('offline'))
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

export const destroyConnection = () => (dispatch: any) => {
  api.destroyConnection()
  dispatch(setConnectionStatus('offline'))
}
