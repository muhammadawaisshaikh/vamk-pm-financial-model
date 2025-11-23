import React from 'react'
import { useFinanceStore } from '../store/financeStore'

export default function ResultsTable(){
  const results = useFinanceStore(s => s.results)

  // determine years from first row length
  const years = results.rows.length > 0 ? results.rows[0].values.length : 0

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="p-3 bg-slate-200 rounded">
          <div className="text-xs text-slate-700">NPV (Equity)</div>
          <div className="text-lg font-medium">{results.npv.toFixed(2)}</div>
        </div>
        <div className="p-3 bg-slate-200 rounded">
          <div className="text-xs text-slate-700">IRR (Equity)</div>
          <div className="text-lg font-medium">{(results.irr*100).toFixed(2)}%</div>
        </div>
        <div className="p-3 bg-slate-200 rounded">
          <div className="text-xs text-slate-700">Cumulative Equity CF</div>
          <div className="text-lg font-medium">{results.cumulativeEquityCashFlow.toFixed(2)}</div>
        </div>
      </div>

      <table className="min-w-full divide-y divide-slate-200 table-auto">
        <thead>
          <tr className="bg-orange-600">
            <th className="px-3 py-3 text-left text-xs font-semibold text-white">Label</th>
            {Array.from({length: years}).map((_, i) => (
              <th key={i} className="px-3 py-3 text-right text-xs font-semibold text-white border-l border-orange-500">Year {i+1}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {results.rows.map(row => (
            <tr key={row.label}>
              <td className="px-3 py-2 text-sm font-medium text-white bg-orange-600">{row.label}</td>
              {row.values.map((v, i) => (
                <td key={i} className="px-3 py-2 text-sm text-right text-slate-700">{typeof v === 'number' && isFinite(v) ? v.toFixed(2) : String(v)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
