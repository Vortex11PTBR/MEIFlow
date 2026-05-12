'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

interface MonthData {
  month: string
  income: number
  expense: number
}

export function RevenueChart({ data }: { data: MonthData[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    chartRef.current?.destroy()
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: data.map(d => d.month),
        datasets: [
          {
            label: 'Receita',
            data: data.map(d => d.income),
            backgroundColor: 'rgba(22,163,74,0.20)',
            borderColor: '#16A34A',
            borderWidth: 2,
            borderRadius: 6,
          },
          {
            label: 'Despesa',
            data: data.map(d => d.expense),
            backgroundColor: 'rgba(220,38,38,0.15)',
            borderColor: '#DC2626',
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#64748b', font: { family: 'system-ui', size: 11 } },
          },
          tooltip: {
            callbacks: {
              label: ctx =>
                ` ${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
            },
          },
        },
        scales: {
          x: { grid: { color: 'rgba(100,116,139,0.1)' }, ticks: { color: '#64748b', font: { size: 11 } } },
          y: {
            grid: { color: 'rgba(100,116,139,0.1)' },
            ticks: {
              color: '#64748b',
              font: { size: 10 },
              callback: v => 'R$' + (Number(v) / 1000).toFixed(0) + 'k',
            },
          },
        },
      },
    })
    return () => chartRef.current?.destroy()
  }, [data])

  return <canvas ref={canvasRef} />
}
