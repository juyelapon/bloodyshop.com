
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { IoSearchSharp, IoCart, IoClose } from 'react-icons/io5'
import { FaUser } from 'react-icons/fa6'
import { GrMenu } from 'react-icons/gr'
import {
  FiHeart,
  FiUser,
  FiPackage,
  FiTruck,
  FiLogOut,
  FiChevronDown,
} from 'react-icons/fi'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Categories', path: '/categories' },
  { name: 'Deals', path: '/deals' },
  { name: 'About', path: '/about' },
]

const readStorage = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null')
    return value ?? fallback
  } catch {
    return fallback
  }
}

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const profileRef = useRef(null)

  const [searchValue, setSearchValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [currentUser, setCurrentUser] = useState(null)
  const [hasOrders, setHasOrders] = useState(false)

  const updateCart = useCallback(() => {
    const cart = readStorage('cart', [])

    const count = Array.isArray(cart)
      ? cart.reduce(
          (total, item) =>
            total +
            (Number(item.quantity) > 0 ? Number(item.quantity) : 1),
          0
        )
      : 0

    setCartCount(count)
  }, [])

  const updateWishlist = useCallback(() => {
    const wishlist = readStorage('wishlist', [])

    setWishlistCount(
      Array.isArray(wishlist) ? wishlist.length : 0
    )
  }, [])

  const updateAuth = useCallback(() => {
    const user = readStorage('shophub_current_user', null)

    setCurrentUser(user)

    if (!user?.email) {
      setHasOrders(false)
      return
    }

    const orders = readStorage('orders', [])
    const userEmail = String(user.email).trim().toLowerCase()

    const userOrders = Array.isArray(orders)
      ? orders.filter((order) => {
          const orderEmail = String(
            order.userEmail || order.customer?.email || ''
          )
            .trim()
            .toLowerCase()

          return orderEmail === userEmail
        })
      : []

    setHasOrders(userOrders.length > 0)
  }, [])

  useEffect(() => {
    updateCart()
    updateWishlist()
    updateAuth()

    const refreshAll = () => {
      updateCart()
      updateWishlist()
      updateAuth()
    }

    window.addEventListener('storage', refreshAll)
    window.addEventListener('cartUpdated', updateCart)
    window.addEventListener('wishlistUpdated', updateWishlist)
    window.addEventListener('ordersUpdated', updateAuth)
    window.addEventListener('authUpdated', updateAuth)

    return () => {
      window.removeEventListener('storage', refreshAll)
      window.removeEventListener('cartUpdated', updateCart)
      window.removeEventListener('wishlistUpdated', updateWishlist)
      window.removeEventListener('ordersUpdated', updateAuth)
      window.removeEventListener('authUpdated', updateAuth)
    }
  }, [updateCart, updateWishlist, updateAuth])

  // Close the desktop profile dropdown when clicking outside it.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setProfileOpen(false)
    setShowSuggestions(false)
  }, [location.pathname])

  useEffect(() => {
    const query = searchValue.trim()

    if (!query) {
      setSuggestions([])
      return
    }

    const controller = new AbortController()

    const searchProducts = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Could not search products')
        }

        const data = await response.json()

        setSuggestions((data.products || []).slice(0, 5))
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSuggestions([])
        }
      }
    }

    searchProducts()

    return () => controller.abort()
  }, [searchValue])

  const handleSearch = (event) => {
    event.preventDefault()

    const query = searchValue.trim()

    if (!query) return

    setShowSuggestions(false)
    setMenuOpen(false)
    setProfileOpen(false)

    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('shophub_current_user')
    localStorage.removeItem('shopHubUser')

    setCurrentUser(null)
    setHasOrders(false)
    setProfileOpen(false)
    setMenuOpen(false)

    window.dispatchEvent(new Event('authUpdated'))

    navigate('/')
  }

  const badgeClass =
    'absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1 text-[10px] font-bold text-white'

  const iconLinkClass =
    'relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-purple-50 hover:text-purple-600'

  const renderSearchForm = (mobile = false) => (
    <form
      onSubmit={handleSearch}
      className={`relative ${mobile ? 'w-full' : 'w-full max-w-md'}`}
    >
      <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 transition focus-within:border-purple-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-100">
        <IoSearchSharp className="ml-4 shrink-0 text-xl text-gray-400" />

        <input
          type="search"
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search products..."
          aria-label="Search products"
          className="w-full bg-transparent px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />

        {searchValue && (
          <button
            type="button"
            onClick={() => {
              setSearchValue('')
              setSuggestions([])
              setShowSuggestions(false)
            }}
            aria-label="Clear search"
            className="mr-3 text-gray-400 hover:text-gray-700"
          >
            <IoClose size={18} />
          </button>
        )}
      </div>

      {showSuggestions &&
        searchValue.trim() &&
        suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-[60] mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
            {suggestions.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                onClick={() => {
                  setSearchValue('')
                  setShowSuggestions(false)
                  setMenuOpen(false)
                  setProfileOpen(false)
                }}
                className="flex items-center gap-3 border-b border-gray-50 px-4 py-3 last:border-b-0 hover:bg-purple-50"
              >
                <img
                  src={product.thumbnail}
                  alt=""
                  className="h-10 w-10 rounded-lg bg-gray-50 object-contain"
                />

                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700">
                  {product.title}
                </span>

                <span className="text-sm font-bold text-purple-600">
                  ${Number(product.price).toFixed(2)}
                </span>
              </Link>
            ))}

            <button
              type="submit"
              className="w-full bg-gray-50 px-4 py-3 text-sm font-semibold text-purple-600 hover:bg-purple-50"
            >
              View all search results
            </button>
          </div>
        )}
    </form>
  )

  const renderCartLink = () => (
    <Link
      to="/cart"
      aria-label={`Shopping cart, ${cartCount} items`}
      className={iconLinkClass}
    >
      <IoCart size={23} />

      {cartCount > 0 && (
        <span className={badgeClass}>
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </Link>
  )

  const renderWishlistLink = () => (
    <Link
      to="/wishlist"
      aria-label={`Wishlist, ${wishlistCount} items`}
      className={iconLinkClass}
    >
      <FiHeart size={21} />

      {wishlistCount > 0 && (
        <span className={badgeClass}>
          {wishlistCount > 99 ? '99+' : wishlistCount}
        </span>
      )}
    </Link>
  )

  const renderAccountMenu = (mobile = false) => (
    <div className="space-y-1">
      {currentUser && (
        <>
          {!mobile && (
            <div className="mb-2 border-b border-gray-100 px-4 py-3">
              <p className="truncate text-sm font-bold text-gray-800">
                {currentUser.fullName ||
                  currentUser.name ||
                  'ShopHub Customer'}
              </p>

              <p className="truncate text-xs text-gray-500">
                {currentUser.email}
              </p>
            </div>
          )}

          <Link
            to="/account"
            onClick={() => {
              setProfileOpen(false)
              setMenuOpen(false)
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-purple-50 hover:text-purple-600"
          >
            <FiUser size={18} />
            My Account
          </Link>

          <Link
            to="/account"
            onClick={() => {
              setProfileOpen(false)
              setMenuOpen(false)
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-purple-50 hover:text-purple-600"
          >
            <FaUser size={16} />
            Profile
          </Link>

          {hasOrders && (
            <>
              <Link
                to="/my-orders"
                onClick={() => {
                  setProfileOpen(false)
                  setMenuOpen(false)
                }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-purple-50 hover:text-purple-600"
              >
                <FiPackage size={18} />
                My Orders
              </Link>

              <Link
                to="/track-order"
                onClick={() => {
                  setProfileOpen(false)
                  setMenuOpen(false)
                }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-purple-50 hover:text-purple-600"
              >
                <FiTruck size={18} />
                Track Order
              </Link>
            </>
          )}

          <div className="my-2 border-t border-gray-100" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </>
      )}
    </div>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main navbar */}
        <div className="flex min-h-[76px] items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-xl font-black text-white shadow-lg shadow-purple-200">
              S
            </span>

            <span className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
              Shop<span className="text-purple-600">Hub</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-semibold transition ${
                  location.pathname === item.path
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop search */}
          <div className="hidden flex-1 justify-center px-3 md:flex">
            {renderSearchForm()}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="hidden sm:block">
              {renderWishlistLink()}
            </div>

            {renderCartLink()}

            {/* Login / Profile */}
            {!currentUser ? (
              <Link
                to="/login"
                aria-label="Login"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-purple-600 px-3 text-sm font-bold text-white transition hover:bg-purple-700 sm:px-4"
              >
                <FaUser size={15} />
                <span className="hidden sm:inline">Login</span>
              </Link>
            ) : (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen((previous) => !previous)
                  }
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition ${
                    profileOpen
                      ? 'border-purple-300 bg-purple-50 text-purple-600'
                      : 'border-gray-200 text-gray-700 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  <FaUser size={16} />
                  <span className="hidden xl:inline">Profile</span>

                  <FiChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${
                      profileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-[100] mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl"
                  >
                    {renderAccountMenu()}
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen((previous) => !previous)
                setProfileOpen(false)
              }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 lg:hidden"
            >
              {menuOpen ? <IoClose size={25} /> : <GrMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="pb-4 md:hidden">
          {renderSearchForm(true)}
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="border-t border-gray-100 py-4 lg:hidden">
            <nav className="mb-3 space-y-1">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    location.pathname === item.path
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mb-3 flex items-center gap-3 border-y border-gray-100 py-3">
              <div className="sm:hidden">
                {renderWishlistLink()}
              </div>

              <span className="text-sm text-gray-500">
                Wishlist
              </span>

              <span className="ml-auto text-sm font-semibold text-gray-700">
                {wishlistCount} items
              </span>
            </div>

            {currentUser ? (
              <div className="rounded-xl bg-gray-50 p-2">
                <div className="px-4 py-3">
                  <p className="truncate text-sm font-bold text-gray-800">
                    {currentUser.fullName ||
                      currentUser.name ||
                      'ShopHub Customer'}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {currentUser.email}
                  </p>
                </div>

                {renderAccountMenu(true)}
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
              >
                <FaUser size={15} />
                Login / Register
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
