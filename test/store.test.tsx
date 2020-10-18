import { render, screen } from '@testing-library/react'
import event from '@testing-library/user-event'
import React from 'react'

import { Fixture, getState } from './fixture'

// TODO: setupTests
import '@testing-library/jest-dom'

describe('setup store', () => {
  test('works', () => {
    const app = render(<Fixture />)

    expect(app.getByText('Fixture')).toBeTruthy()

    const button = screen.getByTestId('increment-button')

    expect(getState().test.value).toBe(0)
    event.click(button)
    expect(getState().test.value).toBe(1)
  })
})
