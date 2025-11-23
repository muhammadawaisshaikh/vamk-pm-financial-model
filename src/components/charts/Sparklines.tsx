import React, { useLayoutEffect, useRef, useEffect } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import type { FinancialResults } from '../../utils/formulas'

const TinyLine = ({ containerRef, dataKey, label, results }: { containerRef: React.RefObject<HTMLDivElement>, dataKey: string, label: string, results: FinancialResults }) => {
  const rootRef = useRef<am5.Root | null>(null)
  const chartRef = useRef<am5xy.XYChart | null>(null)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    if (rootRef.current) return
    const root = am5.Root.new(containerRef.current)
    rootRef.current = root
    root.setThemes([am5themes_Animated.new(root)])

    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false }))
    chartRef.current = chart

    const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: 'year', renderer: am5xy.AxisRendererX.new(root, {}) }))
    const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }))

    const series = chart.series.push(am5xy.LineSeries.new(root, { name: label, xAxis, yAxis, valueYField: 'v', categoryXField: 'year' }))
    series.strokes.template.setAll({ strokeWidth: 2 })

    chart.appear()

    return () => { try { root.dispose() } catch(e){}; rootRef.current = null; chartRef.current = null }
  }, [containerRef])

  useEffect(() => {
    if (!chartRef.current) return
    const mapping: Record<string, number[]> = {
      dscr: results.rows.find(r => r.label === 'DSCR')?.values ?? [],
      irr: results.perYearIrr ?? [],
      cumulative: results.perYearCumulativeEquity ?? [],
    }
    const arr = mapping[dataKey] ?? []
    const data = arr.map((v, i) => ({ year: `Y${i+1}`, v: typeof v === 'number' && isFinite(v) ? v : 0 }))
    const xAxis = chartRef.current.xAxes.getIndex(0)
    if (xAxis) xAxis.data.setAll(data as any)
    chartRef.current.series.each((s: any) => s.data.setAll(data as any))
  }, [results, dataKey])

  return null
}

export default function Sparklines({ results }: { results: FinancialResults }){
  const refD = useRef<HTMLDivElement | null>(null)
  const refI = useRef<HTMLDivElement | null>(null)
  const refC = useRef<HTMLDivElement | null>(null)

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-3 bg-slate-100 rounded">
        <div className="text-xs text-slate-600">DSCR (per year)</div>
        <div ref={refD} style={{ width: '100%', height: 60 }} />
        <TinyLine containerRef={refD} dataKey="dscr" label="DSCR" results={results} />
      </div>
      <div className="p-3 bg-slate-100 rounded">
        <div className="text-xs text-slate-600">IRR (per year)</div>
        <div ref={refI} style={{ width: '100%', height: 60 }} />
        <TinyLine containerRef={refI} dataKey="irr" label="IRR" results={results} />
      </div>
      <div className="p-3 bg-slate-100 rounded">
        <div className="text-xs text-slate-600">Cumulative Equity</div>
        <div ref={refC} style={{ width: '100%', height: 60 }} />
        <TinyLine containerRef={refC} dataKey="cumulative" label="Cumulative" results={results} />
      </div>
    </div>
  )
}
