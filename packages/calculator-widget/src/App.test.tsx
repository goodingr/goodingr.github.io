import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, beforeEach, it, expect } from 'vitest'
import App from './App'

describe('Scientific Calculator App', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('performs a basic calculation via buttons', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(screen.getByTestId('display-result')).toHaveTextContent('2')
  })

  it('evaluates scientific operations', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'sin' }))
    await user.click(screen.getByRole('button', { name: 'pi' }))
    await user.click(screen.getByRole('button', { name: ')' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(screen.getByTestId('display-result')).toHaveTextContent('1')
  })

  it('stores entries in history and reuses them', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'multiply' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    await user.click(screen.getByTestId('history-toggle'))

    const historyPanel = await screen.findByTestId('history-panel')
    expect(historyPanel).toBeInTheDocument()

    const storedEntry = await screen.findByRole('button', { name: /2×3/ })
    await user.click(storedEntry)

    expect(screen.getByTestId('display-expression')).toHaveTextContent('2×3')
    expect(screen.getByTestId('display-result')).toHaveTextContent('6')
  })

  it('accepts keyboard input', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.keyboard('4*5{Enter}')

    expect(screen.getByTestId('display-result')).toHaveTextContent('20')
  })
})
