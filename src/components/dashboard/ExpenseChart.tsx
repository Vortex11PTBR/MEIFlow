'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

const COLORS = [
  'rgba(37,99,235,0.75)',
  'rgba(139,92,246,0.75)',
  'rgba(22,163,74,0.75)',
  'rgba(217,119,6,0.75)',
  'rgba(14,165,233,0.75)',
  'rgba(236,72,153,0.75)',
  'rgba(234,88,12,0.75)',
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
          borderColor: 'rgba(255,255,255,0.8)',
          borderWidth: 2,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#64748b', font: { family: 'system-ui', size: 10 }, boxWidth: 10, padding: 8 },
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
