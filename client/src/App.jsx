import React from 'react'
import Login from './Components/Login/Login'
import Dashboard from './Components/Dashboard/Dashboard'
import Status from './Components/satelliteStatus/Status'
import AdminPanel from './Components/Admin/Admin'
import Visuals from './Components/Visuals/Visuals'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'leaflet/dist/leaflet.css';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/uuid" element={<Dashboard />} />
        <Route path="/dashboard/status" element={<Status />} />
        <Route path="/dashboard/admin" element={<AdminPanel />} />
        <Route path="/dashboard/visuals" element={<Visuals />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App