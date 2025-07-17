import { useState } from 'react'
import { useChatConnection, useSendClientName } from '@/common/hooks'
import { Header, MessagesList, MessageInput } from '@/features/chat/components'
import s from './App.module.css'

function App() {
  const [chatUserName, setChatUserName] = useState<string>(() => localStorage.getItem('userName') || 'Anonymous')
  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)

  useChatConnection()
  useSendClientName(chatUserName)

  return (
    <div className={s.appContainer}>
      <Header userName={chatUserName} setChatUserName={setChatUserName} />
      <MessagesList
        userName={chatUserName}
        isAutoScrollActive={isAutoScrollActive}
        setIsAutoScrollActive={setIsAutoScrollActive}
      />
      <MessageInput isScrolling={isAutoScrollActive} setIsAutoScrollActive={setIsAutoScrollActive} />
    </div>
  )
}

export default App
