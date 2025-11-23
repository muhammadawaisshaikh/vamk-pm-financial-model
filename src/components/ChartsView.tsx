import React from 'react'
import { useFinanceStore } from '../store/financeStore'
import MainChart from './charts/MainChart'
import MetricsChart from './charts/MetricsChart'

export default function ChartsView(){
  const results = useFinanceStore(s => s.results)

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-2 text-lg font-semibold">Project Cash Flows (EUR)</div>
        <MainChart results={results} />
        <div className="mt-2 text-sm text-slate-500 flex justify-between">
          <div>Values: EUR</div>
          <div>Category: Year</div>
        </div>
      </div>

      <div>
        <div className="mb-2 text-lg font-semibold">Equity Metrics — NPV / IRR / Cumulative</div>
        <MetricsChart results={results} />
        <div className="mt-2 text-sm text-slate-500 flex justify-between">
          <div>Left axis: EUR (NPV & Cumulative)</div>
          <div>Right axis: IRR (%)</div>
        </div>
      </div>
    </div>
  )
}
