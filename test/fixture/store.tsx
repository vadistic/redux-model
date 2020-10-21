import { combineReducers, createStore } from 'redux'

import { setupInjectableStore } from '../../src'

import { CounterState } from './counter.model'
import { messageReducer, MessageState } from './message.model'

const staticReducers = {
  message: messageReducer,
}

export const store = createStore(combineReducers(staticReducers))

setupInjectableStore(store, staticReducers)

// ────────────────────────────────────────────────────────────────────────────────

export interface StoreState {
  message: MessageState
  counter: CounterState
}

export const getState = () => store.getState() as StoreState
