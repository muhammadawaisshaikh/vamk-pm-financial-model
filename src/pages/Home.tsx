import React from 'react'
import InputForm from '../components/InputForm'
import ResultsTable from '../components/ResultsTable'
import ChartsView from '../components/ChartsView'

export default function Home() {
    return (
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
    )
}
