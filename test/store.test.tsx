import { render, screen } from '@testing-library/react'
import event from '@testing-library/user-event'
import React from 'react'

import { AppComponent } from './fixture/app'
import { getState } from './fixture/store'

// FIXME: mv to setupTests
import '@testing-library/jest-dom'

describe('setup store', () => {
  test('works', () => {
    const app = render(<AppComponent />)

    expect(app.getByText('Fixture')).toBeTruthy()

    const button = screen.getByTestId('increment-button')

    expect(getState().counter.count).toBe(0)
    event.click(button)
    expect(getState().counter.count).toBe(1)
  })
})
