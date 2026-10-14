import React from 'react'
import { useNavigate } from 'react-router-dom'

const categories = [
    { img: "/pc.png", label: "Electronics", slug: "smartphones" },
    { img: "/fashion.png", label: "Fashion", slug: "mens-shirts" },
    { img: "/homee.png", label: "Home", slug: "furniture" },
    { img: "/sports.png", label: "Sports", slug: "sports-accessories" },
    { img: "/bools.png", label: "Books", slug: "books" },
    { img: "/gaming.png", label: "Gaming", slug: "smartphones" },
]

const Second = () => {
    const navigate = useNavigate()

    const handleCategoryClick = (slug) => {
        navigate(`/categories?category=${slug}`)
    }

    return (
        <section className='bg-white'>
            <div className='max-w-7xl mx-auto px-4'>
                <h2 className='font-inter font-bold text-3xl mt-16 text-center'>
                    Shop by Category
                </h2>

                <div className='grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-6 mt-12 mb-16'>
                    {categories.map((cat) => (
                        <div
                            key={cat.label}
                            onClick={() => handleCategoryClick(cat.slug)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    handleCategoryClick(cat.slug)
                                }
                            }}
                            role='link'
                            tabIndex={0}
                            className='flex flex-col items-center gap-4 cursor-pointer'
                        >
                            <div className='w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center'>
                                <img
                                    src={cat.img}
                                    alt={cat.label}
                                    className='w-8 h-8 object-contain'
                                />
                            </div>

                            <h3 className='text-lg md:text-2xl font-medium text-center'>
                                {cat.label}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Second
