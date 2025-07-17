import { useEffect } from 'react'
import {
  createConnection,
  setConnectionStatus,
  sendClientName,
  setReadyToSendMessages,
  usersCountUpdated,
  destroyConnection,
} from '../../features/chat/model/chat-slice.ts'
import { useAppDispatch } from './useAppDispatch.ts'
import { chatApi, EVENTS } from '@/features/chat/api/chatApi.ts'

export const useChatConnection = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(createConnection())

    chatApi.socket?.on(EVENTS.CONNECT, () => {
      dispatch(setConnectionStatus('online'))

      const savedName = localStorage.getItem('userName')
      if (savedName) {
        dispatch(sendClientName(savedName))
      }
    })

    chatApi.socket?.on(EVENTS.DISCONNECT, () => {
      dispatch(setConnectionStatus('offline'))
      dispatch(setReadyToSendMessages(false))
      dispatch(usersCountUpdated(0))
    })

    return () => {
      chatApi.socket?.off(EVENTS.CONNECT)
      chatApi.socket?.off(EVENTS.DISCONNECT)
      dispatch(destroyConnection())
    }
  }, [])
}
