import { useSelector } from 'react-redux'
import { selectConnectionStatus, selectReadyToSendMessagesStatus } from '../../../app/chat-slice.ts'
import s from './ServerStatus.module.css'

export const ServerStatus = () => {
  const connectionStatus = useSelector(selectConnectionStatus)
  const readyToSendMessages = useSelector(selectReadyToSendMessagesStatus)

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
