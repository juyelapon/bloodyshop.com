
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackgroundImage from '../assets/images/ecommerce.png'
import {
    FiArrowUpRight,
    FiChevronLeft,
    FiChevronRight,
    FiZap,
    FiTruck,
    FiStar,
    FiGift,
    FiShield,
    FiShoppingBag,
} from 'react-icons/fi'

const banners = [
    {
        badge: 'LIMITED TIME OFFER',
        title: 'Big Deals.',
        highlight: 'Bigger Smiles.',
        description:
            'Discover amazing products, exclusive deals and everyday essentials—all in one place.',
        button: 'Explore Deals',
        label: 'UP TO 70% OFF',
        image: BackgroundImage,
        gradient: 'from-[#111827] via-[#172554] to-[#312E81]',
        accent: '#A5B4FC',
        Icon: FiZap,
        tag: '01 / SUMMER SALE',
        path: '/deals',
    },
    {
        badge: 'JUST LANDED',
        title: 'Meet Your',
        highlight: 'New Favorites.',
        description:
            'Fresh arrivals, modern essentials and exciting finds selected to upgrade your everyday life.',
        button: 'Discover More',
        label: 'NEW COLLECTION',
        image: BackgroundImage,
        gradient: 'from-[#3B0764] via-[#581C87] to-[#86198F]',
        accent: '#F5D0FE',
        Icon: FiStar,
        tag: '02 / NEW ARRIVALS',
        path: '/categories',
    },
    {
        badge: 'SMART SHOPPING STARTS HERE',
        title: 'Style Meets',
        highlight: 'Technology.',
        description:
            'Explore smart gadgets and lifestyle essentials that bring more convenience to every day.',
        button: 'Shop Essentials',
        label: 'UPGRADE YOUR DAY',
        image: BackgroundImage,
        gradient: 'from-[#082F49] via-[#164E63] to-[#0F766E]',
        accent: '#99F6E4',
        Icon: FiShoppingBag,
        tag: '03 / SMART PICKS',
        path: '/categories',
    },
    {
        badge: 'YOUR FAVORITES, FOR LESS',
        title: 'Prices Down.',
        highlight: 'Value Up.',
        description:
            'Find special prices on products you love. Your next great find might be one click away.',
        button: 'Grab the Deals',
        label: 'EXTRAORDINARY FINDS',
        image: BackgroundImage,
        gradient: 'from-[#7F1D1D] via-[#9F1239] to-[#BE185D]',
        accent: '#FECDD3',
        Icon: FiGift,
        tag: '04 / SPECIAL OFFERS',
        path: '/deals',
    },
    {
        badge: 'SHOP WITH CONFIDENCE',
        title: 'Quality You',
        highlight: 'Can Trust.',
        description:
            'Browse your favorite categories and discover products chosen with your needs in mind.',
        button: 'Browse Products',
        label: 'MADE FOR EVERYDAY',
        image: BackgroundImage,
        gradient: 'from-[#14532D] via-[#166534] to-[#3F6212]',
        accent: '#BBF7D0',
        Icon: FiShield,
        tag: '05 / EVERYDAY PICKS',
        path: '/categories',
    },
    {
        badge: 'A BETTER WAY TO SHOP',
        title: 'Your World.',
        highlight: 'One Store.',
        description:
            'From daily must-haves to exciting discoveries, bring everything you love together with ShopHub.',
        button: 'Start Shopping',
        label: 'WELCOME TO SHOPHUB',
        image: BackgroundImage,
        gradient: 'from-[#1E1B4B] via-[#312E81] to-[#4338CA]',
        accent: '#C7D2FE',
        Icon: FiTruck,
        tag: '06 / THE SHOPHUB EDIT',
        path: '/categories',
    },
]

