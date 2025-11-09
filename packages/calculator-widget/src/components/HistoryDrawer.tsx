import type { HistoryEntry } from '../types'

type HistoryDrawerProps = {
  open: boolean
  history: HistoryEntry[]
  onClose: () => void
  onSelect: (entry: HistoryEntry) => void
  onClear: () => void
  formatExpression: (expression: string) => string
}

const HistoryDrawer = ({
  open,
  history,
  onClose,
  onSelect,
  onClear,
  formatExpression
}: HistoryDrawerProps) => (
  <aside className={`history${open ? ' history--open' : ''}`} data-testid="history-panel">
    <div className="history__header">
      <div>
        <p className="history__title">History</p>
        <p className="history__subtitle">Tap an entry to reuse the calculation</p>
      </div>
      <div className="history__controls">
        <button type="button" onClick={onClear} disabled={!history.length}>
          Clear
        </button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
    <div className="history__body">
      {history.length === 0 ? (
        <p className="history__empty">No history yet — start calculating!</p>
      ) : (
        history.map(entry => (
          <button
            key={entry.timestamp}
            type="button"
            className="history__entry"
            onClick={() => onSelect(entry)}
          >
            <span className="history__expression">{formatExpression(entry.expression)}</span>
            <span className="history__result">{entry.result}</span>
            <span className="history__timestamp">
              {new Date(entry.timestamp).toLocaleString()}
            </span>
          </button>
        ))
      )}
    </div>
  </aside>
)

export default HistoryDrawer
