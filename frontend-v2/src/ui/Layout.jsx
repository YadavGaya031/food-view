import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav.jsx'
import api from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'
import CartDrawer from './CartDrawer.jsx'
import CartListener from './CartListener.jsx'

export default function Layout() {
  const [isDark, setIsDark] = useState(true)
  const navigate = useNavigate()

  const logout = async () => {
    try { await api.get('/api/auth/logout') } catch {}
    navigate('/user/login')
  }
  return (
    <div className={isDark ? 'dark' : ''}>
      <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 pb-16">
        <header className="sticky top-0 z-10 border-b border-slate-200/70 dark:border-slate-800/70 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-950/60">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800">🍽️</span>
              <h1 className="text-lg font-semibold tracking-tight">Food View</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/user/login" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-sm shadow-sm bg-white/70 dark:bg-slate-900/70">Login</Link>
              <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-red-300 dark:border-red-800 px-3 py-1.5 text-sm shadow-sm bg-red-500/90 text-white">Logout</button>
              <button onClick={() => setIsDark((v) => !v)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-sm shadow-sm hover:shadow transition active:scale-[.98] bg-white/70 dark:bg-slate-900/70">Theme</button>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-0 sm:px-4 lg:px-8 py-6">
          <Outlet />
        </div>
        <CartDrawer />
        <CartListener />
        <BottomNav />
      </main>
    </div>
  )
}


