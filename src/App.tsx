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
import { Header, TypingUsersShowcase } from './components'
import s from './App.module.css'
import sendIcon from './assets/send-button-icon.svg'

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
    <div className={s.appContainer}>
      <Header userName={currentName} connectionStatus={connectionStatus} />

      <div className={s.messagesContainer} onScroll={handleScroll}>
        <div className={s.messagesWrapper}>
          {messages.map((m: any) => (
            <div key={m.id} className={`${s.messageItem} ${m.user.name === currentName ? s.own : s.other}`}>
              <svg
                width='9'
                height='20'
                className={`${s.svgAppendix} ${m.user.name === currentName ? s.ownAppendix : s.otherAppendix}`}
              >
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
              <b>{m.user.name === currentName ? '' : m.user.name}</b>
              {m.message}
              <div className={s.messageTime}>
                {new Date(m.time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          <TypingUsersShowcase typingUsers={typingUsers} />
          <div ref={messagesAnchorRef}></div>
        </div>
      </div>

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
