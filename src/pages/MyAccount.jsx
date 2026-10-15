
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const readStorage = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null')
    return value ?? fallback
  } catch {
    return fallback
  }
}

const normalizeEmail = (email) =>
  String(email || '').trim().toLowerCase()

const getOrderEmail = (order) =>
  normalizeEmail(order.userEmail || order.customer?.email)

const MyAccount = () => {
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(() =>
    readStorage('shophub_current_user', null)
  )

  const [user, setUser] = useState(() => {
    const savedUser = readStorage('shopHubUser', {})
    const sessionUser = readStorage('shophub_current_user', null)

    return {
      fullName: sessionUser?.fullName || savedUser.fullName || '',
      email: sessionUser?.email || savedUser.email || '',
      phone: savedUser.phone || '',
      address: savedUser.address || '',
      city: savedUser.city || '',
      postalCode: savedUser.postalCode || '',
      country: savedUser.country || '',
    }
  })

  const [orders, setOrders] = useState([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  const loadAccountData = useCallback(() => {
    const sessionUser = readStorage('shophub_current_user', null)
    const savedUser = readStorage('shopHubUser', {})
    const allOrders = readStorage('orders', [])
    const wishlist = readStorage('wishlist', [])

    setCurrentUser(sessionUser)

    if (!sessionUser?.email) {
      setOrders([])
      setWishlistCount(0)
      return
    }

    setUser({
      fullName: sessionUser.fullName || savedUser.fullName || '',
      email: sessionUser.email || savedUser.email || '',
      phone: savedUser.phone || '',
      address: savedUser.address || '',
      city: savedUser.city || '',
      postalCode: savedUser.postalCode || '',
      country: savedUser.country || '',
    })

    const email = normalizeEmail(sessionUser.email)

    setOrders(
      Array.isArray(allOrders)
        ? allOrders.filter(
            (order) => getOrderEmail(order) === email
          ).reverse()
        : []
    )

    setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0)
  }, [])

  useEffect(() => {
    loadAccountData()

    window.addEventListener('storage', loadAccountData)
    window.addEventListener('ordersUpdated', loadAccountData)
    window.addEventListener('authUpdated', loadAccountData)
    window.addEventListener('wishlistUpdated', loadAccountData)

    return () => {
      window.removeEventListener('storage', loadAccountData)
      window.removeEventListener('ordersUpdated', loadAccountData)
      window.removeEventListener('authUpdated', loadAccountData)
      window.removeEventListener('wishlistUpdated', loadAccountData)
    }
  }, [loadAccountData])

  const handleChange = (event) => {
    const { name, value } = event.target

    setUser((previous) => ({
      ...previous,
      [name]: value,
    }))

    setMessage('')
  }

  const saveProfile = (event) => {
    event.preventDefault()

    if (!currentUser?.email) {
      setMessageType('error')
      setMessage('Please log in to update your profile.')
      return
    }

    if (!user.fullName.trim() || !user.email.trim()) {
      setMessageType('error')
      setMessage('Name and email are required.')
      return
    }

    const normalizedEmail = normalizeEmail(user.email)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setMessageType('error')
      setMessage('Please enter a valid email address.')
      return
    }

    const previousEmail = normalizeEmail(currentUser.email)

    // Keep this demo account linked to its original order email.
    // Email changes are not allowed here because orders are tied to it.
    if (normalizedEmail !== previousEmail) {
      setMessageType('error')
      setMessage(
        'Changing the account email is not supported in this demo because orders are linked to your login email.'
      )
      return
    }

    const updatedProfile = {
      ...user,
      fullName: user.fullName.trim(),
      email: normalizedEmail,
    }

    const updatedSession = {
      ...currentUser,
      fullName: updatedProfile.fullName,
      email: normalizedEmail,
    }

    try {
      localStorage.setItem(
        'shopHubUser',
        JSON.stringify(updatedProfile)
      )

      localStorage.setItem(
        'shophub_current_user',
        JSON.stringify(updatedSession)
      )

      setUser(updatedProfile)
      setCurrentUser(updatedSession)

      window.dispatchEvent(new Event('authUpdated'))

      setMessageType('success')
      setMessage('Your profile has been updated successfully.')
    } catch {
      setMessageType('error')
      setMessage('Unable to save your profile. Please try again.')
    }
  }

  const formatPrice = (price) =>
    `$${(Number(price) || 0).toFixed(2)}`

  const formatDate = (date) => {
    if (!date) return 'Date unavailable'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date unavailable'
    }

    return parsedDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const totalSpent = orders.reduce((sum, order) => {
    const status = String(order.status || '').toLowerCase()

    if (status === 'cancelled' || status === 'canceled') {
      return sum
    }

    return sum + (Number(order.total) || 0)
  }, 0)

  const inputClass =
    'w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

  if (!currentUser?.email) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <section className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="text-5xl">🔐</div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Login Required
          </h1>

          <p className="mt-3 text-gray-500">
            Please log in to access your account.
          </p>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-7 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Login
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Account Heading */}
        <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white sm:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/20 text-3xl font-bold">
              {(user.fullName || user.email || 'U')
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="text-sm text-blue-100">
                Welcome back,
              </p>

              <h1 className="mt-1 break-words text-3xl font-bold">
                {user.fullName || 'ShopHub Customer'}
              </h1>

              <p className="mt-2 break-all text-blue-100">
                {user.email}
              </p>
            </div>
          </div>
        </section>

        {/* Account Statistics */}
        <section className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {orders.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Wishlist Items</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {wishlistCount}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Spent
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {formatPrice(totalSpent)}
            </h2>
          </div>
        </section>

        {/* Profile Form */}
        <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900">
              Personal Information
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Update your profile and delivery details.
            </p>
          </div>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`mb-6 rounded-xl p-4 text-sm ${
                messageType === 'error'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={saveProfile}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  value={user.fullName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />

                <p className="mt-1 text-xs text-gray-400">
                  The login email cannot be changed in this demo.
                </p>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={user.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  value={user.country}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Delivery Address
                </label>

                <input
                  id="address"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  value={user.city}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Postal Code
                </label>

                <input
                  id="postalCode"
                  name="postalCode"
                  value={user.postalCode}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-7 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </section>

        {/* Quick Links */}
        <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Link
            to="/wishlist"
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="text-2xl">♡</div>
            <h3 className="mt-3 font-bold text-gray-900">
              My Wishlist
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              View your saved products.
            </p>
          </Link>

          <Link
            to="/cart"
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="text-2xl">🛒</div>
            <h3 className="mt-3 font-bold text-gray-900">
              Shopping Cart
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Review items before checkout.
            </p>
          </Link>
        </section>

        {/* Recent Orders */}
        <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Orders
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Your latest orders and their status.
              </p>
            </div>

            {orders.length > 0 && (
              <Link
                to="/my-orders"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                View All Orders →
              </Link>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-4xl">📦</div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No orders yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Your orders will appear here after checkout.
              </p>

              <Link
                to="/"
                className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-gray-100">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.orderId}
                  className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="break-all font-semibold text-gray-900">
                      {order.orderId || 'Order'}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span className="font-bold text-gray-900">
                      {formatPrice(order.total)}
                    </span>

                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                      {order.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default MyAccount
