import { describe, expect, it } from 'vitest'
import {
  CalculationError,
  deleteLastToken,
  evaluateExpression,
  formatExpressionForDisplay,
  hasDecimalInCurrentNumber
} from './expression'

describe('evaluateExpression', () => {
  it('handles operator precedence', () => {
    expect(evaluateExpression('2 + 2 * 3')).toBe('8')
  })

  it('evaluates scientific functions', () => {
    expect(evaluateExpression('sin(pi / 2)')).toBe('1')
    expect(evaluateExpression('sqrt(81)')).toBe('9')
  })

  it('computes nth roots', () => {
    expect(evaluateExpression('nthRoot(32, 5)')).toBe('2')
  })

  it('throws on non-finite results', () => {
    expect(() => evaluateExpression('1 / 0')).toThrow(CalculationError)
  })
})

describe('formatting helpers', () => {
  it('formats expression for display', () => {
    expect(formatExpressionForDisplay('2*pi + log10(100)')).toBe('2×π + log(100)')
  })

  it('detects decimals in the active number', () => {
    expect(hasDecimalInCurrentNumber('12.3+')).toBe(false)
    expect(hasDecimalInCurrentNumber('12.3')).toBe(true)
  })

  it('removes function tokens when deleting', () => {
    expect(deleteLastToken('sin(')).toBe('')
    expect(deleteLastToken('pi')).toBe('')
    expect(deleteLastToken('2+2')).toBe('2+')
  })
})
