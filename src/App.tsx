import { useState, useEffect, useRef } from 'react'
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
import { Header } from './components'
import s from './App.module.css'
import sendIcon from './assets/send-button-icon.svg'
import { MessagesList } from './components'

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
  const [chatUserName, setChatUserName] = useState<string>(() => localStorage.getItem('userName') || 'Anonymous')

  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

  const messagesAnchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatUserName && chatUserName !== 'Anonymous') {
      dispatch(sendClientName(chatUserName))
    }
  }, [chatUserName])

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
    setChatUserName(name)
    setName('')
  }

  return (
    <div className={s.appContainer}>
      <Header userName={chatUserName} connectionStatus={connectionStatus} />

      <MessagesList
        messages={messages}
        userName={chatUserName}
        anchorRef={messagesAnchorRef}
        setIsAutoScrollActive={setIsAutoScrollActive}
      />

      {/*<div className={s.nameInputGroup}>*/}
      {/*  <input*/}
      {/*    className={s.inputField}*/}
      {/*    value={name}*/}
      {/*    onChange={(e) => setName(e.currentTarget.value)}*/}
      {/*    placeholder='Enter your name'*/}
      {/*  />*/}
      {/*  <button className={s.button} onClick={handleConfirmName}>*/}
      {/*    Confirm the name*/}
      {/*  </button>*/}
      {/*</div>*/}

      <section className={s.inputSection}>
        <div className={s.inputContainer}>
          <div className={s.inputGroup}>
            <div className={s.inputWrapper}>
              <input
                className={s.inputMessage}
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
                placeholder='Message'
              />
              <svg width='9' height='20' className={`${s.ownAppendix} ${s.inputAppendix}`}>
                <g fill='none' fillRule='evenodd'>
                  <path
                    d='M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z'
                    fill='#000'
                  />
                  <path
                    d='M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z'
                    fill='FFF'
                  />
                </g>
              </svg>
            </div>
            <button
              className={s.sendButton}
              onClick={() => {
                dispatch(sendClientMessage(message))
                dispatch(stopTypingMessage())
                setIsAutoScrollActive(true)
                setMessage('')
              }}
            >
              {<img className={s.sendButtonIcon} src={sendIcon} alt='Sent icon' />}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
