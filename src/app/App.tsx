import { useEffect, useState } from 'react'
import { useAppDispatch, useChatConnection } from '../common/hooks'
import { sendClientMessage, sendClientName } from './chat-slice.ts'
import { Header, MessageInput, MessagesList } from '../common/components'
import s from './App.module.css'

function App() {
  useChatConnection()

  const [chatUserName, setChatUserName] = useState<string>(() => localStorage.getItem('userName') || 'Anonymous')
  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)

  const dispatch = useAppDispatch()

  const handleSendMessage = (message: string) => {
    dispatch(sendClientMessage(message))
    setIsAutoScrollActive(true)
  }

  useEffect(() => {
    if (chatUserName && chatUserName !== 'Anonymous') {
      dispatch(sendClientName(chatUserName))
    }
  }, [chatUserName])

  return (
    <div className={s.appContainer}>
      <Header userName={chatUserName} setChatUserName={setChatUserName} />

      <MessagesList
        userName={chatUserName}
        isAutoScrollActive={isAutoScrollActive}
        setIsAutoScrollActive={setIsAutoScrollActive}
      />

      <MessageInput onSend={handleSendMessage} isScrolling={isAutoScrollActive} />
    </div>
  )
}

export default App
