import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiShoppingCart,
  FiClock,
  FiZap,
  FiStar,
  FiSliders,
  FiCheckCircle,
  FiLoader,
  FiRefreshCw,
  FiTag,
  FiShield
} from 'react-icons/fi';

const DealsPage = () => {
    const navigate = useNavigate()

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [category, setCategory] = useState('all')
    const [sortBy, setSortBy] = useState('discount')
    const [search, setSearch] = useState('')
    const [message, setMessage] = useState('')
    const [timeLeft, setTimeLeft] = useState(12 * 60 * 60)

    // Fetch products
    const fetchProducts = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch(
                'https://dummyjson.com/products?limit=30&sortBy=discountPercentage&order=desc'
            )

            if (!response.ok) {
                throw new Error('Unable to fetch products')
            }

            const data = await response.json()

            // Keep products that have a discount
            const discountedProducts = (data.products || []).filter(
                (product) => product.discountPercentage > 0
            )

            setProducts(discountedProducts)
        } catch {
            setError('Products load করা যাচ্ছে না। Internet connection check করে আবার চেষ্টা করো।')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((previous) =>
                previous <= 0 ? 12 * 60 * 60 : previous - 1
            )
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // Categories from fetched products
    const categories = useMemo(() => {
        return [...new Set(products.map((product) => product.category))]
    }, [products])

    // Search, category filter and sorting
    const filteredProducts = useMemo(() => {
        let result = [...products]

        if (category !== 'all') {
            result = result.filter(
                (product) => product.category === category
            )
        }

        if (search.trim()) {
            result = result.filter((product) =>
                product.title.toLowerCase().includes(search.toLowerCase())
            )
        }

        if (sortBy === 'discount') {
            result.sort(
                (a, b) => b.discountPercentage - a.discountPercentage
            )
        } else if (sortBy === 'price-low') {
            result.sort((a, b) => a.price - b.price)
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => b.price - a.price)
        } else if (sortBy === 'rating') {
            result.sort((a, b) => b.rating - a.rating)
        }

        return result
    }, [products, category, sortBy, search])

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        return [hours, minutes, secs]
            .map((number) => String(number).padStart(2, '0'))
            .join(':')
    }

    const getOldPrice = (product) => {
        return product.price / (1 - product.discountPercentage / 100)
    }

    // Add product to existing cart
    const addToCart = (product) => {
        try {
            const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')

            if (!Array.isArray(savedCart)) {
                throw new Error('Invalid cart')
            }

            const existingProduct = savedCart.find(
                (item) => item.id === product.id
            )

            let updatedCart

            if (existingProduct) {
                updatedCart = savedCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                )
            } else {
                updatedCart = [
                    ...savedCart,
                    {
                        ...product,
                        quantity: 1
                    }
                ]
            }

            localStorage.setItem('cart', JSON.stringify(updatedCart))

            // Notify other components in this tab
            window.dispatchEvent(new Event('cartUpdated'))

            setMessage(`${product.title} added to cart!`)

            setTimeout(() => {
                setMessage('')
            }, 2500)
        } catch {
            setMessage('Cart update করা যায়নি। আবার চেষ্টা করো।')

            setTimeout(() => {
                setMessage('')
            }, 2500)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">

            {/* Success notification */}
            {message && (
                <div className="fixed right-4 top-20 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-4 shadow-xl">
                    <FiCheckCircle className="shrink-0 text-green-600" size={22} />
                    <p className="text-sm font-semibold">{message}</p>
                </div>
            )}

            {/* Hero / Flash Sale */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
                <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="absolute -bottom-28 left-1/4 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">

                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-200">
                            <FiZap className="text-yellow-300" />
                            Limited-time offers
                        </span>

                        <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                            Deals You
                            <span className="block bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                                Don't Want to Miss.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl leading-7 text-slate-300 sm:text-lg">
                            Discover amazing offers on products you love.
                            Find your next favorite at a special price.
                        </p>

                        <button
                            onClick={() =>
                                document.getElementById('deals-products')?.scrollIntoView({
                                    behavior: 'smooth'
                                })
                            }
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-indigo-950 transition hover:-translate-y-1 hover:bg-blue-100"
                        >
                            Shop Deals
                            <FiArrowRight size={18} />
                        </button>

                        <div className="mt-9 flex flex-wrap items-center gap-3">
                            <FiClock className="text-purple-300" size={22} />
                            <span className="text-sm text-slate-300">
                                Demo flash-sale timer
                            </span>

                            <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-mono text-xl font-bold tracking-wider">
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-lg">
                        <div className="absolute inset-0 rounded-[2rem] bg-purple-500/20 blur-2xl" />

                        <img
                            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1000&q=85"
                            alt="Shopping sale and special offers"
                            className="relative h-72 w-full rounded-3xl border border-white/10 object-cover shadow-2xl sm:h-96"
                        />

                        <div className="absolute -bottom-5 -left-3 rounded-2xl border border-white/20 bg-white p-4 text-slate-900 shadow-xl sm:-left-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                                    <FiTag size={23} />
                                </div>
                                <div>
                                    <p className="font-extrabold">Special Offers</p>
                                    <p className="text-xs text-slate-500">
                                        Explore available discounts
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits strip */}
            <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
                <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-3">
                    <div className="flex items-center gap-3 p-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <FiTag size={21} />
                        </div>
                        <div>
                            <p className="font-bold">Special Prices</p>
                            <p className="text-sm text-slate-500">Discounted demo products</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <FiShield size={21} />
                        </div>
                        <div>
                            <p className="font-bold">Easy Shopping</p>
                            <p className="text-sm text-slate-500">Simple product browsing</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <FiShoppingCart size={21} />
                        </div>
                        <div>
                            <p className="font-bold">Quick Add to Cart</p>
                            <p className="text-sm text-slate-500">Keep track of favorites</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products */}
            <section
                id="deals-products"
                className="mx-auto max-w-7xl scroll-mt-8 px-5 py-16 sm:px-8 md:py-20"
            >
                <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600">
                            Handpicked for you
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                            Today's Best Deals
                        </h2>
                        <p className="mt-3 text-slate-500">
                            Discover products with special demo discounts.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <FiSliders size={18} />
                        <span>{filteredProducts.length} products found</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setCategory('all')}
                            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                                category === 'all'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            All Deals
                        </button>

                        {categories.map((item) => (
                            <button
                                key={item}
                                onClick={() => setCategory(item)}
                                className={`rounded-lg px-4 py-2.5 text-sm font-semibold capitalize transition ${
                                    category === item
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {item.replaceAll('-', ' ')}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search deals..."
                            className="h-11 min-w-0 rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-52"
                        />

                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 sm:w-48"
                        >
                            <option value="discount">Biggest Discount</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24">
                        <FiLoader className="animate-spin text-blue-600" size={36} />
                        <p className="mt-4 font-medium text-slate-500">
                            Loading amazing deals...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-100 bg-white px-5 py-12 text-center">
                        <p className="text-red-600">{error}</p>

                        <button
                            onClick={fetchProducts}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
                        >
                            <FiRefreshCw />
                            Try Again
                        </button>
                    </div>
                )}

                {/* Product grid */}
                {!loading && !error && filteredProducts.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => {
                            const oldPrice = getOldPrice(product)

                            return (
                                <article
                                    key={product.id}
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
                                >
                                    <div
                                        onClick={() => navigate(`/product/${product.id}`)}
                                        className="relative flex h-60 cursor-pointer items-center justify-center overflow-hidden bg-slate-50 p-5"
                                    >
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            loading="lazy"
                                            className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                                        />

                                        <span className="absolute left-3 top-3 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-extrabold text-white shadow-md">
                                            -{Math.round(product.discountPercentage)}%
                                        </span>

                                        <span className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-amber-500 shadow">
                                            <FiStar size={17} />
                                        </span>
                                    </div>

                                    <div className="p-5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                            {product.category.replaceAll('-', ' ')}
                                        </p>

                                        <h3
                                            onClick={() => navigate(`/product/${product.id}`)}
                                            className="mt-2 min-h-12 cursor-pointer text-base font-bold leading-6 transition hover:text-blue-600"
                                        >
                                            {product.title}
                                        </h3>

                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="text-2xl font-extrabold text-slate-900">
                                                ${product.price.toFixed(2)}
                                            </span>

                                            <span className="text-sm text-slate-400 line-through">
                                                ${oldPrice.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between">
                                            <p className="flex items-center gap-1 text-sm text-amber-500">
                                                <FiStar fill="currentColor" size={15} />
                                                <span className="font-bold">{product.rating}</span>
                                            </p>

                                            <span className="text-xs font-semibold text-green-600">
                                                Special price
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => addToCart(product)}
                                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-blue-600"
                                        >
                                            <FiShoppingCart size={18} />
                                            Add to Cart
                                        </button>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && filteredProducts.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <FiTag size={30} />
                        </div>

                        <h3 className="mt-5 text-xl font-bold">
                            No deals found
                        </h3>

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

            {/* Bottom CTA */}
            <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
                    <div className="absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-white/10" />

                    <div className="relative">
                        <FiZap className="mx-auto text-yellow-300" size={36} />

                        <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
                            Your Next Favorite Is Waiting.
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl leading-7 text-blue-100">
                            Keep exploring ShopHub and discover something
                            special for your everyday life.
                        </p>

                        <button
                            onClick={() => navigate('/categories')}
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 transition hover:-translate-y-1 hover:bg-blue-50"
                        >
                            Browse Categories
                            <FiArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

        </main>
    )
}

export default DealsPage
