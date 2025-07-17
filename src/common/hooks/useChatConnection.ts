import { useEffect } from 'react'
import { useAppDispatch } from './useAppDispatch.ts'
import { createConnection, destroyConnection } from '@/features/chat/model'

export const useChatConnection = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(createConnection())

    return () => {
      dispatch(destroyConnection())
    }
  }, [])
}
