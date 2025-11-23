import React, { useLayoutEffect, useRef, useEffect } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import { useFinanceStore } from '../../store/financeStore'

export default function BreakdownDonut(){
  const divRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<am5.Root | null>(null)
  const chartRef = useRef<am5percent.PieChart | null>(null)
  const seriesRef = useRef<any>(null)
  const legendRef = useRef<am5.Legend | null>(null)

  const inputs = useFinanceStore(s => s.inputs)

  useLayoutEffect(() => {
    if (!divRef.current) return
    if (rootRef.current) return

    const root = am5.Root.new(divRef.current)
    rootRef.current = root
    root.setThemes([am5themes_Animated.new(root)])

    const chart = root.container.children.push(am5percent.PieChart.new(root, {}))
    chartRef.current = chart

    const series = chart.series.push(am5percent.PieSeries.new(root, {
      valueField: 'value',
      categoryField: 'category',
      alignLabels: false,
      legendLabelText: '{category}: {value.formatNumber(#,###)}',
    }))
    seriesRef.current = series
    series.labels.template.set('visible', false)
    series.ticks.template.set('visible', false)

    // create legend below the chart and keep a ref to it for safe updates
    const legend = chart.children.push(am5.Legend.new(root, {centerX: am5.percent(50), x: am5.percent(50)}))
    legend.set('y', am5.percent(100))
    chart.set('paddingBottom', 70)
    legendRef.current = legend

    chart.appear()

    return () => {
      try { root.dispose() } catch (e) {}
      rootRef.current = null
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!chartRef.current) return
    const data = [
      { category: 'Turbines & Transformer', value: inputs.capexTurbinesTransformer },
      { category: 'Foundations & Infrastructure', value: inputs.capexFoundations },
      { category: 'Internal Cables & Grid', value: inputs.capexInternalCables },
      { category: 'Permits/Legal/Financing', value: inputs.capexPermitsLegalFinancing },
    ]
    const series = seriesRef.current || chartRef.current.series.getIndex(0)
    if (series && series.data && typeof series.data.setAll === 'function') {
      try {
        series.data.setAll(data as any)
      } catch (e) {
        // guard against amcharts runtime errors
      }

      // update legend data using stored legend ref for reliability
      const legend = legendRef.current
      try {
        if (legend && legend.data && typeof legend.data.setAll === 'function') {
          // prefer series.dataItems when available
          const items = (series.dataItems && series.dataItems.length) ? series.dataItems : series.data
          legend.data.setAll(items)
        }
      } catch (e) {
        // silent guard - avoid bubbling runtime chart errors
      }
    }
  }, [inputs])

  return <div ref={divRef} style={{ width: '100%', height: '320px' }} />
}
