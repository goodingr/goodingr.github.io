import { all, create } from 'mathjs'

const math = create(all, {
  number: 'number',
  precision: 14
})

const FORMAT_OPTIONS = {
  precision: 12,
  lowerExp: -6,
  upperExp: 12
}

const FUNCTION_TOKENS = [
  'nthRoot(',
  'log10(',
  'sqrt(',
  'sin(',
  'cos(',
  'tan(',
  'log('
]

const CONSTANT_TOKENS = ['pi']

const SIMPLE_OPERATOR_SET = new Set(['+', '-', '*', '/', '^'])
const OPERATOR_CHARACTERS = ['+', '-', '*', '/', '^', '(', ')', ',']
const BOUNDARY_REGEX = /[+\-*/^(),]/

export class CalculationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CalculationError'
  }
}

export const simpleOperators = Array.from(SIMPLE_OPERATOR_SET)
export const operatorCharacters = [...OPERATOR_CHARACTERS]

export const sanitizeExpressionForEvaluation = (expression: string): string =>
  expression
    .replace(/×|x|X/g, '*')
    .replace(/÷/g, '/')
    .replace(/−|–/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt')
    .replace(/ln\(/g, 'log(')
    .trim()

export const formatExpressionForDisplay = (expression: string): string => {
  let formatted = expression
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/pi/g, 'π')
    .replace(/sqrt/g, '√')
    .replace(/nthRoot/g, 'n√')

  // Preserve difference between natural log (log) and log10
  formatted = formatted.replace(/log10/g, 'LOG_TEN')
  formatted = formatted.replace(/log\(/g, 'ln(')
  formatted = formatted.replace(/LOG_TEN/g, 'log')

  return formatted
}

export const hasDecimalInCurrentNumber = (expression: string): boolean => {
  if (!expression) {
    return false
  }

  const segments = expression.split(BOUNDARY_REGEX)
  const lastSegment = segments.pop() ?? ''
  return lastSegment.includes('.')
}

export const deleteLastToken = (expression: string): string => {
  if (!expression) {
    return ''
  }

  for (const token of [...FUNCTION_TOKENS, ...CONSTANT_TOKENS]) {
    if (expression.endsWith(token)) {
      return expression.slice(0, -token.length)
    }
  }

  return expression.slice(0, -1)
}

export const evaluateExpression = (expression: string): string => {
  const prepared = sanitizeExpressionForEvaluation(expression)
  if (!prepared) {
    throw new CalculationError('Enter an expression to evaluate')
  }

  try {
    const value = math.evaluate(prepared)

    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        throw new CalculationError('Result is not finite')
      }

      return math.format(value, FORMAT_OPTIONS)
    }

    const valueType = math.typeOf(value)

    if (valueType === 'Complex') {
      throw new CalculationError('Result is complex')
    }

    if (valueType === 'Matrix') {
      throw new CalculationError('Expression returned a matrix - please simplify')
    }

    if (Array.isArray(value)) {
      throw new CalculationError('Expression returned a list - please simplify')
    }

    if (typeof value === 'boolean') {
      return value ? '1' : '0'
    }

    if (value && typeof value.valueOf === 'function') {
      const asNumber = Number(value.valueOf())
      if (!Number.isNaN(asNumber)) {
        return math.format(asNumber, FORMAT_OPTIONS)
      }
    }

    return String(value)
  } catch (error) {
    if (error instanceof CalculationError) {
      throw error
    }

    throw new CalculationError('Please check your expression')
  }
}
