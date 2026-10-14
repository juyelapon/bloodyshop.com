import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiTruck,
  FiPackage,
  FiMapPin,
  FiShield,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi'

const FreeShipping = () => {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 text-white">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
              <FiTruck className="text-emerald-300" />
              ShopHub Delivery Offer
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              More Shopping,
              <span className="block bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                Less Shipping Cost.
              </span>
            </h1>

            <p className="mt-5 max-w-xl leading-7 text-slate-300 sm:text-lg">
              Spend $50 or more on eligible products and enjoy free
              shipping in this ShopHub demo store.
            </p>

            <button
              type="button"
              onClick={() => navigate('/categories')}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-950 transition hover:-translate-y-1 hover:bg-emerald-100"
            >
              Start Shopping <FiArrowRight size={18} />
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
              <FiTruck size={34} />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-emerald-200">
              Free Shipping Threshold
            </p>

            <h2 className="mt-3 text-5xl font-extrabold">$50+</h2>

            <p className="mt-4 leading-7 text-slate-300">
              Reach the minimum order subtotal to qualify for free
              shipping. Orders below $50 may have a demo delivery fee.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Simple Steps to Free Delivery
          </h2>
          <p className="mt-4 leading-7 text-slate-500">
            Add your favorite products, meet the minimum subtotal, and
            check your shipping amount at checkout.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <FiPackage size={24} />
            </div>
            <h3 className="mt-5 text-lg font-bold">1. Choose Products</h3>
            <p className="mt-2 leading-7 text-slate-500">
              Explore ShopHub and add the items you want to your cart.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FiMapPin size={24} />
            </div>
            <h3 className="mt-5 text-lg font-bold">2. Reach $50</h3>
            <p className="mt-2 leading-7 text-slate-500">
              Make sure your product subtotal is at least $50 before
              shipping.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <FiCheckCircle size={24} />
            </div>
            <h3 className="mt-5 text-lg font-bold">3. Checkout</h3>
            <p className="mt-2 leading-7 text-slate-500">
              Review your order summary and check the shipping charge
              before placing your demo order.
            </p>
          </article>
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <FiShield className="mt-1 shrink-0 text-emerald-700" size={22} />
            <div>
              <h3 className="font-bold text-emerald-950">
                Demo Store Policy
              </h3>
              <p className="mt-2 text-sm leading-6 text-emerald-900">
                This is a frontend demonstration. Shipping eligibility
                and any delivery fee are demo rules, not a real shipping
                service or confirmed delivery promise.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-bold text-white transition hover:bg-emerald-700"
          >
            View Shopping Cart <FiArrowRight size={18} />
          </button>
        </div>
      </section>
    </main>
  )
}

export default FreeShipping
