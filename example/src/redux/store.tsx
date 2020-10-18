import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { setupInjectableStore } from '@vadistic/redux-model'

const staticReducers = {}

const composeEnhancers = composeWithDevTools({
  // Specify here name, actionsBlacklist, actionsCreators and other options
})

const enhancers = composeEnhancers()

// const reducers = combineReducers(staticReducers)
const reducers = () => ({})

export const store = setupInjectableStore(createStore(reducers, enhancers), staticReducers)
