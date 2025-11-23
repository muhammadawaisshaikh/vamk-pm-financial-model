import React from 'react'
import { useFinanceStore } from '../store/financeStore'
import MainChart from './charts/MainChart'
import MetricsChart from './charts/MetricsChart'
import BreakdownDonut from './charts/BreakdownDonut'
import OpexStacked from './charts/OpexStacked'
import CashflowWaterfall from './charts/CashflowWaterfall'
import Sparklines from './charts/Sparklines'

export default function ChartsView(){
  const results = useFinanceStore(s => s.results)

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="mb-2 text-lg font-semibold">Project Cash Flows (EUR)</div>
          <MainChart results={results} />
          <div className="mt-2 text-sm text-slate-500 flex justify-between">
            <div>Values: EUR</div>
            <div>Category: Year</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="mb-2 text-lg font-semibold">Equity Metrics — NPV / IRR / Cumulative</div>
          <MetricsChart results={results} />
          <div className="mt-2 text-sm text-slate-500 flex justify-between">
            <div>Left axis: EUR (NPV & Cumulative)</div>
            <div>Right axis: IRR (%)</div>
          </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-2 text-lg font-semibold">CAPEX Breakdown</div>
            <BreakdownDonut />
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-2 text-lg font-semibold">OPEX Composition</div>
            <OpexStacked results={results} />
          </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-2 text-lg font-semibold">Project Cashflow Waterfall (Totals)</div>
            <CashflowWaterfall results={results} />
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-2 text-lg font-semibold">Quick Metric Sparklines</div>
            <Sparklines results={results} />
          </div>
        </div>
      </div>
    </div>
  )
}
