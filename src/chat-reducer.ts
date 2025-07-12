import { api } from './api.ts'

type Message = {
  id: string
  message: string
  user: {
    id: string
    name: string
  }
}

const initialState = {
  messages: [],
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
      return { ...state, messages: [...state.messages, action.newMessage] }
    }

    default:
      return state
  }
}

export const messagesReceived = (messages: any) =>
  ({
    type: 'MESSAGES-RECEIVED',
    messages,
  }) as const

export const newMessageReceived = (newMessage: any) =>
  ({
    type: 'NEW-MESSAGE-RECEIVED',
    newMessage,
  }) as const

export const createConnection = () => (dispatch: any) => {
  api.createConnection()
  api.subscribe(
    (messages: any) => {
      dispatch(messagesReceived(messages))
    },
    (newMessage: any) => {
      dispatch(newMessageReceived(newMessage))
    },
  )
}

export const sendClientName = (name: string) => (dispatch: any) => {
  api.sendName(name)
}

export const sendClientMessage = (message: string) => (dispatch: any) => {
  api.sendMessage(message)
}

export const destroyConnection = () => (dispatch: any) => {
  api.destroyConnection()
}
