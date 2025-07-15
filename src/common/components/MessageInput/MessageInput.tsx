import { type ChangeEvent, type KeyboardEvent, useRef, useState } from 'react'
import { useAppDispatch } from '../../hooks'
import { stopTypingMessage, typeMessage } from '../../../app/chat-slice.ts'
import sendIcon from '../../../assets/send-button-icon.svg'
import s from './MessageInput.module.css'

type MessageInputProps = {
  onSend: (msg: string) => void
  isScrolling: boolean
}

export const MessageInput = ({ onSend, isScrolling }: MessageInputProps) => {
  const [message, setMessage] = useState('')
  const dispatch = useAppDispatch()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.currentTarget.value
    setMessage(newMessage)

    resizeTextarea()

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
    onSend(message.trim())
    dispatch(stopTypingMessage())
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    setMessage('')
  }

  return (
    <section className={`${s.inputSection} ${!isScrolling ? s.onScroll : ''}`}>
      <div className={s.inputContainer}>
        <div className={s.inputGroup}>
          <div className={s.inputWrapper}>
            <textarea
              ref={textareaRef}
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
