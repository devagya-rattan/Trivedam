import React from 'react'
import './Admin.css'

const AdminPanel = () => {
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>🛰️ SatAdmin</h2>
        <nav>
          <ul>
            <li className="active">Dashboard</li>
            <li>Status</li>
            <li>Logs</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Welcome, Admin</h1>
        </header>

        <section className="admin-content">
          <div className="admin-card">📡 Active Satellites: <span>5</span></div>
          <div className="admin-card">⚙️ System Health: <span>Optimal</span></div>
          <div className="admin-card">📥 Uplink Rate: <span>120.5 Mbps</span></div>
          <div className="admin-card">📤 Downlink Rate: <span>2200.3 MHz</span></div>
        </section>
      </main>
    </div>
  )
}

export default AdminPanel
