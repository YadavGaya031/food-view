import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../screens/Home.jsx'
import Saved from '../screens/Saved.jsx'
import Nearby from '../screens/Nearby.jsx'
import CreateFood from '../screens/CreateFood.jsx'
import PartnerProfile from '../screens/PartnerProfile.jsx'
import UserLogin from '../screens/auth/UserLogin.jsx'
import UserRegister from '../screens/auth/UserRegister.jsx'
import PartnerLogin from '../screens/auth/PartnerLogin.jsx'
import PartnerRegister from '../screens/auth/PartnerRegister.jsx'
import UserProfile from '../screens/UserProfile.jsx'
import PartnerReels from '../screens/PartnerReels.jsx'
import Layout from '../ui/Layout.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}> 
        <Route path="/" element={<Home />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/nearby" element={<Nearby />} />
      <Route path="/profile" element={<UserProfile />} />
      </Route>
      <Route path="/create-food" element={<CreateFood />} />
      <Route path="/food-partner/:id" element={<PartnerProfile />} />
      <Route path="/partner/:partnerId/reels" element={<PartnerReels />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/food-partner/login" element={<PartnerLogin />} />
      <Route path="/food-partner/register" element={<PartnerRegister />} />
    </Routes>
  )
}


