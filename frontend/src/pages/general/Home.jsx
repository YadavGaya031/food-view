import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'
import { Navigate } from 'react-router-dom'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [isDark, setIsDark] = useState(false)

  Navigate('/user/login')

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/food', { withCredentials: true })
      .then((response) => {
        setVideos(response.data.foodItems)
      })
      .catch(() => {
        /* noop */
      })
  }, [])

  async function likeVideo(item) {
    const response = await axios.post(
      'http://localhost:3000/api/food/like',
      { foodId: item._id },
      { withCredentials: true }
    )

    if (response.data.like) {
      setVideos((prev) =>
        prev.map((v) => (v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
      )
    } else {
      setVideos((prev) =>
        prev.map((v) => (v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
      )
    }
  }

  async function saveVideo(item) {
    const response = await axios.post(
      'http://localhost:3000/api/food/save',
      { foodId: item._id },
      { withCredentials: true }
    )

    if (response.data.save) {
      setVideos((prev) =>
        prev.map((v) => (v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
      )
    } else {
      setVideos((prev) =>
        prev.map((v) => (v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
      )
    }
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {/* Top bar */}
        <header className="sticky top-0 z-10 border-b border-slate-200/70 dark:border-slate-800/70 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-950/60">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800">🍽️</span>
              <h1 className="text-lg font-semibold tracking-tight">Reels</h1>
              <span className="ml-2 text-xs rounded-full px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {videos.length} items
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDark((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-sm shadow-sm hover:shadow transition active:scale-[.98] bg-white/70 dark:bg-slate-900/70"
                aria-label="Toggle theme"
              >
                <span className="i-lucide-sun dark:i-lucide-moon" aria-hidden="true" />
                <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'} mode</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content wrapper */}
        <section className="mx-auto max-w-6xl px-0 sm:px-4 lg:px-8 py-6">
          {/* Frame around ReelFeed for consistent padding on large screens while letting the feed control its own layout */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 shadow-sm">
            <div className="p-2 sm:p-4">
              <ReelFeed items={videos} onLike={likeVideo} onSave={saveVideo} emptyMessage="No videos available." />
            </div>
          </div>
        </section>

        <footer className="py-8" />
      </main>
    </div>
  )
}

export default Home
