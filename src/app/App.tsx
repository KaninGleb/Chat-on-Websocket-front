import { useState } from 'react'
import { useAppDispatch, useChatConnection, useSendClientName } from '../common/hooks'
import { sendClientMessage } from './chat-slice.ts'
import { Header, MessageInput, MessagesList } from '../common/components'
import s from './App.module.css'

function App() {
  const [chatUserName, setChatUserName] = useState<string>(() => localStorage.getItem('userName') || 'Anonymous')
  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)

  useChatConnection()
  useSendClientName(chatUserName)

  const dispatch = useAppDispatch()

  const handleSendMessage = (message: string) => {
    dispatch(sendClientMessage(message))
    setIsAutoScrollActive(true)
  }

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
