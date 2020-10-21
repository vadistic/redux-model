import { createModel } from '../../src'

export interface CounterState {
  count: number
}

export const CounterModel = createModel({
  useImmer: false,
  useInjection: true,
  scope: 'counter',
  init: { count: 0 } as CounterState,
  reactions: {
    INCREMENT: (state: CounterState): CounterState => ({ ...state, count: state.count + 1 }),
  },
})
