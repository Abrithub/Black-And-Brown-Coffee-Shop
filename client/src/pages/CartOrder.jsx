import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartOrder = ({ onClose }) => {
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    telebirrPhone: "",
    cbeAccount: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order object
    const newOrder = {
      id: Date.now(),
      customerName: formData.name,
      email: formData.name.toLowerCase().replace(' ', '') + '@example.com', // Generate email
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: total,
      status: 'pending',
      date: new Date().toISOString(),
      paymentMethod: paymentMethod === 'card' ? 'Card' : paymentMethod === 'telebirr' ? 'Telebirr' : 'CBE',
      paymentMeta:
        paymentMethod === 'card'
          ? { last4: formData.cardNumber.slice(-4) }
          : paymentMethod === 'telebirr'
            ? { phone: formData.telebirrPhone }
            : { account: formData.cbeAccount },
    };

    // Add to existing orders in localStorage
    const existingOrders = JSON.parse(localStorage.getItem('coffeeShopOrders') || '[]');
    existingOrders.unshift(newOrder); // Add to beginning of array
    localStorage.setItem('coffeeShopOrders', JSON.stringify(existingOrders));

    // Clear cart
    clearCart();

    alert("Order placed successfully!");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-title"
      className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] text-white rounded-3xl p-8 shadow-2xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto relative border border-[#C19976]/30 transform scale-100 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onClose}
          className="flex items-center text-[#C19976] hover:text-[#b38966] transition"
        >
          <ArrowLeft size={20} className="mr-1" /> Back to Cart
        </button>
        <h2 id="order-title" className="text-xl font-semibold text-[#C19976]">
          Complete Your Order
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#3b2315] rounded-lg outline-none focus:ring-2 focus:ring-[#C19976]"
        />
        <input
          name="address"
          type="text"
          placeholder="Delivery Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#3b2315] rounded-lg outline-none focus:ring-2 focus:ring-[#C19976]"
        />
        <input
          name="cardNumber"
          type="text"
          placeholder="Credit Card Number"
          value={formData.cardNumber}
          onChange={handleChange}
          required
          maxLength="16"
          className="w-full p-3 bg-[#3b2315] rounded-lg outline-none focus:ring-2 focus:ring-[#C19976]"
        />
        <div className="flex gap-4">
          <input
            name="expiryDate"
            type="text"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={handleChange}
            required
            className="w-1/2 p-3 bg-[#3b2315] rounded-lg outline-none focus:ring-2 focus:ring-[#C19976]"
          />
          <input
            name="cvv"
            type="password"
            placeholder="CVV"
            value={formData.cvv}
            onChange={handleChange}
            required
            maxLength="3"
            className="w-1/2 p-3 bg-[#3b2315] rounded-lg outline-none focus:ring-2 focus:ring-[#C19976]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#C19976] text-black py-3 mt-4 rounded-lg font-semibold hover:bg-[#b38966] transition-all"
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default CartOrder;
