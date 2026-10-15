
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
    return (
      sum +
      getUnitPrice(item) * Math.max(1, Number(item.quantity) || 1)
    )
  }, 0)

  const originalSubtotal = cart.reduce((sum, item) => {
    return (
      sum +
      getOriginalPrice(item) * Math.max(1, Number(item.quantity) || 1)
    )
  }, 0)

  const discountTotal = Math.max(0, originalSubtotal - subtotal)

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
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

  // Empty cart হলে Categories page-এ নিয়ে যাবে।
  const handleStartShopping = () => {
    navigate('/categories')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="mb-8 md:mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Your Shopping Bag
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>

          <p className="mt-3 text-gray-500">
            Review your items and manage your order.
          </p>
        </div>

        {cart.length === 0 ? (
          <section className="rounded-3xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm sm:py-20">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-5xl">
              🛒
            </div>

            <h2 className="mt-7 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md leading-7 text-gray-500">
              Looks like you haven't added anything to your cart yet.
              Explore our collection and find something you love.
            </p>

            <button
              type="button"
              onClick={handleStartShopping}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
            >
              Start Shopping <span>→</span>
            </button>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-3 lg:gap-9">
            <section className="space-y-5 lg:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Your Items (
                  {cart.reduce(
                    (sum, item) =>
                      sum + Math.max(1, Number(item.quantity) || 1),
                    0
                  )}
                  )
                </h2>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm font-semibold text-red-500 transition hover:text-red-700"
                >
                  Clear Cart
                </button>
              </div>

              {cart.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <Link
                      to={`/product/${item.id}`}
                      className="flex h-48 w-full shrink-0 items-center justify-center rounded-xl bg-gray-50 p-4 sm:h-36 sm:w-36"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                            {item.brand || item.category}
                          </p>

                          <Link
                            to={`/product/${item.id}`}
                            className="mt-2 block text-lg font-bold text-gray-900 transition hover:text-blue-600"
                          >
                            {item.title}
                          </Link>

                          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.title}`}
                          title="Remove product"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-500"
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

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center overflow-hidden rounded-xl border border-gray-200">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={Number(item.quantity) <= 1}
                            aria-label="Decrease quantity"
                            className="h-10 w-10 text-gray-700 transition hover:bg-gray-100 disabled:opacity-40"
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
                              Number(item.quantity || 1) >=
                              Math.max(1, Number(item.stock) || 1)
                            }
                            aria-label="Increase quantity"
                            className="h-10 w-10 text-gray-700 transition hover:bg-gray-100 disabled:opacity-40"
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

                          <p className="mt-1 text-xs text-gray-400">
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
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
              >
                <span>←</span> Continue Shopping
              </Link>
            </section>

            <aside className="lg:col-span-1">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-24 sm:p-7">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <div className="mt-7 space-y-4">
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
                    <span
                      className={`font-semibold ${
                        shipping === 0
                          ? 'text-green-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 border-t border-dashed border-gray-200 pt-5">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="mt-4 text-xs leading-5 text-gray-500">
                    Add{' '}
                    {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more
                    to qualify for free shipping.
                  </p>
                )}

                {subtotal >= FREE_SHIPPING_THRESHOLD && (
                  <p className="mt-4 text-xs leading-5 text-green-600">
                    Great! Your order qualifies for free shipping.
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
                >
                  Proceed to Checkout <span>→</span>
                </button>

                {checkoutMessage && (
                  <p
                    role="status"
                    aria-live="polite"
                    className="mt-4 rounded-xl bg-blue-50 p-3 text-sm leading-6 text-blue-700"
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
