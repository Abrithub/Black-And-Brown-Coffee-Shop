import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ onClose, defaultTab = 'login' }) => {
    const [tab, setTab] = useState(defaultTab); // 'login' | 'register'
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { login, register } = useAuth();

    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: ''
    });

    const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) { setError('Email and password are required.'); return; }
        setLoading(true);
        try {
            const res = await login(form.email, form.password);
            if (res.success) {
                onClose();
            } else {
                // If admin credentials entered in login tab, try admin login
                const adminRes = await login(form.email, form.password, true);
                if (adminRes.success) { onClose(); return; }
                setError(res.message || 'Invalid email or password.');
            }
        } catch { setError('Something went wrong. Please try again.'); }
        finally { setLoading(false); }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            setError('All fields are required.'); return;
        }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
        setLoading(true);
        try {
            const res = await register(form.name, form.email, form.password);
            if (res.success) {
                onClose();
            } else {
                setError(res.message || 'Registration failed. Please try again.');
            }
        } catch { setError('Something went wrong. Please try again.'); }
        finally { setLoading(false); }
    };

    const switchTab = (t) => {
        setTab(t);
        setError('');
        setSuccess('');
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
    };

    const inp = "w-full px-4 py-3 bg-[#1a0f0a] border border-[#5D4030] text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-[#C19976] focus:border-[#C19976] outline-none transition";

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] rounded-3xl w-full max-w-md border border-[#5D4030] shadow-2xl overflow-hidden">

                {/* Top bar */}
                <div className="flex items-center justify-between px-8 pt-8 pb-0">
                    <div className="flex items-center gap-3">
                        {/* Coffee logo */}
                        <div className="w-10 h-10 bg-[#C19976] rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 6h2a1 1 0 011 1v2a1 1 0 01-1 1h-2v5a7 7 0 01-14 0V6h14zm-2 0H4v5a5 5 0 0010 0V6z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-[#C19976] font-bold text-sm leading-none">Black & Brown</p>
                            <p className="text-gray-400 text-xs">Coffee Shop</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tab switcher */}
                <div className="flex mx-8 mt-6 bg-[#1a0f0a] rounded-xl p-1 border border-[#5D4030]">
                    <button
                        onClick={() => switchTab('login')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${tab === 'login' ? 'bg-[#C19976] text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => switchTab('register')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${tab === 'register' ? 'bg-[#C19976] text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                        Create Account
                    </button>
                </div>

                <div className="px-8 py-6">
                    {/* Heading */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white">
                            {tab === 'login' ? 'Welcome back' : 'Join us today'}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {tab === 'login'
                                ? 'Sign in to your account to continue'
                                : 'Create an account to start ordering'}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-5 flex items-start gap-2">
                            <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* LOGIN FORM */}
                    {tab === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
                                <input
                                    type="email"
                                    className={inp}
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={e => set('email', e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={inp + ' pr-12'}
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={e => set('password', e.target.value)}
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                                        {showPassword
                                            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        }
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#C19976] hover:bg-[#b38966] text-black font-bold py-3.5 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                                        Signing in...
                                    </span>
                                ) : 'Sign In'}
                            </button>
                            <p className="text-center text-gray-400 text-sm pt-1">
                                Don't have an account?{' '}
                                <button type="button" onClick={() => switchTab('register')} className="text-[#C19976] font-semibold hover:underline">
                                    Create one
                                </button>
                            </p>
                        </form>
                    )}

                    {/* REGISTER FORM */}
                    {tab === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full name</label>
                                <input
                                    type="text"
                                    className={inp}
                                    placeholder="Your full name"
                                    value={form.name}
                                    onChange={e => set('name', e.target.value)}
                                    autoComplete="name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
                                <input
                                    type="email"
                                    className={inp}
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={e => set('email', e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={inp + ' pr-12'}
                                        placeholder="At least 6 characters"
                                        value={form.password}
                                        onChange={e => set('password', e.target.value)}
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                                        {showPassword
                                            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        }
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        className={inp + ' pr-12'}
                                        placeholder="Repeat your password"
                                        value={form.confirmPassword}
                                        onChange={e => set('confirmPassword', e.target.value)}
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowConfirm(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                                        {showConfirm
                                            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        }
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#C19976] hover:bg-[#b38966] text-black font-bold py-3.5 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                                        Creating account...
                                    </span>
                                ) : 'Create Account'}
                            </button>
                            <p className="text-center text-gray-400 text-sm pt-1">
                                Already have an account?{' '}
                                <button type="button" onClick={() => switchTab('login')} className="text-[#C19976] font-semibold hover:underline">
                                    Sign in
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
