import React, { useState } from 'react'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function Nearby() {
  const [searchQuery, setSearchQuery] = useState('')
  const [partners, setPartners] = useState([])
  const navigate = useNavigate()

  const search = async () => {
    if (!searchQuery.trim()) return
    const res = await api.get('/api/food-partner/search', { params: { query: searchQuery } })
    setPartners(res.data.partners || [])
  }

  const viewPartnerReels = (partnerId) => {
    navigate(`/partner/${partnerId}/reels`)
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 shadow-sm p-4 grid gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input 
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#0f1117]" 
          placeholder="Search by name or address..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && search()}
        />
        <button onClick={search} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">Search</button>
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((p) => (
          <div key={p._id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4 hover:shadow-md transition-shadow">
            <div className="text-sm font-semibold">{p.fullName}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">{p.address}</div>
            <button 
              onClick={() => viewPartnerReels(p._id)}
              className="w-full rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
            >
              View Store Reels
            </button>
          </div>
        ))}
        {partners.length === 0 && searchQuery && (
          <div className="text-sm text-slate-600 dark:text-slate-400">No partners found. Try a different search term.</div>
        )}
      </div>
    </div>
  )
}


