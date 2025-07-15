import s from './ServerStatus.module.css'
import { useSelector } from 'react-redux'
import type { AppStateType } from '../../../app/store.ts'

export type ServerStatusType = 'online' | 'offline'

export const ServerStatus = () => {
  const connectionStatus = useSelector((state: AppStateType) => state.chat.connectionStatus)
  const readyToSendMessages = useSelector((state: AppStateType) => state.chat.readyToSendMessages)

  console.log(connectionStatus, readyToSendMessages)

  const isOnline = connectionStatus && readyToSendMessages

  const statusMap = {
    online: { color: '#4caf50', text: 'Live' },
    offline: { color: '#f44336', text: 'Offline' },
  }

  const { color, text } = isOnline ? statusMap.online : statusMap.offline

  return (
    <div className={s.container} style={{ color }}>
      <span className={s.content} style={{ backgroundColor: color }} />
      <span>{text}</span>
    </div>
  )
}
