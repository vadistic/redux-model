/*
 * RO = ReactionObject
 */

export interface ModelOptions<RO extends AnyRO> {
  scope: string
  reactions: RO
  init: InferROState<RO>
  useImmer?: boolean
  useInjection?: boolean
}

export interface ModelPartial<RO extends AnyRO> extends ModelOptions<RO> {
  reducer: ModelReducer<RO>
  actions: ModelActions<RO>
}

export interface Model<RO extends AnyRO> extends ModelOptions<RO> {
  reducer: ModelReducer<RO>
  actions: ModelActions<RO>
}

// ────────────────────────────────────────────────────────────────────────────────

/** take reactions and get actions type */
export type ModelActions<RO extends AnyRO> = {
  [Type in keyof RO]: ModelAction<Type, RO[Type]>
}

/** take reactions and get handlers type */
export type ModelHandlers<RO extends AnyRO> = {
  [Type in keyof RO]: ModelHandler<Type, RO[Type]>
}

/** take reactions and get reducer type */
export type ModelReducer<RO extends AnyRO> = (
  state: InferROState<RO> | undefined,
  action: ActionUnion<RO>,
) => InferROState<RO>

/** create actions from reaction object */
export type ModelAction<Type, Reaction> = Reaction extends (state: any, payload: void) => any
  ? // no payload
    () => { type: Type; payload: undefined }
  : Reaction extends (state: any, payload: infer P | undefined) => any
  ? // optional payload
    (payload?: P) => { type: Type; payload: P | undefined }
  : Reaction extends (state: any, payload: infer P) => any
  ? // required payload
    (payload: P) => { type: Type; payload: P }
  : void

/** create handlers from reaction object */
export type ModelHandler<Type, Reaction> = Reaction extends (state: any, payload: void) => any
  ? // no payload
    () => () => { type: Type; payload: undefined }
  : Reaction extends (state: any, payload: infer P | undefined) => any
  ? // optional payload
    (payload?: P) => () => { type: Type; payload: P | undefined }
  : Reaction extends (state: any, payload: infer P) => any
  ? // required payload
    (payload: P) => () => { type: Type; payload: P }
  : void

// ────────────────────────────────────────────────────────────────────────────────

export type VoidReaction<S = any> = (state: S) => S | undefined
export type OptionalReaction<S = any, P = any> = (state: S, payload?: P) => S
export type RequiredReaction<S = any, P = any> = (state: S, payload: P) => S

export type AnyRO = {
  [type: string]: VoidReaction | OptionalReaction | RequiredReaction
}

// ────────────────────────────────────────────────────────────────────────────────

export type InferReactionPayload<Reaction> = Reaction extends VoidReaction
  ? undefined
  : Reaction extends RequiredReaction<any, infer P>
  ? P
  : void

export type InferReactionState<Reaction> = Reaction extends (state: infer S) => any
  ? S
  : Reaction extends (state: infer S, payload: any) => any
  ? S
  : never

export type InferROState<RO extends AnyRO> = {
  [Type in keyof RO]: InferReactionState<RO[Type]>
}[keyof RO]

// ────────────────────────────────────────────────────────────────────────────────

/** take reactions and actions union type */
export type ActionUnion<RO extends AnyRO> = {
  [Type in keyof RO]: {
    type: Type
    payload: InferReactionPayload<RO[Type]>
    scope: string
  }
}[keyof RO]

/** take reactions and actions union type without required scope prop */
export type ScopedActionUnion<RO extends AnyRO> = {
  [Type in keyof RO]: {
    type: Type
    payload: InferReactionPayload<RO[Type]>
    scope?: string
  }
}[keyof RO]
