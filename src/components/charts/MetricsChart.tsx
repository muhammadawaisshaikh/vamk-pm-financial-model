import React, { useLayoutEffect, useRef, useEffect } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import { FinancialResults } from '../../utils/formulas'

type Props = { results: FinancialResults }

export default function MetricsChart({ results }: Props) {
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

    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: true, panY: true }))
    chartRef.current = chart

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, { categoryField: 'year', renderer: am5xy.AxisRendererX.new(root, {}) })
    )

    const leftAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }))
    const rightAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, { opposite: true }) }))

    const makeCol = (field: string, name: string) => {
      const s = chart.series.push(am5xy.ColumnSeries.new(root, { name, xAxis, yAxis: leftAxis, valueYField: field, categoryXField: 'year' }))
      s.columns.template.setAll({ tooltipText: '{name}: {valueY}' })
      s.appear()
      return s
    }

    const makeLine = (field: string, name: string) => {
      const s = chart.series.push(am5xy.LineSeries.new(root, { name, xAxis, yAxis: rightAxis, valueYField: field, categoryXField: 'year' }))
      s.strokes.template.setAll({ strokeWidth: 2 })
      s.appear()
      return s
    }

    seriesRefs.current.npv = makeCol('npv', 'NPV (Equity)')
    seriesRefs.current.cumulative = makeCol('cumulative', 'Cumulative Equity CF')
    seriesRefs.current.irr = makeLine('irr', 'IRR (Equity % )')

    const legend = chart.children.push(am5.Legend.new(root, {}))
    legend.data.setAll(Object.values(seriesRefs.current).filter(Boolean) as any)

    return () => {
      try {
        root.dispose()
      } catch (e) {}
      rootRef.current = null
      chartRef.current = null
      seriesRefs.current = {}
    }
  }, [])

  useEffect(() => {
    if (!chartRef.current) return
    const perNpv = results.perYearNpv ?? []
    const perIrr = results.perYearIrr ?? []
    const perCum = results.perYearCumulativeEquity ?? []
    const n = Math.max(perNpv.length, perIrr.length, perCum.length)
    const data: Array<Record<string, any>> = []
    for (let i = 0; i < n; i++) {
      data.push({ year: `Y${i + 1}`, npv: perNpv[i] ?? 0, irr: isFinite(perIrr[i]) ? perIrr[i] * 100 : null, cumulative: perCum[i] ?? 0 })
    }

    const xAxis = chartRef.current.xAxes.getIndex(0)
    if (xAxis) xAxis.data.setAll(data as any)

    Object.entries(seriesRefs.current).forEach(([_, s]) => {
      if (!s) return
      ;(s as any).data.setAll(data as any)
    })
  }, [results])

  return <div ref={divRef} style={{ width: '100%', height: '320px' }} />
}
