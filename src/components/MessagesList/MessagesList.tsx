import { useState, useCallback, type RefObject, type UIEvent, type Dispatch, type SetStateAction, memo } from 'react'
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

export const MessagesList = memo(({ messages, userName, anchorRef, setIsAutoScrollActive }: MessagesListPropsType) => {
  const [lastScrollTop, setLastScrollTop] = useState(0)

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
})
