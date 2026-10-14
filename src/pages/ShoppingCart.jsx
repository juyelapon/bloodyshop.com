import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const FREE_SHIPPING_THRESHOLD = 50
const SHIPPING_FEE = 5

const ShoppingCart = () => {
  const [cart, setCart] = useState([])
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCart(Array.isArray(savedCart) ? savedCart : [])
      } catch {
        setCart([])
      }
    }

    loadCart()
    window.addEventListener('cartUpdated', loadCart)
    window.addEventListener('storage', loadCart)

    return () => {
      window.removeEventListener('cartUpdated', loadCart)
      window.removeEventListener('storage', loadCart)
    }
  }, [])

  const formatPrice = (price) => `$${Number(price || 0).toFixed(2)}`

  const saveCart = (updatedCart) => {
    try {
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      setCart(updatedCart)
      setCheckoutMessage('')
      window.dispatchEvent(new Event('cartUpdated'))
    } catch {
      setCheckoutMessage('Unable to save your cart. Please try again.')
    }
  }

  const updateQuantity = (id, change) => {
    const updatedCart = cart.map((item) => {
      if (item.id !== id) return item

      const currentQuantity = Math.max(1, Number(item.quantity) || 1)
      const stock = Math.max(1, Number(item.stock) || 1)
      const newQuantity = Math.max(
        1,
        Math.min(stock, currentQuantity + change)
      )

      return { ...item, quantity: newQuantity }
    })

    saveCart(updatedCart)
  }

  const removeItem = (id) => {
    saveCart(cart.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    saveCart([])
  }

  // Cart stores the current discounted unit price in item.price.
  const getUnitPrice = (item) => Math.max(0, Number(item.price) || 0)

  const getOriginalPrice = (item) => {
    const price = getUnitPrice(item)
    const discount = Number(item.discountPercentage) || 0

    if (discount <= 0 || discount >= 100) return price

    return price / (1 - discount / 100)
  }

  const subtotal = cart.reduce((sum, item) => {
    return sum + getUnitPrice(item) * Math.max(1, Number(item.quantity) || 1)
  }, 0)

  const originalSubtotal = cart.reduce((sum, item) => {
    return sum + getOriginalPrice(item) * Math.max(1, Number(item.quantity) || 1)
  }, 0)

  const discountTotal = Math.max(0, originalSubtotal - subtotal)
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
    ? 0
    : SHIPPING_FEE
  const total = subtotal + shipping

  const handleCheckout = () => {
    if (!cart.length) {
      setCheckoutMessage('Your cart is empty. Add a product before checkout.')
      return
    }

    navigate('/checkout')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="mb-8 md:mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2">
            Your Shopping Bag
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <p className="text-gray-500 mt-3">
            Review your items and manage your order.
          </p>
        </div>

        {cart.length === 0 ? (
          <section className="bg-white border border-gray-100 rounded-3xl px-5 py-16 sm:py-20 text-center shadow-sm">
            <div className="w-24 h-24 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-5xl">
              🛒
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-7">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-3 max-w-md mx-auto leading-7">
              Looks like you haven't added anything to your cart yet.
              Explore our collection and find something you love.
            </p>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 mt-7 rounded-xl bg-blue-600 px-7 py-4 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
            >
              Start Shopping <span>→</span>
            </Link>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-9">
            <section className="lg:col-span-2 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Your Items ({cart.reduce(
                    (sum, item) => sum + Math.max(1, Number(item.quantity) || 1),
                    0
                  )})
                </h2>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm font-semibold text-red-500 hover:text-red-700 transition"
                >
                  Clear Cart
                </button>
              </div>

              {cart.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    <Link
                      to={`/product/${item.id}`}
                      className="w-full sm:w-36 h-48 sm:h-36 shrink-0 bg-gray-50 rounded-xl flex items-center justify-center p-4"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                            {item.brand || item.category}
                          </p>

                          <Link
                            to={`/product/${item.id}`}
                            className="block text-lg font-bold text-gray-900 mt-2 hover:text-blue-600 transition"
                          >
                            {item.title}
                          </Link>

                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.title}`}
                          title="Remove product"
                          className="w-10 h-10 shrink-0 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition flex items-center justify-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="m19 6-1 14H6L5 6" />
                            <path d="M10 11v5M14 11v5" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={Number(item.quantity) <= 1}
                            aria-label="Decrease quantity"
                            className="w-10 h-10 text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition"
                          >
                            −
                          </button>

                          <span className="w-10 text-center font-semibold text-gray-900">
                            {Math.max(1, Number(item.quantity) || 1)}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={
                              Number(item.quantity) >= Number(item.stock)
                            }
                            aria-label="Increase quantity"
                            className="w-10 h-10 text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(
                              getUnitPrice(item) *
                              Math.max(1, Number(item.quantity) || 1)
                            )}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatPrice(getUnitPrice(item))} per item
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
              >
                <span>←</span> Continue Shopping
              </Link>
            </section>

            <aside className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-7 shadow-sm lg:sticky lg:top-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <div className="space-y-4 mt-7">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-semibold text-green-600">
                      −{formatPrice(discountTotal)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-5 flex justify-between gap-3">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-gray-500 leading-5 mt-4">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more
                    to qualify for free shipping.
                  </p>
                )}

                {subtotal >= FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-green-600 leading-5 mt-4">
                    Great! Your order qualifies for free shipping.
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full mt-7 rounded-xl bg-blue-600 px-5 py-4 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <span>→</span>
                </button>

                {checkoutMessage && (
                  <p
                    role="status"
                    aria-live="polite"
                    className="mt-4 p-3 rounded-xl bg-blue-50 text-blue-700 text-sm leading-6"
                  >
                    {checkoutMessage}
                  </p>
                )}

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
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
                  >
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                  Secure shopping experience
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default ShoppingCart
