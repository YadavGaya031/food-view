import React, { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Comments({ foodId }) {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/api/food/${foodId}/comments`)
      setComments(res.data.comments || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [foodId])

  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    try {
      await api.post('/api/food/comment', { foodId, text })
    } catch (err) {
      if (err?.response?.status === 401) {
        window.location.href = '/user/login'
        return
      }
      throw err
    }
    setText('')
    load()
  }

  return (
    <div className="mt-2 w-[min(92vw,480px)] rounded-xl border border-slate-200 bg-white p-3 text-slate-900 shadow dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <form onSubmit={submit} className="mb-2 flex gap-2">
        <input className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#0f1117]" placeholder="Write a comment" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white" type="submit">Post</button>
      </form>
      <div className="max-h-64 overflow-y-auto pr-1">
        {loading && <div className="text-xs text-slate-500">Loading…</div>}
        {!loading && comments.length === 0 && <div className="text-xs text-slate-500">No comments yet.</div>}
        <ul className="space-y-2">
          {comments.map((c) => (
            <li key={c._id} className="rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">{c.user?.fullName || 'User'} • {new Date(c.createdAt).toLocaleString()}</div>
              <div className="mt-0.5">{c.text}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


