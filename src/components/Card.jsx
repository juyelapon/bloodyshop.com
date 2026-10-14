import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Card = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [addingId, setAddingId] = useState(null)
    const [message, setMessage] = useState('')
    const [wishlist, setWishlist] = useState([])

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 8

    const navigate = useNavigate()

    // Load products
    useEffect(() => {
        fetch('https://dummyjson.com/products?limit=194')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to load products')
                }
                return res.json()
            })
            .then(data => {
                setProducts(data.products || [])
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }, [])

    // Load wishlist from localStorage
    useEffect(() => {
        try {
            const savedWishlist = JSON.parse(
                localStorage.getItem('wishlist') || '[]'
            )

            if (Array.isArray(savedWishlist)) {
                setWishlist(savedWishlist)
            }
        } catch {
            setWishlist([])
        }
    }, [])

    // Pagination calculations
    const totalPages = Math.ceil(products.length / productsPerPage)

    const startIndex = (currentPage - 1) * productsPerPage

    const currentProducts = products.slice(
        startIndex,
        startIndex + productsPerPage
    )

    // Change page and scroll to Featured Products
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)

            requestAnimationFrame(() => {
                document.getElementById('featured-products')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            })
        }
    }

    // Add to Cart
    const addToCart = (product) => {
        try {
            setAddingId(product.id)
            setMessage('')

            const savedCart = JSON.parse(
                localStorage.getItem('cart') || '[]'
            )

            if (!Array.isArray(savedCart)) {
                throw new Error('Invalid cart data')
            }

            const existingItem = savedCart.find(
                item => item.id === product.id
            )

            if (existingItem) {
                const currentQuantity =
                    Number(existingItem.quantity) || 1

                const stock = Number(existingItem.stock) || 0

                if (currentQuantity >= stock) {
                    setMessage('This product has reached its stock limit.')
                    return
                }

                existingItem.quantity = currentQuantity + 1
            } else {
                if (Number(product.stock) <= 0) {
                    setMessage('This product is out of stock.')
                    return
                }

                savedCart.push({
                    ...product,
                    quantity: 1
                })
            }

            localStorage.setItem('cart', JSON.stringify(savedCart))

            window.dispatchEvent(new Event('cartUpdated'))

            setMessage(`${product.title} added to cart!`)
        } catch {
            setMessage('Unable to add product. Please try again.')
        } finally {
            setAddingId(null)
        }
    }

    // Toggle Wishlist
    const toggleWishlist = (product) => {
        try {
            const savedWishlist = JSON.parse(
                localStorage.getItem('wishlist') || '[]'
            )

            if (!Array.isArray(savedWishlist)) {
                throw new Error('Invalid wishlist data')
            }

            const alreadySaved = savedWishlist.some(
                item => item.id === product.id
            )

            let updatedWishlist

            if (alreadySaved) {
                updatedWishlist = savedWishlist.filter(
                    item => item.id !== product.id
                )

                setMessage(`${product.title} removed from wishlist.`)
            } else {
                updatedWishlist = [
                    ...savedWishlist,
                    product
                ]

                setMessage(`${product.title} added to wishlist!`)
            }

            localStorage.setItem(
                'wishlist',
                JSON.stringify(updatedWishlist)
            )

            setWishlist(updatedWishlist)

            window.dispatchEvent(new Event('wishlistUpdated'))
        } catch {
            setMessage('Unable to update wishlist. Please try again.')
        }
    }

    if (loading) {
        return (
            <section className="bg-[#E5E7EB]">
                <div className="max-w-7xl mx-auto px-4 pt-16">
                    <p className="text-gray-500">
                        Loading products...
                    </p>
                </div>
            </section>
        )
    }

    if (products.length === 0) {
        return (
            <section className="bg-[#E5E7EB]">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <p className="text-gray-600">
                        Unable to load products. Please try again later.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section
            id="featured-products"
            className="bg-[#E5E7EB] scroll-mt-24"
        >
            <div className="max-w-7xl mx-auto px-4">

                <div className="pt-16 flex justify-between items-center mb-8 gap-4">
                    <h3 className="text-2xl sm:text-3xl font-bold font-inter">
                        Featured Products
                    </h3>

                    <button
                        type="button"
                        onClick={() => navigate('/categories')}
                        className="font-medium text-sm sm:text-base font-inter text-[#3B82F6] hover:text-blue-800 transition"
                    >
                        View all
                    </button>
                </div>

                {message && (
                    <p
                        role="status"
                        aria-live="polite"
                        className="mb-5 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700"
                    >
                        {message}
                    </p>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentProducts.map(product => {
                        const isWishlisted = wishlist.some(
                            item => item.id === product.id
                        )

                        return (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg overflow-hidden flex flex-col transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="relative p-4 bg-gray-50">
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        onClick={() =>
                                            navigate(`/product/${product.id}`)
                                        }
                                        className="w-full h-48 object-contain cursor-pointer"
                                    />

                                    {/* Wishlist Button */}
                                    <button
                                        type="button"
                                        onClick={() => toggleWishlist(product)}
                                        aria-label={
                                            isWishlisted
                                                ? 'Remove from wishlist'
                                                : 'Add to wishlist'
                                        }
                                        aria-pressed={isWishlisted}
                                        className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-2xl transition hover:scale-110 ${
                                            isWishlisted
                                                ? 'text-red-500'
                                                : 'text-gray-400 hover:text-red-500'
                                        }`}
                                    >
                                        {isWishlisted ? '♥' : '♡'}
                                    </button>
                                </div>

                                <div className="px-4 py-4 flex flex-col flex-1">
                                    <h3
                                        onClick={() =>
                                            navigate(`/product/${product.id}`)
                                        }
                                        className="font-semibold text-base font-inter mb-1 truncate cursor-pointer hover:text-blue-600"
                                    >
                                        {product.title}
                                    </h3>

                                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between gap-3 mt-auto">
                                        <span className="font-bold text-xl font-inter">
                                            ${product.price}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => addToCart(product)}
                                            disabled={
                                                addingId === product.id ||
                                                Number(product.stock) <= 0
                                            }
                                            className="rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {Number(product.stock) <= 0
                                                ? 'Out of Stock'
                                                : addingId === product.id
                                                    ? 'Adding...'
                                                    : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-5 py-10">

                        <p className="text-sm text-gray-600">
                            Showing {startIndex + 1}–{Math.min(
                                startIndex + productsPerPage,
                                products.length
                            )} of {products.length} products
                        </p>

                        <div className="flex flex-wrap justify-center items-center gap-2">

                            <button
                                type="button"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
                                    aria-current={
                                        currentPage === page
                                            ? 'page'
                                            : undefined
                                    }
                                    className={`w-10 h-10 rounded-lg font-medium transition ${
                                        currentPage === page
                                            ? 'bg-[#3B82F6] text-white shadow-md'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                Next
                            </button>

                        </div>
                    </div>
                )}

            </div>
        </section>
    )
}

export default Card
