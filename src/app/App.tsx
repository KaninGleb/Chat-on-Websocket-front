import { useEffect, useState } from 'react'
import { useAppDispatch } from '../common/hooks'
import { createConnection, destroyConnection, sendClientMessage, sendClientName } from './chat-slice.ts'
import { Header, MessageInput, MessagesList } from '../common/components'
import s from './App.module.css'

function App() {
  const [chatUserName, setChatUserName] = useState<string>(() => localStorage.getItem('userName') || 'Anonymous')

  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)

  const dispatch = useAppDispatch()

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
      <Header userName={chatUserName} setChatUserName={setChatUserName}/>

      <MessagesList
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
