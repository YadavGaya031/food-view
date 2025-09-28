import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Insta-like vertical swipe reels with double-tap heart
// ✅ Same props & fields, no API/like/save logic changes
// - Swipe up/down to navigate
// - Desktop wheel snaps 1 reel
// - Autoplay/pause via IntersectionObserver
// - Double-tap big heart (visual only)
// Tailwind helper utilities suggested in your global CSS remain the same.

const SWIPE_THRESHOLD = 40 // px vertical movement to trigger a swipe
const LOCK_MS = 650 // throttle time between snaps

const ReelFeed = ({ items = [], onLike, onSave, emptyMessage = 'No videos yet.' }) => {
  const videoRefs = useRef(new Map())
  const containerRef = useRef(null)
  const lockRef = useRef(false)
  const indexRef = useRef(0)
  const touchStartY = useRef(0)

  // double-tap helpers
  const lastTapRef = useRef(0)
  const heartRefs = useRef(new Map())

  // Autoplay/pause visible reel
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const section = video.closest('[data-reel-index]')
            if (section) indexRef.current = Number(section.getAttribute('data-reel-index')) || 0
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    )

    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [items])

  const setVideoRef = (id) => (el) => {
    if (!el) {
      videoRefs.current.delete(id)
      return
    }
    videoRefs.current.set(id, el)
  }

  const setHeartRef = (id) => (el) => {
    if (!el) {
      heartRefs.current.delete(id)
      return
    }
    heartRefs.current.set(id, el)
  }

  const triggerHeart = (id) => {
    const el = heartRefs.current.get(id)
    if (!el) return
    el.classList.remove('animate-heart-pop')
    // force reflow to restart animation
    void el.offsetWidth
    el.classList.add('animate-heart-pop')
  }

  const handleTap = (id) => {
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      // double-tap detected (UI-only)
      triggerHeart(id)
    }
    lastTapRef.current = now
  }

  const scrollToIndex = (nextIndex) => {
    if (!containerRef.current) return
    const sections = containerRef.current.querySelectorAll('[data-reel-index]')
    const target = sections[nextIndex]
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const trySnap = (direction) => {
    if (lockRef.current) return
    const max = Math.max(0, items.length - 1)
    let next = indexRef.current + (direction > 0 ? 1 : -1)
    next = Math.min(max, Math.max(0, next))
    if (next !== indexRef.current) {
      lockRef.current = true
      scrollToIndex(next)
      setTimeout(() => {
        lockRef.current = false
      }, LOCK_MS)
    }
  }

  // Wheel -> snap 1 reel at a time on desktop
  const onWheel = (e) => {
    if (!containerRef.current) return
    if (Math.abs(e.deltaY) < 10) return
    e.preventDefault()
    trySnap(e.deltaY > 0 ? 1 : -1)
  }

  // Touch swipe handlers (mobile)
  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0]?.clientY ?? 0
  }
  const onTouchEnd = (e) => {
    const endY = e.changedTouches[0]?.clientY ?? 0
    const dy = endY - touchStartY.current
    if (Math.abs(dy) < SWIPE_THRESHOLD) return
    trySnap(dy < 0 ? 1 : -1)
  }

  return (
    // Use a fixed viewport root to avoid the page behind from scrolling and to lock width/height
    <div className="fixed inset-0 z-0 bg-black text-white overflow-hidden">
      <div
        ref={containerRef}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="h-full w-full max-w-[100vw] overflow-y-scroll overflow-x-hidden snap-y snap-mandatory snap-always scroll-smooth no-scrollbar touch-pan-y overscroll-contain"
        role="list"
      >
        {items.length === 0 && (
          <div className="m-4 flex h-full items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-sm text-white/80">
            <p>{emptyMessage}</p>
          </div>
        )}

        {items.map((item, idx) => (
          <section
            key={item._id}
            data-reel-index={idx}
            className="relative isolate snap-start h-full w-full max-w-[100vw] overflow-hidden bg-black"
            role="listitem"
            onClick={() => handleTap(item._id)}
          >
            <video
              ref={setVideoRef(item._id)}
              className="block h-full w-full object-cover"
              src={item.video}
              muted
              playsInline
              loop
              preload="metadata"
            />

            {/* big heart overlay (double-tap) */}
            <div
              ref={setHeartRef(item._id)}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0"
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
            </div>

            {/* overlay gradients (IG-like) */}
            <div className="pointer-events-none absolute inset-0">
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* right-side actions */}
            <div className="pointer-events-auto absolute right-[max(theme(spacing.2),env(safe-area-inset-right))] top-1/2 -translate-y-1/2 md:right-[max(theme(spacing.3),env(safe-area-inset-right))]">
              <div className="flex flex-col items-center gap-4">
                {/* like */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={onLike ? () => onLike(item) : undefined}
                    className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md backdrop-blur transition active:scale-95 hover:bg-white dark:bg-white/10 dark:text-white dark:shadow-[0_2px_10px_rgba(0,0,0,.5)]"
                    aria-label="Like"
                  >
                    <span className="pointer-events-none absolute h-12 w-12 rounded-full group-active:animate-ping group-active:bg-blue-500/40" />
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative">
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>
                  </button>
                  <div className="text-xs font-medium text-white/90 drop-shadow-sm">{item.likeCount ?? item.likesCount ?? item.likes ?? 0}</div>
                </div>

                {/* save */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={onSave ? () => onSave(item) : undefined}
                    className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md backdrop-blur transition active:scale-95 hover:bg-white dark:bg-white/10 dark:text-white dark:shadow-[0_2px_10px_rgba(0,0,0,.5)]"
                    aria-label="Bookmark"
                  >
                    <span className="pointer-events-none absolute h-12 w-12 rounded-full group-active:animate-ping group-active:bg-blue-500/40" />
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative">
                      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                    </svg>
                  </button>
                  <div className="text-xs font-medium text-white/90 drop-shadow-sm">{item.savesCount ?? item.bookmarks ?? item.saves ?? 0}</div>
                </div>

                {/* comments (static trigger button UI only) */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md backdrop-blur transition active:scale-95 hover:bg-white dark:bg-white/10 dark:text-white dark:shadow-[0_2px_10px_rgba(0,0,0,.5)]"
                    aria-label="Comments"
                  >
                    <span className="pointer-events-none absolute h-12 w-12 rounded-full group-active:animate-ping group-active:bg-blue-500/40" />
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative">
                      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    </svg>
                  </button>
                  <div className="text-xs font-medium text-white/90 drop-shadow-sm">{item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)}</div>
                </div>
              </div>
            </div>

            {/* bottom caption & CTA */}
            <div className="pointer-events-none absolute inset-x-0 bottom-18 p-3 sm:p-4">
              <p className="line-clamp-2 max-w-[85%] text-sm font-medium text-white drop-shadow-sm" title={item.description}>
                {item.description}
              </p>
              {item.foodPartner && (
                <Link
                  className="pointer-events-auto mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black shadow hover:brightness-95 active:translate-y-[1px] dark:bg-white/90 dark:text-black"
                  to={"/food-partner/" + item.foodPartner}
                  aria-label="Visit store"
                >
                  Visit store
                </Link>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default ReelFeed
