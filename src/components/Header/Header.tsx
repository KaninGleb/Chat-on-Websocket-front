import { ServerStatus, type ServerStatusType } from '../ServerStatus/ServerStatus.tsx'
import s from './Header.module.css'

type HeaderType = {
  userName: string
  connectionStatus: ServerStatusType
}

export const Header = ({ userName }: HeaderType) => (
  <header className={s.header}>
    <div className={s.container}>
      <div className={s.info}>
        <div className={s.user}>
          Your name: <span className={s.userName}>{userName}</span>
        </div>
        <ServerStatus />
      </div>
    </div>
  </header>
)
