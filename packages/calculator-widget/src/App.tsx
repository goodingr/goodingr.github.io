import Calculator from './components/Calculator'

const App = () => (
  <div className="calculator-shell">
    <main className="calculator-shell__content">
      <section className="calculator-shell__intro">
        <p className="calculator-shell__eyebrow">Featured project</p>
        <h1>React Scientific Calculator</h1>
        <p>
          A responsive calculator that showcases advanced math operations, keyboard input, and
          persistent history — perfect for highlighting engineering craft on your portfolio.
        </p>
      </section>
      <Calculator />
    </main>
  </div>
)

export default App
