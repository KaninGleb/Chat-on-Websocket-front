import { useEffect } from 'react'
import { useAppDispatch } from './useAppDispatch.ts'
import { sendClientName } from '../../app/chat-slice.ts'

export const useSendClientName = (name: string) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (name && name !== 'Anonymous') {
      dispatch(sendClientName(name))
    }
  }, [name])
}
