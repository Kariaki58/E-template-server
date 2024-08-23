import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: 'Cart',
    required: true
  },
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

const Order = model('Order', orderSchema);

export default Order;
