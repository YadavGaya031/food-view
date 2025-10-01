import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'

export default function PartnerProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])

  useEffect(() => {
    api.get(`/api/food-partner/${id}`).then((res) => {
      const data = res.data.foodPartner || res.data
      setProfile(data)
      setVideos(data.foodItems || [])
    })
  }, [id])

  const logout = async () => {
    await api.get('/api/auth/logout')
    window.location.href = '/user/login'
  }

  return (
    <main>
      <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 shadow-sm p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4 md:gap-6">
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">Business</div>
              <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">{profile?.fullName || '—'}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{profile?.address || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { window.location.href = '/create-food' }} className="inline-flex items-center gap-2 rounded-xl bg-green-500/90 px-3 py-1.5 text-sm text-white">+ Create Food</button>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl bg-red-500/90 px-3 py-1.5 text-sm text-white">Logout</button>
          </div>
        </div>

      </section>

      <section className="mt-8" aria-label="Videos">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.map((v) => (
            <div key={v._id} className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <video className="h-full w-full object-cover" src={v.video} muted playsInline />
            </div>
          ))}
        </div>
        {videos.length === 0 && (
          <div className="mx-auto mt-20 max-w-md text-center">
            <div className="mx-auto h-20 w-20 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-3xl">🍽️</div>
            <h3 className="mt-6 text-lg font-semibold">No items yet</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">This partner hasn’t listed any meals. Check back soon.</p>
          </div>
        )}
      </section>
    </main>
  )
}


