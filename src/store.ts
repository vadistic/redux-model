import { combineReducers } from 'redux'
import type { Store, Reducer, AnyAction } from 'redux'

import { bindModelActions, bindModelHandlers } from './model'
import { AnyRO, ModelActions, ModelHandlers, ModelPartial } from './types'

export interface InjectableStore<S = any, A extends AnyAction = AnyAction> extends Store<S, A> {
  injectedReducers: Record<string, Reducer>
  staticReducers: Record<string, Reducer>

  boundActions: Record<string, any>
  boundHandlers: Record<string, any>

  areActionsInjected: (scope: string) => boolean
  areHandlersInjected: (scope: string) => boolean

  ensureReducersInjected: (model: ModelPartial<any>) => void

  getBoundActions: <RO extends AnyRO>(model: ModelPartial<RO>) => ModelActions<RO>
  getBoundHandlers: <RO extends AnyRO>(model: ModelPartial<RO>) => ModelHandlers<RO>
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

  store.areActionsInjected = key => !!store.boundActions[key]
  store.areHandlersInjected = key => !!store.boundActions[key]

  store.getBoundActions = model => {
    store.ensureReducersInjected(model)

    if (!store.boundActions[model.scope]) {
      store.boundActions[model.scope] = bindModelActions(model, store.dispatch)
    }

    return store.boundActions[model.scope]
  }

  store.getBoundHandlers = model => {
    store.ensureReducersInjected(model)

    if (!store.boundHandlers[model.scope]) {
      store.boundHandlers[model.scope] = bindModelHandlers(model, store.dispatch)
    }

    return store.boundHandlers[model.scope]
  }

  store.ensureReducersInjected = model => {
    if (!store.injectedReducers[model.scope] && !store.staticReducers[model.scope]) {
      if (!model.useInjection) {
        throw Error(
          `redux-model auto-injection is disabled & there is no reducers for "${model.scope}" scope`,
        )
      }

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
