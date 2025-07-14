import { ServerStatus, type ServerStatusType } from '../ServerStatus/ServerStatus.tsx'
import s from './Header.module.css'

type HeaderType = {
  userName: string
  connectionStatus: ServerStatusType
}

export const Header = ({ userName, connectionStatus }: HeaderType) => (
  <header className={s.header}>
    <div className={s.headerContainer}>
      <div className={s.headerInfo}>
        <div className={s.userName}>
          Your name: <b>{userName}</b>
        </div>
        <ServerStatus status={connectionStatus} />
      </div>
    </div>
  </header>
)
