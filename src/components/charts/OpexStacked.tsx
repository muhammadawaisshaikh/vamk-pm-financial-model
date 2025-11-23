import React, { useLayoutEffect, useRef, useEffect } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import type { FinancialResults } from '../../utils/formulas'

export default function OpexStacked({ results }: { results: FinancialResults }){
  const divRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<am5.Root | null>(null)
  const chartRef = useRef<am5xy.XYChart | null>(null)
  const seriesRefs = useRef<Record<string, am5xy.XYSeries | null>>({})

  useLayoutEffect(() => {
    if (!divRef.current) return
    if (rootRef.current) return

    const root = am5.Root.new(divRef.current)
    rootRef.current = root
    root.setThemes([am5themes_Animated.new(root)])

    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: true, panY: true }))
    chartRef.current = chart

    const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: 'year', renderer: am5xy.AxisRendererX.new(root, {}) }))
    const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }))

    const makeStackCol = (field: string, name: string) => {
      const s = chart.series.push(am5xy.ColumnSeries.new(root, { name, xAxis, yAxis, valueYField: field, categoryXField: 'year' }))
      ;(s as any).set('stacked', true)
      s.columns.template.setAll({ tooltipText: '{name}: {valueY}' })
      s.appear()
      return s
    }

    const revenueLine = chart.series.push(am5xy.LineSeries.new(root, { name: 'Revenue', xAxis, yAxis, valueYField: 'revenue', categoryXField: 'year' }))
    revenueLine.strokes.template.setAll({ strokeWidth: 2 })

    seriesRefs.current.repairs = makeStackCol('repairs', 'Repairs & Maintenance')
    seriesRefs.current.insurance = makeStackCol('insurance', 'Insurance')
    seriesRefs.current.spare = makeStackCol('spare', 'Spare Parts')
    seriesRefs.current.management = makeStackCol('management', 'Management')

    const legend = chart.children.push(am5.Legend.new(root, {}))
    // place legend below chart and add padding to avoid overlap
    legend.set('y', am5.percent(100))
    legend.set('centerX', am5.percent(50))
    legend.set('x', am5.percent(50))
    chart.set('paddingBottom', 70)
    legend.data.setAll([revenueLine, ...Object.values(seriesRefs.current).filter(Boolean) as any])

    // hide internal labels/ticks that can overlay when space is tight
    try { (xAxis.get('renderer') as any).labels.template.set('visible', true) } catch (e) {}
    try { (yAxis.get('renderer') as any).labels.template.set('visible', true) } catch (e) {}

    chart.appear()

    return () => { try { root.dispose() } catch(e) {} ; rootRef.current = null; chartRef.current = null }
  }, [])

  useEffect(() => {
    if (!chartRef.current) return
    const revenueRow = results.rows.find(r => r.label === 'Revenue')
    const repairsRow = results.rows.find(r => r.label === 'Repairs & Maintenance')
    const insuranceRow = results.rows.find(r => r.label === 'Insurance')
    const spareRow = results.rows.find(r => r.label === 'Spare Parts')
    const managementRow = results.rows.find(r => r.label === 'Management')

    const n = Math.max(revenueRow?.values.length ?? 0, repairsRow?.values.length ?? 0)
    const data: Array<Record<string, any>> = []
    for (let i = 0; i < n; i++) {
      data.push({ year: `Y${i+1}`, revenue: revenueRow?.values[i] ?? 0, repairs: repairsRow?.values[i] ?? 0, insurance: insuranceRow?.values[i] ?? 0, spare: spareRow?.values[i] ?? 0, management: managementRow?.values[i] ?? 0 })
    }

    const xAxis = chartRef.current.xAxes.getIndex(0)
    if (xAxis) xAxis.data.setAll(data as any)
    Object.entries(seriesRefs.current).forEach(([_, s]) => { if (s) (s as any).data.setAll(data as any) })
    // set revenue line
    const revenueSeries = chartRef.current.series.values.find((s: any) => s.get('name') === 'Revenue')
    if (revenueSeries) revenueSeries.data.setAll(data as any)
  }, [results])

  return <div ref={divRef} style={{ width: '100%', height: '360px' }} />
}
