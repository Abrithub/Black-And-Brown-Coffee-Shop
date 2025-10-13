import React, { useState, useEffect } from 'react';

const AboutUs = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // Coffee images for the about section
    const coffeeImages = [
        {
            id: 1,
            src: "img/morning.jpg",
            alt: "Morning Coffee Experience",
            title: "Morning Brew",
            description: "Start your day with our premium morning blends"
        },
        {
            id: 2,
            src: "img/artistan.jpg",
            alt: "Artisan Coffee Preparation",
            title: "Artisan Craft",
            description: "Handcrafted with passion and precision"
        },
        {
            id: 3,
            src: "img/evening.jpg",
            alt: "Evening Coffee Atmosphere",
            title: "Evening Comfort",
            description: "Perfect ending to your day"
        }
    ];

    // Customer testimonials
    const testimonials = [
        {
            id: 1,
            name: "Hanna Alemu",
            location: "Addis Ababa, Ethiopia",
            image: "img/hanna alemu.jpg",
            comment: "The aroma and smoothness of Black & Brown Coffee is unmatched. Every cup feels like a warm hug!"
        },
        {
            id: 2,
            name: "James Carter",
            location: "Nairobi, Kenya",
            image: "img/James.jpg",
            comment: "Absolutely the best coffee I've ever had! You can really taste the quality and freshness."
        },
        {
            id: 3,
            name: "Liya Tesfaye",
            location: "Mekelle, Ethiopia",
            image: "img/liya_tesfaye_1.jpg",
            comment: "Each blend tells a story. The Ethiopian roast brings out such deep, rich flavors—it's addictive!"
        }
    ];

    // Our values data
    const values = [
        {
            icon: "🌱",
            title: "Quality First",
            description: "We source only the finest Ethiopian coffee beans and roast them to perfection."
        },
        {
            icon: "🤝",
            title: "Community",
            description: "We believe in building connections through the shared love of great coffee."
        },
        {
            icon: "♻️",
            title: "Sustainability",
            description: "Committed to environmentally friendly practices and supporting local farmers."
        },
        {
            icon: "🎨",
            title: "Innovation",
            description: "Constantly exploring new flavors and brewing techniques to enhance your experience."
        }
    ];

    // Auto-advance image carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % coffeeImages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    // Intersection observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById('about-section');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div id="about" className="bg-gradient-to-b from-[#1a0f0a] to-[#2A1A10] py-16 px-4 scroll-mt-24">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-24 h-1 bg-[#C19976] rounded-full"></div>
                    <h1 className="text-4xl md:text-6xl font-bold text-[#C19976] mb-6 font-serif">
                        About Black & Brown Coffee
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        From the first morning light to the evening's gentle close, we are here for you.
                    </p>
                </div>

                {/* Interactive Image Carousel */}
                <div className="mb-16">
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-r from-[#2A1A10] to-[#1a0f0a] p-8">
                        <div className="flex items-center justify-between">
                            {/* Image Display */}
                            <div className="w-2/3 relative">
                                <div className="relative h-96 overflow-hidden rounded-2xl">
                                    <img
                                        src={coffeeImages[currentImage].src}
                                        alt={coffeeImages[currentImage].alt}
                                        className="w-full h-full object-cover transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h3 className="text-2xl font-bold mb-2">{coffeeImages[currentImage].title}</h3>
                                        <p className="text-gray-200">{coffeeImages[currentImage].description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Panel */}
                            <div className="w-1/3 pl-8">
                                <h3 className="text-2xl font-bold text-[#C19976] mb-6">Our Coffee Journey</h3>
                                <div className="space-y-4">
                                    {coffeeImages.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onClick={() => setCurrentImage(index)}
                                            className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${currentImage === index
                                                    ? 'bg-[#C19976] text-black shadow-lg'
                                                    : 'bg-[#1a0f0a] text-gray-300 hover:bg-[#2A1A10] hover:text-white'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentImage === index ? 'bg-black' : 'bg-[#C19976]'
                                                    }`}></div>
                                                <div>
                                                    <h4 className="font-semibold">{image.title}</h4>
                                                    <p className="text-sm opacity-80">{image.description}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Our Story Section */}
                <div id="about-section" className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#C19976] mb-6">
                                A World of Flavor, Perfectly Brewed
                            </h2>
                            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                                Experience the distinct character of our premium coffees. Your journey to the perfect taste starts here.
                            </p>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                At Black & Brown Coffee, we believe that every cup tells a story. From the highlands of Ethiopia to your morning routine,
                                we bring you the finest coffee experience that celebrates tradition while embracing innovation.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="bg-[#C19976] text-black px-6 py-3 rounded-full font-bold">
                                    15+ Years Experience
                                </div>
                                <div className="bg-[#C19976] text-black px-6 py-3 rounded-full font-bold">
                                    1000+ Happy Customers
                                </div>
                                <div className="bg-[#C19976] text-black px-6 py-3 rounded-full font-bold">
                                    Premium Quality
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-6 rounded-2xl border border-[#5D4030] hover:border-[#C19976] transition-all duration-300">
                                        <h3 className="text-xl font-bold text-[#C19976] mb-2">Ethiopian Heritage</h3>
                                        <p className="text-gray-300 text-sm">Proudly serving authentic Ethiopian coffee traditions</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-6 rounded-2xl border border-[#5D4030] hover:border-[#C19976] transition-all duration-300">
                                        <h3 className="text-xl font-bold text-[#C19976] mb-2">Fresh Daily</h3>
                                        <p className="text-gray-300 text-sm">Roasted fresh every day for optimal flavor</p>
                                    </div>
                                </div>
                                <div className="space-y-4 mt-8">
                                    <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-6 rounded-2xl border border-[#5D4030] hover:border-[#C19976] transition-all duration-300">
                                        <h3 className="text-xl font-bold text-[#C19976] mb-2">Expert Crafted</h3>
                                        <p className="text-gray-300 text-sm">Every cup is carefully prepared by our skilled baristas</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-6 rounded-2xl border border-[#5D4030] hover:border-[#C19976] transition-all duration-300">
                                        <h3 className="text-xl font-bold text-[#C19976] mb-2">Community Focus</h3>
                                        <p className="text-gray-300 text-sm">Supporting local farmers and sustainable practices</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Our Values Section */}
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#C19976] text-center mb-12">
                        What We Stand For
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-6 rounded-2xl border border-[#5D4030] hover:border-[#C19976] transition-all duration-300 hover:scale-105 text-center group"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#C19976] mb-3">{value.title}</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#C19976] text-center mb-12">
                        What People Say About Our Coffee
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((person) => (
                            <div
                                key={person.id}
                                className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] rounded-2xl overflow-hidden border border-[#5D4030] hover:border-[#C19976] transition-all duration-300 hover:scale-105 group"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={person.image}
                                        alt={person.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-bold text-[#C19976] mb-2">{person.name}</h3>
                                    <p className="text-amber-400 font-semibold mb-3">{person.location}</p>
                                    <p className="text-gray-300 text-sm italic leading-relaxed">
                                        "{person.comment}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <div className="bg-gradient-to-r from-[#C19976] to-amber-600 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-black mb-4">Ready to Experience Excellence?</h3>
                            <p className="text-black text-lg mb-6 max-w-2xl mx-auto">
                                Join us for an unforgettable coffee experience that celebrates tradition, quality, and community.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button 
                                    onClick={() => scrollToSection('products')}
                                    className="bg-black text-[#C19976] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-900 transition-colors duration-300 shadow-2xl"
                                >
                                    Visit Our Shop
                                </button>
                                <button 
                                    onClick={() => scrollToSection('menu')}
                                    className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-2xl"
                                >
                                    Order Online
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;