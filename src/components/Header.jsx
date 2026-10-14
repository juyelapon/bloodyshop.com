
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoSearchSharp, IoCart, IoClose } from 'react-icons/io5'
import { FaUser } from 'react-icons/fa6'
import { GrMenu } from 'react-icons/gr'
import {
  FiPackage,
  FiTruck,
  FiUser,
  FiShield,
} from 'react-icons/fi'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Categories', path: '/categories' },
  { name: 'Deals', path: '/deals' },
  { name: 'About', path: '/about' },
]

const accountLinks = [
  { name: 'My Orders', path: '/my-orders', Icon: FiPackage },
  { name: 'Track Order', path: '/track-order', Icon: FiTruck },
  { name: 'My Account', path: '/account', Icon: FiUser },
  { name: 'Admin Login', path: '/admin-login', Icon: FiShield },
]

const Header = () => {
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Search Suggestions
  useEffect(() => {
    const query = searchTerm.trim()

    if (query.length < 2) {
      setSuggestions([])
      return
    }

    const controller = new AbortController()

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=5`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Unable to load suggestions')
        }

        const data = await response.json()
        setSuggestions(data.products || [])
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Suggestion error:', error)
          setSuggestions([])
        }
      }
    }

    const timer = setTimeout(fetchSuggestions, 250)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [searchTerm])

  // Search Handler
  const handleSearch = (e) => {
    e.preventDefault()

    const query = searchTerm.trim()
    if (!query) return

    setShowSuggestions(false)
    setSearchTerm('')
    setMenuOpen(false)

    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  // Open Product Details
  const openProduct = (productId) => {
    setShowSuggestions(false)
    setSearchTerm('')
    setMenuOpen(false)

    navigate(`/product/${productId}`)
  }

  // Cart Count
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')

        if (!Array.isArray(savedCart)) {
          setCartCount(0)
          return
        }

        const totalQuantity = savedCart.reduce(
          (total, item) =>
            total + Math.max(0, Number(item.quantity) || 0),
          0
        )

        setCartCount(totalQuantity)
      } catch {
        setCartCount(0)
      }
    }

    updateCartCount()

    window.addEventListener('cartUpdated', updateCartCount)
    window.addEventListener('storage', updateCartCount)

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount)
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  // Wishlist Count
  useEffect(() => {
    const updateWishlistCount = () => {
      try {
        const savedWishlist = JSON.parse(
          localStorage.getItem('wishlist') || '[]'
        )

        setWishlistCount(
          Array.isArray(savedWishlist) ? savedWishlist.length : 0
        )
      } catch {
        setWishlistCount(0)
      }
    }

    updateWishlistCount()

    window.addEventListener('wishlistUpdated', updateWishlistCount)
    window.addEventListener('storage', updateWishlistCount)

    return () => {
      window.removeEventListener('wishlistUpdated', updateWishlistCount)
      window.removeEventListener('storage', updateWishlistCount)
    }
  }, [])

  // Reusable Search Form
  const renderSearch = (mobile = false) => (
    <form
      onSubmit={handleSearch}
      className={`relative ${mobile ? 'w-full' : 'w-64'}`}
    >
      <IoSearchSharp
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
      />

      <input
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setShowSuggestions(true)
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Search products..."
        className="w-full h-10 pl-9 pr-4 border border-gray-200 rounded-lg outline-none focus:border-blue-500 placeholder:text-gray-400 text-sm"
        type="search"
        autoComplete="off"
      />

      {showSuggestions && searchTerm.trim().length >= 2 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-[100] overflow-hidden">
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => openProduct(product.id)}
                  className="flex items-center gap-3 w-full px-3 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 border-gray-100"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-11 h-11 object-contain rounded-md bg-gray-50"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800 truncate">
                      {product.title}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      ${product.price}
                    </p>
                  </div>
                </button>
              ))}

              <button
                type="submit"
                className="w-full text-center text-sm text-blue-600 hover:bg-blue-50 py-3 font-medium"
              >
                See all results for "{searchTerm.trim()}"
              </button>
            </>
          ) : (
            <p className="px-4 py-3 text-sm text-gray-500">
              Searching products...
            </p>
          )}
        </div>
      )}
    </form>
  )

  // Reusable account navigation link
  const renderAccountLinks = (mobile = false) =>
    accountLinks.map(({ name, path, Icon }) => (
      <Link
        key={path}
        to={path}
        title={name}
        aria-label={name}
        onClick={() => {
          if (mobile) setMenuOpen(false)
        }}
        className={
          mobile
            ? 'flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition'
            : 'flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors'
        }
      >
        <Icon size={20} aria-hidden="true" />
        {mobile && <span className="text-sm">{name}</span>}
      </Link>
    ))

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <nav className="max-w-7xl mx-auto px-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between gap-4 py-4">
          {/* Mobile Menu + Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              className="md:hidden text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <IoClose size={24} /> : <GrMenu size={22} />}
            </button>

            <Link to="/">
              <img
                src="/navlogo.png"
                alt="ShopHub logo"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Search */}
          <div className="hidden xl:block flex-1 max-w-64">
            {renderSearch()}
          </div>

          {/* All Icons In One Row */}
          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            {/* Cart */}
            <Link
              to="/cart"
              aria-label={`Shopping Cart, ${cartCount} items`}
              title={`Shopping Cart (${cartCount})`}
              className="relative flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <IoCart size={23} />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold ring-2 ring-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Login / Register */}
            <Link
              to="/login"
              aria-label="Login or Register"
              title="Login / Register"
              className="flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FaUser size={19} />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} products`}
              title={`Wishlist (${wishlistCount})`}
              className="relative flex items-center justify-center text-red-500 hover:text-red-600 transition-colors"
            >
              <span className="text-2xl leading-none">
                {wishlistCount > 0 ? '♥' : '♡'}
              </span>

              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-3 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold ring-2 ring-white">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Divider */}
            <div className="hidden sm:block h-6 border-l border-gray-200" />

            {/* Account + Admin SVG Icons: same row */}
            <div className="flex items-center gap-3 lg:gap-4">
              {renderAccountLinks()}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-4 md:hidden">
          {renderSearch(true)}
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 pb-4">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li
                  key={link.name}
                  className="rounded-lg transition-colors hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <Link
                    to={link.path}
                    className="block px-3 py-3 text-gray-700 hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 mt-2 pt-2">
              {renderAccountLinks(true)}

              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-3 py-3 text-red-500"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">
                    {wishlistCount > 0 ? '♥' : '♡'}
                  </span>
                  <span className="text-sm">My Wishlist</span>
                </span>

                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold">
                  {wishlistCount}
                </span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
