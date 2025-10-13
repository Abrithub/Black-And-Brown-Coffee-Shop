import React, { useState, useEffect } from "react";
import { useAuth } from '../Context/AuthContext';
import CustomerAuth from './Auth/CustomerAuth';
import AdminAuth from './Auth/AdminAuth';
import AdminDashboard from './Dashboard/AdminDashboard';
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCustomerAuth, setShowCustomerAuth] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const { cart, toggleCart } = useCart();
  const { user, isAdmin, logout } = useAuth();

  // ✅ Count total items
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full py-4 px-6 top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#1a0f0a]/95 backdrop-blur-lg" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Updated Logo with Coffee Cup Icon and Text */}
        <div className="flex items-center space-x-2">
          <div className="text-[#8B4513]">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 6h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2v5a7 7 0 0 1-14 0V6h-2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1zm-2 0H4v5a5 5 0 1 0 10 0V6z"/>
            </svg>
          </div>
          <span className="text-xl font-bold">
            <span className="text-[#8B4513]">Black</span> & <span className="text-[#A0522D]">Brown</span>
            <br />
            <span className="text-sm text-white">Coffee Shop</span>
          </span>
        </div>

        <div className="hidden md:flex space-x-8">
          {["home", "menu", "products", "promotions", "about", "contact"].map(
            (section) => (
              <a
                key={section}
                href={`#${section}`}
                className="text-white hover:text-[#C19976] capitalize transition-colors duration-200"
              >
                {section}
              </a>
            )
          )}
        </div>

        {/* ✅ Cart Button */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleCart}
            className="relative text-white hover:text-[#C19976] transition duration-300"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21"
              />
            </svg>

            {/* ✅ Cart Count */}
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#C19976] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="text-[#C19976] border border-[#C19976] rounded-full px-6 py-2 hover:bg-[#C19976] hover:text-white transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomerAuth(true)}
              className="text-[#C19976] border border-[#C19976] rounded-full px-6 py-2 hover:bg-[#C19976] hover:text-white transition"
            >
              Sign In
            </button>
          )}
          {!isAdmin && (
            <button
              onClick={() => setShowAdminAuth(true)}
              className="text-gray-400 hover:text-[#C19976] transition text-sm ml-2"
              title="Admin Login"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Auth Modals */}
      {showCustomerAuth && (
        <CustomerAuth onClose={() => setShowCustomerAuth(false)} />
      )}

      {showAdminAuth && (
        <AdminAuth onClose={() => setShowAdminAuth(false)} />
      )}

      {/* Admin Dashboard */}
      {isAdmin && <AdminDashboard />}
    </nav>
  );
};

export default Navbar;