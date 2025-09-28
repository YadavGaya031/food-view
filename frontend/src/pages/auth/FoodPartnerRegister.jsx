import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        'http://localhost:3000/api/auth/food-partner/register',
        {
          fullName: businessName,
          contactName,
          phone,
          email,
          password,
          address,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        navigate('/create-food');
      })
      .catch((error) => {
        console.error('There was an error registering!', error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 dark:bg-[#0b0c0f] dark:text-slate-100 flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white/90 shadow-[0_8px_24px_rgba(16,24,40,.08),_0_1px_4px_rgba(16,24,40,.08)] backdrop-blur-md p-6 md:p-8
                   dark:border-white/10 dark:bg-[#101218]/80 dark:shadow-[0_10px_30px_rgba(0,0,0,.35),_0_2px_8px_rgba(0,0,0,.25)]"
        role="region"
        aria-labelledby="partner-register-title"
      >
        <header className="mb-6">
          <h1 id="partner-register-title" className="text-2xl font-semibold tracking-tight">Partner sign up</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300/90">Grow your business with our platform.</p>
        </header>

        <nav className="mb-6 -mt-1 text-sm text-slate-600 dark:text-slate-300/90">
          <strong className="font-semibold text-slate-900 dark:text-slate-100">Switch:</strong>{' '}
          <Link className="underline underline-offset-4 hover:no-underline decoration-slate-300 dark:decoration-white/30" to="/user/register">User</Link>
          <span className="px-2">•</span>
          <Link className="underline underline-offset-4 hover:no-underline decoration-slate-300 dark:decoration-white/30" to="/food-partner/register">Food partner</Link>
        </nav>

        <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-1.5">
            <label htmlFor="businessName" className="text-sm font-medium">Business Name</label>
            <input
              id="businessName"
              name="businessName"
              placeholder="Tasty Bites"
              autoComplete="organization"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none placeholder:text-slate-400
                         focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
                         dark:border-white/10 dark:bg-[#0f1117] dark:placeholder:text-slate-400/70"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <label htmlFor="contactName" className="text-sm font-medium">Contact Name</label>
              <input
                id="contactName"
                name="contactName"
                placeholder="Jane Doe"
                autoComplete="name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none placeholder:text-slate-400
                           focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
                           dark:border-white/10 dark:bg-[#0f1117] dark:placeholder:text-slate-400/70"
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="phone" className="text-sm font-medium">Phone</label>
              <input
                id="phone"
                name="phone"
                placeholder="+1 555 123 4567"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none placeholder:text-slate-400
                           focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
                           dark:border-white/10 dark:bg-[#0f1117] dark:placeholder:text-slate-400/70"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="business@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none placeholder:text-slate-400
                         focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
                         dark:border-white/10 dark:bg-[#0f1117] dark:placeholder:text-slate-400/70"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none placeholder:text-slate-400
                         focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
                         dark:border-white/10 dark:bg-[#0f1117] dark:placeholder:text-slate-400/70"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="address" className="text-sm font-medium">Address</label>
            <input
              id="address"
              name="address"
              placeholder="123 Market Street"
              autoComplete="street-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none placeholder:text-slate-400
                         focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
                         dark:border-white/10 dark:bg-[#0f1117] dark:placeholder:text-slate-400/70"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">Full address helps customers find you faster.</p>
          </div>

          <button
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white
                       shadow-[0_8px_24px_rgba(16,24,40,.12)] transition hover:brightness-95 active:translate-y-[1px]
                       focus:outline-none focus:ring-4 focus:ring-blue-500/30
                       dark:shadow-[0_10px_30px_rgba(0,0,0,.45)]"
            type="submit"
          >
            Create Partner Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300/90">
          Already a partner?{' '}
          <Link
            to="/food-partner/login"
            className="font-medium underline underline-offset-4 decoration-slate-300 hover:no-underline dark:decoration-white/30"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;