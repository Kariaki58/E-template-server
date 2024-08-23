import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  reference: { type: String, required: true },
  status: { type: String, required: true },
  amount: { type: Number, required: true },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
