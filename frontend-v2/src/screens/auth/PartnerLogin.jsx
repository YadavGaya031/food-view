import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../lib/api'

export default function PartnerLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const res = await api.post('/api/auth/food-partner/login', { email, password })
    navigate('/food-partner/' + res.data.foodPartner._id)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 dark:bg-[#0b0c0f] dark:text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/90 p-6 md:p-8 dark:border-white/10 dark:bg-[#101218]/80">
        <header className="mb-6"><h1 className="text-2xl font-semibold tracking-tight">Partner login</h1></header>
        <nav className="mb-6 -mt-1 text-sm"><Link className="underline" to="/user/login">User</Link><span className="px-2">•</span><Link className="underline" to="/food-partner/login">Food partner</Link></nav>
        <form className="grid gap-4" onSubmit={submit}>
          <input id="partner-email" name="email" autoComplete="email" placeholder="business@example.com" className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-[#0f1117]" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input id="partner-password" name="password" type="password" autoComplete="current-password" placeholder="Password" className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-[#0f1117]" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white" type="submit">Sign In</button>
      </form>
      <div className="mt-6 text-center text-sm">New partner? <Link to="/food-partner/register" className="underline">Create an account</Link></div>
      </div>
    </div>
  )
}


