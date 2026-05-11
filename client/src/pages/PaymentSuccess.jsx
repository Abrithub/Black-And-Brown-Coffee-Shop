import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const txRef = searchParams.get('tx_ref');
    const [status, setStatus] = useState('verifying'); // verifying | success | failed
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const verify = async () => {
            if (!txRef) { setStatus('failed'); return; }
            try {
                const res = await api.get(`/api/payment/verify/${txRef}`);
                if (res.data.success && res.data.status === 'paid') {
                    setStatus('success');
                    setOrder(res.data.order);
                } else {
                    setStatus('failed');
                }
            } catch {
                setStatus('failed');
            }
        };
        verify();
    }, [txRef]);

    return (
        <div className="min-h-screen bg-[#1a0f0a] flex items-center justify-center p-6">
            <div className="bg-[#2A1A10] rounded-3xl p-10 max-w-md w-full text-center border border-[#5D4030] shadow-2xl">

                {status === 'verifying' && (
                    <>
                        <div className="w-16 h-16 border-4 border-[#C19976] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment</h2>
                        <p className="text-gray-400">Please wait...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful! ☕</h2>
                        <p className="text-gray-400 mb-6">Your order has been placed and is being processed.</p>

                        {order && (
                            <div className="bg-[#1a0f0a] rounded-xl p-4 mb-6 text-left border border-[#5D4030]">
                                <p className="text-[#C19976] font-semibold mb-2 text-sm">Order Details</p>
                                <p className="text-gray-300 text-sm">Order ID: <span className="font-mono">#{order._id?.slice(-6)}</span></p>
                                <p className="text-gray-300 text-sm">Customer: {order.customerName}</p>
                                <p className="text-gray-300 text-sm">Total: <span className="text-[#C19976] font-bold">{order.total} birr</span></p>
                                <p className="text-gray-300 text-sm">Status: <span className="text-blue-400 capitalize">{order.status}</span></p>
                            </div>
                        )}

                        <a href="/" className="block w-full bg-[#C19976] hover:bg-[#b38966] text-black font-bold py-3 rounded-xl transition">
                            Back to Shop
                        </a>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Payment Failed</h2>
                        <p className="text-gray-400 mb-6">Something went wrong with your payment. Please try again.</p>
                        <a href="/" className="block w-full bg-[#C19976] hover:bg-[#b38966] text-black font-bold py-3 rounded-xl transition">
                            Try Again
                        </a>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
