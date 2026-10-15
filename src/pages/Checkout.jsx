
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const readStorage = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null')
    return value ?? fallback
  } catch {
    return fallback
  }
}

const Checkout = () => {
  const navigate = useNavigate()

  const [cart, setCart] = useState(() =>
    readStorage('cart', [])
  )

  const [currentUser] = useState(() =>
    readStorage('shophub_current_user', null)
  )

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const loadCart = () => {
      setCart(readStorage('cart', []))
    }

    window.addEventListener('cartUpdated', loadCart)
    window.addEventListener('storage', loadCart)

    return () => {
      window.removeEventListener('cartUpdated', loadCart)
      window.removeEventListener('storage', loadCart)
    }
  }, [])

  const getOriginalPrice = (item) => {
    const price = Number(item.price) || 0
    const discount = Number(item.discountPercentage) || 0

    if (discount <= 0 || discount >= 100) {
      return price
    }

    return price / (1 - discount / 100)
  }

  const subtotal = cart.reduce((sum, item) => {
    return sum + getOriginalPrice(item) * (Number(item.quantity) || 1)
  }, 0)

  const discountTotal = cart.reduce((sum, item) => {
    const originalPrice = getOriginalPrice(item)
    const currentPrice = Number(item.price) || 0
    const quantity = Number(item.quantity) || 1

    return sum + Math.max(0, originalPrice - currentPrice) * quantity
  }, 0)

  const shipping = 0

  const total = cart.reduce((sum, item) => {
    return sum + (Number(item.price) || 0) * (Number(item.quantity) || 1)
  }, 0) + shipping

  const formatPrice = (price) => `$${Number(price).toFixed(2)}`

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }))

    setMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const cleanForm = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      postalCode: formData.postalCode.trim(),
      country: formData.country.trim(),
    }

    const newErrors = {}

    Object.entries(cleanForm).forEach(([key, value]) => {
      if (!value) {
        newErrors[key] = 'This field is required.'
      }
    })

    if (
      cleanForm.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanForm.email)
    ) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (cart.length === 0) {
      setMessage('Your cart is empty. Add products before checkout.')
      return
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setMessage('Please complete all required fields.')
      return
    }

    try {
      const savedOrders = readStorage('orders', [])

      if (!Array.isArray(savedOrders)) {
        setMessage('Unable to read your previous orders.')
        return
      }

      const order = {
        orderId: `SH-${Date.now()}`,
        userEmail: (
          currentUser?.email || cleanForm.email
        ).trim().toLowerCase(),
        customer: cleanForm,
        items: cart,
        subtotal: Number(subtotal.toFixed(2)),
        discountTotal: Number(discountTotal.toFixed(2)),
        shipping,
        total: Number(total.toFixed(2)),
        currency: 'USD',
        status: 'Pending',
        paymentStatus: 'Not Processed',
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem(
        'orders',
        JSON.stringify([...savedOrders, order])
      )

      localStorage.setItem('cart', JSON.stringify([]))

      window.dispatchEvent(new Event('ordersUpdated'))
      window.dispatchEvent(new Event('cartUpdated'))

      setCart([])
      setIsSuccess(true)
      setMessage('Your order has been placed successfully!')
    } catch {
      setMessage(
        'Unable to place your order. Please check your browser storage and try again.'
      )
    }
  }

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-100 ${
      errors[field]
        ? 'border-red-500'
        : 'border-gray-200 focus:border-blue-500'
    }`

  const renderField = (label, name, type = 'text') => (
    <div key={name}>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        className={inputClass(name)}
        autoComplete={
          name === 'fullName' ? 'name'
            : name === 'email' ? 'email'
              : name === 'phone' ? 'tel'
                : name === 'address' ? 'street-address'
                  : name === 'city' ? 'address-level2'
                    : name === 'postalCode' ? 'postal-code'
                      : name === 'country' ? 'country-name'
                        : 'off'
        }
        aria-invalid={Boolean(errors[name])}
      />

      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name]}
        </p>
      )}
    </div>
  )

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <section className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Order Placed!
          </h1>

          <p className="mt-3 text-gray-600">
            Your order has been saved successfully.
          </p>

          <p className="mt-3 break-all text-sm text-gray-500">
            Order ID: {readStorage('orders', []).slice(-1)[0]?.orderId}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/my-orders')}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              View My Orders
            </button>

            <Link
              to="/"
              className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Secure Checkout
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-3 text-gray-500">
            Enter your delivery information to place your order.
          </p>
        </div>

        {cart.length === 0 ? (
          <section className="rounded-3xl bg-white px-5 py-16 text-center shadow-sm">
            <div className="text-5xl">🛒</div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-3 text-gray-500">
              Add some products before proceeding to checkout.
            </p>

            <Link
              to="/"
              className="mt-7 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <form
              onSubmit={handleSubmit}
              className="space-y-7 rounded-3xl bg-white p-5 shadow-sm sm:p-8 lg:col-span-2"
            >
              <section>
                <h2 className="mb-5 text-xl font-bold text-gray-900">
                  Delivery Information
                </h2>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {renderField('Full Name', 'fullName')}
                  {renderField('Email Address', 'email', 'email')}
                  {renderField('Phone Number', 'phone', 'tel')}

                  <div className="sm:col-span-2">
                    {renderField('Street Address', 'address')}
                  </div>

                  {renderField('City', 'city')}
                  {renderField('Postal Code', 'postalCode')}
                  {renderField('Country', 'country')}
                </div>
              </section>

              {message && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl p-4 text-sm ${
                    errors && Object.keys(errors).length > 0
                      ? 'bg-red-50 text-red-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
              >
                Place Order · {formatPrice(total)}
              </button>

              <p className="text-center text-xs leading-5 text-gray-400">
                Demo checkout only. No real payment will be collected.
              </p>
            </form>

            <aside className="h-fit rounded-3xl bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={`${item.id ?? item.title}-${index}`}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800">
                        {item.title || item.name || 'Product'}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Qty: {Number(item.quantity) || 1}
                      </p>
                    </div>

                    <span className="shrink-0 font-semibold text-gray-900">
                      {formatPrice(
                        (Number(item.price) || 0) *
                        (Number(item.quantity) || 1)
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-green-600">
                    −{formatPrice(discountTotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-green-600">
                    Free
                  </span>
                </div>

                <div className="flex justify-between gap-3 border-t border-dashed border-gray-200 pt-5">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Link
                to="/cart"
                className="mt-6 block text-center text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                ← Return to Cart
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default Checkout
