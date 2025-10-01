import React, { useEffect, useMemo, useRef, useState } from 'react'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function CreateFood() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [videoURL, setVideoURL] = useState('')
  const [fileError, setFileError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [price, setPrice] = useState('')
  const [orderUrl, setOrderUrl] = useState('')
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!videoFile) { setVideoURL(''); return }
    const url = URL.createObjectURL(videoFile)
    setVideoURL(url)
    return () => URL.revokeObjectURL(url)
  }, [videoFile])

  const isVideoFile = (file) => file && file.type?.startsWith('video/')
  const MAX_BYTES = 100 * 1024 * 1024

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) { setVideoFile(null); setFileError(''); return }
    if (!isVideoFile(file)) { setVideoFile(null); setFileError('Please select a valid video file.'); return }
    if (file.size > MAX_BYTES) { setVideoFile(null); setFileError('File too large (max ~100MB).'); return }
    setFileError(''); setVideoFile(file)
  }

  const onDrop = (e) => {
    e.preventDefault(); e.stopPropagation()
    const file = e.dataTransfer?.files?.[0]
    if (!file) return
    if (!isVideoFile(file)) { setVideoFile(null); setFileError('Please drop a valid video file.'); return }
    if (file.size > MAX_BYTES) { setVideoFile(null); setFileError('File too large (max ~100MB).'); return }
    setFileError(''); setVideoFile(file)
  }

  const onDragOver = (e) => { e.preventDefault() }
  const openFileDialog = () => fileInputRef.current?.click()

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!name.trim() || !videoFile) return
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    if (price) formData.append('price', String(Number(price) || 0))
    if (orderUrl) formData.append('orderUrl', orderUrl)
    formData.append('video', videoFile)
    try {
      setSubmitting(true)
      setProgress(1)
      const response = await api.post('/api/food', formData, {
        onUploadProgress: (evt) => {
          const total = evt.total || (evt.progress ? evt.loaded / evt.progress : 0)
          const pct = total ? Math.min(100, Math.round((evt.loaded / total) * 100)) : Math.min(95, Math.round((evt.loaded / (videoFile?.size || 1)) * 100))
          setProgress(pct)
        }
      })
      setProgress(100)
      const partnerId = response?.data?.foodPartnerId ?? response?.data?.food?.foodPartner ?? response?.data?.food?.foodPartnerId
      if (partnerId) navigate(`/food-partner/${partnerId}`); else navigate('/create-food')
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Something went wrong while creating the food. Please try again.')
    } finally {
      setTimeout(() => setProgress(0), 700)
      setSubmitting(false)
    }
  }

  const isDisabled = useMemo(() => !name.trim() || !videoFile || submitting, [name, videoFile, submitting])

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 text-slate-900 dark:bg-[#0b0c0f] dark:text-slate-100 flex items-center justify-center px-4 py-10">
      {progress > 0 && (
        <div className="fixed inset-x-0 top-0 z-[60]">
          <div className="h-0.5 w-full bg-transparent">
            <div className="h-0.5 bg-blue-600 transition-[width] duration-200 ease-out dark:bg-blue-400" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white/90 shadow-md backdrop-blur-md p-6 md:p-8 dark:border-white/10 dark:bg-[#101218]/80 dark:shadow-black/40">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Create Food</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300/90">Upload a short video, give it a name, and add a description.</p>
        </header>

        <form className="grid gap-6" onSubmit={onSubmit} noValidate>
          <div className="grid gap-2">
            <label htmlFor="foodVideo" className="text-sm font-medium">Food Video</label>
            <input id="foodVideo" ref={fileInputRef} type="file" accept="video/*" onChange={onFileChange} className="hidden" />
            <div role="button" tabIndex={0} onClick={openFileDialog} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFileDialog() } }} onDrop={onDrop} onDragOver={onDragOver} className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center shadow-sm hover:border-blue-400 hover:bg-blue-50/40 dark:border-white/10 dark:bg-[#0f1117] dark:hover:border-blue-400/60">
              <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                <svg className="text-slate-500 dark:text-slate-400" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M10.8 3.2a1 1 0 0 1 .4-.08h1.6a1 1 0 0 1 1 1v1.6h1.6a1 1 0 0 1 1 1v1.6h1.6a1 1 0 0 1 1 1v7.2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6.4a1 1 0 0 1 1-1h1.6V3.2a1 1 0 0 1 1-1h1.6a1 1 0 0 1 .6.2z" stroke="currentColor" strokeWidth="1.5" /><path d="M9 12.75v-1.5c0-.62.67-1 1.2-.68l4.24 2.45c.53.3.53 1.05 0 1.35L10.2 16.82c-.53.31-1.2-.06-1.2-.68v-1.5" fill="currentColor" /></svg>
                <div className="text-sm"><strong>Tap to upload</strong> or drag and drop</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">MP4, WebM, MOV • Up to ~100MB</div>
              </div>
            </div>

            {fileError && <p className="text-sm text-red-500" role="alert">{fileError}</p>}
            {videoFile && (
              <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-[#0f1117]">
                <div className="min-w-0 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12.75v-1.5c0-.62.67-1 1.2-.68l4.24 2.45c.53.3.53 1.05 0 1.35L10.2 16.82c-.53.31-1.2-.06-1.2-.68v-1.5" /></svg>
                  <span className="truncate">{videoFile.name}</span>
                  <span className="shrink-0 text-slate-500 dark:text-slate-400">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</span>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button type="button" onClick={openFileDialog} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-gray-50 dark:border-white/10 dark:bg-[#101218]">Change</button>
                  <button type="button" onClick={() => { setVideoFile(null); setFileError('') }} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">Remove</button>
                </div>
              </div>
            )}
          </div>

          {videoURL && (
            <div className="rounded-2xl border border-gray-200 p-2 shadow-sm dark:border-white/10">
              <div className="relative mx-auto w-full max-h-[70vh]">
                <video className="aspect-[9/16] w-full max-h-[70vh] rounded-xl bg-black object-contain" src={videoURL} controls playsInline preload="metadata" />
              </div>
            </div>
          )}

          <div className="grid gap-1.5">
            <label htmlFor="foodName" className="text-sm font-medium">Name</label>
            <input id="foodName" type="text" placeholder="e.g., Spicy Paneer Wrap" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-white/10 dark:bg-[#0f1117] dark:placeholder:text-slate-400/70" />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="foodDesc" className="text-sm font-medium">Description</label>
            <textarea id="foodDesc" rows={4} placeholder="Write a short description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-white/10 dark:bg-[#0f1117] dark:placeholder:text-slate-400/70" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <label htmlFor="price" className="text-sm font-medium">Price</label>
              <input id="price" type="number" inputMode="decimal" placeholder="e.g., 9.99" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-white/10 dark:bg-[#0f1117] dark:placeholder:text-slate-400/70" />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="orderUrl" className="text-sm font-medium">Order URL</label>
              <input id="orderUrl" type="url" placeholder="https://your-site.com/order/123" value={orderUrl} onChange={(e) => setOrderUrl(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-white/10 dark:bg-[#0f1117] dark:placeholder:text-slate-400/70" />
            </div>
          </div>

          {submitError && <p className="text-sm text-red-500 -mt-2" role="alert">{submitError}</p>}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-50 dark:border-white/10 dark:bg-[#101218] dark:hover:bg-[#1a1c22]">Cancel</button>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-md hover:brightness-95 active:translate-y-[1px] focus:outline-none focus:ring-4 focus:ring-blue-500/30 dark:shadow-black/40 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isDisabled}>
              {submitting ? 'Saving…' : 'Save Food'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


