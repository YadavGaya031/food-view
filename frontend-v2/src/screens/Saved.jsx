import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import ReelFeed from '../ui/ReelFeed.jsx'

export default function Saved() {
  const [videos, setVideos] = useState([])
  useEffect(() => {
    api.get('/api/food/save').then((res) => {
      const savedFoods = (res.data.savedFoods || []).map((item) => ({
        _id: item._id,
        video: item.video,
        description: item.description,
        likeCount: item.likeCount,
        savesCount: item.savesCount,
        commentsCount: item.commentsCount,
        foodPartner: item.foodPartner,
      }))
      setVideos(savedFoods)
    })
  }, [])

  const removeSaved = async (item) => {
    await api.post('/api/food/save', { foodId: item._id })
    setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1) } : v))
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 shadow-sm">
      <div className="p-2 sm:p-4">
        <ReelFeed items={videos} onSave={removeSaved} emptyMessage="No saved videos yet." />
      </div>
    </div>
  )
}


