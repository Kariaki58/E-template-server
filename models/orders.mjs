import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Schema definition
const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true // Index for faster lookups
  },
  productName: {
    type: String
  },
  color: {
    type: String,
    trim: true // Remove leading and trailing spaces
  },
  size: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1 // Default value to prevent missing quantities
  },
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
    index: true // Index for faster lookups
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0 // Default value for better handling
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

// Create model
const Order = model('Order', orderSchema);

export default Order;
