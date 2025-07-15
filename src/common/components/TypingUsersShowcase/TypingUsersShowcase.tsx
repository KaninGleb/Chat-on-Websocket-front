import { useSelector } from 'react-redux'
import type { AppStateType } from '../../../app/store.ts'
import s from './TypingUsersShowcase.module.css'

export const TypingUsersShowcase = () => {
  const typingUsers = useSelector((state: AppStateType) => state.chat.typingUsers)
  const count = typingUsers.length

  switch (count) {
    case 0:
      return null

    case 1:
      return <div className={s.typingIndicator}>{typingUsers[0].name} is typing</div>

    case 2:
      return (
        <div className={s.typingIndicator}>
          {typingUsers[0].name} and {typingUsers[1].name} are typing
        </div>
      )

    case 3:
      return (
        <div className={s.typingIndicator}>
          {typingUsers[0].name}, {typingUsers[1].name} and {typingUsers[2].name} are typing
        </div>
      )

    default:
      return (
        <div className={s.typingIndicator}>
          {typingUsers[0].name} and {count - 1} others are typing
        </div>
      )
  }
}
