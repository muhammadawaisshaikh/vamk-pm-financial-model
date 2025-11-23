import React, { useLayoutEffect, useRef, useEffect } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import { FinancialResults } from '../../utils/formulas'

type Props = {
  results: FinancialResults
}

export default function MainChart({ results }: Props) {
  const divRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<am5.Root | null>(null)
  const chartRef = useRef<am5xy.XYChart | null>(null)
  const seriesRefs = useRef<Record<string, am5xy.Series | null>>({})

  useLayoutEffect(() => {
    if (!divRef.current) return
    if (rootRef.current) return

    const root = am5.Root.new(divRef.current)
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

    const makeColumn = (field: string, name: string) => {
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

    const makeLine = (field: string, name: string) => {
      const s = chart.series.push(
        am5xy.LineSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueYField: field,
          categoryXField: 'year',
        })
      )
      s.strokes.template.setAll({ strokeWidth: 2 })
      s.appear()
      return s
    }

    // create series we'll update later
    seriesRefs.current.revenue = makeColumn('revenue', 'Revenue')
    seriesRefs.current.cfads = makeColumn('cfads', 'CFADS')
    seriesRefs.current.interest = makeColumn('interest', 'Interest Expense')
    seriesRefs.current.freeCash = makeColumn('freeCash', 'Free Cash Flow to Equity')
    seriesRefs.current.principal = makeColumn('principal', 'Principal Repayment')
    seriesRefs.current.cumulative = makeLine('cumulative', 'Cumulative Free Cash')

    const legend = chart.children.push(am5.Legend.new(root, {}))
    legend.data.setAll(Object.values(seriesRefs.current).filter(Boolean) as any)

    chart.appear()

    return () => {
      try {
        root.dispose()
      } catch (e) {
        // swallow disposal errors
      }
      rootRef.current = null
      chartRef.current = null
      seriesRefs.current = {}
    }
  }, [])

  useEffect(() => {
    if (!chartRef.current) return

    const freeCashRow = results.rows.find(r => r.label === 'Free Cash Flow to Equity')
    const principalRow = results.rows.find(r => r.label === 'Principal Repayment')
    const revenueRow = results.rows.find(r => r.label === 'Revenue')
    const cfadsRow = results.rows.find(r => r.label === 'CFADS')
    const interestRow = results.rows.find(r => r.label === 'Interest Expense')

    const free = freeCashRow ? freeCashRow.values : []
    const principal = principalRow ? principalRow.values : []
    const revenue = revenueRow ? revenueRow.values : []
    const cfads = cfadsRow ? cfadsRow.values : []
    const interest = interestRow ? interestRow.values : []

    const n = Math.max(free.length, principal.length, revenue.length, cfads.length, interest.length)
    const data: Array<Record<string, any>> = []
    let cum = 0
    for (let i = 0; i < n; i++) {
      const f = free[i] ?? 0
      const p = principal[i] ?? 0
      const r = revenue[i] ?? 0
      const c = cfads[i] ?? 0
      const it = interest[i] ?? 0
      cum += f
      data.push({ year: `Y${i + 1}`, revenue: r, cfads: c, interest: it, freeCash: f, principal: p, cumulative: cum })
    }

    const xAxis = chartRef.current.xAxes.getIndex(0)
    if (xAxis) xAxis.data.setAll(data as any)

    Object.entries(seriesRefs.current).forEach(([key, s]) => {
      if (!s) return
      ;(s as any).data.setAll(data as any)
    })
  }, [results])

  return <div ref={divRef} style={{ width: '100%', height: '420px' }} />
}
