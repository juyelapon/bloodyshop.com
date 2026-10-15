
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase'

const LoginRegister = () => {
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const saveUserProfile = (user) => {
    const sessionUser = {
      uid: user.uid,
      fullName: user.displayName || user.email?.split('@')[0] || 'User',
      name: user.displayName || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      photoURL: user.photoURL || '',
    }

    localStorage.setItem(
      'shophub_current_user',
      JSON.stringify(sessionUser)
    )

    let existingProfile = {}

    try {
      const parsed = JSON.parse(
        localStorage.getItem('shopHubUser') || 'null'
      )

      if (
        parsed &&
        parsed.email?.toLowerCase() === sessionUser.email.toLowerCase()
      ) {
        existingProfile = parsed
      }
    } catch {
      existingProfile = {}
    }

    localStorage.setItem(
      'shopHubUser',
      JSON.stringify({
        ...existingProfile,
        ...sessionUser,
        phone: existingProfile.phone || '',
        address: existingProfile.address || '',
        city: existingProfile.city || '',
        postalCode: existingProfile.postalCode || '',
        country: existingProfile.country || 'Bangladesh',
      })
    )

    window.dispatchEvent(new Event('authUpdated'))
  }

  const getFirebaseError = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'

      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.'

      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in.'

      case 'auth/weak-password':
        return 'Please choose a stronger password.'

      case 'auth/popup-closed-by-user':
        return 'The Google sign-in popup was closed before completion.'

      case 'auth/popup-blocked':
        return 'Your browser blocked the popup. Please allow popups and try again.'

      case 'auth/cancelled-popup-request':
        return 'A sign-in popup is already open. Please try again.'

      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.'

      case 'auth/unauthorized-domain':
        return 'This website domain is not authorized in Firebase Authentication.'

      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled in Firebase Console.'

      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using another sign-in method.'

      default:
        return error.message || 'Something went wrong. Please try again.'
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }))

    setMessage('')
    setIsSuccess(false)
  }

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
      confirmPassword: '',
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Please enter your full name.'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setIsSuccess(false)

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const email = formData.email.trim().toLowerCase()
      let userCredential

      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          formData.password
        )
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          formData.password
        )

        await updateProfile(userCredential.user, {
          displayName: formData.name.trim(),
        })
      }

      saveUserProfile(userCredential.user)

      setIsSuccess(true)
      setMessage(
        isLogin
          ? 'Login successful! Welcome back.'
          : 'Registration successful! Your account has been created.'
      )

      navigate('/')
    } catch (error) {
      console.error('Authentication error:', error)
      setIsSuccess(false)
      setMessage(getFirebaseError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setMessage('')
    setIsSuccess(false)
    setIsLoading(true)

    try {
      const provider = new GoogleAuthProvider()

      provider.setCustomParameters({
        prompt: 'select_account',
      })

      const result = await signInWithPopup(auth, provider)

      saveUserProfile(result.user)

      setIsSuccess(true)
      setMessage('Google sign-in successful! Welcome to ShopHub.')

      navigate('/')
    } catch (error) {
      console.error('Google sign-in error:', error)
      setIsSuccess(false)
      setMessage(getFirebaseError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full rounded-xl border bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
      errors[field]
        ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-50'
    }`

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 flex items-center justify-center sm:py-14">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60 lg:grid-cols-2">

        {/* Left Promotional Panel */}
        <section className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-10 text-white lg:flex xl:p-14">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-black text-blue-700 shadow-lg">
                S
              </div>

              <span className="text-2xl font-bold tracking-tight">
                ShopHub
              </span>
            </Link>
          </div>

          <div className="relative z-10 max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-green-300" />
              Your shopping journey starts here
            </span>

            <h1 className="mt-7 text-4xl font-bold leading-tight xl:text-5xl">
              Discover products.
              <br />
              Shop with
              <span className="text-blue-200"> confidence.</span>
            </h1>

            <p className="mt-6 max-w-md leading-7 text-blue-100">
              Find your favourite products in one place. Enjoy a simple,
              convenient shopping experience with ShopHub.
            </p>

            <div className="mt-10 space-y-5">
              {[
                {
                  icon: '✓',
                  title: 'A smooth shopping experience',
                  description: 'Browse products with ease.',
                },
                {
                  icon: '◇',
                  title: 'Discover great products',
                  description: 'Explore different categories.',
                },
                {
                  icon: '♡',
                  title: 'Made for your convenience',
                  description: 'Manage your shopping in one place.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-lg">
                    {feature.icon}
                  </div>

                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="mt-1 text-sm text-blue-100">
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
          <Link
            to="/"
            className="mb-9 inline-flex items-center gap-3 lg:hidden"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white">
              S
            </div>

            <span className="text-2xl font-bold text-gray-900">
              ShopHub
            </span>
          </Link>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Welcome to ShopHub
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </h2>

            <p className="mt-3 leading-6 text-gray-500">
              {isLogin
                ? 'Enter your details to continue your shopping journey.'
                : 'Join ShopHub and start exploring our collection.'}
            </p>
          </div>

          {/* Mode Switch */}
          <div className="mt-8 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
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

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.63 5.91c4.45-4.11 7.14-10.16 7.14-17.56Z" />
              <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.89l-7.63-5.91c-2.12 1.42-4.84 2.26-8.27 2.26-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z" />
            </svg>

            {isLoading ? 'Please wait...' : 'Continue with Google'}
          </button>

          <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Or continue with email
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
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
                  <p id="name-error" className="mt-2 text-xs text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
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
                <p id="email-error" className="mt-2 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
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
                        'Password recovery will be available after Firebase password reset is added.'
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
                  aria-describedby={
                    errors.password ? 'password-error' : undefined
                  }
                  className={`${inputClass('password')} pl-12 pr-16`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-blue-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {errors.password && (
                <p id="password-error" className="mt-2 text-xs text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-gray-700"
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
                    className="mt-2 text-xs text-red-500"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Remember Me */}
            {isLogin && (
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-blue-600"
                />

                <span className="text-sm text-gray-600">Remember me</span>
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
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? 'Please wait...'
                : isLogin
                  ? 'Login to Your Account'
                  : 'Create Account'}
              {!isLoading && <span>→</span>}
            </button>
          </form>

          {/* Switch Mode */}
          <p className="mt-7 text-center text-sm text-gray-500">
            {isLogin
              ? "Don't have an account?"
              : 'Already have an account?'}

            <button
              type="button"
              onClick={() => switchMode(!isLogin)}
              className="ml-1 font-semibold text-blue-600 hover:text-blue-800"
            >
              {isLogin ? 'Register now' : 'Login here'}
            </button>
          </p>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-100 pt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 transition hover:text-blue-600"
            >
              ← Back to ShopHub
            </Link>

            <p className="mt-4 text-xs text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default LoginRegister
