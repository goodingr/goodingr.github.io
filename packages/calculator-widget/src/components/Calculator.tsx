import { useCallback, useEffect, useMemo, useState } from 'react'
import { MAIN_BUTTON_ROWS, SCIENTIFIC_BUTTONS } from '../constants/buttons'
import type { CalculatorButton, HistoryEntry, InputKind } from '../types'
import {
  CalculationError,
  deleteLastToken,
  evaluateExpression,
  formatExpressionForDisplay,
  hasDecimalInCurrentNumber,
  operatorCharacters,
  simpleOperators
} from '../utils/expression'
import Display from './Display'
import HistoryDrawer from './HistoryDrawer'
import Keypad from './Keypad'

const HISTORY_STORAGE_KEY = 'portfolio-calculator-history'
const MAX_HISTORY_ITEMS = 20

const loadHistory = (): HistoryEntry[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

const Calculator = () => {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('0')
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [justEvaluated, setJustEvaluated] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const formattedExpression = useMemo(
    () => formatExpressionForDisplay(expression),
    [expression]
  )

  const appendValue = useCallback(
    (value: string, kind: InputKind) => {
      const shouldReset = justEvaluated && (kind === 'number' || kind === 'function' || kind === 'constant')

      setExpression(prevExpression => {
        let workingExpression = shouldReset ? '' : prevExpression

        if (!workingExpression && kind === 'operator' && value !== '-' && value !== '(') {
          return workingExpression
        }

        const lastChar = workingExpression.slice(-1)

        if (
          value === '.' &&
          (hasDecimalInCurrentNumber(workingExpression) || lastChar === '.')
        ) {
          return workingExpression
        }

        let valueToAppend = value
        const needsLeadingZero =
          value === '.' &&
          (!workingExpression ||
            operatorCharacters.includes(lastChar) ||
            lastChar === '(' ||
            lastChar === ',')

        if (value === '.' && needsLeadingZero) {
          valueToAppend = '0.'
        }

        if (
          kind === 'operator' &&
          simpleOperators.includes(value) &&
          simpleOperators.includes(lastChar)
        ) {
          return `${workingExpression.slice(0, -1)}${value}`
        }

        return `${workingExpression}${valueToAppend}`
      })

      setError(null)
      setJustEvaluated(false)
    },
    [justEvaluated]
  )

  const handleClear = useCallback(() => {
    setExpression('')
    setResult('0')
    setError(null)
    setJustEvaluated(false)
  }, [])

  const handleDelete = useCallback(() => {
    setExpression(prev => deleteLastToken(prev))
    setError(null)
    setJustEvaluated(false)
  }, [])

  const handleEvaluate = useCallback(() => {
    const trimmedExpression = expression.trim()

    if (!trimmedExpression) {
      setError('Enter an expression to evaluate')
      return
    }

    try {
      const evaluatedResult = evaluateExpression(trimmedExpression)

      setHistory(prev => {
        const entry: HistoryEntry = {
          expression: trimmedExpression,
          result: evaluatedResult,
          timestamp: new Date().toISOString()
        }

        return [entry, ...prev].slice(0, MAX_HISTORY_ITEMS)
      })

      setResult(evaluatedResult)
      setError(null)
      setJustEvaluated(true)
      setExpression(evaluatedResult)
    } catch (err) {
      if (err instanceof CalculationError) {
        setError(err.message)
      } else {
        setError('Unable to evaluate expression')
      }
    }
  }, [expression])

  const handleHistorySelect = useCallback((entry: HistoryEntry) => {
    setExpression(entry.expression)
    setResult(entry.result)
    setError(null)
    setJustEvaluated(true)
    setIsHistoryOpen(false)
  }, [])

  const handleHistoryClear = useCallback(() => {
    setHistory([])
    setIsHistoryOpen(false)
  }, [])

  const handleButtonPress = useCallback(
    (button: CalculatorButton) => {
      if (button.action === 'clear') {
        handleClear()
        return
      }

      if (button.action === 'delete') {
        handleDelete()
        return
      }

      if (button.action === 'evaluate') {
        handleEvaluate()
        return
      }

      if (button.kind === 'utility') {
        return
      }

      appendValue(button.value ?? button.label, button.kind as InputKind)
    },
    [appendValue, handleClear, handleDelete, handleEvaluate]
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      const { key } = event

      if (/^\d$/.test(key)) {
        appendValue(key, 'number')
        return
      }

      if (key === '.') {
        event.preventDefault()
        appendValue('.', 'number')
        return
      }

      const operatorMap: Record<string, string> = {
        '+': '+',
        '-': '-',
        '*': '*',
        '/': '/',
        '^': '^'
      }

      if (operatorMap[key]) {
        event.preventDefault()
        appendValue(operatorMap[key], 'operator')
        return
      }

      if (key === '(' || key === ')' || key === ',') {
        event.preventDefault()
        appendValue(key, 'operator')
        return
      }

      if (key === 'Enter' || key === '=') {
        event.preventDefault()
        handleEvaluate()
        return
      }

      if (key === 'Backspace') {
        event.preventDefault()
        handleDelete()
        return
      }

      if (key === 'Delete' || key === 'Escape') {
        event.preventDefault()
        handleClear()
        return
      }

      if (key === 'p' || key === 'P') {
        event.preventDefault()
        appendValue('pi', 'constant')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [appendValue, handleClear, handleDelete, handleEvaluate])

  return (
    <section className="calculator" aria-label="Scientific calculator">
      <div className="calculator__header">
        <div>
          <p className="calculator__title">Scientific Calculator</p>
          <p className="calculator__subtitle">
            Responsive React calculator with persistent history and keyboard support.
          </p>
        </div>
        <button
          type="button"
          className="history-toggle"
          onClick={() => setIsHistoryOpen(open => !open)}
          data-testid="history-toggle"
        >
          {isHistoryOpen ? 'Hide history' : 'Show history'}
        </button>
      </div>

      <Display expression={formattedExpression} result={result} error={error} />

      <Keypad
        scientificButtons={SCIENTIFIC_BUTTONS}
        mainButtonRows={MAIN_BUTTON_ROWS}
        onPress={handleButtonPress}
      />

      <p className="calculator__hint">
        Tip: use the comma to separate values for n√. Example: <code>nthRoot(27, 3)</code>.
      </p>

      {isHistoryOpen && (
        <HistoryDrawer
          open={isHistoryOpen}
          history={history}
          onClose={() => setIsHistoryOpen(false)}
          onClear={handleHistoryClear}
          onSelect={handleHistorySelect}
          formatExpression={formatExpressionForDisplay}
        />
      )}
    </section>
  )
}

export default Calculator
