import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const CustomerAuth = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const result = login(formData.email, formData.password);
                if (result.success) {
                    onClose();
                } else if (result.needsRegistration) {
                    // Switch to registration mode for new users
                    setIsLogin(false);
                    setError('New user detected. Please complete your registration below.');
                } else {
                    setError(result.message);
                }
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }

                if (formData.password.length < 6) {
                    setError('Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }

                const result = register(formData.name, formData.email, formData.password);
                if (result.success) {
                    onClose();
                } else {
                    setError(result.message);
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] rounded-3xl p-8 w-full max-w-md border border-[#C19976]/30 shadow-2xl relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#C19976] mb-2">
                        {isLogin ? 'Welcome Back' : 'Join Us'}
                    </h2>
                    <p className="text-gray-300">
                        {isLogin ? 'Sign in to your account' : 'Create your account'}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className={`rounded-lg p-3 mb-6 ${error.includes('New user detected')
                            ? 'bg-blue-600/20 border border-blue-600/50'
                            : 'bg-red-600/20 border border-red-600/50'
                        }`}>
                        <p className={`text-sm ${error.includes('New user detected') ? 'text-blue-400' : 'text-red-400'
                            }`}>{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-[#C19976] mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-[#C19976]/50 text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-[#C19976] focus:border-[#C19976] outline-none transition duration-300"
                                placeholder="Enter your full name"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[#C19976] mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/10 border border-[#C19976]/50 text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-[#C19976] focus:border-[#C19976] outline-none transition duration-300"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#C19976] mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/10 border border-[#C19976]/50 text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-[#C19976] focus:border-[#C19976] outline-none transition duration-300"
                            placeholder="Enter your password"
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-[#C19976] mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-[#C19976]/50 text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-[#C19976] focus:border-[#C19976] outline-none transition duration-300"
                                placeholder="Confirm your password"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#C19976] hover:bg-amber-600 text-black font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                {/* Toggle */}
                <div className="text-center mt-6">
                    <p className="text-gray-300">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                            }}
                            className="text-[#C19976] hover:text-amber-400 font-semibold transition-colors"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CustomerAuth;
