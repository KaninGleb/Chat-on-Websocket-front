import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import './App.css'

const socket = io('https://chat-on-websocket-back.onrender.com')

function App() {
  useEffect(() => {
    socket.on('init-messages-published', (messages: any) => {
      console.log(messages)
      setMessages(messages)
    })
    socket.on('new-message-sent', (message: any) => {
      setMessages((messages) => [...messages, message])
    })
  }, [])

  const [messages, setMessages] = useState<Array<any>>([])

  const [message, setMessage] = useState('')
  const [name, setName] = useState('Gleb')

  return (
    <>
      <div
        style={{
          border: '1px solid black',
          padding: '10px',
          width: '300px',
          height: '300px',
          overflowY: 'scroll',
          textAlign: 'left',
        }}
      >
        {messages.map((m) => (
          <div key={m.id}>
            <b>{m.user.name}:</b> {m.message}
            <hr />
          </div>
        ))}
      </div>

      <div>
        <input value={name} onChange={(e) => setName(e.currentTarget.value)} />
        <button
          onClick={() => {
            socket.emit('client-name-sent', name)
            setName('')
          }}
        >
          Confirm the name
        </button>
      </div>

      <div>
        <textarea value={message} onChange={(e) => setMessage(e.currentTarget.value)}></textarea>
        <button
          onClick={() => {
            socket.emit('client-message-sent', message)

            setMessage('')
          }}
        >
          Send
        </button>
      </div>
    </>
  )
}

export default App
