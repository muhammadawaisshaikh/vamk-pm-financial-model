import React, { useLayoutEffect, useRef, useEffect } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import { FinancialResults } from '../../utils/formulas'

function toNum(v: any){ return typeof v === 'number' && isFinite(v) ? v : 0 }

export default function CashflowWaterfall({ results }: { results: FinancialResults }){
  const divRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<am5.Root | null>(null)
  const chartRef = useRef<am5xy.XYChart | null>(null)

  useLayoutEffect(() => {
    if (!divRef.current) return
    if (rootRef.current) return

    const root = am5.Root.new(divRef.current)
    rootRef.current = root
    root.setThemes([am5themes_Animated.new(root)])

    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false }))
    chartRef.current = chart

    const xRenderer = am5xy.AxisRendererX.new(root, {})
    const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: 'category', renderer: xRenderer }))
    const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }))

    const series = chart.series.push(am5xy.ColumnSeries.new(root, { name: 'amount', xAxis, yAxis, valueYField: 'value', categoryXField: 'category' }))
    series.columns.template.setAll({ tooltipText: '{category}: {valueY.formatNumber(#,###)}' })

    const line = chart.series.push(am5xy.LineSeries.new(root, { name: 'cumulative', xAxis, yAxis, valueYField: 'cumulative', categoryXField: 'category' }))
    line.strokes.template.setAll({ strokeWidth: 2 })

    const legend = chart.children.push(am5.Legend.new(root, {}))
    legend.data.setAll([series, line] as any)

    chart.appear()

    return () => { try { root.dispose() } catch(e){}; rootRef.current = null; chartRef.current = null }
  }, [])

  useEffect(() => {
    if (!chartRef.current) return

    // compute totals across all years
    const getRow = (label: string) => results.rows.find(r => r.label === label)
    const revenue = (getRow('Revenue')?.values ?? []).reduce((s, v) => s + toNum(v), 0)
    const totalOpex = (getRow('Total OPEX')?.values ?? []).reduce((s, v) => s + toNum(v), 0)
    const interest = (getRow('Interest Expense')?.values ?? []).reduce((s, v) => s + toNum(v), 0)
    const tax = (getRow('Tax')?.values ?? []).reduce((s, v) => s + toNum(v), 0)
    const principal = (getRow('Principal Repayment')?.values ?? []).reduce((s, v) => s + toNum(v), 0)
    const freeCash = (getRow('Free Cash Flow to Equity')?.values ?? []).reduce((s, v) => s + toNum(v), 0)

    const data = [
      { category: 'Revenue', value: revenue },
      { category: 'Total OPEX', value: -totalOpex },
      { category: 'EBIT (calc)', value: revenue - totalOpex },
      { category: 'Interest', value: -interest },
      { category: 'Tax', value: -tax },
      { category: 'Principal', value: -principal },
      { category: 'Free Cash (Equity)', value: freeCash },
    ]

    // compute cumulative
    let cum = 0
    const withCum = data.map(d => { cum += d.value; return { ...d, cumulative: cum } })

    const xAxis = chartRef.current.xAxes.getIndex(0)
    if (xAxis) xAxis.data.setAll(withCum as any)
    chartRef.current.series.each((s: any) => { s.data.setAll(withCum as any) })
  }, [results])

  return <div ref={divRef} style={{ width: '100%', height: '360px' }} />
}
