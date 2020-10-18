import { createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { setupInjectableStore } from '@vadistic/redux-model'

const staticReducers = {}

const composeEnhancers = composeWithDevTools({
  // specify here name, actionsBlacklist, actionsCreators and other options
})

const enhancers = composeEnhancers()

const reducers = combineReducers(staticReducers)

export const store = setupInjectableStore(createStore(reducers, enhancers), staticReducers)
