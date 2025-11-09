import React from 'react'
import ReactDOM from 'react-dom/client'
import { initAnalytics } from '@portfolio/analytics'
import App from './App'
import './index.css'

initAnalytics()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
