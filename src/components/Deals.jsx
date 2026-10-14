import React from 'react'
import { useNavigate } from 'react-router-dom'

const deals = [
    {
        bg: 'bg-[#EF4444]',
        title: 'Flash Sale',
        desc: 'Up to 50% off electronics',
        btnText: 'Shop Now',
        btnColor: 'text-[#EF4444]',
        action: '/deals/flash-sale',
    },
    {
        bg: 'bg-[#22C55E]',
        title: 'Free Shipping',
        desc: 'On orders over $50',
        btnText: 'Learn More',
        btnColor: 'text-[#22C55E]',
        action: '/deals/free-shipping',
    },
    {
        bg: 'bg-[#A855F7]',
        title: 'Member Exclusive',
        desc: 'Extra 20% off for members',
        btnText: 'Join Now',
        btnColor: 'text-[#A855F7]',
        action: '/login',
    },
]

const Deals = () => {
    const navigate = useNavigate()

    return (
        <section>
            <div className='max-w-7xl mx-auto px-4'>
                <h2 className='font-inter font-bold text-center text-3xl mt-16 mb-8'>
                    Today's Deals
                </h2>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16'>
                    {deals.map((deal) => (
                        <div
                            key={deal.title}
                            className={`${deal.bg} rounded-lg p-6 flex flex-col`}
                        >
                            <h3 className='font-bold font-inter text-2xl text-white'>
                                {deal.title}
                            </h3>

                            <p className='text-base font-inter text-white mt-2'>
                                {deal.desc}
                            </p>

                            <button
                                onClick={() => navigate(deal.action)}
                                className={`mt-4 self-start bg-white font-bold rounded-lg px-6 py-2 ${deal.btnColor} hover:opacity-90 transition`}
                            >
                                {deal.btnText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Deals
