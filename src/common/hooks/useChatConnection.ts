import { useEffect } from 'react'
import {
  createConnection,
  setConnectionStatus,
  sendClientName,
  setReadyToSendMessages,
  usersCountUpdated,
  destroyConnection,
} from '../../app/chat-slice.ts'
import { useAppDispatch } from './useAppDispatch.ts'
import { api, EVENTS } from '../api/api.ts'

export const useChatConnection = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(createConnection())

    api.socket?.on(EVENTS.CONNECT, () => {
      dispatch(setConnectionStatus('online'))

      const savedName = localStorage.getItem('userName')
      if (savedName) {
        dispatch(sendClientName(savedName))
      }
    })

    api.socket?.on(EVENTS.DISCONNECT, () => {
      dispatch(setConnectionStatus('offline'))
      dispatch(setReadyToSendMessages(false))
      dispatch(usersCountUpdated(0))
    })

    return () => {
      api.socket?.off(EVENTS.CONNECT)
      api.socket?.off(EVENTS.DISCONNECT)
      dispatch(destroyConnection())
    }
  }, [])
}
