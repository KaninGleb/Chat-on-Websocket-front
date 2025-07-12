import { useState, useEffect, useRef, type UIEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { AppStateType, AppDispatch } from './store.ts'
import { createConnection, destroyConnection, sendClientName, sendClientMessage, typeMessage } from './chat-reducer.ts'
import s from './App.module.css'

function App() {
  const messages = useSelector((state: AppStateType) => state.chat.messages)
  const typingUsers = useSelector((state: AppStateType) => state.chat.typingUsers)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(createConnection())

    return () => {
      dispatch(destroyConnection())
    }
  }, [])

  // const [messages, setMessages] = useState<Array<any>>([])

  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const messagesAnchorRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (isAutoScrollActive) {
      messagesAnchorRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAutoScrollActive, isTyping])

  useEffect(() => {
    setIsTyping(typingUsers.length > 0)
  }, [typingUsers])

  return (
    <>
      <div className={s.messagesContainer} onScroll={handleScroll}>
        {messages.map((m: any) => (
          <div key={m.id} className={s.messageItem}>
            <b>{m.user.name}:</b> {m.message}
          </div>
        ))}

        {typingUsers.map((m: any) => (
          <div key={m.id}>
            <b>{m.name + ' '}</b>
            is typing...
          </div>
        ))}
        <div ref={messagesAnchorRef}></div>
      </div>

      <div className={s.nameInputGroup}>
        <input
          className={s.inputField}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder='Enter your name'
        />
        <button
          className={s.button}
          onClick={() => {
            dispatch(sendClientName(name))
            setName('')
          }}
        >
          Confirm the name
        </button>
      </div>

      <div className={s.textareaGroup}>
        <textarea
          className={s.textareaField}
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          onKeyDown={() => {
            dispatch(typeMessage())
          }}
          placeholder='Type your message'
          rows={4}
        />
        <button
          className={s.button}
          onClick={() => {
            dispatch(sendClientMessage(message))
            setMessage('')
          }}
        >
          Send the message
        </button>
      </div>
    </>
  )
}

export default App
