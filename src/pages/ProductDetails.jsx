
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')

  // Fetch product details using the product ID
  useEffect(() => {
    const controller = new AbortController()

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError('')
        setProduct(null)
        setSelectedImage('')
        setQuantity(1)
        setMessage('')

        const response = await fetch(
          `https://dummyjson.com/products/${id}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Product not found')
        }

        const data = await response.json()

        setProduct(data)
        setSelectedImage(data.thumbnail || data.images?.[0] || '')
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Unable to load this product. Please try again.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchProduct()

    return () => controller.abort()
  }, [id])

  // Calculate discounted price
  const discountedPrice = product
    ? product.price * (1 - product.discountPercentage / 100)
    : 0

  // Add product to localStorage cart
  const addToCart = () => {
    if (!product || product.stock <= 0) return

    try {
      const savedCart = JSON.parse(
        localStorage.getItem('cart') || '[]'
      )

      if (!Array.isArray(savedCart)) {
        throw new Error('Invalid cart data')
      }

      const existingProduct = savedCart.find(
        item => item.id === product.id
      )

      const currentQuantity = existingProduct
        ? Number(existingProduct.quantity) || 0
        : 0

      // Check available stock before adding
      if (currentQuantity + quantity > product.stock) {
        setMessage(
          `Only ${Math.max(0, product.stock - currentQuantity)} more items can be added.`
        )
        return
      }

      let updatedCart

      if (existingProduct) {
        // Increase quantity if product already exists
        updatedCart = savedCart.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: currentQuantity + quantity
              }
            : item
        )
      } else {
        // Add product if it does not exist
        updatedCart = [
          ...savedCart,
          {
            ...product,
            price: discountedPrice,
            quantity
          }
        ]
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart))
      window.dispatchEvent(new Event('cartUpdated'))

      setMessage('Product added to your cart successfully!')
    } catch {
      setMessage('Unable to update your cart. Please try again.')
    }
  }

  // Buy Now: do not add the same product twice
  const buyNow = () => {
    if (!product || product.stock <= 0) return

    try {
      const savedCart = JSON.parse(
        localStorage.getItem('cart') || '[]'
      )

      if (!Array.isArray(savedCart)) {
        throw new Error('Invalid cart data')
      }

      const existingProduct = savedCart.find(
        item => item.id === product.id
      )

      // If product is already in cart, do not increase quantity
      if (existingProduct) {
        navigate('/cart')
        return
      }

      // Validate stock before adding a new product
      if (quantity > product.stock) {
        setMessage(`Only ${product.stock} items are available.`)
        return
      }

      // Add the product only once
      const updatedCart = [
        ...savedCart,
        {
          ...product,
          price: discountedPrice,
          quantity
        }
      ]

      localStorage.setItem('cart', JSON.stringify(updatedCart))
      window.dispatchEvent(new Event('cartUpdated'))

      // Go to cart after successfully saving
      navigate('/cart')
    } catch {
      setMessage('Unable to proceed. Please try again.')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">
          Loading product details...
        </p>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-5 text-center">
        <div className="text-6xl mb-5">📦</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Product Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          {error || 'This product is not available.'}
        </p>
        <Link
          to="/"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  const images = [
    ...new Set(
      [product.thumbnail, ...(product.images || [])].filter(Boolean)
    )
  ]

  const inStock = product.stock > 0

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/categories"
            className="capitalize hover:text-blue-600 transition"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[180px]">
            {product.title}
          </span>
        </nav>

        {/* Main Product Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

          {/* Product Images */}
          <div>
            <div className="relative bg-gray-50 border border-gray-100 rounded-3xl min-h-[320px] sm:min-h-[450px] flex items-center justify-center p-6 sm:p-10 overflow-hidden">
              <span className="absolute top-5 left-5 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full">
                {Math.round(product.discountPercentage)}% OFF
              </span>

              {selectedImage && (
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-[300px] sm:h-[400px] object-contain hover:scale-105 transition duration-500"
                />
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    aria-label={`View product image ${index + 1}`}
                    aria-pressed={selectedImage === image}
                    className={`shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 bg-gray-50 p-2 transition ${
                      selectedImage === image
                        ? 'border-blue-600'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                {product.brand || product.category}
              </span>

              <span
                className={`text-sm font-semibold flex items-center gap-2 ${
                  inStock ? 'text-green-600' : 'text-red-500'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    inStock ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg font-semibold text-sm">
                <span>★</span>
                {Number(product.rating).toFixed(1)}
              </span>

              <span className="text-sm text-gray-500">
                Customer rating
              </span>

              <span className="text-sm text-gray-300">|</span>

              <span className="text-sm text-gray-500">
                SKU: {product.sku || product.id}
              </span>
            </div>

            <p className="text-gray-600 leading-7 mt-6">
              {product.description}
            </p>

            {/* Price */}
            <div className="mt-7 p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center flex-wrap gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  ${discountedPrice.toFixed(2)}
                </span>

                <span className="text-lg text-gray-400 line-through">
                  ${Number(product.price).toFixed(2)}
                </span>

                <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  Save ${(product.price - discountedPrice).toFixed(2)}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Inclusive of all applicable taxes.
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mt-7">
              <p className="text-sm font-semibold text-gray-800 mb-3">
                Quantity
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(previous => Math.max(1, previous - 1))
                    }
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-12 h-12 text-xl text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition"
                  >
                    −
                  </button>

                  <span className="w-12 text-center font-semibold text-gray-900">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(previous =>
                        Math.min(product.stock, previous + 1)
                      )
                    }
                    disabled={!inStock || quantity >= product.stock}
                    aria-label="Increase quantity"
                    className="w-12 h-12 text-xl text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition"
                  >
                    +
                  </button>
                </div>

                <span className="text-sm text-gray-500">
                  {inStock ? `${product.stock} available` : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Cart and Buy Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">
              <button
                type="button"
                onClick={addToCart}
                disabled={!inStock}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 text-white font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span className="text-xl">🛒</span>
                Add to Cart
              </button>

              <button
                type="button"
                onClick={buyNow}
                disabled={!inStock}
                className="rounded-xl border-2 border-blue-600 px-5 py-4 text-blue-600 font-semibold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Buy Now →
              </button>
            </div>

            {/* Feedback Message */}
            {message && (
              <p
                role="status"
                aria-live="polite"
                className={`mt-4 rounded-xl p-3 text-sm font-medium ${
                  message.includes('successfully')
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {message}
              </p>
            )}

            {/* Delivery Information */}
            <div className="mt-8 border-t border-gray-100 pt-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl shrink-0">
                  🚚
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Delivery Information
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {product.shippingInformation || 'Shipping details available at checkout.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl shrink-0">
                  ↩️
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Return Policy
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {product.returnPolicy || 'Please check the return policy before purchasing.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-xl shrink-0">
                  🛡️
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Warranty
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {product.warrantyInformation || 'Warranty information is not available.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Section */}
        <section className="mt-14 sm:mt-20 border-t border-gray-200 pt-10">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Product Information
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            Product Details
          </h2>

          <p className="text-gray-600 leading-7 mt-4 max-w-3xl">
            {product.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
            <div className="rounded-2xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-semibold text-gray-900 capitalize mt-2">
                {product.category}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Brand</p>
              <p className="font-semibold text-gray-900 mt-2">
                {product.brand || 'Not specified'}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Availability</p>
              <p className="font-semibold text-gray-900 mt-2">
                {product.availabilityStatus || (inStock ? 'In Stock' : 'Out of Stock')}
              </p>
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="mt-14 sm:mt-16 border-t border-gray-200 pt-10">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Feedback
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            Customer Reviews
          </h2>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-5 rounded-2xl bg-gray-50 p-6">
            <div>
              <p className="text-4xl font-bold text-gray-900">
                {Number(product.rating).toFixed(1)}
                <span className="text-amber-500 text-2xl ml-2">★</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Overall product rating
              </p>
            </div>

            <div className="hidden sm:block w-px h-16 bg-gray-200" />

            <p className="text-sm text-gray-600 leading-6 max-w-xl">
              Explore customer feedback to learn more about this product.
              Ratings and reviews displayed here are sample data provided by
              the product API.
            </p>
          </div>

          {product.reviews?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {product.reviews.map((review, index) => (
                <article
                  key={`${review.reviewerName}-${index}`}
                  className="border border-gray-100 rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {review.reviewerName}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {review.date
                          ? new Date(review.date).toLocaleDateString()
                          : 'Customer review'}
                      </p>
                    </div>

                    <span className="text-amber-500 font-semibold whitespace-nowrap">
                      ★ {review.rating}/5
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-6 mt-4">
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-5">
              No reviews are available for this product yet.
            </p>
          )}
        </section>

        {/* Back to Shopping */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition"
          >
            ← Continue Shopping
          </Link>
        </div>

      </div>
    </main>
  )
}

export default ProductDetails
