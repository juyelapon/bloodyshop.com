import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiShoppingCart,
  FiZap,
  FiStar,
  FiTag,
  FiLoader,
  FiRefreshCw,
  FiCheckCircle
} from 'react-icons/fi'

const FlashSale = () => {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [message, setMessage] = useState('')

  const fetchProducts = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        'https://dummyjson.com/products?limit=100&sortBy=discountPercentage&order=desc'
      )

      if (!response.ok) {
        throw new Error('Failed to load products')
      }

      const data = await response.json()

      setProducts(
        (data.products || []).filter(
          product => Number(product.discountPercentage) > 0
        )
      )
    } catch {
      setError('Products load করা যাচ্ছে না। আবার চেষ্টা করো।')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const categories = useMemo(
    () => [...new Set(products.map(product => product.category))],
    [products]
  )

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesCategory =
          category === 'all' || product.category === category

        const matchesSearch = product.title
          .toLowerCase()
          .includes(search.trim().toLowerCase())

        return matchesCategory && matchesSearch
      })
      .sort(
        (a, b) => b.discountPercentage - a.discountPercentage
      )
  }, [products, category, search])

  const addToCart = product => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem('cart') || '[]'
      )

      if (!Array.isArray(savedCart)) {
        throw new Error('Invalid cart')
      }

      const existingProduct = savedCart.find(
        item => item.id === product.id
      )

      const updatedCart = existingProduct
        ? savedCart.map(item =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: Math.min(
                    Number(item.stock) || 999,
                    (Number(item.quantity) || 1) + 1
                  )
                }
              : item
          )
        : [
            ...savedCart,
            {
              ...product,
              price: Number(product.price),
              quantity: 1
            }
          ]

      localStorage.setItem('cart', JSON.stringify(updatedCart))
      window.dispatchEvent(new Event('cartUpdated'))

      setMessage(`${product.title} added to cart!`)
    } catch {
      setMessage('Cart update করা যায়নি। আবার চেষ্টা করো।')
    }

    window.setTimeout(() => setMessage(''), 2500)
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {message && (
        <div
          role="status"
          className="fixed right-4 top-20 z-50 flex items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-4 shadow-xl"
        >
          <FiCheckCircle className="text-green-600" size={22} />
          <p className="text-sm font-semibold">{message}</p>
        </div>
      )}

      <section className="relative overflow-hidden bg-gradient-to-br from-red-950 via-slate-950 to-purple-950 text-white">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-red-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-red-200">
              <FiZap className="text-yellow-300" />
              ShopHub Flash Sale
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Amazing Deals,
              <span className="block bg-gradient-to-r from-red-300 to-purple-300 bg-clip-text text-transparent">
                Better Prices.
              </span>
            </h1>

            <p className="mt-5 max-w-xl leading-7 text-slate-300 sm:text-lg">
              Explore discounted products, compare prices, and
              discover your next favorite item.
            </p>

            <button
              onClick={() =>
                document.getElementById('flash-products')?.scrollIntoView({
                  behavior: 'smooth'
                })
              }
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-red-950 transition hover:-translate-y-1 hover:bg-red-100"
            >
              Explore Deals <FiArrowRight size={18} />
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
            <FiZap className="text-yellow-300" size={44} />
            <p className="mt-5 text-sm font-bold uppercase tracking-widest text-red-200">
              Special Offers
            </p>
            <h2 className="mt-3 text-3xl font-extrabold">
              Save on your favorites
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              Browse available discounts and add your favorite products
              to your shopping cart.
            </p>
            <div className="mt-7 flex items-center gap-3 text-sm text-slate-300">
              <FiTag className="text-yellow-300" size={20} />
              Discounts are based on product data.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-3">
          <div className="flex items-center gap-3 p-2">
            <FiTag className="text-blue-600" size={25} />
            <div>
              <p className="font-bold">Special Prices</p>
              <p className="text-sm text-slate-500">Discounted products</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <FiStar className="text-amber-500" size={25} />
            <div>
              <p className="font-bold">Compare Deals</p>
              <p className="text-sm text-slate-500">See ratings and savings</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <FiShoppingCart className="text-green-600" size={25} />
            <div>
              <p className="font-bold">Easy Shopping</p>
              <p className="text-sm text-slate-500">Add items to your cart</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="flash-products"
        className="mx-auto max-w-7xl scroll-mt-8 px-5 py-16 sm:px-8 md:py-20"
      >
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">
            Limited-time offers
          </p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Flash Sale Products
          </h2>
          <p className="mt-3 text-slate-500">
            {filteredProducts.length} discounted products found
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('all')}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
                category === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Deals
            </button>

            {categories.map(item => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold capitalize ${
                  category === item
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item.replaceAll('-', ' ')}
              </button>
            ))}
          </div>

          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search flash sale..."
            className="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {loading && (
          <div className="flex flex-col items-center py-24">
            <FiLoader className="animate-spin text-blue-600" size={36} />
            <p className="mt-4 text-slate-500">Loading flash sale...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-white px-5 py-12 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
            >
              <FiRefreshCw /> Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map(product => {
              const discount = Number(product.discountPercentage) || 0
              const salePrice = Number(product.price) || 0
              const originalPrice =
                discount > 0 && discount < 100
                  ? salePrice / (1 - discount / 100)
                  : salePrice

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="relative flex h-60 w-full items-center justify-center overflow-hidden bg-slate-50 p-5"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                    />
                    <span className="absolute left-3 top-3 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-extrabold text-white">
                      -{Math.round(discount)}%
                    </span>
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-amber-500 shadow">
                      <FiStar size={17} />
                    </span>
                  </button>

                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      {String(product.category || '').replaceAll('-', ' ')}
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="mt-2 min-h-12 text-left text-base font-bold leading-6 hover:text-blue-600"
                    >
                      {product.title}
                    </button>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-2xl font-extrabold">
                        ${salePrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-slate-400 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <p className="flex items-center gap-1 text-sm text-amber-500">
                        <FiStar fill="currentColor" size={15} />
                        <span className="font-bold">{product.rating}</span>
                      </p>
                      <span className="text-xs font-semibold text-green-600">
                        Save {discount.toFixed(1)}%
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-blue-600"
                    >
                      <FiShoppingCart size={18} /> Add to Cart
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center">
            <FiTag className="mx-auto text-slate-400" size={32} />
            <h3 className="mt-5 text-xl font-bold">No deals found</h3>
            <p className="mt-2 text-slate-500">
              Try another search term or category.
            </p>
            <button
              onClick={() => {
                setSearch('')
                setCategory('all')
              }}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-red-600 to-purple-600 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <FiZap className="mx-auto text-yellow-300" size={36} />
          <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
            Don't Miss Out!
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-red-50">
            Find your next favorite product at a special price.
          </p>
          <button
            onClick={() => navigate('/categories')}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-red-700 transition hover:-translate-y-1 hover:bg-red-50"
          >
            Browse Categories <FiArrowRight size={18} />
          </button>
        </div>
      </section>
    </main>
  )
}

export default FlashSale
