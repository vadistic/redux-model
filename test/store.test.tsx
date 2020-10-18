import { createStore } from 'redux'

import { setupInjectableStore } from '../src'

describe('setup store', () => {
  const staticReducers = {}

  const store = setupInjectableStore(createStore({}), staticReducers)
})
