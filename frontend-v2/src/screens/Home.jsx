import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import ReelFeed from '../ui/ReelFeed.jsx'

export default function Home() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    api.get('/api/food').then((res) => setVideos(res.data.foodItems || [])).catch(() => {})
  }, [])

  const onLike = async (item) => {
    let res
    try { res = await api.post('/api/food/like', { foodId: item._id }) } catch (err) {
      if (err?.response?.status === 401) { window.location.href = '/user/login'; return }
      throw err
    }
    if (res.data.like) setVideos((p) => p.map((v) => v._id === item._id ? { ...v, likeCount: (v.likeCount || 0) + 1 } : v))
    else setVideos((p) => p.map((v) => v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount || 1) - 1) } : v))
  }

  const onSave = async (item) => {
    let res
    try { res = await api.post('/api/food/save', { foodId: item._id }) } catch (err) {
      if (err?.response?.status === 401) { window.location.href = '/user/login'; return }
      throw err
    }
    if (res.data.save) setVideos((p) => p.map((v) => v._id === item._id ? { ...v, savesCount: (v.savesCount || 0) + 1 } : v))
    else setVideos((p) => p.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount || 1) - 1) } : v))
  }

  const onRate = async (item) => {
    const stars = Number(window.prompt('Rate 1-5', '5'))
    if (!stars || stars < 1 || stars > 5) return
    let res
    try { res = await api.post('/api/food/rate', { foodId: item._id, stars }) } catch (err) {
      if (err?.response?.status === 401) { window.location.href = '/user/login'; return }
      throw err
    }
    const { average, count } = res.data
    setVideos((p) => p.map((v) => v._id === item._id ? { ...v, averageRating: average, ratingsCount: count } : v))
  }

  const onOpenComments = async (item) => {
    const text = window.prompt('Add a comment')
    if (!text) return
    await api.post('/api/food/comment', { foodId: item._id, text })
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 shadow-sm">
      <div className="p-2 sm:p-4">
        <ReelFeed items={videos} onLike={onLike} onSave={onSave} onRate={onRate} onOpenComments={onOpenComments} />
      </div>
    </div>
  )
}


