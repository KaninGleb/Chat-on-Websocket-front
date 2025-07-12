import s from './ServerStatus.module.css'

export type ServerStatusType = 'online' | 'offline'

type ServerStatusProps = {
  status: ServerStatusType
}

export const ServerStatus = ({ status }: ServerStatusProps) => {
  const statusMap = {
    online: { color: '#4caf50', text: 'Live' },
    offline: { color: '#f44336', text: 'Offline' },
  }

  const { color, text } = statusMap[status] || statusMap.offline

  return (
    <div className={s.container} style={{ color }}>
      <span className={s.content} style={{ backgroundColor: color }} />
      <span>{text}</span>
    </div>
  )
}
