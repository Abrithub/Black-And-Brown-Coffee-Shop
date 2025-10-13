import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import CartOrder from "./CartOrder";

const DisplayCartsPage = () => {
  const { cart, removeFromCart } = useCart();
  const [showOrderPopup, setShowOrderPopup] = useState(false);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#1a0f0a] text-white p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-[#C19976] mb-6 flex items-center gap-2">
        <ShoppingCart size={26} /> Your Cart
      </h2>

      {cart.length === 0 ? (
        <p className="text-gray-400">Your cart is empty ☕</p>
      ) : (
        <div className="w-full max-w-2xl space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-[#2A1A10] rounded-xl p-4"
            >
              <div>
                <h3 className="font-semibold text-[#C19976]">{item.name}</h3>
                <p>Qty: {item.quantity}</p>
              </div>
              <div>
                <p>{item.price * item.quantity} birr</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-sm text-red-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="border-t border-[#C19976]/30 pt-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              Total: <span className="text-[#C19976]">{totalPrice} birr</span>
            </h3>
            <button
              onClick={() => setShowOrderPopup(true)}
              className="bg-[#C19976] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#b38966] transition-all"
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {/* Popup Order Form */}
      {showOrderPopup && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[2000]">
          <CartOrder onClose={() => setShowOrderPopup(false)} />
        </div>
      )}
    </div>
  );
};

export default DisplayCartsPage;
