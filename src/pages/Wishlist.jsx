import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([])
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    // Load Wishlist
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

    // Remove from Wishlist
    const removeFromWishlist = (id) => {
        const updatedWishlist = wishlist.filter(
            product => product.id !== id
        )

        localStorage.setItem(
            'wishlist',
            JSON.stringify(updatedWishlist)
        )

        setWishlist(updatedWishlist)
        setMessage('Product removed from wishlist.')

        window.dispatchEvent(new Event('wishlistUpdated'))
    }

    // Add to Cart
    const addToCart = (product) => {
        try {
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
                const quantity = Number(existingItem.quantity) || 1
                const stock = Number(existingItem.stock) || 0

                if (quantity >= stock) {
                    setMessage('This product has reached its stock limit.')
                    return
                }

                existingItem.quantity = quantity + 1
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
        }
    }

    return (
        <section className="min-h-screen bg-[#E5E7EB] py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                            My Wishlist <span className="text-red-500">♥</span>
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Your favourite products, all in one place.
                        </p>
                    </div>

                    <span className="bg-white rounded-full px-5 py-3 font-semibold text-gray-700 shadow-sm">
                        {wishlist.length}{' '}
                        {wishlist.length === 1 ? 'Product' : 'Products'}
                    </span>
                </div>

                {/* Status Message */}
                {message && (
                    <div
                        role="status"
                        aria-live="polite"
                        className="mb-6 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700"
                    >
                        {message}
                    </div>
                )}

                {/* Empty Wishlist */}
                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 sm:p-16 text-center shadow-sm">
                        <div className="text-7xl text-red-400 mb-5">
                            ♡
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            Your Wishlist is Empty
                        </h2>

                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            You haven't saved any products yet.
                            Explore our collection and save your favourites!
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate('/categories')}
                            className="rounded-lg bg-[#3B82F6] px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Explore Products
                        </button>
                    </div>
                ) : (
                    /* Wishlist Products */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {wishlist.map(product => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col"
                            >
                                {/* Product Image */}
                                <div className="relative bg-gray-50 p-4">
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        onClick={() =>
                                            navigate(`/product/${product.id}`)
                                        }
                                        className="w-full h-48 object-contain cursor-pointer"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeFromWishlist(product.id)
                                        }
                                        aria-label={`Remove ${product.title} from wishlist`}
                                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-xl text-red-500 transition hover:bg-red-50 hover:scale-110"
                                    >
                                        ♥
                                    </button>
                                </div>

                                {/* Product Details */}
                                <div className="p-4 flex flex-col flex-1">
                                    <h2
                                        onClick={() =>
                                            navigate(`/product/${product.id}`)
                                        }
                                        className="font-semibold text-base text-gray-900 mb-2 truncate cursor-pointer hover:text-blue-600"
                                    >
                                        {product.title}
                                    </h2>

                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                        {product.description}
                                    </p>

                                    <div className="mt-auto">
                                        <p className="text-xl font-bold text-gray-900 mb-4">
                                            ${product.price}
                                        </p>

                                        <div className="flex flex-col gap-2">
                                            <button
                                                type="button"
                                                onClick={() => addToCart(product)}
                                                disabled={Number(product.stock) <= 0}
                                                className="w-full rounded-lg bg-[#3B82F6] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {Number(product.stock) <= 0
                                                    ? 'Out of Stock'
                                                    : 'Add to Cart'}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFromWishlist(product.id)
                                                }
                                                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </section>
    )
}

export default Wishlist
