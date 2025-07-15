import type { Message } from '../../../../app/chat-reducer.ts'
import s from './MessageItem.module.css'

type MessageItemPropsType = {
  message: Message
  currentName: string
}

export const MessageItem = ({ currentName, message }: MessageItemPropsType) => (
  <div className={`${s.messageItem} ${message.user.name === currentName ? s.own : s.other}`}>
    <svg
      width='9'
      height='20'
      className={`${s.svgAppendix} ${message.user.name === currentName ? s.ownAppendix : s.otherAppendix}`}
    >
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
    <b>{message.user.name === currentName ? '' : message.user.name}</b>
    {message.message}
    <div className={s.messageTime}>
      {new Date(message.time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  </div>
)
