import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#05070f',
          2: '#080c18',
          3: '#0d1120',
          card: 'rgba(255,255,255,0.028)',
        },
        cyan: {
          DEFAULT: '#00d4ff',
          dim: 'rgba(0,212,255,0.10)',
        },
        green: {
          DEFAULT: '#10b981',
          dim: 'rgba(16,185,129,0.12)',
        },
        red: {
          DEFAULT: '#ef4444',
          dim: 'rgba(239,68,68,0.12)',
        },
        amber: {
          DEFAULT: '#f59e0b',
          dim: 'rgba(245,158,11,0.12)',
        },
        purple: {
          DEFAULT: '#8b5cf6',
          dim: 'rgba(139,92,246,0.12)',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
