import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Menu from "./Components/Menu";
import Products from "./Components/Products";
import Promotion from "./Components/Promotion";
import AboutUs from "./Components/Aboutus";
import Contact from "./Components/Contact";
import CartSidebar from "./Components/CartSidebar";
import OrderModal from "./Components/OrderModal";
import Footer from "./Components/Footer";
import { CartProvider } from "./context/CartContext";
import "./App.css";
import CartOrder from "./pages/CartOrder";
import DisplayCartsPage from "./pages/DisplayCartsPage";
import QRCodePage from "./pages/QRCodePage";
import PaymentSuccess from "./pages/PaymentSuccess";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="relative bg-[#1a0f0a] text-white">
            <Navbar />
            <CartSidebar />
            <OrderModal />

            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div className="relative min-h-screen">
                      <img
                        src="img/hero.jpg"
                        alt="Coffee Shop Background"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      />
                      <div className="relative z-10">
                        <Home />
                      </div>
                    </div>
                    <Menu />
                    <Products />
                    <Promotion />
                    <AboutUs />
                    <Contact />
                    <Footer />
                  </>
                }
              />
              <Route path="/cart" element={<DisplayCartsPage />} />
              <Route path="/order" element={<CartOrder />} />
              <Route path="/qr" element={<QRCodePage />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/callback" element={<PaymentSuccess />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
