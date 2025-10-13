import React from 'react';

const Contact = () => {
    return (
        <div id="contact" className="relative min-h-screen py-16 px-8">
            {/* Coffee Banner Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="img/hero.jpg"
                    alt="Coffee Shop Background"
                    className="w-full h-full object-cover"
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Decorative coffee bean in right down corner */}
            <div className="absolute bottom-8 right-8 z-10">
                <div className="relative">
                    {/* Main coffee bean */}
                    <div className="w-24 h-16 bg-gradient-to-r from-amber-800 to-amber-900 rounded-full transform rotate-12 shadow-2xl">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-12 bg-amber-600 rounded-full"></div>
                        </div>
                        <div className="absolute top-2 left-3 w-8 h-6 bg-gradient-to-br from-amber-400 to-transparent rounded-full opacity-60"></div>
                    </div>

                    {/* Coffee steam lines */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div className="space-y-1">
                            <div className="w-0.5 h-4 bg-amber-600/60 rounded-full animate-pulse"></div>
                            <div className="w-0.5 h-3 bg-amber-600/40 rounded-full animate-pulse delay-150"></div>
                            <div className="w-0.5 h-2 bg-amber-600/30 rounded-full animate-pulse delay-300"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Content */}
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-[#C19976] mb-6">
                        Get In Touch
                    </h2>
                    <p className="text-xl text-white max-w-2xl mx-auto">
                        Have questions about our coffee or want to place a special order?
                        We'd love to hear from you!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Map Section */}
                    <div className="space-y-8">
                        <div className="bg-black/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#C19976]/30">
                            <h3 className="text-2xl font-bold text-[#C19976] mb-6">Find Us</h3>

                            {/* Google Maps Embed */}
                            <div className="relative h-64 rounded-lg overflow-hidden">
                                <a
                                    href="https://maps.app.goo.gl/HqxYfDFwnpjKfRep8"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-full"
                                >
                                    <div className="w-full h-full bg-gradient-to-br from-[#C19976]/20 to-amber-600/20 flex items-center justify-center cursor-pointer hover:from-[#C19976]/30 hover:to-amber-600/30 transition-all duration-300">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-[#C19976] rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-white font-semibold">Click to View Location</p>
                                            <p className="text-gray-300 text-sm">Opens in Google Maps</p>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-white text-sm">
                                    📍 Addis Ababa, Alem Bank, Beside Indiana School
                                </p>
                                <p className="text-gray-400 text-xs mt-2">
                                    Click on the map for directions
                                </p>
                                <a
                                    href="https://maps.app.goo.gl/HqxYfDFwnpjKfRep8"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-3 bg-[#C19976] hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                                >
                                    Get Directions
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-black/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#C19976]/30">
                            <h3 className="text-2xl font-bold text-[#C19976] mb-6">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#C19976]">Address</p>
                                        <p className="text-white">Addis Ababa, Alem Bank, Beside Indiana School</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#C19976]">Phone</p>
                                        <p className="text-white">+251965485715</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#C19976]">Email</p>
                                        <p className="text-white">Blackandbrowncoffee@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#C19976]">Hours</p>
                                        <p className="text-white">Mon-Fri: 6:00 AM - 8:00 PM</p>
                                        <p className="text-white">Sat-Sun: 7:00 AM - 9:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-black/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#C19976]/30">
                        <h3 className="text-2xl font-bold text-[#C19976] mb-6">Send us a Message</h3>

                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#C19976] mb-2">First Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-white/10 border border-[#C19976]/50 text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-[#C19976] focus:border-[#C19976] outline-none transition duration-300"
                                        placeholder="Abraham"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#C19976] mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-white/10 border border-[#C19976]/50 text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-[#C19976] focus:border-[#C19976] outline-none transition duration-300"
                                        placeholder="Berhanu"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#C19976] mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 bg-white/10 border border-[#C19976]/50 text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-[#C19976] focus:border-[#C19976] outline-none transition duration-300"
                                    placeholder="Blackandbrowncoffee@gmail.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#C19976] mb-2">Subject</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-white/10 border border-[#C19976]/50 text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-[#C19976] focus:border-[#C19976] outline-none transition duration-300"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#C19976] mb-2">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/10 border border-[#C19976]/50 text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-[#C19976] focus:border-[#C19976] outline-none transition duration-300 resize-none"
                                    placeholder="Tell us what's on your mind..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#C19976] hover:bg-amber-600 text-black font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
