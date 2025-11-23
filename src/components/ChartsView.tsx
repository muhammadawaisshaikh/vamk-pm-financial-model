import React, { useLayoutEffect, useRef, useEffect } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import { useFinanceStore } from '../store/financeStore'

export default function ChartsView(){
  const chartDivRef = useRef<HTMLDivElement | null>(null)
  const metricsDivRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<am5.Root | null>(null)
  const chartRef = useRef<am5xy.XYChart | null>(null)
  const cashSeriesRef = useRef<am5xy.ColumnSeries | null>(null)
  const principalSeriesRef = useRef<am5xy.ColumnSeries | null>(null)
  const cumSeriesRef = useRef<am5xy.LineSeries | null>(null)
  const metricsRootRef = useRef<am5.Root | null>(null)
  const metricsChartRef = useRef<am5xy.XYChart | null>(null)
  const npvSeriesRef = useRef<am5xy.ColumnSeries | null>(null)
  const cumEqSeriesRef = useRef<am5xy.ColumnSeries | null>(null)
  const irrSeriesRef = useRef<am5xy.LineSeries | null>(null)

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

    // additional series: Revenue, CFADS, Interest Expense
    const revenueSeries = makeSeries('revenue', 'Revenue')
    const cfadsSeries = makeSeries('cfads', 'CFADS')
    const interestSeries = makeSeries('interest', 'Interest Expense')

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

    // add legend
    const legend = chart.children.push(am5.Legend.new(root, {}))
    legend.data.setAll([revenueSeries, cfadsSeries, interestSeries, cashSeriesRef.current, principalSeriesRef.current, cumSeriesRef.current].filter(Boolean) as any)

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

    const revenueRow = results.rows.find(r => r.label === 'Revenue')
    const cfadsRow = results.rows.find(r => r.label === 'CFADS')
    const interestRow = results.rows.find(r => r.label === 'Interest Expense')

    const revenueVals = revenueRow ? revenueRow.values : []
    const cfadsVals = cfadsRow ? cfadsRow.values : []
    const interestVals = interestRow ? interestRow.values : []

    const data: { year: string; freeCash?: number; principal?: number; cumulative?: number; revenue?: number; cfads?: number; interest?: number }[] = []
    let cum = 0
    const n = Math.max(freeVals.length, principalVals.length, revenueVals.length, cfadsVals.length, interestVals.length)
    for (let i = 0; i < n; i++) {
      const free = freeVals[i] ?? 0
      const principal = principalVals[i] ?? 0
      const revenue = revenueVals[i] ?? 0
      const cfads = cfadsVals[i] ?? 0
      const interest = interestVals[i] ?? 0
      cum += free
      data.push({ year: `Y${i+1}`, freeCash: free, principal, cumulative: cum, revenue, cfads, interest })
    }

    const xAxis = chartRef.current?.xAxes.getIndex(0)
    if (xAxis) xAxis.data.setAll(data as any)
    if (cashSeriesRef.current) cashSeriesRef.current.data.setAll(data as any)
    if (principalSeriesRef.current) principalSeriesRef.current.data.setAll(data as any)
    if (cumSeriesRef.current) cumSeriesRef.current.data.setAll(data as any)
  }, [results])

  // create / update metrics chart (NPV, IRR, Cumulative Equity)
  useLayoutEffect(() => {
    if (!metricsDivRef.current) return

    // avoid creating multiple roots
    if (metricsRootRef.current) return

    const mroot = am5.Root.new(metricsDivRef.current)
    metricsRootRef.current = mroot
    mroot.setThemes([am5themes_Animated.new(mroot)])

    const mchart = mroot.container.children.push(
      am5xy.XYChart.new(mroot, { panX: true, panY: true })
    )
    metricsChartRef.current = mchart

    const xAxis = mchart.xAxes.push(
      am5xy.CategoryAxis.new(mroot, {
        categoryField: 'year',
        renderer: am5xy.AxisRendererX.new(mroot, {}),
      })
    )

    const leftAxis = mchart.yAxes.push(
      am5xy.ValueAxis.new(mroot, {
        renderer: am5xy.AxisRendererY.new(mroot, {}),
      })
    )

    const rightAxis = mchart.yAxes.push(
      am5xy.ValueAxis.new(mroot, {
        renderer: am5xy.AxisRendererY.new(mroot, { opposite: true }),
      })
    )

    const makeCol = (field: string, name: string) => {
      const s = mchart.series.push(
        am5xy.ColumnSeries.new(mroot, {
          name,
          xAxis,
          yAxis: leftAxis,
          valueYField: field,
          categoryXField: 'year',
        })
      )
      s.columns.template.setAll({ tooltipText: '{name}: {valueY}' })
      s.appear()
      return s
    }

    const makeLine = (field: string, name: string) => {
      const s = mchart.series.push(
        am5xy.LineSeries.new(mroot, {
          name,
          xAxis,
          yAxis: rightAxis,
          valueYField: field,
          categoryXField: 'year',
        })
      )
      s.strokes.template.setAll({ strokeWidth: 2 })
      s.appear()
      return s
    }

    npvSeriesRef.current = makeCol('npv', 'NPV (Equity)')
    cumEqSeriesRef.current = makeCol('cumulative', 'Cumulative Equity CF')
    irrSeriesRef.current = makeLine('irr', 'IRR (Equity % )')

    const legend = mchart.children.push(am5.Legend.new(mroot, {}))
    legend.data.setAll([npvSeriesRef.current, cumEqSeriesRef.current, irrSeriesRef.current] as any)

    return () => {
      try {
        if (metricsRootRef.current) metricsRootRef.current.dispose()
      } catch (e) {}
      metricsRootRef.current = null
      metricsChartRef.current = null
    }
  }, [])

  // update metrics data when results change
  useEffect(() => {
    if (!metricsChartRef.current) return
    const perNpv = results.perYearNpv ?? []
    const perIrr = results.perYearIrr ?? []
    const perCum = results.perYearCumulativeEquity ?? []
    const n = Math.max(perNpv.length, perIrr.length, perCum.length)
    const mdata = [] as any[]
    for (let i = 0; i < n; i++) {
      mdata.push({ year: `Y${i+1}`, npv: perNpv[i] ?? 0, irr: isFinite(perIrr[i]) ? perIrr[i] * 100 : null, cumulative: perCum[i] ?? 0 })
    }
    if (metricsChartRef.current.xAxes.length > 0) metricsChartRef.current.xAxes.getIndex(0).data.setAll(mdata)
    if (npvSeriesRef.current) npvSeriesRef.current.data.setAll(mdata)
    if (cumEqSeriesRef.current) cumEqSeriesRef.current.data.setAll(mdata)
    if (irrSeriesRef.current) irrSeriesRef.current.data.setAll(mdata)
  }, [results])

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-2 text-lg font-semibold">Project Cash Flows (EUR)</div>
        <div ref={chartDivRef} style={{ width: '100%', height: '420px' }} />
        <div className="mt-2 text-sm text-slate-500 flex justify-between">
          <div>Values: EUR</div>
          <div>Category: Year</div>
        </div>
      </div>

      <div>
        <div className="mb-2 text-lg font-semibold">Equity Metrics — NPV / IRR / Cumulative</div>
        <div ref={metricsDivRef} style={{ width: '100%', height: '320px' }} />
        <div className="mt-2 text-sm text-slate-500 flex justify-between">
          <div>Left axis: EUR (NPV & Cumulative)</div>
          <div>Right axis: IRR (%)</div>
        </div>
      </div>
    </div>
  )
}
