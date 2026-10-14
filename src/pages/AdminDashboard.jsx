import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    FiShoppingBag,
    FiDollarSign,
    FiClock,
    FiUsers,
    FiSearch,
    FiRefreshCw,
    FiExternalLink,
    FiPackage,
    FiTrash2,
} from 'react-icons/fi'

const STATUS_OPTIONS = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
]

const STATUS_STYLES = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
}

const readOrders = () => {
    try {
        const data = JSON.parse(localStorage.getItem('orders') || '[]')
        return Array.isArray(data) ? data : []
    } catch {
        return []
    }
}

const formatDate = (date) => {
    if (!date) return 'N/A'

    const parsed = new Date(date)

    if (Number.isNaN(parsed.getTime())) return 'N/A'

    return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

const getOrderTotal = (order) => {
    if (
        order.total !== undefined &&
        order.total !== null &&
        Number.isFinite(Number(order.total))
    ) {
        return Number(order.total)
    }

    const subtotal = (order.items || []).reduce((sum, item) => {
        return (
            sum +
            (Number(item.price) || 0) *
                (Number(item.quantity) || 1)
        )
    }, 0)

    return subtotal + (Number(order.shipping) || 0)
}

const AdminDashboard = () => {
    const [orders, setOrders] = useState([])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [notice, setNotice] = useState('')

    const loadOrders = () => {
        setOrders(readOrders())
    }

    useEffect(() => {
        loadOrders()

        const handleOrdersUpdated = () => loadOrders()

        window.addEventListener('storage', handleOrdersUpdated)
        window.addEventListener('ordersUpdated', handleOrdersUpdated)

        return () => {
            window.removeEventListener('storage', handleOrdersUpdated)
            window.removeEventListener('ordersUpdated', handleOrdersUpdated)
        }
    }, [])

    // Delete all previously cancelled orders from localStorage and UI.
    const deleteCancelledOrders = () => {
        const latestOrders = readOrders()

        const cancelledOrders = latestOrders.filter((order) => {
            const status = String(order.status || '')
                .trim()
                .toLowerCase()

            return status === 'cancelled' || status === 'canceled'
        })

        if (cancelledOrders.length === 0) {
            setNotice('No cancelled orders found.')
            window.setTimeout(() => setNotice(''), 3000)
            return
        }

        const confirmed = window.confirm(
            `Are you sure you want to permanently delete ${cancelledOrders.length} cancelled order(s)? This cannot be undone.`
        )

        if (!confirmed) return

        try {
            const cancelledIds = new Set(
                cancelledOrders
                    .map((order) => order.orderId ?? order.id)
                    .filter((id) => id !== undefined && id !== null)
                    .map(String)
            )

            const remainingOrders = latestOrders.filter((order) => {
                const status = String(order.status || '')
                    .trim()
                    .toLowerCase()

                const isCancelled =
                    status === 'cancelled' || status === 'canceled'

                const id = order.orderId ?? order.id

                // Remove cancelled orders, including older records.
                if (isCancelled) return false

                // Keep all non-cancelled orders.
                return !cancelledIds.has(String(id))
            })

            localStorage.setItem(
                'orders',
                JSON.stringify(remainingOrders)
            )

            setOrders(remainingOrders)
            setSelectedOrder(null)

            window.dispatchEvent(new Event('ordersUpdated'))

            setNotice(
                `${cancelledOrders.length} cancelled order(s) deleted successfully.`
            )

            window.setTimeout(() => setNotice(''), 3000)
        } catch (error) {
            console.error('Failed to delete cancelled orders:', error)
            setNotice('Could not delete cancelled orders. Please try again.')
        }
    }

    const updateOrderStatus = (orderId, newStatus) => {
        const latestOrders = readOrders()

        const updatedOrders = latestOrders.map((order) =>
            String(order.orderId ?? order.id) === String(orderId)
                ? { ...order, status: newStatus }
                : order
        )

        try {
            localStorage.setItem('orders', JSON.stringify(updatedOrders))

            setOrders(updatedOrders)

            setSelectedOrder((previous) =>
                previous &&
                String(previous.orderId ?? previous.id) === String(orderId)
                    ? { ...previous, status: newStatus }
                    : previous
            )

            window.dispatchEvent(new Event('ordersUpdated'))

            setNotice(`Order status updated to ${newStatus}.`)

            window.setTimeout(() => setNotice(''), 3000)
        } catch {
            setNotice('Could not save the status. Please try again.')
        }
    }

    const stats = useMemo(() => {
        const totalSales = orders.reduce((sum, order) => {
            const status = String(order.status || 'Pending').toLowerCase()

            if (status === 'cancelled' || status === 'canceled') {
                return sum
            }

            return sum + getOrderTotal(order)
        }, 0)

        const pendingOrders = orders.filter(
            (order) =>
                String(order.status || 'Pending').toLowerCase() === 'pending'
        ).length

        const customerEmails = new Set(
            orders
                .map((order) =>
                    String(order.customer?.email || '')
                        .trim()
                        .toLowerCase()
                )
                .filter(Boolean)
        )

        return {
            totalOrders: orders.length,
            totalSales,
            pendingOrders,
            customers: customerEmails.size,
        }
    }, [orders])

    const filteredOrders = useMemo(() => {
        const query = search.trim().toLowerCase()

        return [...orders].reverse().filter((order) => {
            const matchesStatus =
                statusFilter === 'All' ||
                String(order.status || 'Pending').toLowerCase() ===
                    statusFilter.toLowerCase()

            const matchesSearch =
                !query ||
                String(order.orderId || order.id || '')
                    .toLowerCase()
                    .includes(query) ||
                String(order.customer?.fullName || '')
                    .toLowerCase()
                    .includes(query) ||
                String(order.customer?.email || '')
                    .toLowerCase()
                    .includes(query)

            return matchesStatus && matchesSearch
        })
    }, [orders, search, statusFilter])

    const statCards = [
        {
            title: 'Total Orders',
            value: stats.totalOrders.toLocaleString(),
            icon: FiShoppingBag,
            color: 'bg-purple-100 text-purple-600',
        },
        {
            title: 'Total Sales',
            value: `$${stats.totalSales.toFixed(2)}`,
            icon: FiDollarSign,
            color: 'bg-green-100 text-green-600',
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders.toLocaleString(),
            icon: FiClock,
            color: 'bg-amber-100 text-amber-600',
        },
        {
            title: 'Unique Customers',
            value: stats.customers.toLocaleString(),
            icon: FiUsers,
            color: 'bg-blue-100 text-blue-600',
        },
    ]

    const renderOrderDetails = (order) => (
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <p>
                <strong>Phone:</strong> {order.customer?.phone || 'N/A'}
            </p>

            <p>
                <strong>Address:</strong>{' '}
                {[
                    order.customer?.address,
                    order.customer?.city,
                    order.customer?.postalCode,
                    order.customer?.country,
                ]
                    .filter(Boolean)
                    .join(', ') || 'N/A'}
            </p>

            {(order.items || []).map((item, itemIndex) => (
                <p key={item.id ?? itemIndex}>
                    {item.title || 'Product'} × {Number(item.quantity) || 1}
                </p>
            ))}
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <div className="flex min-h-screen">
                <aside className="hidden w-64 shrink-0 flex-col bg-gray-950 text-white md:flex">
                    <div className="border-b border-white/10 px-6 py-7">
                        <Link to="/" className="text-2xl font-extrabold">
                            Shop<span className="text-purple-400">Hub</span>
                        </Link>

                        <p className="mt-2 text-xs text-gray-400">
                            Administration Panel
                        </p>
                    </div>

                    <nav className="flex-1 space-y-2 p-4">
                        <a
                            href="#overview"
                            className="flex items-center gap-3 rounded-xl bg-purple-600 px-4 py-3 font-medium"
                        >
                            <FiPackage size={19} />
                            Dashboard
                        </a>

                        <a
                            href="#orders"
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <FiShoppingBag size={19} />
                            Orders
                        </a>

                        <Link
                            to="/my-orders"
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <FiExternalLink size={19} />
                            My Orders Page
                        </Link>
                    </nav>

                    <div className="border-t border-white/10 p-5">
                        <Link
                            to="/"
                            className="text-sm text-gray-300 transition hover:text-white"
                        >
                            ← Back to Store
                        </Link>

                        <p className="mt-3 text-xs leading-5 text-gray-500">
                            Demo admin panel. No authentication enabled.
                        </p>
                    </div>
                </aside>

                <main className="min-w-0 flex-1">
                    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-5 sm:px-8">
                        <div>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Admin Dashboard
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Manage your ShopHub orders and sales.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={loadOrders}
                                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium transition hover:bg-gray-50"
                            >
                                <FiRefreshCw size={16} />
                                Refresh
                            </button>

                            <Link
                                to="/"
                                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                            >
                                View Store
                            </Link>
                        </div>
                    </header>

                    <div className="space-y-8 p-4 sm:p-8">
                        {notice && (
                            <div
                                role="status"
                                className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-medium text-purple-800"
                            >
                                {notice}
                            </div>
                        )}

                        <section id="overview">
                            <div className="mb-5">
                                <h2 className="text-xl font-bold">Overview</h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Summary of your saved demo orders.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {statCards.map((card) => {
                                    const Icon = card.icon

                                    return (
                                        <div
                                            key={card.title}
                                            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-medium text-gray-500">
                                                    {card.title}
                                                </p>

                                                <div
                                                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}
                                                >
                                                    <Icon size={21} />
                                                </div>
                                            </div>

                                            <p className="mt-5 break-words text-2xl font-bold sm:text-3xl">
                                                {card.value}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        <section
                            id="orders"
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                        >
                            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:p-6">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Order Management
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Search orders and update their status.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <div className="relative min-w-0 flex-1">
                                        <FiSearch
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={18}
                                        />

                                        <input
                                            type="search"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            placeholder="Search ID, customer or email"
                                            className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                        />
                                    </div>

                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500"
                                    >
                                        <option value="All">All Statuses</option>

                                        {STATUS_OPTIONS.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        type="button"
                                        onClick={deleteCancelledOrders}
                                        disabled={
                                            !orders.some((order) =>
                                                ['cancelled', 'canceled'].includes(
                                                    String(order.status || '')
                                                        .trim()
                                                        .toLowerCase()
                                                )
                                            )
                                        }
                                        className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <FiTrash2 size={16} />
                                        Delete Cancelled
                                    </button>
                                </div>
                            </div>

                            {filteredOrders.length === 0 ? (
                                <div className="px-6 py-16 text-center">
                                    <div className="mb-4 text-5xl">📦</div>

                                    <h3 className="text-lg font-bold">
                                        No Orders Found
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-500">
                                        {orders.length === 0
                                            ? 'Orders will appear here after checkout.'
                                            : 'Try changing your search or status filter.'}
                                    </p>

                                    {orders.length === 0 && (
                                        <Link
                                            to="/"
                                            className="mt-5 inline-block rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
                                        >
                                            Start Shopping
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 p-4 md:hidden">
                                        {filteredOrders.map((order, index) => {
                                            const id = order.orderId ?? order.id ?? index
                                            const isSelected =
                                                String(selectedOrder?.orderId ?? selectedOrder?.id) ===
                                                String(order.orderId ?? order.id)

                                            return (
                                                <article
                                                    key={id}
                                                    className="rounded-xl border border-gray-200 p-4"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="break-all text-sm font-bold">
                                                                {order.orderId || order.id || 'N/A'}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {formatDate(order.createdAt)}
                                                            </p>
                                                        </div>

                                                        <span
                                                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                                STATUS_STYLES[
                                                                    String(order.status || 'Pending').toLowerCase()
                                                                ] || STATUS_STYLES.pending
                                                            }`}
                                                        >
                                                            {order.status || 'Pending'}
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 space-y-2 text-sm">
                                                        <p className="text-gray-600">
                                                            <strong className="text-gray-900">Customer: </strong>
                                                            {order.customer?.fullName || 'N/A'}
                                                        </p>

                                                        <p className="break-all text-gray-600">
                                                            {order.customer?.email || 'N/A'}
                                                        </p>

                                                        <p className="text-gray-600">
                                                            <strong className="text-gray-900">Items: </strong>
                                                            {order.items?.length || 0}
                                                        </p>

                                                        <p className="text-lg font-bold">
                                                            ${getOrderTotal(order).toFixed(2)}
                                                        </p>
                                                    </div>

                                                    <label className="mt-4 block text-xs font-semibold text-gray-500">
                                                        UPDATE STATUS
                                                    </label>

                                                    <select
                                                        value={
                                                            STATUS_OPTIONS.includes(order.status)
                                                                ? order.status
                                                                : 'Pending'
                                                        }
                                                        onChange={(e) =>
                                                            updateOrderStatus(
                                                                order.orderId ?? order.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
                                                    >
                                                        {STATUS_OPTIONS.map((status) => (
                                                            <option key={status} value={status}>
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedOrder(isSelected ? null : order)
                                                        }
                                                        className="mt-3 text-sm font-semibold text-purple-600"
                                                    >
                                                        {isSelected ? 'Hide Details' : 'View Details'}
                                                    </button>

                                                    {isSelected && renderOrderDetails(order)}
                                                </article>
                                            )
                                        })}
                                    </div>

                                    <div className="hidden overflow-x-auto md:block">
                                        <table className="w-full min-w-[900px] text-left">
                                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                                                <tr>
                                                    <th className="px-5 py-4">Order</th>
                                                    <th className="px-5 py-4">Customer</th>
                                                    <th className="px-5 py-4">Date</th>
                                                    <th className="px-5 py-4">Total</th>
                                                    <th className="px-5 py-4">Status</th>
                                                    <th className="px-5 py-4">Details</th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-gray-100">
                                                {filteredOrders.map((order, index) => (
                                                    <tr
                                                        key={order.orderId ?? order.id ?? index}
                                                        className="transition hover:bg-gray-50"
                                                    >
                                                        <td className="px-5 py-5">
                                                            <p className="max-w-44 break-all text-sm font-semibold">
                                                                {order.orderId || order.id || 'N/A'}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {order.items?.length || 0} products
                                                            </p>
                                                        </td>

                                                        <td className="px-5 py-5">
                                                            <p className="font-medium">
                                                                {order.customer?.fullName || 'N/A'}
                                                            </p>

                                                            <p className="mt-1 max-w-48 break-all text-xs text-gray-500">
                                                                {order.customer?.email || 'N/A'}
                                                            </p>
                                                        </td>

                                                        <td className="whitespace-nowrap px-5 py-5 text-sm text-gray-600">
                                                            {formatDate(order.createdAt)}
                                                        </td>

                                                        <td className="whitespace-nowrap px-5 py-5 font-semibold">
                                                            ${getOrderTotal(order).toFixed(2)}
                                                        </td>

                                                        <td className="px-5 py-5">
                                                            <select
                                                                aria-label={`Status for order ${order.orderId ?? order.id}`}
                                                                value={
                                                                    STATUS_OPTIONS.includes(order.status)
                                                                        ? order.status
                                                                        : 'Pending'
                                                                }
                                                                onChange={(e) =>
                                                                    updateOrderStatus(
                                                                        order.orderId ?? order.id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className={`rounded-full border-0 px-3 py-2 text-xs font-semibold outline-none ${
                                                                    STATUS_STYLES[
                                                                        String(order.status || 'Pending').toLowerCase()
                                                                    ] || STATUS_STYLES.pending
                                                                }`}
                                                            >
                                                                {STATUS_OPTIONS.map((status) => (
                                                                    <option key={status} value={status}>
                                                                        {status}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>

                                                        <td className="px-5 py-5">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedOrder(
                                                                        String(selectedOrder?.orderId ?? selectedOrder?.id) ===
                                                                        String(order.orderId ?? order.id)
                                                                            ? null
                                                                            : order
                                                                    )
                                                                }
                                                                className="text-sm font-semibold text-purple-600 hover:text-purple-800"
                                                            >
                                                                {String(selectedOrder?.orderId ?? selectedOrder?.id) ===
                                                                String(order.orderId ?? order.id)
                                                                    ? 'Close'
                                                                    : 'View'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {selectedOrder &&
                                        filteredOrders.some(
                                            (order) =>
                                                String(order.orderId ?? order.id) ===
                                                String(selectedOrder.orderId ?? selectedOrder.id)
                                        ) && (
                                            <div className="border-t border-gray-200 bg-gray-50 p-5 sm:p-6">
                                                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                                    <h3 className="break-all text-lg font-bold">
                                                        Order Details: {selectedOrder.orderId ?? selectedOrder.id}
                                                    </h3>

                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedOrder(null)}
                                                        className="text-sm font-semibold text-purple-600"
                                                    >
                                                        Close Details
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                                    <div>
                                                        <h4 className="mb-3 font-semibold">
                                                            Customer Information
                                                        </h4>

                                                        <div className="space-y-2 break-words text-sm text-gray-600">
                                                            <p>
                                                                <strong className="text-gray-900">Name: </strong>
                                                                {selectedOrder.customer?.fullName || 'N/A'}
                                                            </p>

                                                            <p>
                                                                <strong className="text-gray-900">Email: </strong>
                                                                {selectedOrder.customer?.email || 'N/A'}
                                                            </p>

                                                            <p>
                                                                <strong className="text-gray-900">Phone: </strong>
                                                                {selectedOrder.customer?.phone || 'N/A'}
                                                            </p>

                                                            <p>
                                                                <strong className="text-gray-900">Address: </strong>
                                                                {[
                                                                    selectedOrder.customer?.address,
                                                                    selectedOrder.customer?.city,
                                                                    selectedOrder.customer?.postalCode,
                                                                    selectedOrder.customer?.country,
                                                                ].filter(Boolean).join(', ') || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="mb-3 font-semibold">Products</h4>

                                                        <div className="space-y-3">
                                                            {(selectedOrder.items || []).map((item, itemIndex) => (
                                                                <div
                                                                    key={item.id ?? itemIndex}
                                                                    className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3"
                                                                >
                                                                    <div className="flex min-w-0 items-center gap-3">
                                                                        {item.thumbnail && (
                                                                            <img
                                                                                src={item.thumbnail}
                                                                                alt={item.title || 'Product'}
                                                                                className="h-12 w-12 rounded-lg bg-gray-50 object-contain p-1"
                                                                            />
                                                                        )}

                                                                        <div className="min-w-0">
                                                                            <p className="line-clamp-2 text-sm font-medium">
                                                                                {item.title || 'Product'}
                                                                            </p>

                                                                            <p className="mt-1 text-xs text-gray-500">
                                                                                Qty: {Number(item.quantity) || 1}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <p className="shrink-0 text-sm font-semibold">
                                                                        ${(
                                                                            (Number(item.price) || 0) *
                                                                            (Number(item.quantity) || 1)
                                                                        ).toFixed(2)}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 font-bold">
                                                            <span>Order Total</span>

                                                            <span className="text-purple-600">
                                                                ${getOrderTotal(selectedOrder).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </>
                            )}
                        </section>

                        <p className="text-xs leading-5 text-gray-500">
                            Demo only: sales figures are based on saved browser
                            orders, not verified payments. This page has no
                            authentication and must not be used to manage real
                            customer orders.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminDashboard
