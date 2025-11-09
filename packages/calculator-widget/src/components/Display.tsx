type DisplayProps = {
  expression: string
  result: string
  error?: string | null
}

const Display = ({ expression, result, error }: DisplayProps) => (
  <div className="display" aria-live="polite">
    <div className="display__expression" data-testid="display-expression">
      {expression || '0'}
    </div>
    <div
      className={`display__result${error ? ' display__result--error' : ''}`}
      data-testid="display-result"
    >
      {error ?? result}
    </div>
  </div>
)

export default Display
