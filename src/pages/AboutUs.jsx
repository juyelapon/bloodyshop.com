import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FiArrowRight,
    FiHeart,
    FiShield,
    FiTruck,
    FiHeadphones,
    FiAward,
    FiUsers,
    FiPackage,
    FiStar,
    FiGlobe,
    FiTarget,
    FiEye,
    FiShoppingBag
} from 'react-icons/fi'

const values = [
    {
        icon: FiAward,
        title: 'Quality Products',
        description: 'We carefully select products to bring you quality you can trust.',
        color: 'bg-blue-100 text-blue-600'
    },
    {
        icon: FiTruck,
        title: 'Fast Delivery',
        description: 'We work to get your favorite products to you as quickly as possible.',
        color: 'bg-green-100 text-green-600'
    },
    {
        icon: FiShield,
        title: 'Secure Shopping',
        description: 'Your shopping experience should feel safe from start to finish.',
        color: 'bg-purple-100 text-purple-600'
    },
    {
        icon: FiHeart,
        title: 'Customer First',
        description: 'Your satisfaction inspires everything we do.',
        color: 'bg-rose-100 text-rose-600'
    }
]

const stats = [
    { icon: FiUsers, number: '10K+', label: 'Happy Shoppers' },
    { icon: FiPackage, number: '1K+', label: 'Products to Explore' },
    { icon: FiStar, number: '4.8/5', label: 'Customer Rating' },
    { icon: FiGlobe, number: '24/7', label: 'Online Shopping' }
]


const team = [
    {
        name: 'Your Name',
        role: 'Frontend Developer',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
    },
    {
        name: 'Backend Developer',
        role: 'Backend Developer',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80'
    },
    {
        name: 'UI/UX Designer',
        role: 'UI/UX Designer',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    },
    {
        name: 'Project Lead',
        role: 'Project Lead',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80'
    }
]


