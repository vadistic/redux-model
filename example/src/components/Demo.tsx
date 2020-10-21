import React from 'react'

export interface DemoProps {
  title: string
  example: string
}

export const Demo: React.FC<DemoProps> = ({ children, title, example }) => {
  return (
    <div style={{ margin: '16px' }}>
      <h3>{title}</h3>
      <pre>
        <code>{`// Example\n\n` + example.trim()}</code>
      </pre>

      <div>{children}</div>
    </div>
  )
}
