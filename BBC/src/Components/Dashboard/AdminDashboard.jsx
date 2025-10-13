import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';

// Simple Chart Component
const SimpleChart = ({ data, title, type = 'line' }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const chartHeight = 200;

    return (
        <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-6 rounded-2xl border border-[#5D4030] hover:border-[#C19976] transition-all duration-300">
            <h3 className="text-xl font-bold text-[#C19976] mb-4">{title}</h3>
            <div className="relative" style={{ height: chartHeight }}>
                {type === 'line' ? (
                    // Line Chart
                    <svg width="100%" height={chartHeight} className="overflow-visible">
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#C19976" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#C19976" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map((percent) => (
                            <line
                                key={percent}
                                x1="0"
                                y1={`${percent}%`}
                                x2="100%"
                                y2={`${percent}%`}
                                stroke="#5D4030"
                                strokeWidth="1"
                                opacity="0.3"
                            />
                        ))}

                        {/* Area under curve */}
                        <path
                            d={`M 0,${chartHeight} ${data.map((d, i) =>
                                `L ${(i / (data.length - 1)) * 100}%,${chartHeight - (d.value / maxValue) * chartHeight}`
                            ).join(' ')} L 100%,${chartHeight} Z`}
                            fill="url(#lineGradient)"
                        />

                        {/* Line */}
                        <polyline
                            points={data.map((d, i) =>
                                `${(i / (data.length - 1)) * 100}%,${chartHeight - (d.value / maxValue) * chartHeight}`
                            ).join(' ')}
                            fill="none"
                            stroke="#C19976"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />

                        {/* Data points */}
                        {data.map((d, i) => (
                            <circle
                                key={i}
                                cx={`${(i / (data.length - 1)) * 100}%`}
                                cy={chartHeight - (d.value / maxValue) * chartHeight}
                                r="4"
                                fill="#C19976"
                                stroke="#1a0f0a"
                                strokeWidth="2"
                            />
                        ))}
                    </svg>
                ) : (
                    // Bar Chart
                    <div className="flex items-end justify-between h-full space-x-2">
                        {data.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-[#C19976] to-amber-600 rounded-t-sm transition-all duration-300 hover:from-amber-600 hover:to-[#C19976]"
                                    style={{ height: `${(d.value / maxValue) * 100}%` }}
                                />
                                <span className="text-xs text-gray-400 mt-2">{d.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Chart Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center">
                        <div className="w-3 h-3 bg-[#C19976] rounded-full mr-2"></div>
                        <span className="text-gray-300">{d.label}: {d.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const { logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        todaySales: 0,
        todayOrders: 0
    });

    // Chart data for weekly and monthly reports
    const [weeklyData] = useState([
        { label: 'Mon', value: 12 },
        { label: 'Tue', value: 19 },
        { label: 'Wed', value: 15 },
        { label: 'Thu', value: 25 },
        { label: 'Fri', value: 22 },
        { label: 'Sat', value: 30 },
        { label: 'Sun', value: 18 }
    ]);

    const [monthlyData] = useState([
        { label: 'Jan', value: 450 },
        { label: 'Feb', value: 520 },
        { label: 'Mar', value: 480 },
        { label: 'Apr', value: 610 },
        { label: 'May', value: 580 },
        { label: 'Jun', value: 650 },
        { label: 'Jul', value: 720 },
        { label: 'Aug', value: 680 },
        { label: 'Sep', value: 750 },
        { label: 'Oct', value: 820 },
        { label: 'Nov', value: 780 },
        { label: 'Dec', value: 900 }
    ]);

    const [weeklySalesData] = useState([
        { label: 'Mon', value: 2400 },
        { label: 'Tue', value: 3800 },
        { label: 'Wed', value: 3000 },
        { label: 'Thu', value: 5000 },
        { label: 'Fri', value: 4400 },
        { label: 'Sat', value: 6000 },
        { label: 'Sun', value: 3600 }
    ]);

    const [monthlySalesData] = useState([
        { label: 'Jan', value: 45000 },
        { label: 'Feb', value: 52000 },
        { label: 'Mar', value: 48000 },
        { label: 'Apr', value: 61000 },
        { label: 'May', value: 58000 },
        { label: 'Jun', value: 65000 },
        { label: 'Jul', value: 72000 },
        { label: 'Aug', value: 68000 },
        { label: 'Sep', value: 75000 },
        { label: 'Oct', value: 82000 },
        { label: 'Nov', value: 78000 },
        { label: 'Dec', value: 90000 }
    ]);

    // Sample orders data (in real app, this would come from API)
    const [sampleOrders] = useState([
        {
            id: 1,
            customerName: 'John Doe',
            email: 'john@example.com',
            items: [
                { name: 'Ethiopian Yirgacheffe', quantity: 2, price: 110 },
                { name: 'Cappuccino', quantity: 1, price: 220 }
            ],
            total: 440,
            status: 'completed',
            date: new Date().toISOString(),
            paymentMethod: 'Cash'
        },
        {
            id: 2,
            customerName: 'Sarah Johnson',
            email: 'sarah@example.com',
            items: [
                { name: 'Sidamo Coffee', quantity: 1, price: 100 },
                { name: 'Latte Art', quantity: 2, price: 150 }
            ],
            total: 400,
            status: 'pending',
            date: new Date(Date.now() - 3600000).toISOString(),
            paymentMethod: 'Card'
        },
        {
            id: 3,
            customerName: 'Mike Chen',
            email: 'mike@example.com',
            items: [
                { name: 'Harrar Wild Coffee', quantity: 3, price: 110 }
            ],
            total: 330,
            status: 'completed',
            date: new Date(Date.now() - 7200000).toISOString(),
            paymentMethod: 'Cash'
        }
    ]);

    useEffect(() => {
        // Load orders from localStorage or API
        const storedOrders = localStorage.getItem('coffeeShopOrders');
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        } else {
            setOrders(sampleOrders);
            localStorage.setItem('coffeeShopOrders', JSON.stringify(sampleOrders));
        }
    }, []);

    useEffect(() => {
        // Calculate stats
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const today = new Date().toDateString();
        const todayOrders = orders.filter(order =>
            new Date(order.date).toDateString() === today
        );
        const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);

        setStats({
            totalSales,
            totalOrders,
            todaySales,
            todayOrders: todayOrders.length
        });
    }, [orders]);

    const updateOrderStatus = (orderId, newStatus) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem('coffeeShopOrders', JSON.stringify(updatedOrders));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-600';
            case 'pending': return 'bg-yellow-600';
            case 'cancelled': return 'bg-red-600';
            default: return 'bg-gray-600';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a0f0a] to-[#2A1A10] p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-[#C19976] mb-2">Admin Dashboard</h1>
                        <p className="text-gray-300">Manage your coffee shop operations</p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-6 rounded-2xl border border-[#5D4030] hover:border-[#C19976] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Sales</p>
                                <p className="text-3xl font-bold text-[#C19976]">{stats.totalSales} birr</p>
                            </div>
                            <div className="w-12 h-12 bg-[#C19976]/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#C19976]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-6 rounded-2xl border border-[#5D4030] hover:border-[#C19976] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Orders</p>
                                <p className="text-3xl font-bold text-[#C19976]">{stats.totalOrders}</p>
                            </div>
                            <div className="w-12 h-12 bg-[#C19976]/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#C19976]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-6 rounded-2xl border border-[#5D4030] hover:border-[#C19976] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Today's Sales</p>
                                <p className="text-3xl font-bold text-[#C19976]">{stats.todaySales} birr</p>
                            </div>
                            <div className="w-12 h-12 bg-[#C19976]/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#C19976]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-6 rounded-2xl border border-[#5D4030] hover:border-[#C19976] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Today's Orders</p>
                                <p className="text-3xl font-bold text-[#C19976]">{stats.todayOrders}</p>
                            </div>
                            <div className="w-12 h-12 bg-[#C19976]/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#C19976]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] rounded-2xl border border-[#5D4030] overflow-hidden">
                    <div className="p-6 border-b border-[#5D4030]">
                        <h2 className="text-2xl font-bold text-[#C19976]">Recent Orders</h2>
                        <p className="text-gray-400">Manage and track customer orders</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#1a0f0a]">
                                <tr>
                                    <th className="text-left p-4 text-[#C19976] font-semibold">Order ID</th>
                                    <th className="text-left p-4 text-[#C19976] font-semibold">Customer</th>
                                    <th className="text-left p-4 text-[#C19976] font-semibold">Items</th>
                                    <th className="text-left p-4 text-[#C19976] font-semibold">Total</th>
                                    <th className="text-left p-4 text-[#C19976] font-semibold">Status</th>
                                    <th className="text-left p-4 text-[#C19976] font-semibold">Date</th>
                                    <th className="text-left p-4 text-[#C19976] font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-t border-[#5D4030] hover:bg-[#1a0f0a]/50">
                                        <td className="p-4 text-white font-mono">#{order.id}</td>
                                        <td className="p-4">
                                            <div>
                                                <p className="text-white font-semibold">{order.customerName}</p>
                                                <p className="text-gray-400 text-sm">{order.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                {order.items.map((item, index) => (
                                                    <p key={index} className="text-gray-300 text-sm">
                                                        {item.quantity}x {item.name}
                                                    </p>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-[#C19976] font-bold">{order.total} birr</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">{formatDate(order.date)}</td>
                                        <td className="p-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className="bg-[#1a0f0a] border border-[#5D4030] text-white rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[#C19976] focus:border-[#C19976] outline-none"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#C19976] mb-6">Sales Analytics</h2>
                    <div className="grid lg:grid-cols-2 gap-6 mb-8">
                        <SimpleChart
                            data={weeklyData}
                            title="Weekly Orders"
                            type="line"
                        />
                        <SimpleChart
                            data={weeklySalesData}
                            title="Weekly Sales (birr)"
                            type="bar"
                        />
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        <SimpleChart
                            data={monthlyData}
                            title="Monthly Orders"
                            type="line"
                        />
                        <SimpleChart
                            data={monthlySalesData}
                            title="Monthly Sales (birr)"
                            type="bar"
                        />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-6 rounded-2xl border border-[#5D4030] hover:border-[#C19976] transition-all duration-300">
                        <h3 className="text-xl font-bold text-[#C19976] mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full bg-[#C19976] hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors">
                                Add New Product
                            </button>
                            <button className="w-full bg-[#C19976] hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors">
                                View Reports
                            </button>
                            <button className="w-full bg-[#C19976] hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors">
                                Manage Inventory
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-6 rounded-2xl border border-[#5D4030] hover:border-[#C19976] transition-all duration-300">
                        <h3 className="text-xl font-bold text-[#C19976] mb-4">Popular Items</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Ethiopian Yirgacheffe</span>
                                <span className="text-[#C19976] font-semibold">15 sold</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Cappuccino</span>
                                <span className="text-[#C19976] font-semibold">12 sold</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Sidamo Coffee</span>
                                <span className="text-[#C19976] font-semibold">10 sold</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-6 rounded-2xl border border-[#5D4030] hover:border-[#C19976] transition-all duration-300">
                        <h3 className="text-xl font-bold text-[#C19976] mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            <div className="text-sm">
                                <p className="text-gray-300">New order from John Doe</p>
                                <p className="text-gray-500 text-xs">2 minutes ago</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-300">Order #2 completed</p>
                                <p className="text-gray-500 text-xs">1 hour ago</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-300">New customer registered</p>
                                <p className="text-gray-500 text-xs">3 hours ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
