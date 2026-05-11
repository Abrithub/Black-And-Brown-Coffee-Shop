import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ onClose, defaultTab = 'login' }) => {
    const [tab, setTab] = useState(defaultTab);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
            if (res.success) { onClose(); return; }
            const adminRes = await login(form.email, form.password, true);
            if (adminRes.success) { onClose(); return; }
            setError(res.message || 'Invalid email or password.');
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
            if (res.success) { onClose(); return; }
            setError(res.message || 'Registration failed. Please try again.');
        } catch { setError('Something went wrong. Please try again.'); }
        finally { setLoading(false); }
    };

    const switchTab = (t) => {
        setTab(t); setError('');
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
    };

    const inp = "w-full px-3 py-2.5 bg-[#1a0f0a] border border-[#5D4030] text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-[#C19976] focus:border-[#C19976] outline-none transition text-sm";

    const EyeIcon = ({ show }) => show ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] rounded-2xl w-full max-w-sm border border-[#5D4030] shadow-2xl flex flex-col" style={{ maxHeight: '95vh' }}>

                {/* Header — fixed */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#C19976] rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 6h2a1 1 0 011 1v2a1 1 0 01-1 1h-2v5a7 7 0 01-14 0V6h14zm-2 0H4v5a5 5 0 0010 0V6z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-[#C19976] font-bold text-xs leading-none">Black & Brown</p>
                            <p className="text-gray-500 text-xs">Coffee Shop</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition p-1 rounded-lg hover:bg-white/10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tab switcher — fixed */}
                <div className="flex mx-5 mb-3 bg-[#1a0f0a] rounded-lg p-0.5 border border-[#5D4030] shrink-0">
                    <button onClick={() => switchTab('login')}
                        className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${tab === 'login' ? 'bg-[#C19976] text-black' : 'text-gray-400 hover:text-white'}`}>
                        Sign In
                    </button>
                    <button onClick={() => switchTab('register')}
                        className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${tab === 'register' ? 'bg-[#C19976] text-black' : 'text-gray-400 hover:text-white'}`}>
                        Create Account
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 px-5 pb-5">
                    <div className="mb-3">
                        <h2 className="text-xl font-bold text-white">
                            {tab === 'login' ? 'Welcome back' : 'Join us today'}
                        </h2>
                        <p className="text-gray-400 text-xs mt-0.5">
                            {tab === 'login' ? 'Sign in to your account' : 'Create an account to start ordering'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2.5 mb-3 flex items-start gap-2">
                            <span className="text-red-400 text-xs mt-0.5">⚠️</span>
                            <p className="text-red-400 text-xs">{error}</p>
                        </div>
                    )}

                    {/* LOGIN */}
                    {tab === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Email address</label>
                                <input type="email" className={inp} placeholder="you@example.com"
                                    value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} className={inp + ' pr-10'}
                                        placeholder="Enter your password" value={form.password}
                                        onChange={e => set('password', e.target.value)} autoComplete="current-password" required />
                                    <button type="button" onClick={() => setShowPassword(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                        <EyeIcon show={showPassword} />
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full bg-[#C19976] hover:bg-[#b38966] text-black font-bold py-3 rounded-lg transition disabled:opacity-60 text-sm">
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                            <p className="text-center text-gray-400 text-xs">
                                Don't have an account?{' '}
                                <button type="button" onClick={() => switchTab('register')} className="text-[#C19976] font-semibold hover:underline">
                                    Create one
                                </button>
                            </p>
                        </form>
                    )}

                    {/* REGISTER */}
                    {tab === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Full name</label>
                                <input type="text" className={inp} placeholder="Your full name"
                                    value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Email address</label>
                                <input type="email" className={inp} placeholder="you@example.com"
                                    value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} className={inp + ' pr-10'}
                                        placeholder="At least 6 characters" value={form.password}
                                        onChange={e => set('password', e.target.value)} autoComplete="new-password" required />
                                    <button type="button" onClick={() => setShowPassword(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                        <EyeIcon show={showPassword} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Confirm password</label>
                                <div className="relative">
                                    <input type={showConfirm ? 'text' : 'password'} className={inp + ' pr-10'}
                                        placeholder="Repeat your password" value={form.confirmPassword}
                                        onChange={e => set('confirmPassword', e.target.value)} autoComplete="new-password" required />
                                    <button type="button" onClick={() => setShowConfirm(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                        <EyeIcon show={showConfirm} />
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full bg-[#C19976] hover:bg-[#b38966] text-black font-bold py-3 rounded-lg transition disabled:opacity-60 text-sm">
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                            <p className="text-center text-gray-400 text-xs">
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
