'use client'

import { useEffect, useRef } from 'react'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

interface DataPoint {
  month?: string
  day?: string
  income: number
  expense: number
}

export function LineChart({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const labels = data.map(d => d.month ?? d.day ?? '')

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Receita',
            data: data.map(d => d.income),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.08)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Despesa',
            data: data.map(d => d.expense),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.06)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#ef4444',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#080c18',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            titleColor: '#94a3b8',
            bodyColor: '#e2e8f0',
            callbacks: {
              label: ctx =>
                ` ${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#64748b', font: { size: 11 } },
          },
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

    return () => chart.destroy()
  }, [data])

  return <canvas ref={canvasRef} />
}
