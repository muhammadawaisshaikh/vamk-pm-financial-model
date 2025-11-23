import React, { useLayoutEffect, useRef, useEffect } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import { useFinanceStore } from '../store/financeStore'

export default function ChartsView(){
  const chartDivRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<am5.Root | null>(null)
  const chartRef = useRef<am5xy.XYChart | null>(null)
  const cashSeriesRef = useRef<am5xy.ColumnSeries | null>(null)
  const principalSeriesRef = useRef<am5xy.ColumnSeries | null>(null)
  const cumSeriesRef = useRef<am5xy.LineSeries | null>(null)

  const results = useFinanceStore(s => s.results)

  // create chart once
  useLayoutEffect(() => {
    if (!chartDivRef.current) return
    // avoid creating multiple roots on the same DOM node
    if (rootRef.current) return

    const root = am5.Root.new(chartDivRef.current)
    rootRef.current = root
    root.setThemes([am5themes_Animated.new(root)])

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, { panX: true, panY: true, wheelX: 'panX', wheelY: 'zoomX' })
    )
    chartRef.current = chart

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'year',
        renderer: am5xy.AxisRendererX.new(root, {}),
      })
    )

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    )

    const makeSeries = (field: string, name: string) => {
      const s = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueYField: field,
          categoryXField: 'year',
        })
      )
      s.columns.template.setAll({ tooltipText: '{name}: {valueY}' })
      s.appear()
      return s
    }

    cashSeriesRef.current = makeSeries('freeCash', 'Free Cash Flow to Equity')
    principalSeriesRef.current = makeSeries('principal', 'Principal Repayment')

    const cum = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Cumulative Free Cash',
        xAxis,
        yAxis,
        valueYField: 'cumulative',
        categoryXField: 'year',
      })
    )
    cum.strokes.template.setAll({ strokeWidth: 2 })
    cumSeriesRef.current = cum

    chart.appear()

    return () => {
      try {
        root.dispose()
      } catch (e) {
        // ignore dispose errors
      }
      rootRef.current = null
      chartRef.current = null
      cashSeriesRef.current = null
      principalSeriesRef.current = null
      cumSeriesRef.current = null
    }
  }, [])

  // update data when results change
  useEffect(() => {
    if (!results || !results.rows || results.rows.length === 0) return
    const freeCashRow = results.rows.find(r => r.label === 'Free Cash Flow to Equity')
    const principalRow = results.rows.find(r => r.label === 'Principal Repayment')

    const freeVals = freeCashRow ? freeCashRow.values : []
    const principalVals = principalRow ? principalRow.values : []

    const data: { year: string; freeCash?: number; principal?: number; cumulative?: number }[] = []
    let cum = 0
    const n = Math.max(freeVals.length, principalVals.length)
    for (let i = 0; i < n; i++) {
      const free = freeVals[i] ?? 0
      const principal = principalVals[i] ?? 0
      cum += free
      data.push({ year: `Y${i+1}`, freeCash: free, principal, cumulative: cum })
    }

    const xAxis = chartRef.current?.xAxes.getIndex(0)
    if (xAxis) xAxis.data.setAll(data as any)
    if (cashSeriesRef.current) cashSeriesRef.current.data.setAll(data as any)
    if (principalSeriesRef.current) principalSeriesRef.current.data.setAll(data as any)
    if (cumSeriesRef.current) cumSeriesRef.current.data.setAll(data as any)
  }, [results])

  return <div ref={chartDivRef} style={{ width: '100%', height: '420px' }} />
}
