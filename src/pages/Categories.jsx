import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    FiArrowRight,
    FiTruck,
    FiShield,
    FiHeadphones,
    FiStar,
    FiLoader,
    FiFilter,
    FiHeart
} from 'react-icons/fi'
import { IoShirtOutline } from 'react-icons/io5'
import {
    BsLaptop,
    BsHouseDoor,
    BsDroplet,
    BsBasket,
    BsBicycle
} from 'react-icons/bs'

const categories = [
    {
        name: 'Fashion',
        slug: 'mens-shirts',
        description: 'Discover stylish outfits and accessories for every occasion.',
        count: 'Explore clothing',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
        icon: IoShirtOutline,
        color: 'bg-rose-100 text-rose-600'
    },
    {
        name: 'Electronics',
        slug: 'smartphones',
        description: 'Discover smart devices, gadgets and everyday technology.',
        count: 'Explore electronics',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
        icon: BsLaptop,
        color: 'bg-blue-100 text-blue-600'
    },
    {
        name: 'Home & Living',
        slug: 'furniture',
        description: 'Make your home beautiful with thoughtful essentials.',
        count: 'Explore home products',
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
        icon: BsHouseDoor,
        color: 'bg-green-100 text-green-600'
    },
    {
        name: 'Beauty',
        slug: 'beauty',
        description: 'Find skincare, makeup and personal care favorites.',
        count: 'Explore beauty',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
        icon: BsDroplet,
        color: 'bg-pink-100 text-pink-600'
    },
    {
        name: 'Groceries',
        slug: 'groceries',
        description: 'Shop everyday essentials and pantry favorites.',
        count: 'Explore groceries',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        icon: BsBasket,
        color: 'bg-amber-100 text-amber-600'
    },
    {
        name: 'Sports & Fitness',
        slug: 'sports-accessories',
        description: 'Gear up for your next workout and outdoor adventure.',
        count: 'Explore sports',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80',
        icon: BsBicycle,
        color: 'bg-purple-100 text-purple-600'
    }
]

const benefits = [
    {
        icon: FiTruck,
        title: 'Fast & Reliable Delivery',
        description: 'Get your orders quickly',
        color: 'bg-blue-100 text-blue-600'
    },
    {
        icon: FiShield,
        title: 'Secure Shopping',
        description: 'Shop with confidence',
        color: 'bg-purple-100 text-purple-600'
    },
    {
        icon: FiHeadphones,
        title: 'Customer Support',
        description: "We're here to help",
        color: 'bg-green-100 text-green-600'
    },
    {
        icon: FiStar,
        title: 'Quality Products',
        description: 'Find your everyday favorites',
        color: 'bg-amber-100 text-amber-600'
    }
]

