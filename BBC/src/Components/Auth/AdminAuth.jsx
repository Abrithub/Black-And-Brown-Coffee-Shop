import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';

const AdminAuth = ({ onClose }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

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
            const result = login(formData.username, formData.password, true);
            if (result.success) {
                onClose();
            } else {
                setError(result.message);
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
                    <div className="w-16 h-16 bg-[#C19976] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[#C19976] mb-2">
                        Admin Login
                    </h2>
                    <p className="text-gray-300">
                        Access the admin dashboard
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-3 mb-6">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#C19976] mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/10 border border-[#C19976]/50 text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-[#C19976] focus:border-[#C19976] outline-none transition duration-300"
                            placeholder="Enter admin username"
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
                            placeholder="Enter admin password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#C19976] hover:bg-amber-600 text-black font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default AdminAuth;
