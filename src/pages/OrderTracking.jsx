import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    FiSearch,
    FiPackage,
    FiCheckCircle,
    FiClock,
    FiTruck,
    FiMapPin,
    FiArrowLeft,
    FiTerminal,
    FiShield,
    FiXCircle,
    FiRefreshCw,
} from 'react-icons/fi'

const trackingSteps = [
    {
        title: 'Order Placed',
        description: 'Your order has been received.',
        status: 'pending',
        icon: FiPackage,
    },
    {
        title: 'Processing',
        description: 'Your items are being prepared.',
        status: 'processing',
        icon: FiClock,
    },
    {
        title: 'Shipped',
        description: 'Your package is on its way.',
        status: 'shipped',
        icon: FiTruck,
    },
    {
        title: 'Delivered',
        description: 'Your package has arrived.',
        status: 'delivered',
        icon: FiCheckCircle,
    },
]

const normalizeStatus = (status) => {
    const value = String(status || 'Pending').toLowerCase()

    if (value === 'cancelled' || value === 'canceled') {
        return 'cancelled'
    }

    if (value === 'delivered') return 'delivered'
    if (value === 'shipped') return 'shipped'
    if (value === 'processing') return 'processing'

    return 'pending'
}

const formatDate = (date) => {
    if (!date) return 'Not available'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
        return 'Not available'
    }

    return parsedDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const OrderTracking = () => {
    const [searchId, setSearchId] = useState('')
    const [order, setOrder] = useState(null)
    const [searched, setSearched] = useState(false)
    const [error, setError] = useState('')

    const findOrder = (e) => {
        e.preventDefault()

        const query = searchId.trim()

        if (!query) {
            setError('Please enter your Order ID.')
            setOrder(null)
            setSearched(true)
            return
        }

        try {
            const savedOrders = JSON.parse(
                localStorage.getItem('orders') || '[]'
            )

            const foundOrder = Array.isArray(savedOrders)
                ? savedOrders.find(
                      (item) =>
                          String(item.orderId || '').toLowerCase() ===
                          query.toLowerCase()
                  )
                : null

            setOrder(foundOrder || null)
            setSearched(true)
            setError(
                foundOrder
                    ? ''
                    : 'No order found. Please check your Order ID and try again.'
            )
        } catch {
            setOrder(null)
            setSearched(true)
            setError('Unable to read orders. Please try again.')
        }
    }

    const resetSearch = () => {
        setSearchId('')
        setOrder(null)
        setSearched(false)
        setError('')
    }

    const currentStatus = normalizeStatus(order?.status)

    const currentStep = trackingSteps.findIndex(
        (step) => step.status === currentStatus
    )

    const isCancelled = currentStatus === 'cancelled'

    const total = Number(order?.total)

    const safeTotal =
        order?.total !== undefined &&
        order?.total !== null &&
        order?.total !== '' &&
        Number.isFinite(total)
            ? total
            : (order?.items || []).reduce(
                  (sum, item) =>
                      sum +
                      (Number(item.price) || 0) *
                          (Number(item.quantity) || 1),
                  0
              ) + (Number(order?.shipping) || 0)

    const inputClass =
        'w-full rounded-xl border border-purple-500/30 bg-[#0b1020] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20'

    return (
        <main className="min-h-screen overflow-hidden bg-[#070b14] px-4 py-10 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Terminal Header */}
                <div className="mb-8 flex items-center justify-between gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-purple-300"
                    >
                        <FiArrowLeft />
                        Back to Shop
                    </Link>

                    <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-2 text-xs font-semibold text-green-400">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                        TRACKING SYSTEM
                    </div>
                </div>

                {/* Hero */}
                <section className="relative mb-8 overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#15102b] via-[#0c1224] to-[#080c17] p-6 shadow-[0_0_50px_rgba(139,92,246,0.08)] sm:p-10">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

                    <div className="relative">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-purple-400/20 bg-purple-500/10 px-3 py-2 font-mono text-xs text-purple-300">
                            <FiTerminal size={15} />
                            SYSTEM / ORDER_TRACKING
                        </div>

                        <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                            Track Your{' '}
                            <span className="text-purple-400 drop-shadow-[0_0_18px_rgba(168,85,247,0.4)]">
                                Order
                            </span>
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                            Follow your package from checkout to delivery.
                            Enter your Order ID to access its current status
                            and details.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs text-slate-500">
                            <span className="flex items-center gap-2">
                                <FiShield className="text-purple-400" />
                                ORDER LOOKUP
                            </span>

                            <span className="flex items-center gap-2">
                                <FiRefreshCw className="text-blue-400" />
                                LOCAL DEMO
                            </span>
                        </div>
                    </div>
                </section>

                {/* Search */}
                <section className="mb-8 rounded-2xl border border-slate-800 bg-[#0c1220] p-5 shadow-xl sm:p-7">
                    <label
                        htmlFor="orderId"
                        className="mb-3 block text-sm font-semibold text-slate-200"
                    >
                        Enter your Order ID
                    </label>

                    <form
                        onSubmit={findOrder}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />

                            <input
                                id="orderId"
                                type="text"
                                value={searchId}
                                onChange={(e) => {
                                    setSearchId(e.target.value)
                                    setError('')
                                }}
                                placeholder="Example: SH-123456789"
                                className={`${inputClass} pl-11`}
                            />
                        </div>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_22px_rgba(147,51,234,0.2)] transition hover:bg-purple-500"
                        >
                            <FiSearch size={17} />
                            Track Order
                        </button>
                    </form>

                    {error && searched && (
                        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
                            <FiXCircle className="mt-0.5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                        Tip: Find your Order ID on the My Orders page.
                    </p>
                </section>

                {/* Empty State */}
                {!searched && (
                    <section className="rounded-2xl border border-dashed border-slate-700 bg-[#0c1220]/60 px-6 py-12 text-center">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
                            <FiPackage size={30} />
                        </div>

                        <h2 className="text-xl font-bold text-white">
                            Ready to Track
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                            Enter an Order ID above to see its progress,
                            shipping information and order summary.
                        </p>

                        <Link
                            to="/my-orders"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-purple-500/30 px-5 py-3 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/10"
                        >
                            View My Orders <FiArrowLeft className="rotate-180" />
                        </Link>
                    </section>
                )}

                {/* Order Results */}
                {searched && order && (
                    <div className="space-y-6">

                        {/* Order Summary */}
                        <section className="rounded-2xl border border-slate-800 bg-[#0c1220] p-5 sm:p-7">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">
                                        Order Reference
                                    </p>

                                    <h2 className="break-all text-xl font-extrabold text-white sm:text-2xl">
                                        {order.orderId || 'N/A'}
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-400">
                                        Placed on {formatDate(order.createdAt)}
                                    </p>
                                </div>

                                <span
                                    className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${
                                        isCancelled
                                            ? 'border-red-500/30 bg-red-500/10 text-red-300'
                                            : currentStatus === 'delivered'
                                              ? 'border-green-500/30 bg-green-500/10 text-green-300'
                                              : 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                                    }`}
                                >
                                    {isCancelled ? (
                                        <FiXCircle />
                                    ) : currentStatus === 'delivered' ? (
                                        <FiCheckCircle />
                                    ) : (
                                        <FiRefreshCw />
                                    )}

                                    {order.status || 'Pending'}
                                </span>
                            </div>
                        </section>

                        {/* Cancelled Status */}
                        {isCancelled ? (
                            <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 sm:p-8">
                                <FiXCircle
                                    size={34}
                                    className="mb-4 text-red-400"
                                />

                                <h2 className="text-xl font-bold text-red-300">
                                    Order Cancelled
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    This order has been cancelled. Contact
                                    customer support if you need more
                                    information.
                                </p>
                            </section>
                        ) : (
                            /* Progress Timeline */
                            <section className="rounded-2xl border border-slate-800 bg-[#0c1220] p-5 sm:p-8">
                                <div className="mb-8">
                                    <p className="font-mono text-xs uppercase tracking-widest text-purple-400">
                                        Delivery Pipeline
                                    </p>

                                    <h2 className="mt-2 text-xl font-bold text-white">
                                        Order Progress
                                    </h2>
                                </div>

                                <div className="relative">
                                    {trackingSteps.map((step, index) => {
                                        const Icon = step.icon
                                        const completed = index <= currentStep
                                        const active = index === currentStep

                                        return (
                                            <div
                                                key={step.status}
                                                className="relative flex gap-4 pb-9 last:pb-0 sm:gap-6"
                                            >
                                                {index <
                                                    trackingSteps.length -
                                                        1 && (
                                                    <div
                                                        className={`absolute left-5 top-11 h-[calc(100%-20px)] w-0.5 sm:left-6 ${
                                                            index < currentStep
                                                                ? 'bg-purple-500'
                                                                : 'bg-slate-800'
                                                        }`}
                                                    />
                                                )}

                                                <div
                                                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border sm:h-12 sm:w-12 ${
                                                        completed
                                                            ? 'border-purple-400/40 bg-purple-500/15 text-purple-300'
                                                            : 'border-slate-700 bg-slate-900 text-slate-600'
                                                    } ${
                                                        active
                                                            ? 'shadow-[0_0_22px_rgba(168,85,247,0.2)]'
                                                            : ''
                                                    }`}
                                                >
                                                    <Icon size={21} />
                                                </div>

                                                <div className="min-w-0 flex-1 pt-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3
                                                            className={`font-bold ${
                                                                completed
                                                                    ? 'text-white'
                                                                    : 'text-slate-500'
                                                            }`}
                                                        >
                                                            {step.title}
                                                        </h3>

                                                        {active && (
                                                            <span className="rounded-md bg-purple-500/10 px-2 py-1 font-mono text-[10px] font-bold uppercase text-purple-300">
                                                                Current
                                                            </span>
                                                        )}

                                                        {index < currentStep && (
                                                            <FiCheckCircle
                                                                className="text-green-400"
                                                                size={15}
                                                            />
                                                        )}
                                                    </div>

                                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Products */}
                        <section className="rounded-2xl border border-slate-800 bg-[#0c1220] p-5 sm:p-7">
                            <h2 className="mb-6 text-xl font-bold text-white">
                                Order Items
                            </h2>

                            <div className="space-y-4">
                                {(order.items || []).map((item, index) => (
                                    <div
                                        key={item.id ?? index}
                                        className="flex items-center gap-4 rounded-xl border border-slate-800 bg-[#0a0f1c] p-3 sm:p-4"
                                    >
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-900 p-2">
                                            {item.thumbnail ? (
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title || 'Product'}
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <FiPackage
                                                    size={26}
                                                    className="text-slate-500"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="line-clamp-2 text-sm font-semibold text-white">
                                                {item.title || 'Product'}
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Quantity:{' '}
                                                {Number(item.quantity) || 1}
                                            </p>
                                        </div>

                                        <p className="shrink-0 text-sm font-bold text-purple-300">
                                            $
                                            {(
                                                (Number(item.price) || 0) *
                                                (Number(item.quantity) || 1)
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-3 border-t border-slate-800 pt-5 text-sm">
                                <div className="flex justify-between gap-4 text-slate-400">
                                    <span>Subtotal</span>
                                    <span>
                                        $
                                        {Number(
                                            order.subtotal ??
                                                (order.items || []).reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        (Number(item.price) ||
                                                            0) *
                                                            (Number(
                                                                item.quantity
                                                            ) || 1),
                                                    0
                                                )
                                        ).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4 text-slate-400">
                                    <span>Shipping</span>
                                    <span>
                                        {Number(order.shipping) === 0
                                            ? 'Free'
                                            : `$${(
                                                  Number(order.shipping) || 0
                                              ).toFixed(2)}`}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4 border-t border-slate-800 pt-4">
                                    <span className="font-bold text-white">
                                        Total
                                    </span>

                                    <span className="text-xl font-extrabold text-purple-300">
                                        ${safeTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Shipping Address */}
                        <section className="rounded-2xl border border-slate-800 bg-[#0c1220] p-5 sm:p-7">
                            <div className="flex items-start gap-4">
                                <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-purple-300">
                                    <FiMapPin size={22} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-white">
                                        Shipping Address
                                    </h2>

                                    <div className="mt-3 space-y-1 text-sm leading-6 text-slate-400">
                                        <p className="font-semibold text-slate-200">
                                            {order.customer?.fullName || 'Customer'}
                                        </p>

                                        <p>
                                            {[
                                                order.customer?.address,
                                                order.customer?.city,
                                                order.customer?.postalCode,
                                                order.customer?.country,
                                            ]
                                                .filter(Boolean)
                                                .join(', ') ||
                                                'No shipping address available.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={resetSearch}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-purple-400 hover:text-white"
                            >
                                <FiSearch />
                                Track Another Order
                            </button>

                            <Link
                                to="/my-orders"
                                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-500"
                            >
                                My Orders
                                <FiArrowLeft className="rotate-180" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 border-t border-slate-800 pt-6 text-center">
                    <p className="font-mono text-xs text-slate-600">
                        SHOPHUB_TRACKING // DEMO_VERSION_1.0
                    </p>
                </div>
            </div>
        </main>
    )
}

export default OrderTracking