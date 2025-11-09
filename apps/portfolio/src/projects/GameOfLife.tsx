import { useCallback, useEffect, useMemo, useState } from 'react'

const ROWS = 24
const COLS = 36
const TICK_MIN = 50
const TICK_MAX = 600
const DEFAULT_SPEED = 200

type Grid = boolean[][]

type Pattern = {
  name: string
  description: string
  shape: string[]
}

const patterns: Pattern[] = [
  {
    name: 'Glider',
    description: 'Diagonal spaceship that travels across the grid forever.',
    shape: ['010', '001', '111']
  },
  {
    name: 'Lightweight spaceship',
    description: 'Fast moving pattern that leaves the original location.',
    shape: ['01111', '10001', '00001', '10010']
  },
  {
    name: 'Pulsar',
    description: 'Period-3 oscillator with a symmetrical 48-cell ring.',
    shape: [
      '0011100011100',
      '0000000000000',
      '1000010100001',
      '1000010100001',
      '1000010100001',
      '0011100011100',
      '0000000000000',
      '0011100011100',
      '1000010100001',
      '1000010100001',
      '1000010100001',
      '0000000000000',
      '0011100011100'
    ]
  },
  {
    name: 'Gosper glider gun',
    description: 'First known gun that emits a stream of gliders indefinitely.',
    shape: [
      '000000000000000000000000100000000000',
      '000000000000000000000010100000000000',
      '000000000000110000001100000000000011',
      '000000000001000100001100000000000011',
      '110000000010000010001100000000000000',
      '110000000010001011000010100000000000',
      '000000000010000010000000100000000000',
      '000000000001000100000000000000000000',
      '000000000000110000000000000000000000'
    ]
  }
]

const createEmptyGrid = (): Grid => Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => false))

const createRandomGrid = (): Grid =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => Math.random() < 0.3)
  )

const countNeighbors = (grid: Grid, row: number, col: number) => {
  let count = 0

  for (let y = -1; y <= 1; y += 1) {
    for (let x = -1; x <= 1; x += 1) {
      if (y === 0 && x === 0) continue
      const nextRow = row + y
      const nextCol = col + x
      if (nextRow >= 0 && nextRow < ROWS && nextCol >= 0 && nextCol < COLS) {
        if (grid[nextRow][nextCol]) {
          count += 1
        }
      }
    }
  }

  return count
}

const evolve = (grid: Grid): Grid => {
  const next: Grid = createEmptyGrid()

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const alive = grid[row][col]
      const neighbors = countNeighbors(grid, row, col)

      if (alive && (neighbors === 2 || neighbors === 3)) {
        next[row][col] = true
      } else if (!alive && neighbors === 3) {
        next[row][col] = true
      }
    }
  }

  return next
}

export const GameOfLife = () => {
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid())
  const [isRunning, setIsRunning] = useState(false)
  const [generation, setGeneration] = useState(0)
  const [speed, setSpeed] = useState(DEFAULT_SPEED)

  const aliveCells = useMemo(
    () => grid.reduce((total, row) => total + row.filter(Boolean).length, 0),
    [grid]
  )

  useEffect(() => {
    if (!isRunning) {
      return
    }

    const id = window.setInterval(() => {
      setGrid(current => {
        const next = evolve(current)
        setGeneration(prev => prev + 1)
        return next
      })
    }, speed)

    return () => window.clearInterval(id)
  }, [isRunning, speed])

  const toggleCell = useCallback((row: number, col: number) => {
    setGrid(current => {
      const next = current.map(innerRow => [...innerRow])
      next[row][col] = !next[row][col]
      return next
    })
  }, [])

  const handleStep = useCallback(() => {
    setGrid(current => {
      const next = evolve(current)
      setGeneration(prev => prev + 1)
      return next
    })
  }, [])

  const handleClear = useCallback(() => {
    setIsRunning(false)
    setGrid(createEmptyGrid())
    setGeneration(0)
  }, [])

  const handleRandomize = useCallback(() => {
    setIsRunning(false)
    setGrid(createRandomGrid())
    setGeneration(0)
  }, [])

  const handleApplyPattern = useCallback((pattern: Pattern) => {
    setIsRunning(false)
    setGrid(() => {
      const next = createEmptyGrid()
      const patternRows = pattern.shape.length
      const patternCols = pattern.shape[0]?.length ?? 0
      const rowOffset = Math.max(0, Math.floor((ROWS - patternRows) / 2))
      const colOffset = Math.max(0, Math.floor((COLS - patternCols) / 2))

      pattern.shape.forEach((rowString, rowIdx) => {
        rowString.split('').forEach((cell, colIdx) => {
          if (cell === '1') {
            const targetRow = rowOffset + rowIdx
            const targetCol = colOffset + colIdx
            if (targetRow < ROWS && targetCol < COLS) {
              next[targetRow][targetCol] = true
            }
          }
        })
      })

      return next
    })
    setGeneration(0)
  }, [])

  return (
    <div className="life">
      <div className="life__controls">
        <div className="life__buttons">
          <button type="button" onClick={() => setIsRunning(running => !running)}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button type="button" onClick={handleStep} disabled={isRunning}>
            Step
          </button>
          <button type="button" onClick={handleRandomize}>
            Randomize
          </button>
          <button type="button" onClick={handleClear}>
            Clear
          </button>
        </div>
        <label className="life__slider">
          Speed ({speed}ms)
          <input
            type="range"
            min={TICK_MIN}
            max={TICK_MAX}
            value={speed}
            onChange={event => setSpeed(Number(event.target.value))}
          />
        </label>
        <div className="life__stats">
          <p>Generation: {generation.toLocaleString()}</p>
          <p>Alive cells: {aliveCells.toLocaleString()}</p>
        </div>
      </div>
      <div className="life__presets">
        <p className="life__section-label">Example patterns</p>
        <div className="life__preset-buttons">
          {patterns.map(pattern => (
            <button key={pattern.name} type="button" onClick={() => handleApplyPattern(pattern)}>
              {pattern.name}
            </button>
          ))}
        </div>
      </div>
      <div
        className="life__grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <button
              key={`${rowIdx}-${colIdx}`}
              type="button"
              className={`life__cell${cell ? ' life__cell--alive' : ''}`}
              onClick={() => toggleCell(rowIdx, colIdx)}
            />
          ))
        )}
      </div>
      <section className="life__rules">
        <div>
          <h3>Rules</h3>
          <ul>
            <li>Any live cell with fewer than two live neighbours dies (underpopulation).</li>
            <li>Any live cell with two or three neighbours survives.</li>
            <li>Any live cell with more than three neighbours dies (overpopulation).</li>
            <li>Any dead cell with exactly three neighbours becomes a live cell (reproduction).</li>
          </ul>
        </div>
        <div>
          <h3>Pattern notes</h3>
          <ul>
            {patterns.map(pattern => (
              <li key={pattern.name}>
                <strong>{pattern.name}:</strong> {pattern.description}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
