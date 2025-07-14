import {
  useState,
  useCallback,
  type UIEvent,
  type Dispatch,
  type SetStateAction,
  memo,
  useEffect, useRef
} from 'react'
import { MessageItem } from './MessageItem/MessageItem.tsx'
import { TypingUsersShowcase } from '../TypingUsersShowcase/TypingUsersShowcase.tsx'
import type { Message } from '../../chat-reducer.ts'
import s from './MessagesList.module.css'
import { useSelector } from 'react-redux'
import type { AppStateType } from '../../store.ts'

type MessagesListPropsType = {
  messages: Message[]
  userName: string
  isAutoScrollActive: boolean
  setIsAutoScrollActive: Dispatch<SetStateAction<boolean>>
}

export const MessagesList = memo(({ messages, userName, isAutoScrollActive, setIsAutoScrollActive }: MessagesListPropsType) => {
  const typingUsers = useSelector((state: AppStateType) => state.chat.typingUsers)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const messagesAnchorRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const maxScrollPosition = element.scrollHeight - element.clientHeight
    const scrollFromBottom = maxScrollPosition - element.scrollTop

    if (scrollFromBottom > 200) {
      setIsAutoScrollActive(false)
      setLastScrollTop(element.scrollTop)
      return
    }

    if (element.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - element.scrollTop) < 10) {
      setIsAutoScrollActive(true)
    } else {
      setIsAutoScrollActive(false)
    }
    setLastScrollTop(element.scrollTop)
  }, [lastScrollTop, setIsAutoScrollActive])

  useEffect(() => {
    if (isAutoScrollActive) {
      messagesAnchorRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAutoScrollActive, isTyping])

  useEffect(() => {
    setIsTyping(typingUsers.length > 0)
  }, [typingUsers])

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
