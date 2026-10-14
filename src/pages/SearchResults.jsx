import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiFilter, FiStar } from 'react-icons/fi'

const SearchResults = () => {
    const [searchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    // Filter states
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [priceSort, setPriceSort] = useState('default')
    const [minRating, setMinRating] = useState('0')

    const navigate = useNavigate()
    const query = searchParams.get('q')?.trim() || ''

    useEffect(() => {
        if (!query) {
            setProducts([])
            setLoading(false)
            setError(false)
            return
        }

        const controller = new AbortController()

        const searchProducts = async () => {
            setLoading(true)
            setError(false)

            try {
                const response = await fetch(
                    `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`,
                    { signal: controller.signal }
                )

                if (!response.ok) {
                    throw new Error('Search failed')
                }

                const data = await response.json()
                setProducts(data.products || [])
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(true)
                    setProducts([])
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }

        searchProducts()

        return () => controller.abort()
    }, [query])

    // Reset filters when the search query changes
    useEffect(() => {
        setCategoryFilter('all')
        setPriceSort('default')
        setMinRating('0')
    }, [query])

    // Get categories from the current search results
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

    const clearFilters = () => {
        setCategoryFilter('all')
        setPriceSort('default')
        setMinRating('0')
    }

    return (
        <section className="min-h-screen bg-[#E5E7EB] py-12">
            <div className="mx-auto max-w-7xl px-4">

                <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                    Search Results
                </h1>

                {query && (
                    <p className="mb-8 text-gray-600">
                        Results for "{query}"
                    </p>
                )}

                {!query ? (
                    <div className="rounded-xl bg-white p-8 text-center">
                        <p className="text-gray-600">
                            Please enter a product name in the search box.
                        </p>
                    </div>
                ) : loading ? (
                    <p className="py-10 text-gray-600">
                        Searching products...
                    </p>
                ) : error ? (
                    <div className="rounded-xl bg-white p-8 text-center">
                        <p className="mb-4 text-red-500">
                            Unable to search products. Please try again.
                        </p>

                        <button
                            onClick={() => navigate('/')}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                        >
                            Back to Home
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="rounded-xl bg-white p-8 text-center">
                        <p className="mb-2 text-xl font-semibold text-gray-800">
                            No products found
                        </p>

                        <p className="text-gray-500">
                            Try searching with another product name.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Filter and Sorting Section */}
                        <div className="mb-8 rounded-xl bg-white p-4 shadow-sm sm:p-6">

                            <div className="mb-5 flex items-center gap-2">
                                <FiFilter size={20} className="text-blue-600" />

                                <h2 className="text-lg font-bold text-gray-900">
                                    Filter & Sort Products
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                                {/* Category Filter */}
                                <div>
                                    <label
                                        htmlFor="search-category-filter"
                                        className="mb-2 block text-sm font-semibold text-gray-600"
                                    >
                                        Category
                                    </label>

                                    <select
                                        id="search-category-filter"
                                        value={categoryFilter}
                                        onChange={event =>
                                            setCategoryFilter(event.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="all">
                                            All Categories
                                        </option>

                                        {availableCategories.map(category => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category
                                                    .split('-')
                                                    .map(word =>
                                                        word.charAt(0).toUpperCase() +
                                                        word.slice(1)
                                                    )
                                                    .join(' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Sorting */}
                                <div>
                                    <label
                                        htmlFor="search-price-sort"
                                        className="mb-2 block text-sm font-semibold text-gray-600"
                                    >
                                        Sort by Price
                                    </label>

                                    <select
                                        id="search-price-sort"
                                        value={priceSort}
                                        onChange={event =>
                                            setPriceSort(event.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="default">
                                            Default Order
                                        </option>

                                        <option value="low-high">
                                            Price: Low to High
                                        </option>

                                        <option value="high-low">
                                            Price: High to Low
                                        </option>
                                    </select>
                                </div>

                                {/* Rating Filter */}
                                <div>
                                    <label
                                        htmlFor="search-rating-filter"
                                        className="mb-2 block text-sm font-semibold text-gray-600"
                                    >
                                        Minimum Rating
                                    </label>

                                    <select
                                        id="search-rating-filter"
                                        value={minRating}
                                        onChange={event =>
                                            setMinRating(event.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="0">
                                            All Ratings
                                        </option>

                                        <option value="3">
                                            3+ Stars
                                        </option>

                                        <option value="4">
                                            4+ Stars
                                        </option>

                                        <option value="4.5">
                                            4.5+ Stars
                                        </option>
                                    </select>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full rounded-lg border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                    >
                                        Clear Filters
                                    </button>
                                </div>

                            </div>

                            <p className="mt-5 text-sm text-gray-500">
                                Showing{' '}
                                <span className="font-bold text-gray-900">
                                    {filteredProducts.length}
                                </span>{' '}
                                of{' '}
                                <span className="font-bold text-gray-900">
                                    {products.length}
                                </span>{' '}
                                products
                            </p>
                        </div>

                        {/* Product Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        className="flex flex-col overflow-hidden rounded-xl bg-white transition hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="bg-gray-50 p-4">
                                            <img
                                                src={product.thumbnail}
                                                alt={product.title}
                                                onClick={() =>
                                                    navigate(`/product/${product.id}`)
                                                }
                                                loading="lazy"
                                                className="h-48 w-full cursor-pointer object-contain"
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col p-4">
                                            <h2
                                                onClick={() =>
                                                    navigate(`/product/${product.id}`)
                                                }
                                                className="mb-2 cursor-pointer font-semibold text-gray-900 hover:text-blue-600"
                                            >
                                                {product.title}
                                            </h2>

                                            <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                                                {product.description}
                                            </p>

                                            <p className="mb-4 flex items-center gap-1 text-sm text-amber-500">
                                                <FiStar
                                                    size={16}
                                                    fill="currentColor"
                                                />
                                                {Number(product.rating).toFixed(1)}
                                            </p>

                                            <div className="mt-auto flex items-center justify-between gap-3">
                                                <span className="text-xl font-bold text-gray-900">
                                                    ${product.price}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        navigate(`/product/${product.id}`)
                                                    }
                                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                                >
                                                    View Product
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl bg-white p-8 text-center">
                                <p className="mb-2 text-xl font-semibold text-gray-800">
                                    No products match your filters
                                </p>

                                <p className="text-gray-500">
                                    Try changing your category or rating.
                                </p>

                                <button
                                    onClick={clearFilters}
                                    className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}

export default SearchResults
