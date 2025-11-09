import type { CalculatorButton } from '../types'

export const SCIENTIFIC_BUTTONS: CalculatorButton[] = [
  { label: 'sin', value: 'sin(', kind: 'function' },
  { label: 'cos', value: 'cos(', kind: 'function' },
  { label: 'tan', value: 'tan(', kind: 'function' },
  { label: 'π', value: 'pi', kind: 'constant', ariaLabel: 'pi' },
  { label: 'ln', value: 'log(', kind: 'function', ariaLabel: 'natural log' },
  { label: 'log', value: 'log10(', kind: 'function', ariaLabel: 'log base 10' },
  { label: '√', value: 'sqrt(', kind: 'function', ariaLabel: 'square root' },
  { label: 'n√', value: 'nthRoot(', kind: 'function', ariaLabel: 'nth root' }
]

export const MAIN_BUTTON_ROWS: CalculatorButton[][] = [
  [
    { label: 'AC', kind: 'utility', action: 'clear' },
    { label: 'DEL', kind: 'utility', action: 'delete' },
    { label: '(', value: '(', kind: 'operator' },
    { label: ')', value: ')', kind: 'operator' }
  ],
  [
    { label: '7', kind: 'number' },
    { label: '8', kind: 'number' },
    { label: '9', kind: 'number' },
    { label: '÷', value: '/', kind: 'operator', ariaLabel: 'divide' }
  ],
  [
    { label: '4', kind: 'number' },
    { label: '5', kind: 'number' },
    { label: '6', kind: 'number' },
    { label: '×', value: '*', kind: 'operator', ariaLabel: 'multiply' }
  ],
  [
    { label: '1', kind: 'number' },
    { label: '2', kind: 'number' },
    { label: '3', kind: 'number' },
    { label: '−', value: '-', kind: 'operator', ariaLabel: 'subtract' }
  ],
  [
    { label: '0', kind: 'number', span: 2 },
    { label: '.', kind: 'number' },
    { label: '+', kind: 'operator' }
  ],
  [
    { label: '^', value: '^', kind: 'operator', ariaLabel: 'power' },
    { label: ',', value: ',', kind: 'operator', ariaLabel: 'comma' },
    { label: '=', kind: 'utility', action: 'evaluate', span: 2 }
  ]
]
