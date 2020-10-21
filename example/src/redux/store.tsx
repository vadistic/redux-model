import { createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { setupInjectableStore } from '@vadistic/redux-model'
import { messageReducer } from './message.model'

const staticReducers = {
  message: messageReducer,
}

const composeEnhancers = composeWithDevTools({
  // specify here name, actionsBlacklist, actionsCreators and other options
})

const enhancers = composeEnhancers()

export const reducers = combineReducers(staticReducers)
export const store = createStore(reducers, enhancers)

setupInjectableStore(store, staticReducers)
