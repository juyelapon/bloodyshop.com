
import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { FiShield, FiLock, FiMail, FiArrowLeft } from 'react-icons/fi'

const AdminLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    // Demo credentials only — not secure for production.
    const adminEmail = 'admin@shophub.com'
    const adminPassword = 'ShopHub@123'

    if (email.trim() === adminEmail && password === adminPassword) {
      sessionStorage.setItem('shophub_admin_logged_in', 'true')

      const destination = location.state?.from?.pathname || '/admin'
      navigate(destination, { replace: true })
    } else {
      setError('Invalid email or password.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition"
        >
          <FiArrowLeft />
          Back to ShopHub
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-7 sm:p-9">
          <div className="flex justify-center mb-5">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600">
              <FiShield size={32} />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-slate-900">
            Admin Login
          </h1>

          <p className="text-sm text-slate-500 text-center mt-2 mb-7">
            Sign in to access the ShopHub dashboard.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email Address
              </label>

              <div className="relative">
                <FiMail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  autoComplete="username"
                  required
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <FiLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  required
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Sign In to Dashboard
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            ShopHub Admin Portal
          </p>
        </div>
      </div>
    </main>
  )
}

export default AdminLogin
