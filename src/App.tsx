import { useEffect, useState } from 'react'
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

  return (
    <>
      <div className={s.messagesContainer}>
        {messages.map((m) => (
          <div key={m.id} className={s.messageItem}>
            <b>{m.user.name}:</b> {m.message}
            <hr />
          </div>
        ))}
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
