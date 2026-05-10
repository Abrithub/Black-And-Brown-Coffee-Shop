import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import AuthModal from './Auth/AuthModal';
import AdminDashboard from './Dashboard/AdminDashboard';
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const { cart, toggleCart } = useCart();
  const { user, admin, isAdmin, logout } = useAuth();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const loggedInUser = user || admin;

  const openAuth = (tab = 'login') => { setAuthTab(tab); setShowAuth(true); };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleRequestAuth = () => openAuth('login');
    window.addEventListener("scroll", handleScroll);
    window.addEventListener('requestAuth', handleRequestAuth);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('requestAuth', handleRequestAuth);
    };
  }, []);

  return (
    <>
      <nav className={`fixed w-full py-4 px-6 top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#1a0f0a]/95 backdrop-blur-lg shadow-lg" : "bg-transparent"}`}>
        <div className="container mx-auto flex justify-between items-center">

          {/* Logo */}
          <a href="#home" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-[#C19976] rounded-full flex items-center justify-center group-hover:bg-[#b38966] transition">
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 6h2a1 1 0 011 1v2a1 1 0 01-1 1h-2v5a7 7 0 01-14 0V6h14zm-2 0H4v5a5 5 0 0010 0V6z"/>
              </svg>
            </div>
            <div>
              <p className="text-[#C19976] font-bold text-base leading-none">Black & Brown</p>
              <p className="text-gray-400 text-xs">Coffee Shop</p>
            </div>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-8">
            {["home", "menu", "products", "promotions", "about", "contact"].map(section => (
              <a key={section} href={`#${section}`}
                className="text-gray-300 hover:text-[#C19976] capitalize text-sm font-medium transition-colors duration-200">
                {section}
              </a>
            ))}
          </div>

          {/* Desktop right controls */}
          <div className="hidden md:flex items-center space-x-3">

            {/* Cart button */}
            <button
              onClick={() => loggedInUser ? toggleCart() : openAuth('login')}
              className="relative p-2 text-gray-300 hover:text-[#C19976] transition"
              aria-label="Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C19976] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Logged in state */}
            {loggedInUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#C19976] rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">
                      {(loggedInUser.name || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-white text-sm font-medium leading-none">{loggedInUser.name}</p>
                    {isAdmin && <p className="text-[#C19976] text-xs">Admin</p>}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-white border border-[#5D4030] hover:border-[#C19976] px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth('login')}
                  className="text-sm text-gray-300 hover:text-white px-4 py-2 rounded-lg border border-[#5D4030] hover:border-[#C19976] transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="text-sm bg-[#C19976] hover:bg-[#b38966] text-black font-semibold px-4 py-2 rounded-lg transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile cart */}
            <button
              onClick={() => loggedInUser ? toggleCart() : openAuth('login')}
              className="relative p-1 text-gray-300 hover:text-[#C19976] transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C19976] text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(prev => !prev)}
              className="text-white hover:text-[#C19976] transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#1a0f0a]/98 backdrop-blur-lg border-t border-[#5D4030] mt-2">
            <div className="px-6 py-4 space-y-3">
              {["home", "menu", "products", "promotions", "about", "contact"].map(section => (
                <a key={section} href={`#${section}`} onClick={() => setMobileOpen(false)}
                  className="block text-gray-300 hover:text-[#C19976] capitalize transition-colors py-1">
                  {section}
                </a>
              ))}
              <div className="border-t border-[#5D4030] pt-3 mt-3">
                {loggedInUser ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{loggedInUser.name}</p>
                      {isAdmin && <p className="text-[#C19976] text-xs">Admin</p>}
                    </div>
                    <button onClick={() => { logout(); setMobileOpen(false); }}
                      className="text-sm text-red-400 border border-red-800 px-3 py-1.5 rounded-lg">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => { openAuth('login'); setMobileOpen(false); }}
                      className="flex-1 text-sm text-gray-300 border border-[#5D4030] py-2.5 rounded-lg text-center">
                      Sign In
                    </button>
                    <button onClick={() => { openAuth('register'); setMobileOpen(false); }}
                      className="flex-1 text-sm bg-[#C19976] text-black font-semibold py-2.5 rounded-lg text-center">
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultTab={authTab} />}

      {/* Admin Dashboard */}
      {isAdmin && <AdminDashboard />}
    </>
  );
};

export default Navbar;
