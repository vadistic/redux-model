/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useCallback, useRef } from 'react'
import { useStore, useSelector, useDispatch } from 'react-redux'
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

  if (model.useInjection) {
    store.ensureReducersInjected(model)
  }

  store.ensureActionsInjected(model)

  return store.boundActions[model.scope]
}

export const useModelHandlers = <RO extends AnyRO>(model: ModelPartial<RO>): ModelHandlers<RO> => {
  const store = useInjectableStore()

  if (model.useInjection) {
    store.ensureReducersInjected(model)
  }

  store.ensureHandlersInjected(model)

  return store.boundHandlers[model.scope]
}

export const useModelDispatch = <RO extends AnyRO>(
  model: ModelPartial<RO>,
): Dispatch<ScopedActionUnion<RO>> => {
  const dispatch = useDispatch()

  const scopedDispatch = useCallback(
    (action: AnyAction) => dispatch({ scope: model.scope, ...action }),
    [dispatch, model],
  ) as Dispatch<ScopedActionUnion<RO>>

  return scopedDispatch
}

export const useModelReset = <RO extends AnyRO>(model: ModelPartial<RO>, deps: any[]): void => {
  const initRef = useRef<boolean>(true)
  const dispatch = useModelDispatch(model)

  useMemo(() => {
    if (!initRef.current) {
      dispatch({ type: 'RESET' } as any)
    } else {
      initRef.current = false
    }
  }, [model, ...deps])
}

// ────────────────────────────────────────────────────────────────────────────────

export interface UseModel<RO extends AnyRO> {
  dispatch: Dispatch<ScopedActionUnion<RO>>
  actions: ModelActions<RO>
  handlers: ModelHandlers<RO>
}

/**
 * create useModel hook with scoped dispatch, handlers and actions
 */
export const useModel = <RO extends AnyRO>(model: ModelPartial<RO>): UseModel<RO> => {
  const store = useInjectableStore()

  const scopedDispatch = useCallback(
    (action: AnyAction) => store.dispatch({ ...action, scope: model.scope }),
    [store, model],
  ) as Dispatch<ScopedActionUnion<RO>>

  if (model.useInjection) {
    store.ensureReducersInjected(model)
  }

  store.ensureActionsInjected(model)
  store.ensureHandlersInjected(model)

  return {
    dispatch: scopedDispatch,
    actions: store.boundActions[model.scope],
    handlers: store.boundHandlers[model.scope],
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
): Select => {
  if (model.useInjection) {
    const store = useInjectableStore()

    store.ensureReducersInjected(model)
  }

  return useSelector(state =>
    select ? select((state as any)[model.scope]) : (state as any)[model.scope],
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
): Select => {
  if (model.useInjection) {
    const store = useInjectableStore()

    store.ensureReducersInjected(model)
  }

  return useSelector(state =>
    select ? select((state as any)[model.scope]) : (state as any)[model.scope],
  )
}
