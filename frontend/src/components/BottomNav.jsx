import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

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
  { to: '/orders', label: 'Orders', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15V6a2 2 0 0 0-2-2H7l-4 6v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
      <polyline points="7 10 12 15 17 10" />
    </svg>
  )},
  { to: '/profile', label: 'Profile', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )},
];

const BottomNav = () => {
  const location = useLocation();

  const activeIndex = useMemo(() => {
    const path = location.pathname || '/';
    if (path === '/') return 0;
    const idx = items.findIndex((i) => i.to !== '/' && path.startsWith(i.to));
    return idx === -1 ? 0 : idx;
  }, [location.pathname]);

  const segmentWidth = 100 / items.length; // percentage of the bar each item occupies

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-white/90 border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] backdrop-blur-md
                 dark:bg-[#0b0c0f]/80 dark:border-white/10 dark:shadow-[0_-2px_12px_rgba(0,0,0,0.35)]"
      role="navigation"
      aria-label="Bottom"
    >
      <div className="relative mx-auto max-w-md px-2 py-2">

        <div className="relative grid grid-cols-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `z-10 flex flex-col items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl transition-transform
                 ${isActive ? 'text-blue-600 dark:text-blue-400 font-medium scale-110' : 'text-slate-600 dark:text-slate-300 scale-100'}
                 hover:text-blue-500 dark:hover:text-blue-300`
              }
            >
              <span className="h-6 w-6" aria-hidden="true">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;