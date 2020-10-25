import { ModelActions } from '../src'

describe('typing', () => {
  type StateFixture = { a: number; b?: string }

  type ReactionsFixture = {
    EMPTY: (state: StateFixture) => StateFixture
    EMPTY_IMMER: (state: StateFixture) => void

    REQUIRED: (state: StateFixture, payload: number) => StateFixture
    REQUIRED_IMMER: (state: StateFixture, payload: number) => void

    OPTIONAL: (state: StateFixture, payload?: number) => StateFixture
    OPTIONAL_IMMER: (state: StateFixture, payload?: number) => void
  }

  type ActionsFixture = ModelActions<ReactionsFixture>

  const anyFn = (...args: any[]) => ({ type: 'test', payload: {} as any })

  const empty = anyFn as ActionsFixture['EMPTY']
  const emptyImmer = anyFn as ActionsFixture['EMPTY_IMMER']

  const required = anyFn as ActionsFixture['REQUIRED']
  const requiredImmer = anyFn as ActionsFixture['REQUIRED_IMMER']

  const optional = anyFn as ActionsFixture['OPTIONAL']
  const optionalImmer = anyFn as ActionsFixture['OPTIONAL_IMMER']

  // eslint-disable-next-line jest/expect-expect
  test('correct action typing', () => {
    empty().payload
    // @ts-expect-error no payload
    emptyImmer(2).type

    // @ts-expect-error required payload
    required().payload
    requiredImmer(2).type

    optional().payload
    optionalImmer(2).payload
  })
})
