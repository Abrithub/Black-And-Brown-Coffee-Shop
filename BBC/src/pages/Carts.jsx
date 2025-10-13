import React from "react";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Carts = () => {
  const { cart, removeFromCart, isCartOpen, toggleCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-[#2A1A10] text-white z-50 shadow-2xl p-6 overflow-y-auto transform transition-transform duration-500 ${isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#C19976]">Your Cart</h2>
        <X
          className="cursor-pointer text-[#C19976] hover:text-[#b38966]"
          onClick={toggleCart}
        />
      </div>

      {/* Items */}
      {cart.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">Your cart is empty ☕</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-[#3b2315] rounded-xl p-3"
            >
              <div>
                <h3 className="font-semibold text-[#C19976]">{item.name}</h3>
                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p>{item.price * item.quantity} birr</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-red-400 hover:text-red-600 mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {cart.length > 0 && (
        <div className="mt-6 border-t border-[#C19976]/40 pt-4">
          <div className="flex justify-between text-lg">
            <span>Total:</span>
            <span className="font-semibold text-[#C19976]">
              {totalPrice} birr
            </span>
          </div>
          <button
            onClick={() => {
              // Dispatch custom event to trigger order modal
              window.dispatchEvent(new CustomEvent('placeOrder'));
            }}
            className="w-full bg-[#C19976] text-black py-3 mt-4 rounded-lg font-semibold hover:bg-[#b38966] transition-all"
          >
            Place Order
          </button>
        </div>
      )}

    </div>
  );
};

export default Carts;
