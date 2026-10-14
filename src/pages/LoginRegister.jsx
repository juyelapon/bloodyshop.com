
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(previous => ({
      ...previous,
      [name]: value
    }))

    setErrors(previous => ({
      ...previous,
      [name]: ''
    }))

    setMessage('')
  }

  // Switch between Login and Register
  const switchMode = (loginMode) => {
    setIsLogin(loginMode)
    setShowPassword(false)
    setErrors({})
    setMessage('')
    setIsSuccess(false)
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Please enter your full name.'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.'
    }

    if (
      !isLogin &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    setMessage('')
    setIsSuccess(false)

    if (!validateForm()) return

    // Demo-only feedback: no real authentication is performed.
    setIsSuccess(true)

    if (isLogin) {
      setMessage(
        'Form validated successfully! Connect a backend to log in securely.'
      )
    } else {
      setMessage(
        'Registration form validated successfully! Connect a backend to create your account.'
      )
    }
  }

  const inputClass = (field) =>
    `w-full rounded-xl border bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
      errors[field]
        ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-50'
    }`

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/60 border border-gray-100">

        {/* Left Promotional Panel */}
        <section className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white p-10 xl:p-14 min-h-[680px]">

          {/* Decorative Background */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-indigo-300/20 blur-3xl" />

          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-xl bg-white text-blue-700 flex items-center justify-center font-black text-xl shadow-lg">
                S
              </div>

              <span className="text-2xl font-bold tracking-tight">
                ShopHub
              </span>
            </Link>
          </div>

          <div className="relative z-10 max-w-lg">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-medium">
              <span className="w-2 h-2 bg-green-300 rounded-full" />
              Your shopping journey starts here
            </span>

            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mt-7">
              Discover products.
              <br />
              Shop with
              <span className="text-blue-200"> confidence.</span>
            </h1>

            <p className="text-blue-100 leading-7 mt-6 max-w-md">
              Find your favourite products in one place. Enjoy a simple,
              convenient shopping experience with ShopHub.
            </p>

            {/* Feature List */}
            <div className="space-y-5 mt-10">
              {[
                {
                  icon: '✓',
                  title: 'A smooth shopping experience',
                  description: 'Browse products with ease.'
                },
                {
                  icon: '◇',
                  title: 'Discover great products',
                  description: 'Explore different categories.'
                },
                {
                  icon: '♡',
                  title: 'Made for your convenience',
                  description: 'Manage your shopping in one place.'
                }
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-lg shrink-0">
                    {feature.icon}
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {feature.title}
                    </h3>

                    <p className="text-sm text-blue-100 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-sm text-blue-100">
            © {new Date().getFullYear()} ShopHub. All rights reserved.
          </p>
        </section>

        {/* Right Form Panel */}
        <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-12 xl:p-14">

          {/* Mobile Logo */}
          <Link
            to="/"
            className="lg:hidden inline-flex items-center gap-3 mb-9"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl">
              S
            </div>

            <span className="text-2xl font-bold text-gray-900">
              ShopHub
            </span>
          </Link>

          {/* Heading */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Welcome to ShopHub
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </h2>

            <p className="text-gray-500 leading-6 mt-3">
              {isLogin
                ? 'Enter your details to continue your shopping journey.'
                : 'Join ShopHub and start exploring our collection.'}
            </p>
          </div>

          {/* Mode Switch */}
          <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-xl p-1 mt-8">
            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`rounded-lg py-3 text-sm font-semibold transition ${
                isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`rounded-lg py-3 text-sm font-semibold transition ${
                !isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">

            {/* Full Name */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={inputClass('name')}
                />

                {errors.name && (
                  <p id="name-error" className="text-xs text-red-500 mt-2">
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`${inputClass('email')} pl-12`}
                />
              </div>

              {errors.email && (
                <p id="email-error" className="text-xs text-red-500 mt-2">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                {isLogin && (
                  <button
                    type="button"
                    onClick={() =>
                      setMessage(
                        'Password recovery will be available after backend integration.'
                      )
                    }
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`${inputClass('password')} pl-12 pr-16`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(previous => !previous)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-blue-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {errors.password && (
                <p id="password-error" className="text-xs text-red-500 mt-2">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={
                    errors.confirmPassword
                      ? 'confirm-password-error'
                      : undefined
                  }
                  className={inputClass('confirmPassword')}
                />

                {errors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    className="text-xs text-red-500 mt-2"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Remember Me */}
            {isLogin && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600 rounded"
                />

                <span className="text-sm text-gray-600">
                  Remember me
                </span>
              </label>
            )}

            {/* Feedback */}
            {message && (
              <div
                role="status"
                aria-live="polite"
                className={`rounded-xl border p-3 text-sm leading-6 ${
                  isSuccess
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-blue-200 bg-blue-50 text-blue-700'
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 text-white font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition"
            >
              {isLogin ? 'Login to Your Account' : 'Create Account'}
              <span>→</span>
            </button>
          </form>

          {/* Switch Mode */}
          <p className="text-sm text-center text-gray-500 mt-7">
            {isLogin
              ? "Don't have an account?"
              : 'Already have an account?'}

            <button
              type="button"
              onClick={() => switchMode(!isLogin)}
              className="font-semibold text-blue-600 hover:text-blue-800 ml-1"
            >
              {isLogin ? 'Register now' : 'Login here'}
            </button>
          </p>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-blue-600 transition"
            >
              ← Back to ShopHub
            </Link>

            <p className="text-xs text-gray-400 mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default LoginRegister
