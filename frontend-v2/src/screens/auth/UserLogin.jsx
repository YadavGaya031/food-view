import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../lib/api'

export default function UserLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    await api.post('/api/auth/user/login', { email, password })
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 dark:bg-[#0b0c0f] dark:text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/90 p-6 md:p-8 dark:border-white/10 dark:bg-[#101218]/80">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        </header>
        <nav className="mb-6 -mt-1 text-sm"><Link className="underline" to="/user/login">User</Link><span className="px-2">•</span><Link className="underline" to="/food-partner/login">Food partner</Link></nav>
        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium" htmlFor="login-email">Email</label>
            <input id="login-email" name="email" autoComplete="email" className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-[#0f1117]" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium" htmlFor="login-password">Password</label>
            <input id="login-password" name="password" type="password" autoComplete="current-password" className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-[#0f1117]" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white" type="submit">Sign In</button>
        </form>
        <div className="mt-6 text-center text-sm">New here? <Link to="/user/register" className="underline">Create account</Link></div>
      </div>
    </div>
  )
}


