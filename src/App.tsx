import { useState, useEffect, useRef, type UIEvent } from 'react'
import io from 'socket.io-client'
import s from './App.module.css'

const socket = io('https://chat-on-websocket-back.onrender.com')

function App() {
  useEffect(() => {
    socket.on('init-messages-published', (messages: any) => {
      console.log(messages)
      setMessages(messages)
    })
    socket.on('new-message-sent', (message: any) => {
      setMessages((messages) => {
        const exists = messages.some((m) => m.id === message.id)
        if (exists) {
          return messages
        }
        return [...messages, message]
      })
    })
  }, [])

  const [messages, setMessages] = useState<Array<any>>([])

  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)
  const [lastScrollTop, setLastScrollTop] = useState(0)

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
  }, [messages, isAutoScrollActive])

  return (
    <>
      <div className={s.messagesContainer} onScroll={handleScroll}>
        {messages.map((m) => (
          <div key={m.id} className={s.messageItem}>
            <b>{m.user.name}:</b> {m.message}
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
            socket.emit('client-name-sent', name)
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
          placeholder='Type your message'
          rows={4}
        />
        <button
          className={s.button}
          onClick={() => {
            socket.emit('client-message-sent', message)
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
