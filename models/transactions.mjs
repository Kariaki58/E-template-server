import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  reference: { type: String, required: true },
  status: { type: String, required: true },
  message: { type: String, required: true },
  transaction: { type: String, required: true },
  trxref: { type: String, required: true }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
