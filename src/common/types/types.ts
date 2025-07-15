export type User = {
  id: string
  name: string
}

export type Message = {
  id: string
  message: string
  user: User
  time?: string
}

export type ServerStatusType = 'online' | 'offline'
