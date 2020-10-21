import React from 'react'
import {
  useModelActions,
  useModelHandlers,
  useModelSelector,
  useModelDispatch,
} from '@vadistic/redux-model'
import { AppModel } from '../redux/counter.model'
import { Demo } from './Demo'

const SELECTOR_EXAMPLE = /* tsx */ `
const count = useModelSelector(AppModel, state => state.count)

return <p>count: {count}</p>
`

const ACTION_EXAMPLE = /* tsx */ `
const actions = useModelActions(AppModel)

return <button onClick={() => actions.INCREMENT()}>OK</button>
`

const HANDLER_EXAMPLE = /* tsx */ `
const handlers = useModelHandlers(AppModel)

return <button onClick={handlers.INCREMENT()}>Increment</button>
`

const DISPATCH_EXAMPLE = /* tsx */ `
const dispatch = useModelDispatch(AppModel)

return <button onClick={() => dispatch({ type: 'INCREMENT', payload: undefined })}>Increment</button>
`

export const Counter: React.FC = () => {
  const actions = useModelActions(AppModel)
  const handlers = useModelHandlers(AppModel)
  const count = useModelSelector(AppModel, state => state.count)
  const dispatch = useModelDispatch(AppModel)

  return (
    <div>
      <h3>Counter</h3>

      <Demo title="State selector" example={SELECTOR_EXAMPLE}>
        <p>
          <big>
            count: <strong>{count}</strong>
          </big>
        </p>
      </Demo>

      <Demo title="Increment with action" example={ACTION_EXAMPLE}>
        <button onClick={() => actions.INCREMENT()}>Increment</button>
      </Demo>

      <Demo title="Increment with handler" example={HANDLER_EXAMPLE}>
        <button onClick={handlers.INCREMENT()}>Increment</button>
      </Demo>

      <Demo title="Increment with dispatch" example={DISPATCH_EXAMPLE}>
        <button onClick={() => dispatch({ type: 'INCREMENT', payload: undefined })}>
          Increment
        </button>{' '}
      </Demo>
    </div>
  )
}
