import { useState, useEffect, useRef, type UIEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { AppStateType, AppDispatch } from './store.ts'
import {
  createConnection,
  destroyConnection,
  sendClientName,
  sendClientMessage,
  typeMessage,
  stopTypingMessage,
} from './chat-reducer.ts'
import { ServerStatus, TypingUsersShowcase } from './components'
import s from './App.module.css'

function App() {
  const messages = useSelector((state: AppStateType) => state.chat.messages)
  const typingUsers = useSelector((state: AppStateType) => state.chat.typingUsers)
  const connectionStatus = useSelector((state: AppStateType) => state.chat.connectionStatus)

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
  const [currentName, setCurrentName] = useState<string>(() => localStorage.getItem('userName') || 'Anonymous')

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
    if (currentName && currentName !== 'Anonymous') {
      dispatch(sendClientName(currentName))
    }
  }, [currentName])

  useEffect(() => {
    if (isAutoScrollActive) {
      messagesAnchorRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAutoScrollActive, isTyping])

  useEffect(() => {
    setIsTyping(typingUsers.length > 0)
  }, [typingUsers])

  const handleConfirmName = () => {
    if (name.trim() === '') return
    dispatch(sendClientName(name.trim()))
    localStorage.setItem('userName', name)
    setCurrentName(name)
    setName('')
  }

  return (
    <>
      <div className={s.headerInfo}>
        <div className={s.userName}>
          Your name: {' '} <b>{currentName}</b>
        </div>
        <ServerStatus status={connectionStatus} />
      </div>

      <div className={s.messagesContainer} onScroll={handleScroll}>
        {messages.map((m: any) => (
          <div key={m.id} className={s.messageItem}>
            <b>{m.user.name}:</b> {m.message}
          </div>
        ))}

        <TypingUsersShowcase typingUsers={typingUsers} />
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
          onClick={handleConfirmName}
        >
          Confirm the name
        </button>
      </div>

      <div className={s.textareaGroup}>
        <textarea
          className={s.textareaField}
          value={message}
          onChange={(e) => {
            const newMessage = e.currentTarget.value
            setMessage(newMessage)

            if (newMessage.trim() !== '') {
              dispatch(typeMessage())
            } else {
              dispatch(stopTypingMessage())
            }
          }}
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
            dispatch(stopTypingMessage())
            setIsAutoScrollActive(true)
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
