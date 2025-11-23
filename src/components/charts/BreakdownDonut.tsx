import React, { useLayoutEffect, useRef, useEffect } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import { useFinanceStore } from '../../store/financeStore'

export default function BreakdownDonut(){
  const divRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<am5.Root | null>(null)
  const chartRef = useRef<am5percent.PieChart | null>(null)

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
    series.labels.template.set('visible', false)
    series.ticks.template.set('visible', false)

    const legend = chart.children.push(am5.Legend.new(root, {centerX: am5.percent(50), x: am5.percent(50)}))

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
    const series = chartRef.current.series.getIndex(0) as any
    if (series && series.data && typeof series.data.setAll === 'function') {
      series.data.setAll(data as any)

      // try to find legend child and update its data safely
      const children: any[] = (chartRef.current.children && (chartRef.current.children as any).values) || []
      const legend = children.find(c => c && typeof c.data !== 'undefined' && typeof c.data.setAll === 'function')
      if (legend && legend.data && typeof legend.data.setAll === 'function') {
        legend.data.setAll(series.dataItems)
      }
    }
  }, [inputs])

  return <div ref={divRef} style={{ width: '100%', height: '320px' }} />
}
