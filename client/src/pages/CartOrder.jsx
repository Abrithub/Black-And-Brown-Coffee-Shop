import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const PAYMENT_METHODS = [
  { id: "Chapa", label: "Pay Online", sub: "Telebirr · CBE · Card", icon: "💳", highlight: true },
  { id: "Cash", label: "Cash", sub: "Pay on delivery", icon: "💵" },
];

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
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const total = getCartTotal();
  const deliveryFee = total >= 500 ? 0 : 50;
  const grandTotal = total + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (cart.length === 0) { setError("Your cart is empty."); return; }
    if (!formData.name || !formData.email) { setError("Name and email are required."); return; }

    setLoading(true);
    try {
      if (paymentMethod === "Chapa") {
        // Initialize Chapa payment — redirects to Chapa checkout
        const res = await api.post("/api/payment/initialize", {
          customerId: user?._id || user?.id || null,
          customerName: formData.name,
          email: formData.email,
          phone: formData.phone,
          shippingAddress: formData.address,
          items: cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        });

        if (res.data.success && res.data.checkoutUrl) {
          clearCart();
          // Redirect to Chapa checkout page
          window.location.href = res.data.checkoutUrl;
        } else {
          setError(res.data.message || "Payment initialization failed.");
        }
      } else {
        // Cash on delivery
        await api.post("/api/orders", {
          customerId: user?._id || user?.id || null,
          customerName: formData.name,
          email: formData.email,
          phone: formData.phone,
          shippingAddress: formData.address,
          items: cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          paymentMethod: "Cash",
          paymentMeta: {},
        });
        clearCart();
        alert("✅ Order placed! We'll contact you soon.");
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full p-3 bg-[#1a0f0a] border border-[#5D4030] rounded-xl outline-none focus:ring-2 focus:ring-[#C19976] text-white placeholder-gray-500 text-sm";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] text-white rounded-3xl p-6 shadow-2xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto relative border border-[#5D4030]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={onClose} className="flex items-center text-gray-400 hover:text-white transition text-sm">
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>
        <h2 className="text-lg font-bold text-[#C19976]">Complete Your Order</h2>
        <div className="w-16" />
      </div>

      {/* Order Summary */}
      <div className="bg-[#1a0f0a] rounded-2xl p-4 mb-5 border border-[#5D4030]">
        <p className="text-[#C19976] font-semibold text-sm mb-3">Order Summary</p>
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-gray-300">
              <span className="truncate mr-2">{item.name} ×{item.quantity}</span>
              <span className="shrink-0">{item.price * item.quantity} birr</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#5D4030] mt-3 pt-3 space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Delivery</span>
            <span className={deliveryFee === 0 ? "text-green-400" : ""}>
              {deliveryFee === 0 ? "Free 🎉" : `${deliveryFee} birr`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-[#C19976] text-base">
            <span>Total</span>
            <span>{grandTotal} birr</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm flex gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Full Name *</label>
            <input name="name" type="text" className={inp} placeholder="Abraham Berhanu"
              value={formData.name} onChange={handleChange} required />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Email *</label>
            <input name="email" type="email" className={inp} placeholder="you@example.com"
              value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Phone</label>
            <input name="phone" type="tel" className={inp} placeholder="+251 9XX XXX XXX"
              value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Address</label>
            <input name="address" type="text" className={inp} placeholder="Addis Ababa"
              value={formData.address} onChange={handleChange} />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <p className="text-xs text-gray-400 mb-2">Payment Method</p>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  paymentMethod === m.id
                    ? "bg-[#C19976] border-[#C19976] text-black"
                    : "bg-[#1a0f0a] border-[#5D4030] text-gray-300 hover:border-[#C19976]"
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-lg">{m.icon}</span>
                  <span className="font-bold text-sm">{m.label}</span>
                  {m.highlight && paymentMethod !== m.id && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">Recommended</span>
                  )}
                </div>
                <p className={`text-xs ${paymentMethod === m.id ? "text-black/70" : "text-gray-500"}`}>{m.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chapa info box */}
        {paymentMethod === "Chapa" && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-sm">
            <p className="text-green-400 font-semibold mb-1">🔒 Secure Payment via Chapa</p>
            <p className="text-gray-400 text-xs">You'll be redirected to Chapa's secure checkout where you can pay with:</p>
            <div className="flex gap-3 mt-2 text-xs text-gray-300">
              <span>📱 Telebirr</span>
              <span>🏦 CBE Birr</span>
              <span>💳 Bank Card</span>
              <span>🏧 Amole</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#C19976] hover:bg-[#b38966] text-black py-3.5 rounded-xl font-bold transition disabled:opacity-60 disabled:cursor-not-allowed text-base mt-1"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              {paymentMethod === "Chapa" ? "Redirecting to payment..." : "Placing order..."}
            </span>
          ) : (
            paymentMethod === "Chapa"
              ? `Pay ${grandTotal} birr with Chapa`
              : `Place Order — ${grandTotal} birr`
          )}
        </button>
      </form>
    </div>
  );
};

export default CartOrder;
