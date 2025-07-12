import { legacy_createStore as createStore, combineReducers, applyMiddleware, type Action } from 'redux'
import { chatReducer } from './chat-reducer.ts'
import { thunk, type ThunkDispatch } from 'redux-thunk'

const rootReducer = combineReducers({
  chat: chatReducer,
})

export type AppStateType = ReturnType<typeof rootReducer>

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)
