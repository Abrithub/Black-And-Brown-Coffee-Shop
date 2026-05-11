import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const orderSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false // Allow guest orders
        },
        customerName: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: function (v) {
                    return v && v.length > 0;
                },
                message: 'Order must have at least one item'
            }
        },
        total: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'cancelled'],
            default: 'pending'
        },
        paymentMethod: {
            type: String,
            enum: ['Card', 'Telebirr', 'CBE', 'Cash', 'Chapa'],
            required: true
        },
        paymentMeta: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        shippingAddress: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

// Auto-calculate total from items before validation
orderSchema.pre('validate', function (next) {
    if (this.items && this.items.length > 0) {
        this.total = this.items.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );
    }
    if (typeof next === 'function') next();
});

export default mongoose.model('Order', orderSchema);


