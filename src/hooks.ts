/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react'
import { useStore, useSelector } from 'react-redux'
import { AnyAction, Dispatch } from 'redux'

import { InjectableStore } from './store'
import {
  AnyRO,
  ScopedActionUnion,
  InferROState,
  ModelActions,
  ModelHandlers,
  ModelPartial,
} from './types'

export const useInjectableStore = <S = any, A extends AnyAction = AnyAction>() => {
  const store = useStore() as InjectableStore<S, A>

  if (!store) {
    throw Error(`redux-model could not find redux store in context - Provider is missing, probably`)
  }

  return store
}

export const useModelActions = <RO extends AnyRO>(model: ModelPartial<RO>): ModelActions<RO> => {
  const store = useInjectableStore()

  return store.getBoundActions(model)
}

export const useModelHandlers = <RO extends AnyRO>(model: ModelPartial<RO>): ModelHandlers<RO> => {
  const store = useInjectableStore()

  return store.getBoundHandlers(model)
}

export const useModelDispatch = <RO extends AnyRO>(
  model: ModelPartial<RO>,
): Dispatch<ScopedActionUnion<RO>> => {
  const store = useInjectableStore()

  store.ensureReducersInjected(model)

  const scopedDispatch = useCallback(
    (action: AnyAction) => store.dispatch({ scope: model.scope, ...action }),
    [store, model],
  ) as Dispatch<ScopedActionUnion<RO>>

  return scopedDispatch
}

// ────────────────────────────────────────────────────────────────────────────────

export interface UseModel<RO extends AnyRO> {
  dispatch: Dispatch<ScopedActionUnion<RO>>
  actions: ModelActions<RO>
  handlers: ModelHandlers<RO>
  state: InferROState<RO>
}

/**
 * create useModel hook with scoped dispatch, handlers and actions
 */
export const useModel = <RO extends AnyRO>(model: ModelPartial<RO>): UseModel<RO> => {
  const actions = useModelActions(model)
  const handlers = useModelHandlers(model)
  const dispatch = useModelDispatch(model)

  const state = useModelSelector(model, state => state)

  return {
    actions,
    handlers,
    dispatch,
    state,
  }
}

// ────────────────────────────────────────────────────────────────────────────────

/**
 * create selector that autmagically works on model scope
 *
 * ! if not autoinjected, it assumes that `scope` is the same as property in combineReduces
 */
export const createModelSelector = <RO extends AnyRO>(model: ModelPartial<RO>) => <
  Select = InferROState<RO>
>(
  select?: (state: InferROState<RO>) => Select,
  equalityFn?: (left: Select, right: Select) => boolean,
): Select => {
  // ! hook can be in conditional because this should not change in runtime
  if (model.useInjection) {
    const store = useInjectableStore()

    store.ensureReducersInjected(model)
  }

  return useSelector(
    state => (select ? select((state as any)[model.scope]) : (state as any)[model.scope]),
    equalityFn,
  )
}

/**
 * the same as createModelSelector, but not curried
 *
 * ! if not autoinjected, it assumes that `scope` is the same as property in combineReduces
 */
export const useModelSelector = <RO extends AnyRO, Select = InferROState<RO>>(
  model: ModelPartial<RO>,
  select?: (state: InferROState<RO>) => Select,
  equalityFn?: (left: Select, right: Select) => boolean,
): Select => {
  // ! hook can be in conditional because this should not change in runtime
  if (model.useInjection) {
    const store = useInjectableStore()

    store.ensureReducersInjected(model)
  }

  return useSelector(
    state => (select ? select((state as any)[model.scope]) : (state as any)[model.scope]),
    equalityFn,
  )
}
