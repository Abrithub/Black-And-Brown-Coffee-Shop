import React from 'react';
import { X, Minus, Plus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
  const { 
    cart, 
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    getCartItemsCount,
    clearCart 
  } = useCart();

  const exchangeRate = 144.5;

  const calculateDollarPrice = (birrPrice) => {
    return (birrPrice / exchangeRate).toFixed(2);
  };

  const handleBackToHome = () => {
    toggleCart();
    // Scroll to home section
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContinueShopping = () => {
    toggleCart();
    // Scroll to products section
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={toggleCart}
      />
      
      {/* Cart Sidebar */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#2A1A10] to-[#1a0f0a] shadow-2xl border-l border-[#5D4030] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#5D4030] bg-[#2A1A10]">
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleBackToHome}
                className="p-2 hover:bg-[#5D4030] rounded-lg transition-colors group"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-[#C19976]" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-[#C19976]">Your Cart</h2>
                <p className="text-gray-400 text-sm">{getCartItemsCount()} items</p>
              </div>
            </div>
            <button 
              onClick={toggleCart}
              className="p-2 hover:bg-[#5D4030] rounded-lg transition-colors group"
            >
              <X className="w-6 h-6 text-gray-400 group-hover:text-red-400" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-lg mb-2">Your cart is empty</p>
                <p className="text-sm mb-6">Add some delicious coffee items to get started!</p>
                <button 
                  onClick={handleContinueShopping}
                  className="bg-[#C19976] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#b38966] transition-colors"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-[#1a0f0a] rounded-lg border border-[#5D4030] hover:border-[#C19976] transition-colors">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm truncate">{item.name}</h3>
                      <p className="text-[#C19976] text-sm">{item.price} birr</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2 bg-[#45291B] rounded-full px-3 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-[#5D4030] rounded-full transition-colors"
                          >
                            <Minus className="w-3 h-3 text-gray-400 hover:text-white" />
                          </button>
                          <span className="text-white text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-[#5D4030] rounded-full transition-colors"
                          >
                            <Plus className="w-3 h-3 text-gray-400 hover:text-white" />
                          </button>
                        </div>
                        <p className="text-[#C19976] font-semibold text-sm">
                          {item.price * item.quantity} birr
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 hover:bg-red-600/20 rounded-lg transition-colors flex-shrink-0"
                      title="Remove item"
                    >
                      <X className="w-4 h-4 text-red-400 hover:text-red-300" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#5D4030] bg-[#2A1A10]">
              {/* Order Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-300">Subtotal:</span>
                  <span className="text-[#C19976] font-bold">
                    {getCartTotal()} birr
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Delivery Fee:</span>
                  <span>50 birr</span>
                </div>
                <div className="flex justify-between items-center text-lg border-t border-[#5D4030] pt-3">
                  <span className="text-white font-bold">Total:</span>
                  <span className="text-[#C19976] font-bold text-xl">
                    {getCartTotal() + 50} birr
                  </span>
                </div>
                <div className="text-right text-gray-400 text-sm">
                  ${calculateDollarPrice(getCartTotal() + 50)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-[#C19976] text-black py-3 rounded-lg font-bold hover:bg-[#b38966] transition-colors shadow-lg">
                  Proceed to Checkout
                </button>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={handleContinueShopping}
                    className="flex-1 border border-[#C19976] text-[#C19976] py-3 rounded-lg font-semibold hover:bg-[#C19976] hover:text-black transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button 
                    onClick={clearCart}
                    className="flex-1 border border-red-500 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Free Delivery Notice */}
                {getCartTotal() >= 500 && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center">
                    <p className="text-green-400 text-sm font-semibold">
                      🎉 You qualify for free delivery!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;