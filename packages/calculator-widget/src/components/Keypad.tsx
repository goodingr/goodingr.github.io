import type { CalculatorButton } from '../types'

type KeypadProps = {
  scientificButtons: CalculatorButton[]
  mainButtonRows: CalculatorButton[][]
  onPress: (button: CalculatorButton) => void
}

const buildClassName = (button: CalculatorButton) => {
  const classes = ['keypad__button']

  if (button.action === 'evaluate') {
    classes.push('keypad__button--equals')
  } else if (button.action) {
    classes.push('keypad__button--utility')
  } else if (button.kind === 'operator') {
    classes.push('keypad__button--operator')
  } else if (button.kind === 'function' || button.kind === 'constant') {
    classes.push('keypad__button--function')
  }

  return classes.join(' ')
}

const Keypad = ({ scientificButtons, mainButtonRows, onPress }: KeypadProps) => (
  <div className="keypad">
    <div className="keypad__scientific" aria-label="Scientific operations">
      {scientificButtons.map(button => (
        <button
          key={button.label}
          type="button"
          className={buildClassName(button)}
          onClick={() => onPress(button)}
          aria-label={button.ariaLabel ?? button.label}
        >
          {button.label}
        </button>
      ))}
    </div>
    <div className="keypad__main" aria-label="Calculator keypad">
      {mainButtonRows.map((row, rowIndex) =>
        row.map(button => (
          <button
            key={`${button.label}-${rowIndex}`}
            type="button"
            className={buildClassName(button)}
            onClick={() => onPress(button)}
            aria-label={button.ariaLabel ?? button.label}
            style={button.span ? { gridColumn: `span ${button.span}` } : undefined}
            data-action={button.action}
          >
            {button.label}
          </button>
        ))
      )}
    </div>
  </div>
)

export default Keypad
