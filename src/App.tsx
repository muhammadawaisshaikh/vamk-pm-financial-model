import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Documentation from './pages/Documentation'

function Layout() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 border-b border-slate-200 pb-6">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/VAMK_logo.png/500px-VAMK_logo.png"
                alt="VAMK (Vaasa University of Applied Sciences)"
                className="w-24 h-auto"
              />
              <div>
                <h1 className="text-2xl font-semibold">VAMK PM Financial Model</h1>
                <p className="text-sm text-slate-600">Interactive financial model with real-time calculations and charts</p>
              </div>
            </Link>

            <a
              href="https://www.linkedin.com/in/muhammadawaisshaikh/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded hover:shadow-md transition-shadow"
              title="Muhammad Awais — LinkedIn"
            >
              <img
                src="https://i.ibb.co/6yQQF1y/1670522766188-1.jpg"
                alt="Muhammad Awais"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-right">
                <div className="text-sm font-medium">Developed by: Muhammad Awais</div>
                <div className="text-xs text-slate-500">Master of Engineering (PM2025)</div>
              </div>
            </a>
          </div>

          <nav className="flex justify-center gap-8 text-sm">
            <Link to="/" className={`pb-1 border-b-2 transition-colors ${location.pathname === '/' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
              Calculator Model
            </Link>
            <Link to="/docs" className={`pb-1 border-b-2 transition-colors ${location.pathname === '/docs' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
              Course Documentation
            </Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Documentation />} />
        </Routes>

        <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} VAMK PM Financial Model. Educational Project – Not for commercial use.</p>
        </footer>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  )
}
