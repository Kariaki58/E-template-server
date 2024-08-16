import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    cartId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cart',
        required: true
    },
    shippingAddress: {
        type: mongoose.Schema.ObjectId,
        ref: 'Address',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
