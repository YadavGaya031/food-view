import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/food-partner/${id}`, { withCredentials: true })
      .then((response) => {
        const data = response.data.foodPartner || response.data
        setProfile(data)
        setVideos(data.foodItems)
      })
      // .catch((error) => {
      //   if (error.response?.status === 401) {
      //     window.location.href = '/food-partner/login'
      //   }
      // })
  }, [id])

  const handleLogout = () => {
    axios
      .get('http://localhost:3000/api/auth/logout', { withCredentials: true })
      .then(() => {
        window.location.href = '/user/login' // Redirect to login page
      })
      .catch((err) => {
        console.error('Logout failed:', err)
      })
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
        {/* Top bar */}
        <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight">Partner Profile</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDark((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-sm shadow-sm hover:shadow transition active:scale-[.98] bg-white/70 dark:bg-slate-900/70"
                aria-label="Toggle theme"
              >
                <span className="i-lucide-sun dark:i-lucide-moon" aria-hidden="true" />
                <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'} mode</span>
              </button>
              <button
                onClick={handleLogout}
                className="ml-2 inline-flex items-center gap-2 rounded-xl border border-red-300 dark:border-red-800 px-3 py-1.5 text-sm shadow-sm hover:shadow transition active:scale-[.98] bg-red-500/90 text-white"
              >
                Logout
              </button>
              <button
                onClick={() => { window.location.href = '/create-food' }}
                className="ml-2 inline-flex items-center gap-2 rounded-xl border border-green-300 dark:border-green-800 px-3 py-1.5 text-sm shadow-sm hover:shadow transition active:scale-[.98] bg-green-500/90 text-white"
              >
                + Create Food
              </button>
            </div>
          </div>
        </header>

        {/* Profile header */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 shadow-sm">
            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4 md:gap-6">
                <img
                  className="h-20 w-20 md:h-24 md:w-24 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-800"
                  src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D"
                  alt="Business avatar"
                />
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                    Business
                  </div>
                  <h2
                    className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight"
                    title="Business name"
                  >
                    {profile?.fullName || '—'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400" title="Address">
                    {profile?.address || '—'}
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-4 text-center">
                  <dt className="text-xs uppercase tracking-wider text-slate-500">Total meals</dt>
                  <dd className="mt-1 text-2xl font-semibold">
                    {profile?.foodItems?.length ?? 0}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-4 text-center">
                  <dt className="text-xs uppercase tracking-wider text-slate-500">Customer served</dt>
                  <dd className="mt-1 text-2xl font-semibold">{profile?.customersServed ?? 0}</dd>
                </div>
                <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-4 text-center">
                  <dt className="text-xs uppercase tracking-wider text-slate-500">Items listed</dt>
                  <dd className="mt-1 text-2xl font-semibold">{videos?.length ?? 0}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-auto max-w-6xl px-4">
          <hr className="border-slate-200/70 dark:border-slate-800/70" />
        </div>

        {/* Videos grid */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8" aria-label="Videos">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {videos.map((v) => (
              <div
                key={v._id}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-shadow"
              >
                <video
                  className="h-full w-full object-cover"
                  src={v.video}
                  muted
                  playsInline
                />
                <div className="pointer-events-none absolute inset-0 ring-0 group-hover:ring-8 ring-inset ring-slate-900/0 group-hover:ring-slate-900/5 dark:group-hover:ring-white/10 transition" />
              </div>
            ))}
          </div>

          {/* Empty state */}
          {videos.length === 0 && (
            <div className="mx-auto mt-20 max-w-md text-center">
              <div className="mx-auto h-20 w-20 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-3xl">🍽️</div>
              <h3 className="mt-6 text-lg font-semibold">No items yet</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">This partner hasn’t listed any meals. Check back soon.</p>
            </div>
          )}
        </section>

        <footer className="py-10" />
      </main>
    </div>
  )
}

export default Profile