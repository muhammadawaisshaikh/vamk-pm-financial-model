import React from 'react'
import { useFinanceStore } from '../store/financeStore'

const NumberInput: React.FC<{label: string; value: number; step?: number; onChange: (v:number)=>void}> = ({label, value, step = 0.01, onChange}) => (
  <label className="block mb-3">
    <span className="text-sm text-slate-700">{label}</span>
    <input
      type="number"
      step={step}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="mt-1 block w-full rounded border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2"
    />
  </label>
)

export default function InputForm(){
  const inputs = useFinanceStore(s => s.inputs)
  const setInput = useFinanceStore(s => s.setInput)

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 shadow-md border border-slate-100" style={{ borderRadius: '5px' }}>
          <div className="text-sm font-semibold mb-2">Project Parameters</div>
          <div className="grid grid-cols-1 gap-4">
            <NumberInput label="Capacity Factor (decimal)" value={inputs.capacityFactor} step={0.01} onChange={v => setInput('capacityFactor', v)} />
            <NumberInput label="Size of Turbine (kW)" value={inputs.sizeKW} step={1} onChange={v => setInput('sizeKW', Math.max(0, Math.round(v)))} />
            <NumberInput label="Hours in Year" value={inputs.hoursInYear} step={1} onChange={v => setInput('hoursInYear', Math.max(1, Math.round(v)))} />
            <NumberInput label="Availability Rate (decimal)" value={inputs.availabilityRate} step={0.001} onChange={v => setInput('availabilityRate', v)} />
            <NumberInput label="Feed-in Tariff (EUR/kWh)" value={inputs.fit} step={0.001} onChange={v => setInput('fit', v)} />
          </div>

          <div className="grid grid-cols-1 gap-4 mt-3">
            <NumberInput label="Inflation of FIT (decimal)" value={inputs.inflationFit} step={0.001} onChange={v => setInput('inflationFit', v)} />
            <NumberInput label="Inflation of OPEX (decimal)" value={inputs.inflationOpex} step={0.001} onChange={v => setInput('inflationOpex', v)} />
          </div>
          </div>

          <div className="bg-white p-4 shadow-md border border-slate-100" style={{ borderRadius: '5px' }}>
          <div className="text-sm font-semibold mb-2">Capital Expenditure (CAPEX)</div>
          <div className="grid grid-cols-1 gap-4">
            <NumberInput label="Turbines & Transformer" value={inputs.capexTurbinesTransformer} step={1} onChange={v => setInput('capexTurbinesTransformer', Math.max(0, Math.round(v)))} />
            <NumberInput label="Foundations & Infrastructure" value={inputs.capexFoundations} step={1} onChange={v => setInput('capexFoundations', Math.max(0, Math.round(v)))} />
            <NumberInput label="Internal Cables & Grid" value={inputs.capexInternalCables} step={1} onChange={v => setInput('capexInternalCables', Math.max(0, Math.round(v)))} />
            <NumberInput label="Permits, Legal & Financing" value={inputs.capexPermitsLegalFinancing} step={1} onChange={v => setInput('capexPermitsLegalFinancing', Math.max(0, Math.round(v)))} />
          </div>
          </div>

          <div className="bg-white p-4 shadow-md border border-slate-100" style={{ borderRadius: '5px' }}>
          <div className="text-sm font-semibold mb-2">Operational Expenditure (OPEX)</div>
          <div className="grid grid-cols-1 gap-4">
            <NumberInput label="Repairs & Maintenance (pct of capex, decimal)" value={inputs.repairsPct} step={0.001} onChange={v => setInput('repairsPct', v)} />
            <NumberInput label="Insurance" value={inputs.insurance} step={1} onChange={v => setInput('insurance', v)} />
            <NumberInput label="Spare Parts" value={inputs.spareParts} step={1} onChange={v => setInput('spareParts', v)} />
            <NumberInput label="Management & Administration" value={inputs.management} step={1} onChange={v => setInput('management', v)} />
          </div>
          </div>

          <div className="bg-white p-4 shadow-md border border-slate-100" style={{ borderRadius: '5px' }}>
          <div className="text-sm font-semibold mb-2">Financial Structure</div>
          <div className="grid grid-cols-1 gap-4">
            <NumberInput label="Debt Ratio (decimal)" value={inputs.debtRatio} step={0.01} onChange={v => setInput('debtRatio', v)} />
            <NumberInput label="Equity Ratio (decimal)" value={inputs.equityRatio} step={0.01} onChange={v => setInput('equityRatio', v)} />
            <NumberInput label="Interest Rate (decimal)" value={inputs.interestRate} step={0.001} onChange={v => setInput('interestRate', v)} />
            <NumberInput label="Tax Rate (decimal)" value={inputs.taxRate} step={0.001} onChange={v => setInput('taxRate', v)} />
            <NumberInput label="Repayment Period (years)" value={inputs.repaymentPeriod} step={1} onChange={v => setInput('repaymentPeriod', Math.max(1, Math.round(v)))} />
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
