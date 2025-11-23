import React from 'react'
import InputForm from './components/InputForm'
import ResultsTable from './components/ResultsTable'
import ChartsView from './components/ChartsView'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/VAMK_logo.png/500px-VAMK_logo.png" alt="VAMK (Vaasa University of Applied Sciences)" srcSet="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/VAMK_logo.png/500px-VAMK_logo.png" className="mb-4 w-32" />
          <h1 className="text-2xl font-semibold">VAMK PM Financial Model</h1>
          <p className="text-sm text-slate-600">Interactive financial model with real-time calculations and charts</p>
        </header>

        <main className="space-y-6">
          <section>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-medium mb-3">Inputs</h2>
              <InputForm />
            </div>
          </section>

          <section>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-medium mb-3">Results</h2>
              <ResultsTable />
            </div>
          </section>

          <section>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-medium mb-3">Charts</h2>
              <ChartsView />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
