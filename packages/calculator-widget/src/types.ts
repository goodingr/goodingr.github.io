export type ButtonKind = 'number' | 'operator' | 'function' | 'constant' | 'utility'

export type ButtonAction = 'clear' | 'delete' | 'evaluate'

export interface CalculatorButton {
  label: string
  kind: ButtonKind
  value?: string
  action?: ButtonAction
  span?: number
  ariaLabel?: string
}

export interface HistoryEntry {
  expression: string
  result: string
  timestamp: string
}

export type InputKind = Exclude<ButtonKind, 'utility'>
