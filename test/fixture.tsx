import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'

import { createModel, setupInjectableStore, useModelActions } from '../src'

// ────────────────────────────────────────────────────────────────────────────────

// classic reducer

export interface MessageState {
  message?: string
}

const messageInit: MessageState = {
  message: 'INIT',
}

const messageReducer = (state = messageInit, action: any) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return { ...state, message: action.payload }
    case 'RESET_MESSAGE':
      return { ...state, message: undefined }
    default:
      return state
  }
}

const staticReducers = {
  message: messageReducer,
}

// ────────────────────────────────────────────────────────────────────────────────

// model reducer

export interface TestState {
  value: number
}

const TestModel = createModel({
  useImmer: false,
  useInjection: true,
  scope: 'test',
  init: { value: 0 } as TestState,
  reactions: {
    INCREMENT: (state: TestState): TestState => ({ ...state, value: state.value + 1 }),
  },
})

export const store = createStore(combineReducers(staticReducers))

setupInjectableStore(store, staticReducers)

// ────────────────────────────────────────────────────────────────────────────────

// helper

export interface StoreState {
  message: MessageState
  test: TestState
}

export const getState = () => store.getState() as StoreState

// ────────────────────────────────────────────────────────────────────────────────

// react fixture

export const Counter: React.FC = () => {
  const actions = useModelActions(TestModel)

  return (
    <div className="Counter">
      <p>hello</p>

      <button onClick={() => actions.INCREMENT()} data-testid="increment-button">
        Increment
      </button>
    </div>
  )
}

export const Fixture: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="Fixture">
        <h1>Fixture</h1>
        <Counter />
      </div>
    </Provider>
  )
}
