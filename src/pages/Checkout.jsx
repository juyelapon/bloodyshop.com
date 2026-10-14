import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const FREE_SHIPPING_THRESHOLD = 50
const SHIPPING_FEE = 5

const Checkout = () => {
    const navigate = useNavigate()

    const [cart, setCart] = useState([])
    const [orderPlaced, setOrderPlaced] = useState(false)
    const [orderId, setOrderId] = useState('')
    const [error, setError] = useState('')

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    })

    useEffect(() => {
        const loadCart = () => {
            try {
                const savedCart = JSON.parse(
                    localStorage.getItem('cart') || '[]'
                )

                setCart(Array.isArray(savedCart) ? savedCart : [])
            } catch {
                setCart([])
            }
        }

        loadCart()

        window.addEventListener('cartUpdated', loadCart)

        return () => {
            window.removeEventListener('cartUpdated', loadCart)
        }
    }, [])

    const subtotal = cart.reduce((total, item) => {
        const price = Number(item.price) || 0
        const quantity = Number(item.quantity) || 1

        return total + price * quantity
    }, 0)

    const shipping =
        subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
            ? 0
            : SHIPPING_FEE

    const total = subtotal + shipping

    const discountTotal = cart.reduce((totalDiscount, item) => {
        const price = Number(item.price) || 0
        const discount = Number(item.discountPercentage) || 0
        const quantity = Number(item.quantity) || 1

        if (discount <= 0 || discount >= 100) {
            return totalDiscount
        }

        const originalPrice = price / (1 - discount / 100)
        const itemDiscount = (originalPrice - price) * quantity

        return totalDiscount + itemDiscount
    }, 0)

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }))

        setError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (cart.length === 0) {
            setError('Your cart is empty. Please add products first.')
            return
        }

        const cleanForm = {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            postalCode: form.postalCode.trim(),
            country: form.country.trim(),
        }

        const emptyField = Object.values(cleanForm).some(
            (value) => !value
        )

        if (emptyField) {
            setError('Please fill in all required fields.')
            return
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(cleanForm.email)) {
            setError('Please enter a valid email address.')
            return
        }

        const newOrderId = `SH-${Date.now()}`

        const order = {
            orderId: newOrderId,
            customer: cleanForm,
            items: cart,
            subtotal: Number(subtotal.toFixed(2)),
            discountTotal: Number(discountTotal.toFixed(2)),
            shipping: Number(shipping.toFixed(2)),
            total: Number(total.toFixed(2)),
            currency: 'USD',
            status: 'Pending',
            paymentStatus: 'Not Processed',
            createdAt: new Date().toISOString(),
        }

        try {
            const previousOrders = JSON.parse(
                localStorage.getItem('orders') || '[]'
            )

            const orders = Array.isArray(previousOrders)
                ? previousOrders
                : []

            localStorage.setItem(
                'orders',
                JSON.stringify([...orders, order])
            )

            localStorage.setItem('cart', '[]')

            window.dispatchEvent(new Event('cartUpdated'))

            setCart([])
            setOrderId(newOrderId)
            setOrderPlaced(true)
        } catch {
            setError(
                'Unable to save your order. Please check your browser storage and try again.'
            )
        }
    }

    if (orderPlaced) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-16">
                <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
                        ✓
                    </div>

                    <h1 className="mb-3 text-3xl font-bold text-gray-900">
                        Order Placed Successfully!
                    </h1>

                    <p className="mb-6 text-gray-600">
                        Thank you for shopping with ShopHub.
                        Your demo order has been saved.
                    </p>

                    <div className="mb-6 rounded-xl bg-gray-50 p-5 text-left">
                        <p className="mb-2 text-sm text-gray-500">
                            Order ID
                        </p>

                        <p className="break-all font-semibold text-gray-900">
                            {orderId}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-4">
                            <span className="text-gray-600">
                                Order Total
                            </span>

                            <span className="text-xl font-bold text-gray-900">
                                ${total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <p className="mb-8 text-sm text-amber-700">
                        Demo checkout only. No payment has been processed.
                    </p>

                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                        >
                            Continue Shopping
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </main>
        )
    }

    if (cart.length === 0) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16">
                <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
                    <div className="mb-4 text-5xl">🛒</div>

                    <h1 className="mb-3 text-2xl font-bold text-gray-900">
                        Your Cart Is Empty
                    </h1>

                    <p className="mb-6 text-gray-600">
                        Add some products to your cart before checking out.
                    </p>

                    <Link
                        to="/"
                        className="inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Checkout
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Complete your shipping information to place your order.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3"
                >
                    <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
                        <h2 className="mb-6 text-xl font-bold text-gray-900">
                            Shipping Information
                        </h2>

                        {error && (
                            <div
                                role="alert"
                                className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="fullName"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Full Name *
                                </label>

                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Email Address *
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Phone Number *
                                </label>

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="address"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Street Address *
                                </label>

                                <textarea
                                    id="address"
                                    name="address"
                                    autoComplete="street-address"
                                    value={form.address}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                    placeholder="House number, street, area..."
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="city"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    City *
                                </label>

                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    autoComplete="address-level2"
                                    value={form.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                    placeholder="Enter your city"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="postalCode"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Postal Code *
                                </label>

                                <input
                                    id="postalCode"
                                    name="postalCode"
                                    type="text"
                                    autoComplete="postal-code"
                                    value={form.postalCode}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                    placeholder="Enter postal code"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="country"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Country *
                                </label>

                                <input
                                    id="country"
                                    name="country"
                                    type="text"
                                    autoComplete="country-name"
                                    value={form.country}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                    placeholder="Enter your country"
                                />
                            </div>
                        </div>

                        <p className="mt-6 text-sm text-gray-500">
                            * Required fields
                        </p>
                    </section>

                    <aside className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="mb-6 text-xl font-bold text-gray-900">
                            Order Summary
                        </h2>

                        <div className="mb-6 max-h-72 space-y-4 overflow-y-auto">
                            {cart.map((item, index) => (
                                <div
                                    key={item.id ?? index}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50 p-2">
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title || 'Product'}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="line-clamp-2 text-sm font-medium text-gray-800">
                                            {item.title || 'Product'}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Qty: {Number(item.quantity) || 1}
                                        </p>
                                    </div>

                                    <p className="shrink-0 text-sm font-semibold text-gray-900">
                                        ${(
                                            (Number(item.price) || 0) *
                                            (Number(item.quantity) || 1)
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 border-t border-gray-200 pt-5">
                            <div className="flex justify-between gap-4 text-sm">
                                <span className="text-gray-600">
                                    Subtotal
                                </span>

                                <span className="font-medium text-gray-900">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>

                            {discountTotal > 0 && (
                                <div className="flex justify-between gap-4 text-sm">
                                    <span className="text-gray-600">
                                        Estimated Savings
                                    </span>

                                    <span className="font-medium text-green-600">
                                        -${discountTotal.toFixed(2)}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between gap-4 text-sm">
                                <span className="text-gray-600">
                                    Shipping
                                </span>

                                <span className="font-medium text-gray-900">
                                    {shipping === 0
                                        ? 'Free'
                                        : `$${shipping.toFixed(2)}`}
                                </span>
                            </div>

                            {subtotal < FREE_SHIPPING_THRESHOLD && (
                                <p className="text-xs text-gray-500">
                                    Spend $
                                    {(
                                        FREE_SHIPPING_THRESHOLD - subtotal
                                    ).toFixed(2)}{' '}
                                    more to get free shipping.
                                </p>
                            )}

                            <div className="flex justify-between gap-4 border-t border-gray-200 pt-4">
                                <span className="text-base font-bold text-gray-900">
                                    Total
                                </span>

                                <span className="text-xl font-bold text-purple-600">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full rounded-lg bg-purple-600 px-5 py-3.5 font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                        >
                            Place Order
                        </button>

                        <Link
                            to="/cart"
                            className="mt-4 block text-center text-sm font-medium text-gray-600 transition hover:text-purple-600"
                        >
                            ← Return to Cart
                        </Link>

                        <p className="mt-5 text-center text-xs leading-5 text-gray-500">
                            Demo checkout. No payment information is collected
                            and no real payment is processed.
                        </p>
                    </aside>
                </form>
            </div>
        </main>
    )
}

export default Checkout
