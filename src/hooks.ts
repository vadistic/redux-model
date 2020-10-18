/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useCallback } from 'react'
import { useDispatch, useStore, useSelector } from 'react-redux'
import { AnyAction, Dispatch } from 'redux'

import { bindModelActions, bindModelHandlers } from './model'
import { InjectableStore } from './store'
import {
  AnyRO,
  ScopedActionUnion,
  InferROState,
  ModelActions,
  ModelHandlers,
  ModelPartial,
} from './types'

const useInjectableStore = <S = any, A extends AnyAction = AnyAction>() =>
  useStore() as InjectableStore<S, A>

/**
 * registers model
 *
 * is called implicityle with any of other hooks
 */
const ensureInjection = <RO extends AnyRO>(model: ModelPartial<RO>, store: InjectableStore) => {
  if (!store.injectionStatus(model.scope)) {
    store.injectReducer(model.scope, model.reducer)
    store.injectReactions(model.scope, model.reactions)
  }
}

// ────────────────────────────────────────────────────────────────────────────────

export const useModelActions = <RO extends AnyRO>(model: ModelPartial<RO>): ModelActions<RO> => {
  if (!model.useInjection) {
    const dispatch = useDispatch()

    return useMemo(() => bindModelActions(model.scope, model.reactions, dispatch), [])
  }

  const store = useInjectableStore()

  ensureInjection(model, store)

  return store.boundActions[model.scope]
}

export const useModelHandlers = <RO extends AnyRO>(model: ModelPartial<RO>): ModelHandlers<RO> => {
  if (!model.useInjection) {
    const dispatch = useDispatch()

    return useMemo(() => bindModelHandlers(model.scope, model.reactions, dispatch), [])
  }

  const store = useStore() as InjectableStore

  ensureInjection(model, store)

  return store.boundHandlers[model.scope]
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
  const dispatch = useDispatch()

  const scopedDispatch = useCallback(
    (action: AnyAction) => dispatch({ ...action, scope: model.scope }),
    [],
  ) as Dispatch<ScopedActionUnion<RO>>

  if (!model.useInjection) {
    const actions = useMemo(() => bindModelActions(model.scope, model.reactions, dispatch), [])
    const handlers = useMemo(() => bindModelHandlers(model.scope, model.reactions, dispatch), [])

    return { dispatch: scopedDispatch, actions, handlers }
  }

  const store = useInjectableStore()

  ensureInjection(model, store)

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

    ensureInjection(model, store)
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

    ensureInjection(model, store)
  }

  return useSelector(state =>
    select ? select((state as any)[model.scope]) : (state as any)[model.scope],
  )
}
