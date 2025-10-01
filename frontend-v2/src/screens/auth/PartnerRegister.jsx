import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../lib/api'

export default function PartnerRegister() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    await api.post('/api/auth/food-partner/register', { fullName, contactName, phone, address, email, password })
    navigate('/food-partner/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 dark:bg-[#0b0c0f] dark:text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white/90 p-6 md:p-8 dark:border-white/10 dark:bg-[#101218]/80">
        <header className="mb-6"><h1 className="text-2xl font-semibold tracking-tight">Partner registration</h1></header>
        <nav className="mb-6 -mt-1 text-sm"><Link className="underline" to="/user/register">User</Link><span className="px-2">•</span><Link className="underline" to="/food-partner/register">Food partner</Link></nav>
        <form className="grid gap-4" onSubmit={submit}>
          <input id="p-fullname" name="organization" autoComplete="organization" placeholder="Business full name" className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-[#0f1117]" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input id="p-contact" name="name" autoComplete="name" placeholder="Contact person name" className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-[#0f1117]" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          <input id="p-phone" name="tel" autoComplete="tel" placeholder="Phone" inputMode="tel" className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-[#0f1117]" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input id="p-address" name="street-address" autoComplete="street-address" placeholder="Address" className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-[#0f1117]" value={address} onChange={(e) => setAddress(e.target.value)} />
          <input id="p-email" name="email" autoComplete="email" placeholder="Email" className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-[#0f1117]" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input id="p-password" name="new-password" autoComplete="new-password" type="password" placeholder="Password" className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-[#0f1117]" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white" type="submit">Register</button>
        </form>
        <div className="mt-6 text-center text-sm">Already a partner? <Link to="/food-partner/login" className="underline">Sign in</Link></div>
      </div>
    </div>
  )
}


