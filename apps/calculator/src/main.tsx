import React from 'react'
import ReactDOM from 'react-dom/client'
import { CalculatorApp } from '@portfolio/calculator-widget'
import { initAnalytics, trackPageView } from '@portfolio/analytics'

initAnalytics()
trackPageView()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CalculatorApp />
  </React.StrictMode>
)
