import { useAppSelector } from '../../hooks'
import { selectTypingUsers } from '../../../app/chat-slice.ts'
import s from './TypingUsersShowcase.module.css'

export const TypingUsersShowcase = () => {
  const typingUsers = useAppSelector(selectTypingUsers)
  const count = typingUsers.length

  if (count === 0) return null

  let typingMessage = ''

  switch (count) {
    case 1:
      typingMessage = `${typingUsers[0].name} is typing`
      break

    case 2:
      typingMessage = `${typingUsers[0].name} and ${typingUsers[1].name} are typing`
      break

    case 3:
      typingMessage = `${typingUsers[0].name}, ${typingUsers[1].name} and ${typingUsers[2].name} are typing`
      break

    default:
      typingMessage = `${typingUsers[0].name} and ${count - 1} others are typing`
      break
  }

  return (
    <div className={s.typingIndicator}>
      {typingMessage}
      <span className={s.dots}>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </div>
  )
}
