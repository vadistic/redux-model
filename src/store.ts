import { combineReducers } from 'redux'
import type { Store, Reducer, AnyAction } from 'redux'

import { bindModelActions, bindModelHandlers } from './model'
import { AnyRO } from './types'

export interface InjectableStore<S = any, A extends AnyAction = AnyAction> extends Store<S, A> {
  injectedReducers: Record<string, Reducer>
  staticReducers: Record<string, Reducer>

  boundActions: Record<string, any>
  boundHandlers: Record<string, any>

  injectReducer: (scope: string, reducer: Reducer<any, any>) => void
  injectReactions: (scope: string, reactions: AnyRO) => void

  injectionStatus: (scope: string) => boolean
}

/**
 *  - mutate provided store object !
 *  - allows for injection for code splliting (and less hassle)
 *  @see https://redux.js.org/recipes/code-splitting
 */
export const setupInjectableStore = <S, A extends AnyAction>(
  reduxStore: Store<S, A>,
  staticReducers: Record<string, Reducer<any, any>>,
) => {
  const store = reduxStore as InjectableStore<S, A>

  store.boundActions = {}
  store.boundHandlers = {}

  store.injectedReducers = {}
  store.staticReducers = staticReducers

  store.injectionStatus = key => !!store.injectedReducers[key]

  store.injectReactions = (scope, reactions) => {
    if (!store.boundActions[scope]) {
      store.boundActions[scope] = bindModelActions(scope, reactions, store.dispatch)
    }

    if (!store.boundHandlers[scope]) {
      store.boundHandlers[scope] = bindModelHandlers(scope, reactions, store.dispatch)
    }
  }

  store.injectReducer = (key, asyncReducer) => {
    if (!store.injectedReducers[key]) {
      store.injectedReducers[key] = asyncReducer

      store.replaceReducer(
        combineReducers({
          ...store.staticReducers,
          ...store.injectedReducers,
        }) as any,
      )
    }
  }

  return store
}
