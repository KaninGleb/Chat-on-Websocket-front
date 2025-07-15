import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from './store.ts'
import { createConnection, destroyConnection, selectMessages, sendClientMessage, sendClientName } from './chat-slice.ts'
import { Header, MessageInput, MessagesList } from '../common/components'
import s from './App.module.css'

function App() {
  const messages = useSelector(selectMessages)

  const [name, setName] = useState('')
  const [chatUserName, setChatUserName] = useState<string>(() => localStorage.getItem('userName') || 'Anonymous')

  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)

  const dispatch = useDispatch<AppDispatch>()

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

  useEffect(() => {
    dispatch(createConnection())

    return () => {
      dispatch(destroyConnection())
    }
  }, [])

  useEffect(() => {
    if (chatUserName && chatUserName !== 'Anonymous') {
      dispatch(sendClientName(chatUserName))
    }
  }, [chatUserName])

  return (
    <div className={s.appContainer}>
      <Header userName={chatUserName} />

      <MessagesList
        messages={messages}
        userName={chatUserName}
        isAutoScrollActive={isAutoScrollActive}
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

      <MessageInput onSend={handleSendMessage} isScrolling={isAutoScrollActive} />
    </div>
  )
}

export default App
