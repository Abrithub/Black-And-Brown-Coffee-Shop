import React, { useState, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';

const QRCodeDisplay = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('menu');
    const canvasRef = useRef(null);

    const baseUrl = window.location.origin;

    const qrTargets = {
        menu: {
            label: 'View Menu',
            url: `${baseUrl}/#menu`,
            description: 'Scan to browse our full coffee menu',
            icon: '☕',
            color: '#C19976',
        },
        order: {
            label: 'Order Now',
            url: `${baseUrl}/#products`,
            description: 'Scan to browse products and place an order',
            icon: '🛒',
            color: '#22C55E',
        },
        shop: {
            label: 'Full Shop',
            url: baseUrl,
            description: 'Scan to visit our full online coffee shop',
            icon: '🏪',
            color: '#3B82F6',
        },
    };

    const current = qrTargets[activeTab];

    const downloadQR = () => {
        // Find the canvas element rendered by QRCodeCanvas
        const canvas = document.getElementById('qr-download-canvas');
        if (!canvas) return;
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `blackbrown-coffee-${activeTab}-qr.png`;
        a.click();
    };

    const printQR = () => {
        const printWindow = window.open('', '_blank');
        const svgEl = document.getElementById('qr-svg');
        if (!svgEl || !printWindow) return;
        printWindow.document.write(`
            <html>
            <head>
                <title>Black & Brown Coffee Shop - QR Code</title>
                <style>
                    body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #fff; }
                    .container { text-align: center; padding: 40px; border: 2px solid #C19976; border-radius: 16px; max-width: 400px; }
                    h1 { color: #1a0f0a; font-size: 24px; margin-bottom: 4px; }
                    h2 { color: #C19976; font-size: 18px; margin-bottom: 20px; }
                    p { color: #555; font-size: 14px; margin-top: 16px; }
                    .url { color: #888; font-size: 11px; margin-top: 8px; word-break: break-all; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>☕ Black & Brown</h1>
                    <h2>Coffee Shop</h2>
                    ${svgEl.outerHTML}
                    <p>${current.description}</p>
                    <p class="url">${current.url}</p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] rounded-3xl w-full max-w-md border border-[#5D4030] shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#5D4030]">
                    <div>
                        <h2 className="text-xl font-bold text-[#C19976]">QR Code</h2>
                        <p className="text-gray-400 text-sm">Scan to order or view menu</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition p-1 rounded-lg hover:bg-white/10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tab selector */}
                <div className="flex gap-2 px-6 pt-4">
                    {Object.entries(qrTargets).map(([key, val]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition border ${activeTab === key
                                ? 'bg-[#C19976] text-black border-[#C19976]'
                                : 'text-gray-400 border-[#5D4030] hover:border-[#C19976]'}`}
                        >
                            {val.icon} {val.label}
                        </button>
                    ))}
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center px-6 py-6">
                    <div className="bg-white p-5 rounded-2xl shadow-lg mb-4">
                        {/* Visible SVG for display */}
                        <QRCodeSVG
                            id="qr-svg"
                            value={current.url}
                            size={200}
                            bgColor="#ffffff"
                            fgColor="#1a0f0a"
                            level="H"
                            includeMargin={false}
                            imageSettings={{
                                src: '',
                                excavate: false,
                            }}
                        />
                        {/* Hidden canvas for download */}
                        <QRCodeCanvas
                            id="qr-download-canvas"
                            value={current.url}
                            size={400}
                            bgColor="#ffffff"
                            fgColor="#1a0f0a"
                            level="H"
                            style={{ display: 'none' }}
                        />
                    </div>

                    <p className="text-white font-semibold text-center mb-1">{current.description}</p>
                    <p className="text-gray-500 text-xs text-center break-all px-4 mb-5">{current.url}</p>

                    {/* Action buttons */}
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={downloadQR}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#C19976] hover:bg-[#b38966] text-black font-semibold py-3 rounded-xl transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                        </button>
                        <button
                            onClick={printQR}
                            className="flex-1 flex items-center justify-center gap-2 border border-[#C19976] text-[#C19976] hover:bg-[#C19976] hover:text-black font-semibold py-3 rounded-xl transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print
                        </button>
                    </div>

                    {/* Usage tip */}
                    <div className="mt-4 bg-[#1a0f0a] border border-[#5D4030] rounded-xl p-3 w-full">
                        <p className="text-gray-400 text-xs text-center">
                            💡 Print and place on tables, counter, or packaging so customers can scan and order instantly
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeDisplay;
