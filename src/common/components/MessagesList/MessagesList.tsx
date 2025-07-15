import {
  useCallback,
  type UIEvent,
  type Dispatch,
  type SetStateAction,
  memo,
  useEffect, useRef
} from 'react'
import { MessageItem } from './MessageItem/MessageItem.tsx'
import { TypingUsersShowcase } from '../TypingUsersShowcase/TypingUsersShowcase.tsx'
import s from './MessagesList.module.css'
import { useAppSelector } from '../../hooks'
import { selectMessages, selectTypingUsers } from '../../../app/chat-slice.ts'

type MessagesListPropsType = {
  userName: string
  isAutoScrollActive: boolean
  setIsAutoScrollActive: Dispatch<SetStateAction<boolean>>
}

export const MessagesList = memo(({ userName, isAutoScrollActive, setIsAutoScrollActive }: MessagesListPropsType) => {
  const messages = useAppSelector(selectMessages)
  const typingUsers = useAppSelector(selectTypingUsers)
  const lastScrollTopRef = useRef(0)
  const isTyping = typingUsers.length > 0

  const messagesAnchorRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const maxScrollPosition = element.scrollHeight - element.clientHeight
    const scrollFromBottom = maxScrollPosition - element.scrollTop

    if (scrollFromBottom > 200) {
      setIsAutoScrollActive(false)
      lastScrollTopRef.current = element.scrollTop
      return
    }

    if (element.scrollTop > lastScrollTopRef.current && Math.abs(maxScrollPosition - element.scrollTop) < 10) {
      setIsAutoScrollActive(true)
    } else {
      setIsAutoScrollActive(false)
    }
    lastScrollTopRef.current = element.scrollTop
  }, [setIsAutoScrollActive])

  useEffect(() => {
    if (isAutoScrollActive) {
      messagesAnchorRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAutoScrollActive, isTyping])

  return (
    <div className={s.messagesContainer} onScroll={handleScroll}>
      <div className={s.messagesWrapper}>
        {messages.map((m) => (
          <MessageItem key={m.id} currentName={userName} message={m} />
        ))}
        <TypingUsersShowcase/>
        <div ref={messagesAnchorRef}></div>
      </div>
    </div>
  )
})
