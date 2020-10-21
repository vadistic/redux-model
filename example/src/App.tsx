import React from 'react'
import './App.css'
import { Counter } from './components/Counter'

export const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>@vadistic/redux-model example</h1>

        <Counter />
      </header>
    </div>
  )
}
