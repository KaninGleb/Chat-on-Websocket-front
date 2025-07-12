import s from './TypingUsersShowcase.module.css'

type TypingUsers = {
  id: string
  name: string
}

export const TypingUsersShowcase = ({ typingUsers }: { typingUsers: TypingUsers[] }) => {
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
