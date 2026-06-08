'use client'

import ReactECharts from 'echarts-for-react'
import { useEffect, useMemo, useState } from 'react'

interface SeriesData {
  name: string
  data: [number, number][]
}

interface Props {
  series: SeriesData[]
  height?: number
  min?: number
  max?: number
}

export default function ScadaEChart({ series, height = 600, min, max }: Props) {
  const [isDark, setIsDark] = useState(true)

  // ✅ SAFE: run only on client
  useEffect(() => {
    const getTheme = () => document.documentElement.classList.contains('dark')

    setIsDark(getTheme())

    // optional: listen theme change (Tailwind dark mode toggle)
    const observer = new MutationObserver(() => {
      setIsDark(getTheme())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const colors = useMemo(() => {
    return {
      bg: isDark ? '#0f172a' : '#ffffff',
      text: isDark ? '#e2e8f0' : '#0f172a',
      grid: isDark ? '#1e293b' : '#e5e7eb',
      border: isDark ? '#334155' : '#d1d5db',
    }
  }, [isDark])

  const option = useMemo(() => {
    return {
      backgroundColor: colors.bg,

      title: {
        text: 'Historian',
        left: 'center',
        textStyle: {
          color: colors.text,
          fontSize: 16,
        },
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },

          magicType: { type: ['line', 'bar'] },

          saveAsImage: {},
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
        backgroundColor: isDark ? '#020617' : '#ffffff',
        borderColor: colors.border,
        textStyle: {
          color: colors.text,
        },
      },

      legend: {
        top: 30,
        textStyle: {
          color: colors.text,
        },
      },

      grid: {
        left: 50,
        right: 30,
        top: 80,
        bottom: 80,
      },

      xAxis: {
        type: 'time',
        min,
        max,

        axisLine: {
          lineStyle: {
            color: colors.border,
          },
        },

        axisLabel: {
          color: colors.text,
        },

        splitLine: {
          show: false,
        },
      },

      yAxis: {
        type: 'value',

        axisLabel: {
          color: colors.text,
        },

        splitLine: {
          lineStyle: {
            color: colors.grid,
          },
        },
      },

      dataZoom: [
        {
          type: 'inside',
        },
        {
          type: 'slider',
          height: 20,
          bottom: 20,
          borderColor: colors.border,
          backgroundColor: colors.bg,
          textStyle: {
            color: colors.text,
          },
        },
      ],

      series: series.map((s) => ({
        name: s.name,
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: s.data,
        lineStyle: {
          width: 2,
        },
      })),
    }
  }, [series, min, max, colors, isDark])

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
      <ReactECharts
        option={option}
        notMerge={true} // ✅ important for theme update
        lazyUpdate={true}
        style={{
          height: `${height}px`,
          width: '100%',
        }}
      />
    </div>
  )
}
