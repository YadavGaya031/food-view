import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import ReelFeed from '../ui/ReelFeed.jsx'

export default function PartnerReels() {
  const { partnerId } = useParams()
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [partner, setPartner] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [foodRes, partnerRes] = await Promise.all([
          api.get(`/api/food/partner/${partnerId}`),
          api.get(`/api/food-partner/${partnerId}`)
        ])
        setVideos(foodRes.data.foodItems || [])
        setPartner(partnerRes.data.foodPartner)
      } catch (error) {
        console.error('Error fetching partner data:', error)
        setVideos([])
        setPartner(null)
      } finally {
        setLoading(false)
      }
    }

    if (partnerId) {
      fetchData()
    }
  }, [partnerId])

  const onLike = async (item) => {
    let res
    try { 
      res = await api.post('/api/food/like', { foodId: item._id }) 
    } catch (err) {
      if (err?.response?.status === 401) { 
        navigate('/user/login')
        return 
      }
      throw err
    }
    if (res.data.like) {
      setVideos((p) => p.map((v) => v._id === item._id ? { ...v, likeCount: (v.likeCount || 0) + 1 } : v))
    } else {
      setVideos((p) => p.map((v) => v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount || 1) - 1) } : v))
    }
  }

  const onSave = async (item) => {
    let res
    try { 
      res = await api.post('/api/food/save', { foodId: item._id }) 
    } catch (err) {
      if (err?.response?.status === 401) { 
        navigate('/user/login')
        return 
      }
      throw err
    }
    if (res.data.save) {
      setVideos((p) => p.map((v) => v._id === item._id ? { ...v, savesCount: (v.savesCount || 0) + 1 } : v))
    } else {
      setVideos((p) => p.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount || 1) - 1) } : v))
    }
  }

  const onRate = async (item) => {
    const stars = Number(window.prompt('Rate 1-5', '5'))
    if (!stars || stars < 1 || stars > 5) return
    let res
    try { 
      res = await api.post('/api/food/rate', { foodId: item._id, stars }) 
    } catch (err) {
      if (err?.response?.status === 401) { 
        navigate('/user/login')
        return 
      }
      throw err
    }
    const { average, count } = res.data
    setVideos((p) => p.map((v) => v._id === item._id ? { ...v, averageRating: average, ratingsCount: count } : v))
  }

  const onOpenComments = async (item) => {
    const text = window.prompt('Add a comment')
    if (!text) return
    try {
      await api.post('/api/food/comment', { foodId: item._id, text })
    } catch (err) {
      if (err?.response?.status === 401) { 
        navigate('/user/login')
        return 
      }
      throw err
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 shadow-sm p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600 dark:text-slate-400">Loading...</div>
        </div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 shadow-sm p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600 dark:text-slate-400">Partner not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 shadow-sm">
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{partner.fullName}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{partner.address}</p>
          </div>
          <button 
            onClick={() => navigate('/nearby')}
            className="rounded-lg bg-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Back to Search
          </button>
        </div>
      </div>
      <div className="p-2 sm:p-4">
        <ReelFeed 
          items={videos} 
          onLike={onLike} 
          onSave={onSave} 
          onRate={onRate} 
          onOpenComments={onOpenComments}
          emptyMessage={`No reels posted by ${partner.fullName} yet.`}
          storeName={partner.fullName}
        />
      </div>
    </div>
  )
}
