import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    FiUser,
    FiPackage,
    FiHeart,
    FiMapPin,
    FiEdit2,
    FiShoppingBag,
    FiArrowRight,
    FiLogOut,
    FiMail,
    FiPhone,
    FiCheckCircle,
} from 'react-icons/fi'

const MyAccount = () => {
    const [orders, setOrders] = useState([])
    const [editing, setEditing] = useState(false)
    const [saved, setSaved] = useState(false)

    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem('shopHubUser') || 'null'
            ) || {
                fullName: 'ShopHub Customer',
                email: 'customer@example.com',
                phone: '',
                address: '',
                city: '',
                postalCode: '',
                country: 'Bangladesh',
            }
        } catch {
            return {
                fullName: 'ShopHub Customer',
                email: 'customer@example.com',
                phone: '',
                address: '',
                city: '',
                postalCode: '',
                country: 'Bangladesh',
            }
        }
    })

    useEffect(() => {
        const loadOrders = () => {
            try {
                const savedOrders = JSON.parse(
                    localStorage.getItem('orders') || '[]'
                )

                setOrders(
                    Array.isArray(savedOrders) ? savedOrders : []
                )
            } catch {
                setOrders([])
            }
        }

        loadOrders()

        window.addEventListener('storage', loadOrders)
        window.addEventListener('ordersUpdated', loadOrders)

        return () => {
            window.removeEventListener('storage', loadOrders)
            window.removeEventListener('ordersUpdated', loadOrders)
        }
    }, [])

    const updateUser = (e) => {
        const { name, value } = e.target

        setUser((previousUser) => ({
            ...previousUser,
            [name]: value,
        }))

        setSaved(false)
    }

    const saveProfile = (e) => {
        e.preventDefault()

        localStorage.setItem('shopHubUser', JSON.stringify(user))
        setEditing(false)
        setSaved(true)
    }

    const totalSpent = orders
        .filter(
            (order) =>
                String(order.status || '').toLowerCase() !== 'cancelled' &&
                String(order.status || '').toLowerCase() !== 'canceled'
        )
        .reduce((total, order) => {
            return total + (Number(order.total) || 0)
        }, 0)

    const inputClass =
        'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100'

    const accountLinks = [
        {
            title: 'My Orders',
            description: 'View your order history and status',
            icon: FiPackage,
            link: '/my-orders',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'My Wishlist',
            description: 'Explore your saved products',
            icon: FiHeart,
            link: '/wishlist',
            color: 'bg-pink-50 text-pink-600',
        },
        {
            title: 'Continue Shopping',
            description: 'Discover products you might love',
            icon: FiShoppingBag,
            link: '/',
            color: 'bg-purple-50 text-purple-600',
        },
    ]

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Page Heading */}
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-600">
                        My Account
                    </p>

                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Welcome back, {user.fullName.split(' ')[0]}!
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Manage your profile, orders and delivery information.
                    </p>
                </div>

                {/* Profile Banner */}
                <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 p-6 text-white shadow-lg sm:p-8">
                    <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10" />
                    <div className="absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-white/10" />

                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-5">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-3xl font-bold shadow-inner">
                                {user.fullName
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase() || 'U'}
                            </div>

                            <div>
                                <p className="mb-1 text-sm text-purple-100">
                                    Your ShopHub Profile
                                </p>

                                <h2 className="text-2xl font-bold sm:text-3xl">
                                    {user.fullName || 'Your Name'}
                                </h2>

                                <p className="mt-1 break-all text-sm text-purple-100">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setEditing(true)
                                setSaved(false)
                            }}
                            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white px-5 py-3 text-sm font-bold text-purple-700 shadow-sm transition hover:bg-purple-50 sm:self-center"
                        >
                            <FiEdit2 />
                            Edit Profile
                        </button>
                    </div>
                </section>

                {/* Stats */}
                <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">
                                Total Orders
                            </span>

                            <span className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                <FiPackage size={21} />
                            </span>
                        </div>

                        <p className="text-3xl font-extrabold text-gray-900">
                            {orders.length}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Orders placed
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">
                                Wishlist
                            </span>

                            <span className="rounded-xl bg-pink-50 p-3 text-pink-600">
                                <FiHeart size={21} />
                            </span>
                        </div>

                        <p className="text-3xl font-extrabold text-gray-900">
                            Saved
                        </p>

                        <Link
                            to="/wishlist"
                            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800"
                        >
                            View Wishlist <FiArrowRight />
                        </Link>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">
                                Total Spent
                            </span>

                            <span className="rounded-xl bg-green-50 p-3 text-green-600">
                                <FiShoppingBag size={21} />
                            </span>
                        </div>

                        <p className="text-3xl font-extrabold text-gray-900">
                            ${totalSpent.toFixed(2)}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Excluding cancelled orders
                        </p>
                    </div>
                </section>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

                    {/* Personal Information */}
                    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2 sm:p-8">
                        <div className="mb-7 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Personal Information
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Manage your personal details.
                                </p>
                            </div>

                            <span className="rounded-xl bg-purple-50 p-3 text-purple-600">
                                <FiUser size={22} />
                            </span>
                        </div>

                        {saved && (
                            <div className="mb-5 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
                                <FiCheckCircle size={18} />
                                Profile saved successfully!
                            </div>
                        )}

                        <form onSubmit={saveProfile}>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        value={user.fullName}
                                        onChange={updateUser}
                                        disabled={!editing}
                                        required
                                        className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-600`}
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Email Address
                                    </label>

                                    <div className="relative">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                        <input
                                            type="email"
                                            name="email"
                                            value={user.email}
                                            onChange={updateUser}
                                            disabled={!editing}
                                            required
                                            className={`${inputClass} pl-11 disabled:bg-gray-50 disabled:text-gray-600`}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Phone Number
                                    </label>

                                    <div className="relative">
                                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={user.phone}
                                            onChange={updateUser}
                                            disabled={!editing}
                                            className={`${inputClass} pl-11 disabled:bg-gray-50 disabled:text-gray-600`}
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Country
                                    </label>

                                    <input
                                        type="text"
                                        name="country"
                                        value={user.country}
                                        onChange={updateUser}
                                        disabled={!editing}
                                        className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-600`}
                                        placeholder="Country"
                                    />
                                </div>
                            </div>

                            {editing && (
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
                                    >
                                        Save Changes
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const savedUser = JSON.parse(
                                                localStorage.getItem(
                                                    'shopHubUser'
                                                ) || 'null'
                                            )

                                            setUser(
                                                savedUser || {
                                                    fullName: 'ShopHub Customer',
                                                    email: 'customer@example.com',
                                                    phone: '',
                                                    address: '',
                                                    city: '',
                                                    postalCode: '',
                                                    country: 'Bangladesh',
                                                }
                                            )

                                            setEditing(false)
                                            setSaved(false)
                                        }}
                                        className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </form>
                    </section>

                    {/* Quick Links */}
                    <aside className="space-y-4">
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 text-lg font-bold text-gray-900">
                                Quick Access
                            </h2>

                            <div className="space-y-3">
                                {accountLinks.map((item) => {
                                    const Icon = item.icon

                                    return (
                                        <Link
                                            key={item.title}
                                            to={item.link}
                                            className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-purple-200 hover:bg-purple-50/50"
                                        >
                                            <span
                                                className={`rounded-xl p-3 ${item.color}`}
                                            >
                                                <Icon size={20} />
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-bold text-gray-800">
                                                    {item.title}
                                                </span>

                                                <span className="mt-1 block text-xs leading-5 text-gray-500">
                                                    {item.description}
                                                </span>
                                            </span>

                                            <FiArrowRight className="shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-purple-600" />
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="rounded-xl bg-orange-50 p-3 text-orange-600">
                                    <FiMapPin size={21} />
                                </span>

                                <div>
                                    <h2 className="font-bold text-gray-900">
                                        Delivery Address
                                    </h2>

                                    <p className="text-xs text-gray-500">
                                        Saved profile address
                                    </p>
                                </div>
                            </div>

                            {user.address || user.city ? (
                                <div className="text-sm leading-6 text-gray-600">
                                    <p>{user.address}</p>
                                    <p>{user.city}</p>
                                    <p>
                                        {[user.postalCode, user.country]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm leading-6 text-gray-500">
                                    No delivery address saved yet. You can add
                                    your address during checkout.
                                </p>
                            )}

                            <Link
                                to="/checkout"
                                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-purple-600 transition hover:text-purple-800"
                            >
                                Go to Checkout <FiArrowRight />
                            </Link>
                        </div>
                    </aside>
                </div>

                {/* Recent Orders */}
                <section className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Recent Orders
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                A quick look at your latest purchases.
                            </p>
                        </div>

                        <Link
                            to="/my-orders"
                            className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-800"
                        >
                            View All <FiArrowRight />
                        </Link>
                    </div>

                    {orders.length === 0 ? (
                        <div className="rounded-xl bg-gray-50 px-5 py-10 text-center">
                            <FiPackage
                                size={34}
                                className="mx-auto mb-3 text-gray-400"
                            />

                            <h3 className="font-bold text-gray-800">
                                No orders yet
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Your recent purchases will appear here.
                            </p>

                            <Link
                                to="/"
                                className="mt-5 inline-flex rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {[...orders].reverse().slice(0, 3).map(
                                (order, index) => (
                                    <div
                                        key={order.orderId || index}
                                        className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">
                                                {order.orderId || 'Order'}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {order.items?.length || 0}{' '}
                                                {(order.items?.length || 0) === 1
                                                    ? 'product'
                                                    : 'products'}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                                            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                                                {order.status || 'Pending'}
                                            </span>

                                            <span className="font-bold text-gray-900">
                                                $
                                                {Number(
                                                    order.total
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>

                {/* Footer Link */}
                <div className="mt-8 flex justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-purple-300 hover:text-purple-700"
                    >
                        <FiShoppingBag />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default MyAccount
