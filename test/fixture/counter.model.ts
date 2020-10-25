import { createModel } from '../../src'

export interface CounterState {
  count: number
}

const init: CounterState = {
  count: 0,
}

export const CounterModel = createModel({
  useImmer: false,
  useInjection: true,
  scope: 'counter',
  init,
  reactions: {
    UNARY: (state: CounterState): CounterState => ({ ...state, count: state.count + 1 }),
    OPTIONAL: (state: CounterState, payload = 1): CounterState => ({
      ...state,
      count: state.count + payload,
    }),
    REQUIRED: (state: CounterState, payload: number): CounterState => ({
      ...state,
      count: state.count + payload,
    }),
  },
})