const Hero = () => {
    const navigate = useNavigate()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [paused, setPaused] = useState(false)

    const activeBanner = banners[currentSlide]
    const ActiveIcon = activeBanner.Icon

    const nextSlide = () => {
        setCurrentSlide((previous) => (previous + 1) % banners.length)
    }

    const previousSlide = () => {
        setCurrentSlide(
            (previous) => (previous - 1 + banners.length) % banners.length
        )
    }

    useEffect(() => {
        if (paused) return

        const sliderInterval = setInterval(() => {
            setCurrentSlide((previous) => (previous + 1) % banners.length)
        }, 4500)

        return () => clearInterval(sliderInterval)
    }, [paused])

    return (
        <section
            className="relative isolate overflow-hidden bg-slate-950"
            aria-label="ShopHub featured offers"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Dynamic background */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${activeBanner.gradient} transition-colors duration-700`}
            />

            {/* Decorative glow */}
            <div
                className="absolute -right-24 -top-28 h-80 w-80 rounded-full opacity-20 blur-3xl transition-colors duration-700 md:h-[450px] md:w-[450px]"
                style={{ backgroundColor: activeBanner.accent }}
            />

            <div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

            <div className="container relative mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                <div className="grid min-h-[420px] items-center gap-10 md:grid-cols-2 md:gap-8 lg:min-h-[470px] lg:gap-14">

                    {/* Banner content */}
                    <div
                        key={`content-${currentSlide}`}
                        className="relative z-10 animate-[heroFadeIn_0.65s_ease-out_both]"
                    >
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: activeBanner.accent }}
                            />
                            <span className="text-[10px] font-bold tracking-[0.18em] text-white sm:text-xs">
                                {activeBanner.badge}
                            </span>
                        </div>

                        <h1 className="max-w-xl font-inter text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl">
                            {activeBanner.title}
                            <span
                                className="mt-2 block"
                                style={{ color: activeBanner.accent }}
                            >
                                {activeBanner.highlight}
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-sm leading-7 text-white/75 sm:text-base sm:leading-8 lg:text-lg">
                            {activeBanner.description}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(activeBanner.path)}
                                className="group inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-slate-900 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:bg-white/90 sm:px-7 sm:py-4 sm:text-base"
                            >
                                {activeBanner.button}
                                <FiArrowUpRight
                                    size={19}
                                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                                />
                            </button>

                            <div className="flex items-center gap-3 text-white/80">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                                    <ActiveIcon size={19} />
                                </span>
                                <span className="text-xs font-semibold tracking-wide sm:text-sm">
                                    {activeBanner.label}
                                </span>
                            </div>
                        </div>

                        {/* Slide number */}
                        <p className="mt-10 text-xs font-semibold tracking-[0.2em] text-white/50">
                            {activeBanner.tag}
                        </p>
                    </div>

                    {/* Banner image */}
                    <div
                        key={`image-${currentSlide}`}
                        className="relative mx-auto w-full max-w-lg animate-[heroImageIn_0.8s_ease-out_both] md:max-w-none"
                    >
                        {/* Image frame */}
                        <div className="absolute inset-5 rotate-3 rounded-[2rem] border border-white/20 bg-white/5 sm:inset-7" />

                        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/10 p-3 shadow-2xl shadow-black/20 backdrop-blur-sm sm:rounded-[2rem] sm:p-5">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/10" />

                            <img
                                src={activeBanner.image}
                                alt={activeBanner.title + ' ' + activeBanner.highlight}
                                className="relative z-10 aspect-[5/4] w-full rounded-2xl object-contain transition-transform duration-700 hover:scale-[1.04] sm:rounded-3xl"
                            />

                            {/* Floating offer card */}
                            <div className="absolute bottom-5 left-5 z-20 flex items-center gap-3 rounded-2xl border border-white/30 bg-white/95 p-3 shadow-xl sm:bottom-8 sm:left-8 sm:p-4">
                                <span
                                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-900 sm:h-12 sm:w-12"
                                    style={{ backgroundColor: activeBanner.accent }}
                                >
                                    <ActiveIcon size={22} />
                                </span>

                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Featured collection
                                    </p>
                                    <p className="mt-1 text-sm font-extrabold text-slate-900 sm:text-base">
                                        {activeBanner.label}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative dot pattern */}
                        <div className="absolute -right-3 -top-3 -z-10 grid grid-cols-5 gap-2 opacity-50 sm:-right-5 sm:-top-5">
                            {Array.from({ length: 25 }).map((_, index) => (
                                <span
                                    key={index}
                                    className="h-1.5 w-1.5 rounded-full bg-white/70"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Slider controls */}
                <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/15 pt-6 sm:mt-12">
                    {/* Progress indicators */}
                    <div className="flex flex-1 items-center gap-2 sm:gap-3">
                        {banners.map((banner, index) => (
                            <button
                                key={banner.tag}
                                type="button"
                                onClick={() => setCurrentSlide(index)}
                                aria-label={`Show banner ${index + 1}: ${banner.title} ${banner.highlight}`}
                                aria-pressed={currentSlide === index}
                                className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-300 ${
                                    currentSlide === index
                                        ? 'w-10 bg-white sm:w-16'
                                        : 'w-5 bg-white/30 hover:bg-white/60 sm:w-8'
                                }`}
                            >
                                {currentSlide === index && (
                                    <span
                                        className="absolute inset-0 origin-left rounded-full bg-white"
                                        key={`progress-${currentSlide}-${paused}`}
                                    />
                                )}
                            </button>
                        ))}

                        <span className="ml-2 hidden text-xs font-semibold tracking-widest text-white/60 sm:inline">
                            {String(currentSlide + 1).padStart(2, '0')} / 06
                        </span>
                    </div>

                    {/* Previous / Next buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={previousSlide}
                            aria-label="Previous banner"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-white hover:bg-white hover:text-slate-900"
                        >
                            <FiChevronLeft size={20} />
                        </button>

                        <button
                            type="button"
                            onClick={nextSlide}
                            aria-label="Next banner"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-white hover:bg-white hover:text-slate-900"
                        >
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Animation keyframes */}
            <style>{`
                @keyframes heroFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes heroImageIn {
                    from {
                        opacity: 0;
                        transform: translateX(20px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .animate-\\[heroFadeIn_0\\.65s_ease-out_both\\],
                    .animate-\\[heroImageIn_0\\.8s_ease-out_both\\] {
                        animation: none !important;
                    }
                }
            `}</style>
        </section>
    )
}

export default Hero
