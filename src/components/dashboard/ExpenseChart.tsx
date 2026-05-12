'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

const COLORS = [
  'rgba(0,212,255,0.75)',
  'rgba(139,92,246,0.75)',
  'rgba(16,185,129,0.75)',
  'rgba(245,158,11,0.75)',
  'rgba(56,189,248,0.75)',
  'rgba(244,114,182,0.75)',
  'rgba(251,146,60,0.75)',
]

export function ExpenseChart({ data }: { data: Record<string, number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const labels = Object.keys(data)
    const values = Object.values(data)
    chartRef.current?.destroy()
    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: COLORS.slice(0, labels.length),
          borderColor: '#080c18',
          borderWidth: 3,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#94a3b8', font: { family: 'monospace', size: 9 }, boxWidth: 10, padding: 8 },
          },
          tooltip: {
            callbacks: {
              label: ctx =>
                ` ${ctx.label}: ${Number(ctx.raw).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
            },
          },
        },
      },
    })
    return () => chartRef.current?.destroy()
  }, [data])

  return <canvas ref={canvasRef} />
}
