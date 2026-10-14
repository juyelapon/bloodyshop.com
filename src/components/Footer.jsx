import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Categories', to: '/categories' },
  { label: 'Deals', to: '/deals' },
  { label: 'About Us', to: '/about' },
]

const customerLinks = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'Shipping Info', to: '/deals/free-shipping' },
  { label: 'Returns', to: '/contact?topic=returns' },
  { label: 'FAQ', to: '/contact?topic=faq' },
]

const Footer = () => {
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isError, setIsError] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()

    const cleanEmail = email.trim()

    if (!cleanEmail) {
      setFeedback('Please enter your email address.')
      setIsError(true)
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(cleanEmail)) {
      setFeedback('Please enter a valid email address.')
      setIsError(true)
      return
    }

    // Demo only: no newsletter backend is connected.
    setFeedback(
      'Your email is valid! Newsletter subscription requires backend integration.'
    )
    setIsError(false)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setFeedback('')
  }

  return (
    <footer className="bg-[#111827] text-gray-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pt-12 pb-8">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-block text-2xl font-bold text-white"
            >
              ShopHub
              <span className="text-blue-500">.</span>
            </Link>

            <p className="text-sm leading-6 text-gray-400 mt-4 max-w-xs">
              Discover great products, enjoy exciting deals, and make your
              shopping experience simple and convenient.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <span
                aria-label="Facebook"
                title="Facebook"
                className="w-9 h-9 rounded-full bg-[#1F2937] flex items-center justify-center text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
                </svg>
              </span>

              <span
                aria-label="Twitter"
                title="Twitter"
                className="w-9 h-9 rounded-full bg-[#1F2937] flex items-center justify-center text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M22 5.9a8 8 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.4 8.4 0 0 1-2.7 1 4.2 4.2 0 0 0-7.2 3.8A11.9 11.9 0 0 1 2.9 4.8a4.2 4.2 0 0 0 1.3 5.6 4.1 4.1 0 0 1-1.9-.5v.1a4.2 4.2 0 0 0 3.4 4.1 4.2 4.2 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.5 8.5 0 0 1 1.5 19a12 12 0 0 0 18.5-10.1v-.5A8.5 8.5 0 0 0 22 5.9Z" />
                </svg>
              </span>

              <span
                aria-label="Instagram"
                title="Instagram"
                className="w-9 h-9 rounded-full bg-[#1F2937] flex items-center justify-center text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
                </svg>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white hover:translate-x-1 inline-block transition duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Customer Service
            </h3>

            <ul className="space-y-3">
              {customerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white hover:translate-x-1 inline-block transition duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Newsletter
            </h3>

            <p className="text-sm text-gray-400 leading-6 mb-4">
              Subscribe to receive updates about new products and special
              offers.
            </p>

            <form onSubmit={handleSubscribe} noValidate>
              <div className="flex items-stretch gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Your Email"
                  aria-label="Your email address"
                  aria-invalid={isError}
                  className="min-w-0 flex-1 rounded-lg bg-[#1F2937] border border-gray-700 px-3 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Subscribe
                </button>
              </div>

              {feedback && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`mt-3 text-xs leading-5 ${
                    isError ? 'text-red-400' : 'text-blue-300'
                  }`}
                >
                  {feedback}
                </p>
              )}
            </form>

            <p className="text-xs text-gray-500 mt-3">
              Demo form — email subscriptions are not saved.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1F2937]" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} ShopHub. All rights reserved.
          </p>

          <Link
            to="/"
            className="text-xs text-gray-500 hover:text-white transition"
          >
            Back to Home ↑
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer