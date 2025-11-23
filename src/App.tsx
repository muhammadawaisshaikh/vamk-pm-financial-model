import React from 'react'
import InputForm from './components/InputForm'
import ResultsTable from './components/ResultsTable'
import ChartsView from './components/ChartsView'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/VAMK_logo.png/500px-VAMK_logo.png"
                alt="VAMK (Vaasa University of Applied Sciences)"
                className="w-14 h-14"
              />
              <div>
                <h1 className="text-2xl font-semibold">VAMK PM Financial Model</h1>
                <p className="text-sm text-slate-600">Interactive financial model with real-time calculations and charts</p>
              </div>
            </div>

            <a
              href="https://www.linkedin.com/in/muhammadawaisshaikh/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded hover:shadow-md"
              title="Muhammad Awais — LinkedIn"
            >
              <img
                src="https://i.ibb.co/6yQQF1y/1670522766188-1.jpg"
                alt="Muhammad Awais"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-right">
                <div className="text-sm font-medium">Developed by: Muhammad Awais</div>
                <div className="text-xs text-slate-500">Master of Engineering (PM2025)</div>
              </div>
            </a>
          </div>
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
