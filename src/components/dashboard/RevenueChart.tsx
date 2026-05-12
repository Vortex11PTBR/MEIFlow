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
            backgroundColor: 'rgba(0,212,255,0.25)',
            borderColor: '#00d4ff',
            borderWidth: 2,
            borderRadius: 6,
          },
          {
            label: 'Despesa',
            data: data.map(d => d.expense),
            backgroundColor: 'rgba(239,68,68,0.20)',
            borderColor: '#ef4444',
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
            labels: { color: '#94a3b8', font: { family: 'monospace', size: 10 } },
          },
          tooltip: {
            callbacks: {
              label: ctx =>
                ` ${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
            },
          },
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 11 } } },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
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
