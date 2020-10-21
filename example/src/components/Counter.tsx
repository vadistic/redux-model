import React from 'react'
import {
  useModelActions,
  useModelHandlers,
  useModelSelector,
  useModelDispatch,
} from '@vadistic/redux-model'
import { AppModel } from '../redux/counter.model'

export const Counter: React.FC = () => {
  const actions = useModelActions(AppModel)
  const handlers = useModelHandlers(AppModel)
  const count = useModelSelector(AppModel, state => state.count)
  const dispatch = useModelDispatch(AppModel)

  return (
    <div>
      <h3>Counter</h3>

      <code>VALUE: {count}</code>

      <button onClick={() => actions.INCREMENT()}>Increment with action</button>

      <button onClick={handlers.INCREMENT()}>Increment with handler</button>

      <button onClick={() => dispatch({ type: 'INCREMENT', payload: undefined })}>
        Increment with dispatch
      </button>
    </div>
  )
}
