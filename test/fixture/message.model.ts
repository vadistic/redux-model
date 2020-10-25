// CLASSIC REDUX REDUCER

export interface MessageState {
  value?: string
}

const init: MessageState = {
  value: undefined,
}

export const SET_MESSAGE = 'SET_MESSAGE' as const
export const RESET_MESSAGE = 'RESET_MESSAGE' as const

export type SetMessageAction = { type: typeof SET_MESSAGE; payload: string }
export type ResetMessageAction = { type: typeof RESET_MESSAGE; payload: undefined }

export type MessageActionUnion = SetMessageAction | ResetMessageAction

export const messageReducer = (state = init, action: MessageActionUnion): MessageState => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return { ...state, value: action.payload }
    case 'RESET_MESSAGE':
      return { ...state, value: undefined }
    default:
      return state
  }
}
