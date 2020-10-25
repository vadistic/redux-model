import React from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'

import { useModelActions } from '../../src'

import { CounterModel } from './counter.model'
import { RESET_MESSAGE, SET_MESSAGE } from './message.model'
import { store, StoreState } from './store'

export const TEST_IDS = {
  UNARY_BUTTON: 'UNARY_BUTTON',
  OPTIONAL_BUTTON_1: 'OPTIONAL_BUTTON_1',
  OPTIONAL_BUTTON_2: 'OPTIONAL_BUTTON_2',
  REQUIRED_BUTTON: 'REQUIRED_BUTTON',

  RESET_MESSAGE_BUTTON: 'RESET_MESSAGE_BUTTON',
  MESSAGE_INPUT: 'MESSAGE_INPUT',
} as const

export const CounterComponent: React.FC = () => {
  const counterActions = useModelActions(CounterModel)

  return (
    <div className="Counter">
      <p>hello</p>

      <button onClick={() => counterActions.UNARY()} data-testid={TEST_IDS.UNARY_BUTTON}>
        Click
      </button>

      <button onClick={() => counterActions.OPTIONAL()} data-testid={TEST_IDS.OPTIONAL_BUTTON_1}>
        Click
      </button>

      <button onClick={() => counterActions.OPTIONAL(1)} data-testid={TEST_IDS.OPTIONAL_BUTTON_2}>
        Click
      </button>

      <button onClick={() => counterActions.REQUIRED(1)} data-testid={TEST_IDS.REQUIRED_BUTTON}>
        Click
      </button>
    </div>
  )
}

export const MessageComponent: React.FC = () => {
  const message = useSelector((state: StoreState) => state.message.value)
  const dispatch = useDispatch()

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: SET_MESSAGE, payload: e.target.value })
  }

  const handleReset: React.MouseEventHandler<HTMLButtonElement> = () => {
    dispatch({ type: RESET_MESSAGE })
  }

  return (
    <div className="Message">
      <p>message {message}</p>

      <button onClick={handleReset} data-testid={TEST_IDS.RESET_MESSAGE_BUTTON}>
        Reset
      </button>

      <input
        name="message"
        defaultValue={message}
        onChange={handleChange}
        data-testid={TEST_IDS.MESSAGE_INPUT}
      />
    </div>
  )
}

export const AppComponent: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="Fixture">
        <h1>Fixture</h1>

        <CounterComponent />

        <MessageComponent />
      </div>
    </Provider>
  )
}
