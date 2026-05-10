import Order from '../models/Order.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public (can be protected later)
export const createOrder = async (req, res) => {
    try {
        const {
            customerId,
            customerName,
            email,
            items,
            paymentMethod,
            paymentMeta,
            shippingAddress,
            phone
        } = req.body;

        // Validation
        if (!customerName || !email || !items || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Please provide customer name, email, items, and payment method'
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Items must be a non-empty array'
            });
        }

        // Validate each item
        for (const item of items) {
            if (!item.name || !item.quantity || !item.price) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have name, quantity, and price'
                });
            }
        }

        // Create order
        const order = await Order.create({
            customerId: customerId || null,
            customerName,
            email: email.toLowerCase(),
            items,
            paymentMethod,
            paymentMeta: paymentMeta || {},
            shippingAddress: shippingAddress || '',
            phone: phone || ''
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin only)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customerId', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customerId', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// @desc    Get orders by customer ID
// @route   GET /api/orders/customer/:customerId
// @access  Private
export const getOrdersByCustomer = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.params.customerId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Please provide status'
            });
        }

        const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        res.json({
            success: true,
            message: 'Order status updated',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private (Admin only)
export const updateOrder = async (req, res) => {
    try {
        const {
            customerName,
            email,
            items,
            paymentMethod,
            paymentMeta,
            shippingAddress,
            phone,
            status
        } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update fields if provided
        if (customerName) order.customerName = customerName;
        if (email) order.email = email.toLowerCase();
        if (items) order.items = items;
        if (paymentMethod) order.paymentMethod = paymentMethod;
        if (paymentMeta) order.paymentMeta = paymentMeta;
        if (shippingAddress !== undefined) order.shippingAddress = shippingAddress;
        if (phone !== undefined) order.phone = phone;
        if (status) order.status = status;

        await order.save();

        res.json({
            success: true,
            message: 'Order updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin only)
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        await Order.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats/summary
// @access  Private (Admin only)
export const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalSales = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: today }
        });

        const todaySales = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: today }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);

        const statusCounts = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            stats: {
                totalOrders,
                totalSales: totalSales[0]?.total || 0,
                todayOrders,
                todaySales: todaySales[0]?.total || 0,
                statusCounts: statusCounts.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};


