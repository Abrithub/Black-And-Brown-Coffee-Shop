import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CartOrder from '../pages/CartOrder';

const OrderModal = () => {
    const [showOrderForm, setShowOrderForm] = useState(false);
    const { cart, toggleCart } = useCart();

    // Listen for order button clicks
    React.useEffect(() => {
        const handleOrderClick = () => {
            setShowOrderForm(true);
        };

        // Add event listener for order button clicks
        window.addEventListener('placeOrder', handleOrderClick);

        return () => {
            window.removeEventListener('placeOrder', handleOrderClick);
        };
    }, []);

    const handleClose = () => {
        setShowOrderForm(false);
        toggleCart(); // Close the cart sidebar when order is completed
    };

    return (
        <>
            {/* Order Form Popup - Centered Modal */}
            {showOrderForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[2000] p-4">
                    <div className="relative">
                        {/* Close button overlay */}
                        <button
                            onClick={handleClose}
                            className="absolute -top-4 -right-4 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors z-10"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <CartOrder onClose={handleClose} />
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderModal;