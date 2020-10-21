import immer from 'immer'
import type { AnyAction, Dispatch } from 'redux'

import type {
  AnyRO,
  Model,
  ModelOptions,
  ModelActions,
  ModelHandlers,
  ModelReducer,
  ModelPartial,
} from './types'

export const createModel = <RO extends AnyRO>(options: ModelOptions<RO>): Model<RO> => {
  const reducer = createModelReducer<RO>(options)
  const actions = createModelActions<RO>(options)

  return {
    ...options,
    reducer,
    actions,
  }
}

// ────────────────────────────────────────────────────────────────────────────────

const createModelReducer = <RO extends AnyRO>({
  init,
  scope,
  reactions,
  useImmer = true,
}: ModelOptions<RO>): ModelReducer<RO> => (state: any, action: AnyAction) => {
  if (!state) return init
  if (!action.scope || action.scope !== scope) return state

  // FIXME: inject typing for default reducers
  // if (action.type === 'RESET') {
  //   return init
  // }

  // if (action.type === 'DERIVED') {
  //   return { ...state, ...action.payload }
  // }

  const reaction = reactions[action.type]

  if (!reaction) return state

  if (useImmer) {
    if (!immer) {
      throw Error(`react-model is trying to use immer but it's not installed`)
    }

    return immer(state, (draft: unknown) => reaction(draft, action.payload))
  }

  return reaction(state, action.payload)
}

const createModelActions = <RO extends AnyRO>({
  scope,
  reactions,
}: ModelOptions<RO>): ModelActions<RO> =>
  Object.keys(reactions).reduce(
    (acc, type) => ({
      ...acc,
      [type]: (payload: unknown) => ({ type, payload, scope }),
    }),
    {} as any,
  )

// ────────────────────────────────────────────────────────────────────────────────

export const bindModelActions = <RO extends AnyRO>(
  { scope, reactions }: ModelPartial<RO>,
  dispatch: Dispatch<any>,
): ModelActions<RO> =>
  Object.keys(reactions).reduce(
    (acc, type) => ({
      ...acc,
      [type]: (payload: unknown) => dispatch({ type, payload, scope }),
    }),
    {} as any,
  )

export const bindModelHandlers = <RO extends AnyRO>(
  { scope, reactions }: ModelPartial<RO>,
  dispatch: Dispatch<any>,
): ModelHandlers<RO> =>
  Object.keys(reactions).reduce(
    (acc, type) => ({
      ...acc,
      [type]: (payload: unknown) => () => dispatch({ type, payload, scope }),
    }),
    {} as any,
  )
