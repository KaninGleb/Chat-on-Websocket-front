import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, AppStateType } from './store.ts'
import { createConnection, destroyConnection, sendClientMessage, sendClientName } from './chat-reducer.ts'
import { Header, MessageInput, MessagesList } from './components'
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

  const handleSendMessage = (message: string) => {
    dispatch(sendClientMessage(message))
    setIsAutoScrollActive(true)
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

      <MessageInput onSend={handleSendMessage} />
    </div>
  )
}

export default App
