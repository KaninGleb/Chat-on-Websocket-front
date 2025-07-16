export type User = {
  id: string
  name: string
}

export type Message = {
  id: string
  message: string
  user: User
  createdAt: string
}

export type ServerStatusType = 'online' | 'offline' | 'connecting'
