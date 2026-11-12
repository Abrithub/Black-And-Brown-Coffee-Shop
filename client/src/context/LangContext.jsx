import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    // Navbar
    home: 'Home', menu: 'Menu', products: 'Products',
    promotions: 'Promotions', about: 'About', contact: 'Contact',
    login: 'Login', logout: 'Logout', myOrders: 'My Orders',
    // Cart
    yourCart: 'Your Cart', cartEmpty: 'Your cart is empty ☕',
    placeOrder: 'Place Order', total: 'Total', delivery: 'Delivery',
    free: 'Free 🎉',
    // Order form
    completeOrder: 'Complete Your Order', orderSummary: 'Order Summary',
    fullName: 'Full Name', email: 'Email', phone: 'Phone', address: 'Address',
    paymentMethod: 'Payment Method', payOnline: 'Pay Online', cash: 'Cash',
    payOnDelivery: 'Pay on delivery', placingOrder: 'Placing order...',
    orderPlaced: '✅ Order placed! We\'ll contact you soon.',
    // Products
    addToCart: 'Add to Cart', featured: 'Featured', inStock: 'In Stock',
    lowStock: 'Low Stock', almostGone: 'Almost Gone',
    // Orders page
    myOrdersTitle: 'My Orders', trackOrders: 'Track and review your past orders',
    noOrders: "You haven't placed any orders yet.", shopNow: 'Shop Now ☕',
    // Status
    pending: 'Pending', processing: 'Processing',
    completed: 'Completed', cancelled: 'Cancelled',
    // Misc
    backToShop: 'Back to shop', loading: 'Loading...',
  },
  am: {
    // Navbar
    home: 'መነሻ', menu: 'ምናሌ', products: 'ምርቶች',
    promotions: 'ቅናሾች', about: 'ስለ እኛ', contact: 'ያግኙን',
    login: 'ግባ', logout: 'ውጣ', myOrders: 'ትዕዛዞቼ',
    // Cart
    yourCart: 'ጋሪዎ', cartEmpty: 'ጋሪዎ ባዶ ነው ☕',
    placeOrder: 'ትዕዛዝ ስጥ', total: 'ጠቅላላ', delivery: 'ዴሊቨሪ',
    free: 'ነፃ 🎉',
    // Order form
    completeOrder: 'ትዕዛዝዎን ያጠናቅቁ', orderSummary: 'የትዕዛዝ ማጠቃለያ',
    fullName: 'ሙሉ ስም', email: 'ኢሜይል', phone: 'ስልክ', address: 'አድራሻ',
    paymentMethod: 'የክፍያ ዘዴ', payOnline: 'በኦንላይን ክፈሉ', cash: 'በጥሬ ገንዘብ',
    payOnDelivery: 'ሲደርስ ክፈሉ', placingOrder: 'ትዕዛዝ እየተፈፀመ...',
    orderPlaced: '✅ ትዕዛዝ ተቀብሏል! በቅርቡ እናገኝዎታለን።',
    // Products
    addToCart: 'ወደ ጋሪ ጨምር', featured: 'ተመረጠ', inStock: 'አለ',
    lowStock: 'ትንሽ ቀርቷል', almostGone: 'ተቃርቧል',
    // Orders page
    myOrdersTitle: 'ትዕዛዞቼ', trackOrders: 'ያለፉ ትዕዛዞችዎን ይከታተሉ',
    noOrders: 'እስካሁን ምንም ትዕዛዝ አልሰጡም።', shopNow: 'አሁን ይግዙ ☕',
    // Status
    pending: 'በመጠባበቅ', processing: 'እየተሰራ',
    completed: 'ተጠናቋል', cancelled: 'ተሰርዟል',
    // Misc
    backToShop: 'ወደ ሱቅ ተመለስ', loading: 'እየጫነ...',
  },
};

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(
    () => localStorage.getItem('lang') || 'en'
  );

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;

  return (
    <LangContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