const AboutUs = () => {
    const navigate = useNavigate()

    return (
        <main className="overflow-hidden bg-white text-slate-900">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
                <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-purple-200/40 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                            <span className="h-2 w-2 rounded-full bg-blue-600" />
                            About ShopHub
                        </span>

                        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Shopping Made
                            <span className="block text-blue-600">
                                Simple & Special.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                            At ShopHub, we believe shopping should be simple,
                            convenient and enjoyable. We bring your everyday
                            favorites together in one place.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate('/categories')}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
                            >
                                Explore Categories
                                <FiArrowRight size={18} />
                            </button>

                            <button
                                onClick={() => document.getElementById('our-story')?.scrollIntoView({
                                    behavior: 'smooth'
                                })}
                                className="rounded-xl border border-slate-300 bg-white/80 px-6 py-3.5 font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-white"
                            >
                                Our Story
                            </button>
                        </div>

                        <div className="mt-9 flex items-center gap-3">
                            <div className="flex -space-x-3">
                                {team.slice(0, 3).map((person) => (
                                    <img
                                        key={person.name}
                                        src={person.image}
                                        alt={person.name}
                                        className="h-10 w-10 rounded-full border-2 border-white object-cover"
                                    />
                                ))}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">
                                    Built around your needs
                                </p>
                                <p className="text-xs text-slate-500">
                                    Every detail matters to us.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-lg">
                        <div className="absolute inset-5 rotate-6 rounded-[2rem] bg-blue-200/70" />

                        <div className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl shadow-blue-200/50">
                            <img
                                src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1000&q=85"
                                alt="Shopping bags and products"
                                className="h-72 w-full object-cover sm:h-96"
                            />
                        </div>

                        <div className="absolute -bottom-5 -left-3 rounded-2xl border border-white bg-white p-4 shadow-xl sm:-left-7">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <FiHeart size={22} />
                                </div>
                                <div>
                                    <p className="font-bold">Made for you</p>
                                    <p className="text-xs text-slate-500">
                                        Shopping with care
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -right-2 top-5 rounded-2xl border border-white bg-white p-3 shadow-xl sm:-right-5">
                            <div className="flex items-center gap-2 text-green-600">
                                <FiShield size={20} />
                                <span className="text-sm font-bold text-slate-700">
                                    Shop confidently
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section
                id="our-story"
                className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24"
            >
                <div className="relative">
                    <img
                        src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85"
                        alt="Team working together"
                        loading="lazy"
                        className="h-72 w-full rounded-3xl object-cover shadow-xl sm:h-96"
                    />

                    <div className="absolute -bottom-5 right-4 rounded-2xl bg-blue-600 px-5 py-4 text-white shadow-lg sm:right-8">
                        <p className="text-2xl font-extrabold">Our</p>
                        <p className="text-sm font-medium text-blue-100">
                            story, your experience
                        </p>
                    </div>
                </div>

                <div className="pt-4 md:pt-0">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                        Who we are
                    </p>

                    <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                        More Than a Store.
                        <span className="block text-blue-600">
                            A Better Way to Shop.
                        </span>
                    </h2>

                    <p className="mt-6 leading-8 text-slate-600">
                        ShopHub is a demo e-commerce brand built around one
                        simple idea: finding the right products online should
                        feel easy and enjoyable.
                    </p>

                    <p className="mt-4 leading-8 text-slate-600">
                        From exploring categories to discovering products,
                        we aim to create a smooth shopping experience with
                        clear information, thoughtful design and convenient
                        navigation.
                    </p>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-lg">
                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <FiTarget size={22} />
                            </div>
                            <h3 className="font-bold">Our Mission</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Make online shopping easier, clearer and more enjoyable.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-5 transition hover:border-purple-200 hover:shadow-lg">
                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                <FiEye size={22} />
                            </div>
                            <h3 className="font-bold">Our Vision</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Build a shopping destination people love to return to.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-slate-50 py-16 md:py-20">
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                            Why ShopHub
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                            What Makes Us Different?
                        </h2>
                        <p className="mt-4 leading-7 text-slate-500">
                            Great shopping is about more than products.
                            It is about the experience from start to finish.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((value) => {
                            const Icon = value.icon

                            return (
                                <article
                                    key={value.title}
                                    className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
                                >
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${value.color} transition duration-300 group-hover:scale-110`}>
                                        <Icon size={26} />
                                    </div>

                                    <h3 className="mt-6 text-lg font-bold">
                                        {value.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-slate-500">
                                        {value.description}
                                    </p>
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-14 text-white md:py-16">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 sm:px-8 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon

                        return (
                            <div key={stat.label} className="text-center">
                                <Icon className="mx-auto mb-4 text-blue-100" size={30} />
                                <p className="text-3xl font-extrabold sm:text-4xl">
                                    {stat.number}
                                </p>
                                <p className="mt-2 text-sm text-blue-100">
                                    {stat.label}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Team */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                            The people behind ShopHub
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                            Meet Our Team
                        </h2>
                        <p className="mt-4 max-w-xl leading-7 text-slate-500">
                            A sample team section showing the people and roles
                            that could bring the ShopHub experience to life.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/contact')}
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-blue-200 px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                        Contact Us
                        <FiArrowRight />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {team.map((person) => (
                        <article
                            key={person.name}
                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="overflow-hidden bg-slate-100">
                                <img
                                    src={person.image}
                                    alt={person.name}
                                    loading="lazy"
                                    className="h-64 w-full object-cover object-center transition duration-500 group-hover:scale-105"
                                />
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-bold">
                                    {person.name}
                                </h3>
                                <p className="mt-1 text-sm text-blue-600">
                                    {person.role}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-10 text-center sm:px-12 sm:py-14">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                        <FiShoppingBag size={28} />
                    </div>

                    <h2 className="mt-5 text-2xl font-extrabold sm:text-4xl">
                        Ready to Find Your Favorites?
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
                        Explore our categories and discover products for your
                        everyday life.
                    </p>

                    <button
                        onClick={() => navigate('/categories')}
                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
                    >
                        Start Exploring
                        <FiArrowRight size={18} />
                    </button>
                </div>
            </section>

        </main>
    )
}

export default AboutUs
