import mongoose from "mongoose";


const transaction = mongoose.Schema({
    orderId: mongoose.Schema.ObjectId,
    userId: mongoose.Schema.ObjectId,
    amount: Number,
    currency: String,
    paymentMethod: String,
    transactionStatus: String,
    transactionDate: Date
}, { timestamps: true })

const Transaction = mongoose.model('Trasaction', transaction);

export default Transaction