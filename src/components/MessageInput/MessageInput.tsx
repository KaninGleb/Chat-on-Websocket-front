import { useDispatch } from 'react-redux'
import { type ChangeEvent, type KeyboardEvent, useState } from 'react'
import type { AppDispatch } from '../../store.ts'
import { stopTypingMessage, typeMessage } from '../../chat-reducer.ts'
import sendIcon from '../../assets/send-button-icon.svg'
import s from './MessageInput.module.css'

type MessageInputProps = {
  onSend: (msg: string) => void
}

export const MessageInput = ({onSend }: MessageInputProps) => {
  const [message, setMessage] = useState('')

  const dispatch = useDispatch<AppDispatch>()

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.currentTarget.value
    setMessage(newMessage)

    if (/\S/.test(newMessage)) {
      dispatch(typeMessage())
    } else {
      dispatch(stopTypingMessage())
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) return

      e.preventDefault()

      if (!e.ctrlKey || e.ctrlKey) {
        handleSendClick()
      }
    } else if (e.key.length === 1) {
      dispatch(typeMessage())
    }
  }

  const handleSendClick = () => {
    if (message.trim() === '') return
    onSend(message)
    dispatch(stopTypingMessage())
    setMessage('')
  }

  return (
    <section className={s.inputSection}>
      <div className={s.inputContainer}>
        <div className={s.inputGroup}>
          <div className={s.inputWrapper}>
            <textarea
              className={s.inputMessage}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder='Message'
              rows={1}
            />
            <svg width='9' height='20' className={`${s.ownAppendix} ${s.inputAppendix}`}>
              <g fill='none' fillRule='evenodd'>
                <path
                  d='M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z'
                  fill='#000'
                />
                <path
                  d='M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z'
                  fill='FFF'
                />
              </g>
            </svg>
          </div>
          <button className={s.sendButton} onClick={handleSendClick}>
            <img className={s.sendButtonIcon} src={sendIcon} alt='Send icon' />
          </button>
        </div>
      </div>
    </section>
  )
}
