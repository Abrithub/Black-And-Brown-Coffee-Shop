import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Promotion = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Promotional banners data
    const promotionalBanners = [
        {
            id: 1,
            title: "New Year Special!",
            subtitle: "Get 25% off on all premium coffee blends",
            description: "Start your year with our finest coffee selection",
            image: "img/hero.jpg",
            discount: "25% OFF",
            cta: "Shop Now",
            bgColor: "from-amber-600 to-amber-800"
        },
        {
            id: 2,
            title: "Valentine's Day Collection",
            subtitle: "Romantic coffee experience for two",
            description: "Perfect coffee blends for sharing special moments",
            image: "img/pack.jpg",
            discount: "Buy 1 Get 1",
            cta: "Explore Collection",
            bgColor: "from-pink-600 to-rose-800"
        },
        {
            id: 3,
            title: "Spring Refresh",
            subtitle: "Light & refreshing coffee blends",
            description: "Welcome spring with our seasonal coffee collection",
            image: "img/Ethiopian Yirgacheffe - Rare Yirgacheffe Coffee.jpg",
            discount: "30% OFF",
            cta: "Discover More",
            bgColor: "from-green-600 to-emerald-800"
        }
    ];


    // Social media links
    const socialMediaLinks = [
        {
            name: "Facebook",
            icon: FaFacebook,
            url: "https://facebook.com/blackandbrowncoffee",
            color: "bg-blue-600 hover:bg-blue-700"
        },
        {
            name: "Instagram",
            icon: FaInstagram,
            url: "https://instagram.com/blackandbrowncoffee",
            color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        },
        {
            name: "Twitter",
            icon: FaTwitter,
            url: "https://twitter.com/blackandbrowncoffee",
            color: "bg-blue-400 hover:bg-blue-500"
        },
        {
            name: "YouTube",
            icon: FaYoutube,
            url: "https://youtube.com/blackandbrowncoffee",
            color: "bg-red-600 hover:bg-red-700"
        }
    ];

    // Auto-advance slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % promotionalBanners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);


    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % promotionalBanners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + promotionalBanners.length) % promotionalBanners.length);
    };


    return (
        <div id="promotions" className="bg-gradient-to-b from-[#1a0f0a] to-[#2A1A10] py-16 px-4 scroll-mt-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-24 h-1 bg-[#C19976] rounded-full"></div>
                    <h1 className="text-4xl md:text-6xl font-bold text-[#C19976] mb-4 font-serif">
                        Promotions & Offers
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Discover our latest deals, seasonal offers, and featured products
                    </p>
                </div>

                {/* Promotional Banner Slider */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-[#C19976] mb-8 text-center">Current Promotions</h2>
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {promotionalBanners.map((banner) => (
                                <div key={banner.id} className="w-full flex-shrink-0 relative">
                                    <div className={`h-96 bg-gradient-to-r ${banner.bgColor} flex items-center justify-center relative overflow-hidden`}>
                                        {/* Background Image */}
                                        <img
                                            src={banner.image}
                                            alt={banner.title}
                                            className="absolute inset-0 w-full h-full object-cover opacity-20"
                                        />

                                        {/* Content */}
                                        <div className="relative z-10 text-center text-white px-8 max-w-4xl">
                                            <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                                                {banner.discount}
                                            </div>
                                            <h3 className="text-4xl md:text-5xl font-bold mb-4">{banner.title}</h3>
                                            <p className="text-xl md:text-2xl mb-2">{banner.subtitle}</p>
                                            <p className="text-lg mb-8 opacity-90">{banner.description}</p>
                                            <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-2xl">
                                                {banner.cta}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Dots Indicator */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {promotionalBanners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>


                {/* Social Media Integration */}
                <div className="bg-gradient-to-r from-[#C19976] to-amber-600 rounded-3xl p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-black mb-4">Connect With Us</h3>
                        <p className="text-black text-lg mb-8 max-w-2xl mx-auto">
                            Follow us on social media for daily coffee tips, behind-the-scenes content, and exclusive offers!
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            {socialMediaLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${social.color} text-white p-4 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl`}
                                >
                                    <social.icon className="w-6 h-6" />
                                </a>
                            ))}
                        </div>

                        <div className="text-black">
                            <p className="text-lg font-semibold mb-2">Join our community for exclusive perks:</p>
                            <ul className="text-base space-y-1">
                                <li>• Early access to new products</li>
                                <li>• Special discount codes</li>
                                <li>• Coffee brewing tips & recipes</li>
                                <li>• Behind-the-scenes content</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Promotion;