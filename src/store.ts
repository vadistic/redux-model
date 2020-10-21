import { combineReducers } from 'redux'
import type { Store, Reducer, AnyAction } from 'redux'

import { bindModelActions, bindModelHandlers } from './model'
import { ModelPartial } from './types'

export interface InjectableStore<S = any, A extends AnyAction = AnyAction> extends Store<S, A> {
  injectedReducers: Record<string, Reducer>
  staticReducers: Record<string, Reducer>

  boundActions: Record<string, any>
  boundHandlers: Record<string, any>

  areReducersInjected: (scope: string) => boolean
  areActionsInjected: (scope: string) => boolean
  areHandlersInjected: (scope: string) => boolean

  ensureReducersInjected: (model: ModelPartial<any>) => void
  ensureActionsInjected: (model: ModelPartial<any>) => void
  ensureHandlersInjected: (model: ModelPartial<any>) => void
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

  store.areReducersInjected = key => !!store.injectedReducers[key]
  store.areActionsInjected = key => !!store.boundActions[key]
  store.areHandlersInjected = key => !!store.boundActions[key]

  store.ensureActionsInjected = model => {
    if (!store.boundActions[model.scope]) {
      store.boundActions[model.scope] = bindModelActions(model, store.dispatch)
    }
  }

  store.ensureHandlersInjected = model => {
    if (!store.boundActions[model.scope]) {
      store.boundHandlers[model.scope] = bindModelHandlers(model, store.dispatch)
    }
  }

  store.ensureReducersInjected = model => {
    if (!store.injectedReducers[model.scope] && !store.staticReducers[model.scope]) {
      store.injectedReducers[model.scope] = model.reducer as any

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
