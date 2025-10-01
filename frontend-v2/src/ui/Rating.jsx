import React, { useState } from 'react'
import api from '../lib/api'

export default function Rating({ foodId, initialAverage = 0, initialCount = 0, onRated }) {
  const [hover, setHover] = useState(0)
  const [pending, setPending] = useState(false)
  const [average, setAverage] = useState(initialAverage)
  const [count, setCount] = useState(initialCount)

  const rate = async (stars) => {
    setPending(true)
    try {
      const res = await api.post('/api/food/rate', { foodId, stars })
      const { average: avg, count: cnt } = res.data
      setAverage(avg)
      setCount(cnt)
      onRated && onRated({ average: avg, count: cnt })
    } catch (err) {
      if (err?.response?.status === 401) {
        window.location.href = '/user/login'
        return
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mt-2 w-[min(92vw,420px)] rounded-xl border border-slate-200 bg-white p-3 text-slate-900 shadow dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-xs text-slate-600 dark:text-slate-400">Average:</span>
        <span className="font-medium">{typeof average === 'number' ? average.toFixed(1) : '0.0'}</span>
        <span className="text-xs text-slate-600 dark:text-slate-400">({count})</span>
      </div>
      <div className="mt-2 flex items-center gap-1">
        {[1,2,3,4,5].map((star) => (
          <button
            key={star}
            disabled={pending}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => rate(star)}
            className="p-1 disabled:opacity-60"
            aria-label={`Rate ${star}`}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill={(hover || average) >= star ? 'gold' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}


