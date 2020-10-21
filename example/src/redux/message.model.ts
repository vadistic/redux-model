// CLASSIC REDUX REDUCER

export interface MessageState {
  message?: string
}

const messageInit: MessageState = {
  message: 'INIT',
}

export const messageReducer = (state = messageInit, action: any) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return { ...state, message: action.payload }
    case 'RESET_MESSAGE':
      return { ...state, message: undefined }
    default:
      return state
  }
}