const Categories = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const [selectedCategory, setSelectedCategory] = useState('')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Filter states
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [priceSort, setPriceSort] = useState('default')
    const [minRating, setMinRating] = useState('0')

    // Wishlist states
    const [wishlist, setWishlist] = useState([])
    const [wishlistMessage, setWishlistMessage] = useState('')

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 8

    // Read category from URL
    useEffect(() => {
        const categorySlug = searchParams.get('category')

        if (!categorySlug) {
            setSelectedCategory('')
            return
        }

        const validCategory = categories.find(
            category => category.slug === categorySlug
        )

        if (validCategory) {
            setSelectedCategory(validCategory.slug)
            setCategoryFilter('all')
            setPriceSort('default')
            setMinRating('0')
            setCurrentPage(1)

            setTimeout(() => {
                document.getElementById('category-products')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }, 150)
        } else {
            setSelectedCategory('')
            setProducts([])
            setError('This category is not available yet.')
        }
    }, [searchParams])

    // Load Wishlist from localStorage
    useEffect(() => {
        const loadWishlist = () => {
            try {
                const savedWishlist = JSON.parse(
                    localStorage.getItem('wishlist') || '[]'
                )

                setWishlist(
                    Array.isArray(savedWishlist) ? savedWishlist : []
                )
            } catch {
                setWishlist([])
            }
        }

        loadWishlist()
        window.addEventListener('wishlistUpdated', loadWishlist)

        return () => {
            window.removeEventListener('wishlistUpdated', loadWishlist)
        }
    }, [])

    // Add or remove a product from Wishlist
    const toggleWishlist = (product) => {
        try {
            const savedWishlist = JSON.parse(
                localStorage.getItem('wishlist') || '[]'
            )

            const currentWishlist = Array.isArray(savedWishlist)
                ? savedWishlist
                : []

            const alreadySaved = currentWishlist.some(
                item => item.id === product.id
            )

            let updatedWishlist

            if (alreadySaved) {
                updatedWishlist = currentWishlist.filter(
                    item => item.id !== product.id
                )
                setWishlistMessage('Product removed from wishlist.')
            } else {
                updatedWishlist = [...currentWishlist, product]
                setWishlistMessage('Product added to wishlist!')
            }

            localStorage.setItem(
                'wishlist',
                JSON.stringify(updatedWishlist)
            )

            setWishlist(updatedWishlist)
            window.dispatchEvent(new Event('wishlistUpdated'))
        } catch {
            setWishlistMessage(
                'Unable to update wishlist. Please try again.'
            )
        }
    }

    // Fetch products for selected category
    useEffect(() => {
        if (!selectedCategory) {
            setProducts([])
            setLoading(false)
            return
        }

        const controller = new AbortController()

        const fetchProducts = async () => {
            setLoading(true)
            setError('')
            setProducts([])
            setCurrentPage(1)

            try {
                const response = await fetch(
                    `https://dummyjson.com/products/category/${encodeURIComponent(selectedCategory)}`,
                    { signal: controller.signal }
                )

                if (!response.ok) {
                    throw new Error('Failed to load products')
                }

                const data = await response.json()
                setProducts(data.products || [])

                if (!data.products?.length) {
                    setError('No products found in this category.')
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(
                        'Products could not be loaded. Please try again.'
                    )
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }

        fetchProducts()

        return () => controller.abort()
    }, [selectedCategory])

    // Available categories in loaded products
    const availableCategories = useMemo(() => {
        return [...new Set(products.map(product => product.category))]
    }, [products])

    // Apply filters and sorting
    const filteredProducts = useMemo(() => {
        let result = [...products]

        if (categoryFilter !== 'all') {
            result = result.filter(
                product => product.category === categoryFilter
            )
        }

        result = result.filter(
            product => product.rating >= Number(minRating)
        )

        if (priceSort === 'low-high') {
            result.sort((a, b) => a.price - b.price)
        } else if (priceSort === 'high-low') {
            result.sort((a, b) => b.price - a.price)
        }

        return result
    }, [products, categoryFilter, priceSort, minRating])

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [selectedCategory, categoryFilter, priceSort, minRating])

    // Pagination calculations
    const totalPages = Math.ceil(
        filteredProducts.length / productsPerPage
    )

    const startIndex = (currentPage - 1) * productsPerPage

    const currentProducts = filteredProducts.slice(
        startIndex,
        startIndex + productsPerPage
    )

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const handleExplore = (category) => {
        setCategoryFilter('all')
        setPriceSort('default')
        setMinRating('0')
        setCurrentPage(1)
        setWishlistMessage('')

        setSearchParams({ category: category.slug })
    }

    const clearFilters = () => {
        setCategoryFilter('all')
        setPriceSort('default')
        setMinRating('0')
        setCurrentPage(1)
    }

    const closeProducts = () => {
        setSelectedCategory('')
        setProducts([])
        setError('')
        setWishlistMessage('')
        setSearchParams({})
        clearFilters()
    }

    return (
        <main className="min-h-screen bg-white text-slate-900">

            {/* Hero Section */}
            <section className="overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-5 py-14 sm:px-8 md:flex-row md:justify-between md:py-20">

                    <div className="max-w-2xl">
                        <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                            Shop by category
                        </span>

                        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Find What
                            <span className="text-blue-600"> You Love.</span>
                        </h1>

                        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                            Explore our wide range of categories and discover
                            products that match your style, needs and lifestyle.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                document.getElementById('all-categories')?.scrollIntoView({
                                    behavior: 'smooth'
                                })
                            }
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
                        >
                            Explore Categories
                            <FiArrowRight size={18} />
                        </button>
                    </div>

                    <div className="w-full max-w-md">
                        <img
                            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=900&q=85"
                            alt="Shopping bags and shopping items"
                            className="h-64 w-full rounded-3xl object-cover shadow-xl sm:h-80"
                        />
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section
                id="all-categories"
                className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20"
            >
                <div className="mb-9 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-600">
                            Explore our collection
                        </p>

                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                            All Categories
                        </h2>

                        <div className="mt-4 h-1 w-16 rounded-full bg-blue-600" />
                    </div>

                    <p className="max-w-md text-sm leading-6 text-slate-500 sm:text-right">
                        Everything you need, organized in one place.
                        Find your favorites with ease.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map(category => {
                        const Icon = category.icon

                        return (
                            <article
                                key={category.slug}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60 sm:flex-row sm:gap-4"
                            >
                                <div className="h-52 overflow-hidden rounded-xl bg-slate-100 sm:h-auto sm:min-h-56 sm:w-2/5 sm:shrink-0">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col items-start py-4 sm:py-1">
                                    <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${category.color}`}>
                                        <Icon size={22} />
                                    </div>

                                    <h3 className="text-xl font-bold">
                                        {category.name}
                                    </h3>

                                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
                                        {category.description}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => handleExplore(category)}
                                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        Explore
                                        <FiArrowRight className="transition group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </section>

            {/* Products for selected category */}
            {selectedCategory && (
                <section
                    id="category-products"
                    className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-16 sm:px-8"
                >
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-blue-600">
                                Explore collection
                            </p>

                            <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                                {categories.find(
                                    category => category.slug === selectedCategory
                                )?.name}
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={closeProducts}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Close products
                        </button>
                    </div>

                    {wishlistMessage && (
                        <p
                            role="status"
                            aria-live="polite"
                            className="mb-5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700"
                        >
                            {wishlistMessage}
                        </p>
                    )}

                    {/* Filters */}
                    {!loading && !error && products.length > 0 && (
                        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                            <div className="mb-4 flex items-center gap-2">
                                <FiFilter className="text-blue-600" size={20} />
                                <h3 className="font-bold text-slate-800">
                                    Filter & Sort Products
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label
                                        htmlFor="category-filter"
                                        className="mb-2 block text-sm font-semibold text-slate-600"
                                    >
                                        Category
                                    </label>

                                    <select
                                        id="category-filter"
                                        value={categoryFilter}
                                        onChange={event => setCategoryFilter(event.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="all">All Categories</option>

                                        {availableCategories.map(category => (
                                            <option key={category} value={category}>
                                                {category
                                                    .split('-')
                                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                    .join(' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="price-sort"
                                        className="mb-2 block text-sm font-semibold text-slate-600"
                                    >
                                        Sort by Price
                                    </label>

                                    <select
                                        id="price-sort"
                                        value={priceSort}
                                        onChange={event => setPriceSort(event.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="default">Default Order</option>
                                        <option value="low-high">Price: Low to High</option>
                                        <option value="high-low">Price: High to Low</option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="rating-filter"
                                        className="mb-2 block text-sm font-semibold text-slate-600"
                                    >
                                        Minimum Rating
                                    </label>

                                    <select
                                        id="rating-filter"
                                        value={minRating}
                                        onChange={event => setMinRating(event.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="0">All Ratings</option>
                                        <option value="3">3+ Stars</option>
                                        <option value="4">4+ Stars</option>
                                        <option value="4.5">4.5+ Stars</option>
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-slate-500">
                                Showing{' '}
                                <span className="font-bold text-slate-800">
                                    {filteredProducts.length}
                                </span>
                                {' '}of{' '}
                                <span className="font-bold text-slate-800">
                                    {products.length}
                                </span>
                                {' '}products
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex items-center justify-center gap-3 py-16 text-blue-600">
                            <FiLoader className="animate-spin" size={24} />
                            <span className="font-medium">Loading products...</span>
                        </div>
                    )}

                    {error && (
                        <p className="rounded-xl bg-red-50 p-5 text-center text-red-600">
                            {error}
                        </p>
                    )}

                    {/* Product Grid */}
                    {!loading && !error && currentProducts.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {currentProducts.map(product => {
                                const isWishlisted = wishlist.some(
                                    item => item.id === product.id
                                )

                                return (
                                    <article
                                        key={product.id}
                                        onClick={() => navigate(`/product/${product.id}`)}
                                        className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="relative flex h-44 items-center justify-center bg-slate-50 p-4 sm:h-56">
                                            <img
                                                src={product.thumbnail}
                                                alt={product.title}
                                                loading="lazy"
                                                className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                                            />

                                            <button
                                                type="button"
                                                onClick={event => {
                                                    event.stopPropagation()
                                                    toggleWishlist(product)
                                                }}
                                                aria-label={
                                                    isWishlisted
                                                        ? `Remove ${product.title} from wishlist`
                                                        : `Add ${product.title} to wishlist`
                                                }
                                                aria-pressed={isWishlisted}
                                                className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 ${
                                                    isWishlisted
                                                        ? 'text-red-500'
                                                        : 'text-slate-500 hover:text-red-500'
                                                }`}
                                            >
                                                <FiHeart
                                                    size={21}
                                                    fill={isWishlisted ? 'currentColor' : 'none'}
                                                />
                                            </button>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="line-clamp-2 min-h-10 font-semibold">
                                                {product.title}
                                            </h3>

                                            <p className="mt-2 text-lg font-extrabold text-blue-600">
                                                ${product.price}
                                            </p>

                                            <p className="mt-1 flex items-center gap-1 text-sm text-amber-500">
                                                <FiStar size={15} fill="currentColor" />
                                                {Number(product.rating).toFixed(1)}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={event => {
                                                    event.stopPropagation()
                                                    navigate(`/product/${product.id}`)
                                                }}
                                                className="mt-4 w-full rounded-lg border border-blue-600 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && !error && totalPages > 1 && (
                        <div className="mt-10 flex flex-col items-center gap-4">
                            <p className="text-sm text-slate-500">
                                Showing{' '}
                                <span className="font-semibold text-slate-800">
                                    {startIndex + 1}
                                </span>
                                {' - '}
                                <span className="font-semibold text-slate-800">
                                    {Math.min(
                                        startIndex + productsPerPage,
                                        filteredProducts.length
                                    )}
                                </span>
                                {' of '}
                                <span className="font-semibold text-slate-800">
                                    {filteredProducts.length}
                                </span>
                                {' products'}
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                ).map(page => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => goToPage(page)}
                                        aria-current={currentPage === page ? 'page' : undefined}
                                        className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold transition ${
                                            currentPage === page
                                                ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200'
                                                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {!loading && !error && filteredProducts.length === 0 && products.length > 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center">
                            <p className="font-semibold text-slate-700">
                                No products match your filters.
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Try changing your category or rating.
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </section>
            )}

            {/* Benefits Section */}
            <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
                <div className="grid grid-cols-1 gap-4 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
                    {benefits.map(benefit => {
                        const Icon = benefit.icon

                        return (
                            <div
                                key={benefit.title}
                                className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-white/70"
                            >
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${benefit.color}`}>
                                    <Icon size={22} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold">
                                        {benefit.title}
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </main>
    )
}

export default Categories
