import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Comments from './Comments.jsx'
import Rating from './Rating.jsx'

const SWIPE_THRESHOLD = 40
const LOCK_MS = 650

export default function ReelFeed({ items = [], onLike, onSave, onRate, onOpenComments, emptyMessage = 'No videos yet.', storeName = null }) {
  const videoRefs = useRef(new Map())
  const containerRef = useRef(null)
  const lockRef = useRef(false)
  const indexRef = useRef(0)
  const touchStartY = useRef(0)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
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
    }, { threshold: [0, 0.25, 0.6, 0.9, 1] })
    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [items])

  const setVideoRef = (id) => (el) => {
    if (!el) { videoRefs.current.delete(id); return }
    videoRefs.current.set(id, el)
  }

  const scrollToIndex = (nextIndex) => {
    if (!containerRef.current) return
    const sections = containerRef.current.querySelectorAll('[data-reel-index]')
    const target = sections[nextIndex]
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const trySnap = (direction) => {
    if (lockRef.current) return
    const max = Math.max(0, items.length - 1)
    let next = indexRef.current + (direction > 0 ? 1 : -1)
    next = Math.min(max, Math.max(0, next))
    if (next !== indexRef.current) {
      lockRef.current = true
      scrollToIndex(next)
      setTimeout(() => { lockRef.current = false }, LOCK_MS)
    }
  }

  const onWheel = (e) => {
    if (!containerRef.current) return
    if (Math.abs(e.deltaY) < 10) return
    e.preventDefault()
    trySnap(e.deltaY > 0 ? 1 : -1)
  }

  const onTouchStart = (e) => { touchStartY.current = e.touches[0]?.clientY ?? 0 }
  const onTouchEnd = (e) => {
    const endY = e.changedTouches[0]?.clientY ?? 0
    const dy = endY - touchStartY.current
    if (Math.abs(dy) < SWIPE_THRESHOLD) return
    trySnap(dy < 0 ? 1 : -1)
  }

  return (
    <div className="fixed inset-0 z-0 bg-black text-white overflow-hidden">
      <div ref={containerRef} onWheel={onWheel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="h-full w-full overflow-y-scroll snap-y snap-mandatory snap-always scroll-smooth no-scrollbar touch-pan-y overscroll-contain" role="list">
        {items.length === 0 && (
          <div className="m-4 flex h-full items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-sm text-white/80">
            <p>{emptyMessage}</p>
          </div>
        )}

        {items.map((item, idx) => (
          <section key={item._id} data-reel-index={idx} className="relative isolate snap-start h-full w-full overflow-hidden bg-black" role="listitem">
            <video ref={setVideoRef(item._id)} className="block h-full w-full object-cover" src={item.video} muted playsInline loop preload="metadata" />

            <div className="pointer-events-none absolute inset-0">
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* Store name display */}
            {storeName && (
              <div className="pointer-events-none absolute inset-x-0 top-0 p-4 z-10">
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-black/70 backdrop-blur-md px-6 py-3 border border-white/20 shadow-lg">
                    <h3 className="text-xl font-bold text-white text-center flex items-center gap-2">
                      <span className="text-2xl">🏪</span>
                      {storeName}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div className="pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2">
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <button onClick={onLike ? () => onLike(item) : undefined} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md hover:bg-white dark:bg-white/10 dark:text-white" aria-label="Like">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>
                  </button>
                  <div className="text-xs font-medium text-white/90">{item.likeCount ?? 0}</div>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button onClick={onSave ? () => onSave(item) : undefined} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md hover:bg-white dark:bg-white/10 dark:text-white" aria-label="Bookmark">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" /></svg>
                  </button>
                  <div className="text-xs font-medium text-white/90">{item.savesCount ?? 0}</div>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button onClick={() => window.dispatchEvent(new CustomEvent('add-to-cart', { detail: { foodId: item._id } }))} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:brightness-110" aria-label="Add to cart">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L21 6H6"></path></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* bottom caption & CTA */}
            <div className="pointer-events-none absolute inset-x-0 bottom-18 p-3 sm:p-4">
              <p className="line-clamp-2 max-w-[85%] text-sm font-medium text-white" title={item.description}>{item.description}</p>
              <div className="mt-2 flex items-center gap-2 pointer-events-auto">
                <details className="group inline-block">
                  <summary className="list-none inline-flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold text-black cursor-pointer select-none">⭐ Rating</summary>
                  <Rating foodId={item._id} initialAverage={item.averageRating} initialCount={item.ratingsCount} onRated={({ average, count }) => { /* optimistic update */ }} />
                </details>
                <details className="group inline-block ml-2">
                  <summary className="list-none inline-flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold text-black cursor-pointer select-none">💬 Comments</summary>
                  <Comments foodId={item._id} />
                </details>
              </div>
              {item.foodPartner && !storeName && (
                <Link className="pointer-events-auto mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black" to={"/partner/" + item.foodPartner + "/reels"}>View Store Reels</Link>
              )}
              {item.orderUrl && (
                <a className="pointer-events-auto ml-2 mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-3 py-2 text-xs font-semibold text-white" href={item.orderUrl} target="_blank" rel="noreferrer">Order now</a>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}


