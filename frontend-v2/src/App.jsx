import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes.jsx'

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}


