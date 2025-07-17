import { useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { useAppDispatch } from '@/common/hooks'
import { ServerStatus } from '@/features/chat/components'
import { sendClientName } from '@/features/chat/model/chat-slice.ts'
import { penIcon } from '@/assets'
import s from './Header.module.css'

type HeaderType = {
  userName: string
  setChatUserName: (name: string) => void
}

export const Header = ({ userName, setChatUserName }: HeaderType) => {
  const [name, setName] = useState<string>('')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const dispatch = useAppDispatch()

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value)
    if (error) {
      setError(null)
    }
  }

  const handleConfirmName = () => {
    const trimmed = name.trim()

    if (trimmed === '') {
      setError('Name cannot be empty')
      return
    }
    setIsEditing(false)

    dispatch(sendClientName(trimmed))
    localStorage.setItem('userName', trimmed)
    setChatUserName(trimmed)
    setName('')
    setError(null)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirmName()
    }
  }

  const handleSpanOnClick = () => setIsEditing(true)

  return (
    <header className={s.header}>
      <div className={s.container}>
        <div className={s.info}>
          <div className={s.user}>
            Your name:{' '}
            {isEditing ? (
              <div className={s.inputWrapper}>
                <input
                  className={error ? s.inputError : ''}
                  value={name}
                  onChange={handleOnChange}
                  onBlur={handleConfirmName}
                  onKeyDown={handleKeyDown}
                  maxLength={15}
                  autoFocus
                />
                <div className={`${s.lengthMsg} ${name.length >= 15 && s.errorMsg}`}>{name.length}/15</div>
                {error && <div className={s.errorText}>{error}</div>}
              </div>
            ) : (
              <span className={s.userName} onClick={handleSpanOnClick}>
                {userName}
                <img className={s.editIcon} src={penIcon} alt='Edit icon' />
              </span>
            )}
          </div>
          <ServerStatus />
        </div>
      </div>
    </header>
  )
}
