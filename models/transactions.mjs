import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const transactionSchema = new Schema({
  reference: {
    type: String,
    required: true,
    trim: true, // Remove leading and trailing spaces
    unique: true // Ensure each transaction reference is unique
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'], // Define possible status values
    default: 'pending' // Set default status
  },
  message: {
    type: String,
    required: true,
    trim: true // Remove leading and trailing spaces
  },
  transaction: {
    type: String,
    required: true,
    trim: true // Remove leading and trailing spaces
  },
  trxref: {
    type: String,
    required: true,
    trim: true, // Remove leading and trailing spaces
    unique: true // Ensure each trxref is unique
  }
}, { timestamps: true });

// Add indexes to the schema
transactionSchema.index({ reference: 1 });
transactionSchema.index({ trxref: 1 });
transactionSchema.index({ status: 1 }); // Optional: Index for querying by status

// Create model
const Transaction = model('Transaction', transactionSchema);

export default Transaction;
