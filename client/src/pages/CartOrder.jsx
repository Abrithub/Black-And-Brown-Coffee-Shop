import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const CartOrder = ({ onClose }) => {
  const { cart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    telebirrPhone: "",
    cbeAccount: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!formData.name || !formData.email) {
      setError("Name and email are required.");
      return;
    }

    const paymentMeta =
      paymentMethod === "Card"
        ? {}
        : paymentMethod === "Telebirr"
        ? { phone: formData.telebirrPhone }
        : paymentMethod === "CBE"
        ? { account: formData.cbeAccount }
        : {};

    const payload = {
      customerId: user?._id || user?.id || null,
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      paymentMethod,
      paymentMeta,
      shippingAddress: formData.address,
    };

    try {
      setLoading(true);
      await api.post("/api/orders", payload);
      clearCart();
      alert("✅ Order placed successfully! We'll contact you soon.");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const total = getCartTotal();
  const deliveryFee = total >= 500 ? 0 : 50;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-title"
      className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] text-white rounded-3xl p-8 shadow-2xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto relative border border-[#C19976]/30"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onClose}
          className="flex items-center text-[#C19976] hover:text-[#b38966] transition"
        >
          <ArrowLeft size={20} className="mr-1" /> Back
        </button>
        <h2 id="order-title" className="text-xl font-semibold text-[#C19976]">
          Complete Your Order
        </h2>
      </div>

      {/* Order Summary */}
      <div className="bg-[#1a0f0a] rounded-xl p-4 mb-6 border border-[#5D4030]">
        <h3 className="text-[#C19976] font-semibold mb-3">Order Summary</h3>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-gray-300 mb-1">
            <span>{item.name} × {item.quantity}</span>
            <span>{item.price * item.quantity} birr</span>
          </div>
        ))}
        <div className="border-t border-[#5D4030] mt-3 pt-3 space-y-1">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? "Free 🎉" : `${deliveryFee} birr`}</span>
          </div>
          <div className="flex justify-between font-bold text-[#C19976]">
            <span>Total</span>
            <span>{total + deliveryFee} birr</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-600/20 border border-red-500 rounded-lg p-3 mb-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Full Name *"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#3b2315] rounded-lg outline-none focus:ring-2 focus:ring-[#C19976] text-white placeholder-gray-500"
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address *"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#3b2315] rounded-lg outline-none focus:ring-2 focus:ring-[#C19976] text-white placeholder-gray-500"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 bg-[#3b2315] rounded-lg outline-none focus:ring-2 focus:ring-[#C19976] text-white placeholder-gray-500"
        />
        <input
          name="address"
          type="text"
          placeholder="Delivery Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-3 bg-[#3b2315] rounded-lg outline-none focus:ring-2 focus:ring-[#C19976] text-white placeholder-gray-500"
        />

        {/* Payment Method */}
        <div>
          <p className="text-gray-300 mb-2 font-medium">Payment Method</p>
          <div className="grid grid-cols-2 gap-2">
            {["Cash", "Card", "Telebirr", "CBE"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`py-2 px-4 rounded-lg border font-medium transition ${
                  paymentMethod === method
                    ? "bg-[#C19976] text-black border-[#C19976]"
                    : "bg-[#3b2315] text-gray-300 border-[#5D4030] hover:border-[#C19976]"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {paymentMethod === "Telebirr" && (
          <input
            name="telebirrPhone"
            type="tel"
            placeholder="Telebirr Phone Number"
            value={formData.telebirrPhone}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#3b2315] rounded-lg outline-none focus:ring-2 focus:ring-[#C19976] text-white placeholder-gray-500"
          />
        )}
        {paymentMethod === "CBE" && (
          <input
            name="cbeAccount"
            type="text"
            placeholder="CBE Account Number"
            value={formData.cbeAccount}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#3b2315] rounded-lg outline-none focus:ring-2 focus:ring-[#C19976] text-white placeholder-gray-500"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#C19976] text-black py-3 mt-2 rounded-lg font-bold hover:bg-[#b38966] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Placing Order..." : `Place Order — ${total + deliveryFee} birr`}
        </button>
      </form>
    </div>
  );
};

export default CartOrder;
