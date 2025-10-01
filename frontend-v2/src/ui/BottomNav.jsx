import React from 'react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Home', exact: true, icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
    </svg>
  )},
  { to: '/saved', label: 'Saved', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  )},
  { to: '/nearby', label: 'Nearby', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )},
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/90 border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] backdrop-blur-md dark:bg-[#0b0c0f]/80 dark:border-white/10 dark:shadow-[0_-2px_12px_rgba(0,0,0,0.35)]">
      <div className="relative mx-auto max-w-md px-2 py-2">
        <div className="relative grid grid-cols-3">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.exact}
              className={({ isActive }) => `z-10 flex flex-col items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl transition-transform ${isActive ? 'text-blue-600 dark:text-blue-400 font-medium scale-110' : 'text-slate-600 dark:text-slate-300 scale-100'} hover:text-blue-500 dark:hover:text-blue-300`}>
              <span className="h-6 w-6" aria-hidden="true">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}


