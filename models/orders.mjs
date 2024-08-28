import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const orderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  color: {
    type: String
  },
  size: {
    type: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  price: {
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
