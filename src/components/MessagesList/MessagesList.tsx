import { useState, type RefObject, type UIEvent, type Dispatch, type SetStateAction } from 'react'
import { MessageItem } from './MessageItem/MessageItem.tsx'
import { TypingUsersShowcase } from '../TypingUsersShowcase/TypingUsersShowcase.tsx'
import type { Message } from '../../chat-reducer.ts'
import s from './MessagesList.module.css'

type MessagesListPropsType = {
  messages: Message[]
  userName: string
  anchorRef: RefObject<HTMLDivElement | null>
  setIsAutoScrollActive: Dispatch<SetStateAction<boolean>>
}

export const MessagesList = ({ messages, userName, anchorRef, setIsAutoScrollActive }: MessagesListPropsType) => {
  const [lastScrollTop, setLastScrollTop] = useState(0)

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const maxScrollPosition = element.scrollHeight - element.clientHeight

    if (element.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - element.scrollTop) < 10) {
      setIsAutoScrollActive(true)
    } else {
      setIsAutoScrollActive(false)
    }
    setLastScrollTop(element.scrollTop)
  }

  return (
    <div className={s.messagesContainer} onScroll={handleScroll}>
      <div className={s.messagesWrapper}>
        {messages.map((m) => (
          <MessageItem key={m.id} currentName={userName} message={m} />
        ))}
        <TypingUsersShowcase/>
        <div ref={anchorRef}></div>
      </div>
    </div>
  )
}
