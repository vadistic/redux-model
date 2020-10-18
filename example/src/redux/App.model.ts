import { createModel } from '@vadistic/redux-model'

export interface AppState {
  count: number
  message?: string
}

const init: AppState = {
  count: 0,
  message: undefined,
}

export const AppModel = createModel({
  scope: 'App',
  useImmer: false,
  useInjection: true,
  init,
  reactions: {
    INCREMENT: (state: AppState): AppState => {
      return {
        ...state,
        count: state.count + 1,
      }
    },
  },
})
