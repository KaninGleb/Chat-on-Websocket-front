import { io, Socket } from 'socket.io-client'

export const api = {
  socket: null as null | Socket,
  createConnection() {
    this.socket = io('https://chat-on-websocket-back.onrender.com')
  },
}
