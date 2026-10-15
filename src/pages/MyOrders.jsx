
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
  normalizeEmail(
    order.userEmail || order.customer?.email
  )

const MyOrders = () => {
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(() =>
    readStorage('shophub_current_user', null)
  )

  const [orders, setOrders] = useState([])
  const [message, setMessage] = useState('')

  const loadOrders = useCallback(() => {
    const user = readStorage('shophub_current_user', null)
    const allOrders = readStorage('orders', [])

    setCurrentUser(user)

    if (!user?.email || !Array.isArray(allOrders)) {
      setOrders([])
      return
    }

    const userEmail = normalizeEmail(user.email)

    const userOrders = allOrders
      .filter((order) => getOrderEmail(order) === userEmail)
      .reverse()

    setOrders(userOrders)
  }, [])

  useEffect(() => {
    loadOrders()

    window.addEventListener('storage', loadOrders)
    window.addEventListener('ordersUpdated', loadOrders)
    window.addEventListener('authUpdated', loadOrders)

    return () => {
      window.removeEventListener('storage', loadOrders)
      window.removeEventListener('ordersUpdated', loadOrders)
      window.removeEventListener('authUpdated', loadOrders)
    }
  }, [loadOrders])

  const deleteOrder = (orderId) => {
    if (!currentUser?.email) {
      setMessage('Please log in to manage your orders.')
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this order?'
    )

    if (!confirmed) return

    const allOrders = readStorage('orders', [])

    if (!Array.isArray(allOrders)) {
      setMessage('Unable to load orders. Please try again.')
      return
    }

    const userEmail = normalizeEmail(currentUser.email)

    const orderToDelete = allOrders.find(
      (order) =>
        order.orderId === orderId &&
        getOrderEmail(order) === userEmail
    )

    if (!orderToDelete) {
      setMessage('This order could not be found in your account.')
      loadOrders()
      return
    }

    const updatedOrders = allOrders.filter(
      (order) =>
        !(
          order.orderId === orderId &&
          getOrderEmail(order) === userEmail
        )
    )

    try {
      localStorage.setItem(
        'orders',
        JSON.stringify(updatedOrders)
      )

      setMessage('Order deleted successfully.')
      window.dispatchEvent(new Event('ordersUpdated'))
      loadOrders()
    } catch {
      setMessage('Unable to delete the order. Please try again.')
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

  const statusClass = (status) => {
    const value = String(status || '').toLowerCase()

    if (value === 'delivered') {
      return 'bg-green-100 text-green-700'
    }

    if (value === 'cancelled' || value === 'canceled') {
      return 'bg-red-100 text-red-700'
    }

    if (value === 'shipped' || value === 'out for delivery') {
      return 'bg-blue-100 text-blue-700'
    }

    return 'bg-amber-100 text-amber-700'
  }

  if (!currentUser?.email) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <section className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="text-5xl">🔐</div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Login Required
          </h1>

          <p className="mt-3 text-gray-500">
            Please log in to view your orders.
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
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Your Account
            </p>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-3 text-gray-500">
              View and manage the orders associated with your account.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Continue Shopping
          </Link>
        </div>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className="mb-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-700"
          >
            {message}
          </p>
        )}

        {orders.length === 0 ? (
          <section className="rounded-3xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm sm:py-20">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-5xl">
              📦
            </div>

            <h2 className="mt-7 text-2xl font-bold text-gray-900">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md leading-7 text-gray-500">
              You haven't placed any orders with this account yet.
              Once you place an order, it will appear here.
            </p>

            <Link
              to="/"
              className="mt-7 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Products
            </Link>
          </section>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <span className="font-medium text-gray-600">
                Total Orders
              </span>

              <span className="text-2xl font-bold text-gray-900">
                {orders.length}
              </span>
            </div>

            {orders.map((order) => (
              <article
                key={order.orderId}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <h2 className="mt-1 break-all font-bold text-gray-900">
                      {order.orderId || 'Order ID unavailable'}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold ${statusClass(order.status)}`}
                    >
                      {order.status || 'Pending'}
                    </span>

                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  {Array.isArray(order.items) &&
                  order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div
                        key={`${item.id ?? item.title}-${index}`}
                        className="flex items-center gap-4"
                      >
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                          {item.thumbnail || item.image ? (
                            <img
                              src={item.thumbnail || item.image}
                              alt={item.title || 'Product'}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.title || item.name || 'Product'}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            Quantity: {Number(item.quantity) || 1}
                          </p>
                        </div>

                        <p className="shrink-0 font-semibold text-gray-900">
                          {formatPrice(
                            (Number(item.price) || 0) *
                            (Number(item.quantity) || 1)
                          )}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No product details available for this order.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="text-sm text-gray-500">
                    Payment status:{' '}
                    <span className="font-semibold text-gray-700">
                      {order.paymentStatus || 'Not Processed'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/track-order"
                      state={{ orderId: order.orderId }}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                      Track Order
                    </Link>

                    <button
                      type="button"
                      onClick={() => deleteOrder(order.orderId)}
                      className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Delete Order
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default MyOrders
