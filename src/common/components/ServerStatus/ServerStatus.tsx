import { useAppSelector } from '../../hooks'
import { selectConnectionStatus, selectReadyToSendMessagesStatus, selectUsersCount } from '../../../app/chat-slice.ts'
import s from './ServerStatus.module.css'

export const ServerStatus = () => {
  const connectionStatus = useAppSelector(selectConnectionStatus)
  const readyToSendMessages = useAppSelector(selectReadyToSendMessagesStatus)
  const usersCount = useAppSelector(selectUsersCount)

  const statusMap = {
    online: { color: '#4caf50', text: 'Live' },
    offline: { color: '#f44336', text: 'Offline' },
    connecting: { color: '#ff9800', text: 'Connecting...' },
  }

  let statusKey: keyof typeof statusMap

  if (connectionStatus === 'offline') {
    statusKey = 'offline'
  } else if (!readyToSendMessages) {
    statusKey = 'connecting'
  } else {
    statusKey = 'online'
  }

  const { color, text } = statusMap[statusKey] || statusMap.offline

  return (
    <div className={s.container} style={{ color }}>
      {statusKey === 'online' && <span className={s.usersCount}>({usersCount} online)</span>}
      <span className={s.status}>
        <span
          className={`${s.content} ${statusKey === 'connecting' ? s.pulsing : ''}`}
          style={{ backgroundColor: color }}
        />
        <span>{text}</span>
      </span>
    </div>
  )
}
