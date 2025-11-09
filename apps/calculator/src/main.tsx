import React from 'react'
import ReactDOM from 'react-dom/client'
import { CalculatorApp } from '@portfolio/calculator-widget'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CalculatorApp />
  </React.StrictMode>
)
