import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const MyOrders = () => {
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)

    const loadOrders = () => {
        try {
            const savedOrders = JSON.parse(
                localStorage.getItem('orders') || '[]'
            )

            setOrders(
                Array.isArray(savedOrders)
                    ? [...savedOrders].reverse()
                    : []
            )
        } catch (error) {
            console.error('Failed to load orders:', error)
            setOrders([])
        }
    }

    useEffect(() => {
        loadOrders()

        window.addEventListener('storage', loadOrders)
        window.addEventListener('ordersUpdated', loadOrders)

        return () => {
            window.removeEventListener('storage', loadOrders)
            window.removeEventListener('ordersUpdated', loadOrders)
        }
    }, [])

    const getOrderKey = (order) =>
        order.orderId ?? order.id ?? null

    const isCancelled = (order) => {
        const status = String(order.status || '')
            .trim()
            .toLowerCase()

        return status === 'cancelled' || status === 'canceled'
    }

    const deleteOrder = (order) => {
        const orderKey = getOrderKey(order)

        if (orderKey == null) {
            window.alert(
                'This order has no unique ID. Please check the saved order data.'
            )
            return
        }

        const message = isCancelled(order)
            ? 'Permanently delete this cancelled order?'
            : 'Cancel and permanently delete this order?'

        if (!window.confirm(message)) return

        try {
            const savedOrders = JSON.parse(
                localStorage.getItem('orders') || '[]'
            )

            if (!Array.isArray(savedOrders)) {
                throw new Error('Saved orders data is invalid.')
            }

            const updatedOrders = savedOrders.filter((item) => {
                const itemKey = getOrderKey(item)

                return (
                    itemKey == null ||
                    String(itemKey) !== String(orderKey)
                )
            })

            if (updatedOrders.length === savedOrders.length) {
                loadOrders()
                window.alert(
                    'Order was not found in localStorage. Please refresh and try again.'
                )
                return
            }

            localStorage.setItem(
                'orders',
                JSON.stringify(updatedOrders)
            )

            const verifiedOrders = JSON.parse(
                localStorage.getItem('orders') || '[]'
            )

            const stillExists = verifiedOrders.some(
                (item) =>
                    getOrderKey(item) != null &&
                    String(getOrderKey(item)) === String(orderKey)
            )

            if (stillExists) {
                window.alert('Could not delete this order.')
                loadOrders()
                return
            }

            setOrders([...verifiedOrders].reverse())
            setSelectedOrder(null)

            window.dispatchEvent(new Event('ordersUpdated'))

        } catch (error) {
            console.error('Order deletion failed:', error)
            window.alert('Something went wrong while deleting the order.')
        }
    }

    const formatDate = (date) => {
        if (!date) return 'Date unavailable'

        const parsedDate = new Date(date)

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Date unavailable'
        }

        return parsedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const getOrderTotal = (order) => {
        if (order.total != null) {
            return Number(order.total) || 0
        }

        if (order.totalAmount != null) {
            return Number(order.totalAmount) || 0
        }

        return (
            (Number(order.subtotal) || 0) +
            (Number(order.shipping) || 0)
        )
    }

    const getStatusStyle = (status) => {
        const normalizedStatus = String(
            status || 'Pending'
        ).toLowerCase()

        if (normalizedStatus === 'delivered') {
            return 'bg-green-100 text-green-700'
        }

        if (normalizedStatus === 'shipped') {
            return 'bg-blue-100 text-blue-700'
        }

        if (normalizedStatus === 'processing') {
            return 'bg-yellow-100 text-yellow-700'
        }

        if (
            normalizedStatus === 'cancelled' ||
            normalizedStatus === 'canceled'
        ) {
            return 'bg-red-100 text-red-700'
        }

        return 'bg-purple-100 text-purple-700'
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Orders
                    </h1>

                    <p className="mt-2 text-gray-500">
                        View and manage your orders.
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mb-4 text-6xl">📦</div>

                        <h2 className="text-2xl font-semibold text-gray-800">
                            No Orders Found
                        </h2>

                        <p className="mt-2 text-gray-500">
                            You haven't placed any orders yet.
                        </p>

                        <Link
                            to="/"
                            className="mt-6 inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => {
                            const orderKey =
                                getOrderKey(order) ?? `order-${index}`

                            const isExpanded =
                                selectedOrder === orderKey

                            const status = order.status || 'Pending'
                            const cancelled = isCancelled(order)

                            const canCancel = [
                                'pending',
                                'processing',
                            ].includes(String(status).toLowerCase())

                            return (
                                <div
                                    key={orderKey}
                                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                                >
                                    <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Order ID
                                            </p>

                                            <h3 className="mt-1 break-all font-bold text-gray-900">
                                                {getOrderKey(order) || 'Unavailable'}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Placed on{' '}
                                                {formatDate(
                                                    order.date ||
                                                    order.createdAt ||
                                                    order.orderDate
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyle(status)}`}
                                            >
                                                {status}
                                            </span>

                                            <span className="text-lg font-bold text-gray-900">
                                                ${getOrderTotal(order).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="space-y-4">
                                            {(order.items || []).map(
                                                (item, itemIndex) => (
                                                    <div
                                                        key={
                                                            item.id ??
                                                            item.productId ??
                                                            itemIndex
                                                        }
                                                        className="flex items-center gap-4"
                                                    >
                                                        <img
                                                            src={
                                                                item.image ||
                                                                item.thumbnail ||
                                                                'https://placehold.co/80x80?text=Product'
                                                            }
                                                            alt={
                                                                item.title ||
                                                                item.name ||
                                                                'Product'
                                                            }
                                                            className="h-16 w-16 rounded-lg border border-gray-100 object-cover"
                                                        />

                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="truncate font-semibold text-gray-800">
                                                                {item.title ||
                                                                    item.name ||
                                                                    'Product'}
                                                            </h4>

                                                            <p className="mt-1 text-sm text-gray-500">
                                                                Qty: {item.quantity || 1}
                                                            </p>
                                                        </div>

                                                        <p className="font-semibold text-gray-800">
                                                            ${(
                                                                (Number(item.price) || 0) *
                                                                (Number(item.quantity) || 1)
                                                            ).toFixed(2)}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedOrder(
                                                        isExpanded ? null : orderKey
                                                    )
                                                }
                                                className="rounded-lg border border-purple-600 px-4 py-2 font-semibold text-purple-600 transition hover:bg-purple-50"
                                            >
                                                {isExpanded
                                                    ? 'Hide Details'
                                                    : 'View Details'}
                                            </button>

                                            {canCancel && (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteOrder(order)}
                                                    className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}

                                            {cancelled && (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteOrder(order)}
                                                    className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                                                >
                                                    Delete Order
                                                </button>
                                            )}

                                            <Link
                                                to={`/track-order?orderId=${encodeURIComponent(
                                                    getOrderKey(order) || ''
                                                )}`}
                                                className="rounded-lg bg-gray-900 px-4 py-2 text-center font-semibold text-white transition hover:bg-gray-700"
                                            >
                                                Track Order
                                            </Link>
                                        </div>

                                        {isExpanded && (
                                            <div className="mt-5 rounded-xl bg-gray-50 p-5">
                                                <h3 className="mb-4 text-lg font-bold text-gray-900">
                                                    Order Details
                                                </h3>

                                                <div className="grid gap-5 sm:grid-cols-2">
                                                    <div>
                                                        <h4 className="mb-2 font-semibold text-gray-700">
                                                            Customer Information
                                                        </h4>

                                                        <p className="text-sm text-gray-600">
                                                            {order.customer?.fullName ||
                                                                order.customer?.name ||
                                                                order.customerName ||
                                                                order.name ||
                                                                'N/A'}
                                                        </p>

                                                        <p className="mt-1 break-all text-sm text-gray-600">
                                                            {order.customer?.email ||
                                                                order.email ||
                                                                'N/A'}
                                                        </p>

                                                        <p className="mt-1 text-sm text-gray-600">
                                                            {order.customer?.phone ||
                                                                order.phone ||
                                                                'N/A'}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <h4 className="mb-2 font-semibold text-gray-700">
                                                            Shipping Address
                                                        </h4>

                                                        <p className="text-sm text-gray-600">
                                                            {typeof order.shippingAddress === 'string'
                                                                ? order.shippingAddress
                                                                : order.shippingAddress?.address ||
                                                                  order.customer?.address ||
                                                                  order.address ||
                                                                  'Address unavailable'}
                                                        </p>

                                                        <p className="mt-1 text-sm text-gray-600">
                                                            {order.shippingAddress?.city ||
                                                                order.customer?.city ||
                                                                order.city ||
                                                                ''}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-5 border-t border-gray-200 pt-4">
                                                    <div className="flex justify-between py-1 text-sm text-gray-600">
                                                        <span>Subtotal</span>
                                                        <span>
                                                            ${(
                                                                Number(order.subtotal) ||
                                                                Math.max(
                                                                    0,
                                                                    getOrderTotal(order) -
                                                                    (Number(order.shipping) || 0)
                                                                )
                                                            ).toFixed(2)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between py-1 text-sm text-gray-600">
                                                        <span>Shipping</span>
                                                        <span>
                                                            ${(Number(order.shipping) || 0).toFixed(2)}
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 flex justify-between border-t border-gray-200 pt-3 font-bold text-gray-900">
                                                        <span>Total</span>
                                                        <span>
                                                            ${getOrderTotal(order).toFixed(2)}
                                                        </span>
                                                    </div>

                                                    <p className="mt-3 text-sm text-gray-500">
                                                        Payment Method: {order.paymentMethod || 'N/A'}
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Payment Status: {order.paymentStatus || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyOrders
