import { combineReducers } from 'redux';
import type { Store, Reducer, AnyAction } from 'redux';

import { bindModelActions, bindModelHandlers } from './model';
import { AnyRO } from './types';

export interface InjectableStore<S = any, A extends AnyAction = AnyAction> extends Store<S, A> {
  injectedReducers: Record<string, Reducer>;
  staticReducers: Record<string, Reducer>;

  boundActions: Record<string, any>;
  boundHandlers: Record<string, any>;

  injectReducer: (scope: string, reducer: Reducer<any, any>) => void;
  injectReactions: (scope: string, reactions: AnyRO) => void;

  injectionStatus: (scope: string) => boolean;
}

/**
 *  @see https://redux.js.org/recipes/code-splitting
 */
export const setupInjectableStore = <S, A extends AnyAction>(
  store: Store<S, A>,
  staticReducers: Record<string, Reducer<any, any>>,
) => {
  const _store = store as InjectableStore<S, A>;

  _store.boundActions = {};
  _store.boundHandlers = {};

  _store.injectedReducers = {};
  _store.staticReducers = staticReducers;

  _store.injectionStatus = key => !!_store.injectedReducers[key];

  _store.injectReactions = (scope, reactions) => {
    if (!_store.boundActions[scope]) {
      _store.boundActions[scope] = bindModelActions(scope, reactions, _store.dispatch);
    }

    if (!_store.boundHandlers[scope]) {
      _store.boundHandlers[scope] = bindModelHandlers(scope, reactions, _store.dispatch);
    }
  };

  _store.injectReducer = (key, asyncReducer) => {
    if (!_store.injectedReducers[key]) {
      _store.injectedReducers[key] = asyncReducer;

      _store.replaceReducer(
        combineReducers({
          ..._store.staticReducers,
          ..._store.injectedReducers,
        }) as any,
      );
    }
  };

  return _store;
};
