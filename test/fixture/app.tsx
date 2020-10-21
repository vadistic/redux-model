import React from 'react'
import { Provider } from 'react-redux'

import { useModelActions } from '../../src'

import { CounterModel } from './counter.model'
import { store } from './store'

export const CounterComponent: React.FC = () => {
  const counterActions = useModelActions(CounterModel)

  return (
    <div className="Counter">
      <p>hello</p>

      <button onClick={() => counterActions.INCREMENT()} data-testid="increment-button">
        Increment
      </button>
    </div>
  )
}

export const AppComponent: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="Fixture">
        <h1>Fixture</h1>
        <CounterComponent />
      </div>
    </Provider>
  )
}
