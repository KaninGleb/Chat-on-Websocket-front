import { useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([
    { message: 'Hello, Viktor', id: 'hsdafgds', user: { id: 'sdfdsf', name: 'Dimych' } },
    { message: 'Hello, Dimych', id: 'asdfsdfs', user: { id: 'asdfdg', name: 'Viktor' } },
  ])

  return (
    <>
      <div
        style={{
          border: '1px solid black',
          padding: '10px',
          width: '300px',
          height: '300px',
          overflowY: 'scroll',
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.user.name}:</b> {m.message}
            <hr />
          </div>
        ))}
      </div>

      <textarea value={message} onChange={(e) => setMessage(e.currentTarget.value)}></textarea>
      <button
        onClick={() => {
          socket.emit('client-message-sent', message)

          setMessage('')
        }}
      >
        Send
      </button>
    </>
  )
}

export default App
