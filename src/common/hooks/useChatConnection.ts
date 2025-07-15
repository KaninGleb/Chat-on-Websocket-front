import { useAppDispatch } from './useAppDispatch.ts'
import { useEffect } from 'react'
import { createConnection, destroyConnection } from '../../app/chat-slice.ts'

export const useChatConnection = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(createConnection())

    return () => {
      dispatch(destroyConnection())
    }
  }, [])
}
