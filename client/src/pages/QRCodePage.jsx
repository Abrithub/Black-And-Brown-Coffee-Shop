import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Change this to your real Vercel URL after deploying
const SITE_URL = import.meta.env.VITE_SITE_URL || 
  (typeof window !== 'undefined' ? window.location.origin : 'https://black-and-brown-coffee-shop-6hn7.vercel.app');

const QRCodePage = () => {
    const printRef = useRef();

    const handlePrint = () => {
        const content = printRef.current.innerHTML;
        const win = window.open('', '_blank');
        win.document.write(`
            <html>
            <head>
                <title>Black & Brown Coffee - QR Code</title>
                <style>
                    body { margin: 0; padding: 40px; font-family: Georgia, serif; background: #fff; }
                    .page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
                    .logo { font-size: 32px; font-weight: bold; color: #8B4513; margin-bottom: 8px; }
                    .sub { font-size: 16px; color: #666; margin-bottom: 32px; }
                    .qr-box { border: 3px solid #C19976; border-radius: 16px; padding: 24px; background: #fff; }
                    .instruction { margin-top: 24px; font-size: 18px; color: #333; text-align: center; }
                    .url { margin-top: 8px; font-size: 13px; color: #999; text-align: center; }
                    .steps { margin-top: 24px; text-align: left; font-size: 14px; color: #555; line-height: 2; }
                    .divider { width: 200px; height: 2px; background: #C19976; margin: 20px auto; }
                </style>
            </head>
            <body>
                <div class="page">
                    ${content}
                </div>
            </body>
            </html>
        `);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); win.close(); }, 500);
    };

    return (
        <div className="min-h-screen bg-[#1a0f0a] flex flex-col items-center justify-center p-8">
            <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl" ref={printRef}>
                {/* Logo */}
                <div className="mb-2">
                    <p className="text-3xl font-bold" style={{ color: '#8B4513' }}>Black & Brown</p>
                    <p className="text-base text-gray-500">Coffee Shop</p>
                </div>

                <div className="w-32 h-0.5 bg-amber-600 mx-auto my-5" />

                {/* QR Code */}
                <div className="flex justify-center mb-5">
                    <div className="border-4 border-amber-700 rounded-2xl p-4 bg-white">
                        <QRCodeSVG
                            value={SITE_URL}
                            size={200}
                            bgColor="#ffffff"
                            fgColor="#3b1a08"
                            level="H"
                            includeMargin={false}
                        />
                    </div>
                </div>

                {/* Instructions */}
                <p className="text-xl font-bold text-gray-800 mb-2">Scan to Order</p>
                <p className="text-sm text-gray-500 mb-4">Point your phone camera at the QR code to view our menu and place your order</p>

                <div className="w-32 h-0.5 bg-amber-600 mx-auto my-4" />

                <div className="text-left text-sm text-gray-600 space-y-1">
                    <p>1. Open your phone camera</p>
                    <p>2. Point at the QR code</p>
                    <p>3. Tap the link that appears</p>
                    <p>4. Browse menu & order</p>
                </div>

                <div className="w-32 h-0.5 bg-amber-600 mx-auto my-4" />

                <p className="text-xs text-gray-400 break-all">{SITE_URL}</p>
                <p className="text-xs text-gray-400 mt-1">📍 Addis Ababa, Alem Bank</p>
            </div>

            {/* Controls — hidden when printing */}
            <div className="mt-8 flex gap-4">
                <button
                    onClick={handlePrint}
                    className="bg-[#C19976] hover:bg-[#b38966] text-black font-bold px-8 py-3 rounded-xl transition flex items-center gap-2"
                >
                    🖨️ Print QR Code
                </button>
                <a
                    href="/"
                    className="border border-[#5D4030] text-gray-300 hover:border-[#C19976] hover:text-white px-8 py-3 rounded-xl transition"
                >
                    ← Back to Site
                </a>
            </div>

            <p className="text-gray-500 text-sm mt-4">
                Print this page and place it on each table
            </p>
        </div>
    );
};

export default QRCodePage;
