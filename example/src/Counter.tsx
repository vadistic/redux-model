import React from 'react'
import { AppModel } from './redux/App.model'

export const Counter: React.FC = () => {
  const actions = AppModel.useActions()
  // const handlers = AppModel.useHandlers()

  return (
    <div>
      <h3>Counter</h3>

      <button>Increment</button>
    </div>
  )
}
