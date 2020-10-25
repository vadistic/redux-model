import { render, screen } from '@testing-library/react'
import event from '@testing-library/user-event'
import React from 'react'

import { AppComponent, TEST_IDS } from './fixture/app.fixture'
import { getState } from './fixture/store'

// FIXME: mv to setupTests
import '@testing-library/jest-dom'

describe('setup store', () => {
  test('renders', () => {
    render(<AppComponent />)

    expect(screen.getByText('Fixture')).toBeTruthy()
  })

  test('counter model actions', () => {
    render(<AppComponent />)

    expect(getState().counter.count).toBe(0)

    event.click(screen.getByTestId(TEST_IDS.UNARY_BUTTON))

    expect(getState().counter.count).toBe(1)

    event.click(screen.getByTestId(TEST_IDS.OPTIONAL_BUTTON_1))

    expect(getState().counter.count).toBe(2)

    event.click(screen.getByTestId(TEST_IDS.OPTIONAL_BUTTON_2))

    expect(getState().counter.count).toBe(3)

    event.click(screen.getByTestId(TEST_IDS.REQUIRED_BUTTON))

    expect(getState().counter.count).toBe(4)
  })

  test('message valilla actions', () => {
    render(<AppComponent />)

    expect(getState().message.value).toBe(undefined)

    event.type(screen.getByTestId(TEST_IDS.MESSAGE_INPUT), 'hello')

    expect(getState().message.value).toBe('hello')

    event.click(screen.getByTestId(TEST_IDS.RESET_MESSAGE_BUTTON))

    expect(getState().message.value).toBe(undefined)
  })
})
