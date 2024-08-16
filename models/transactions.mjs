import mongoose from "mongoose";


const transaction = mongoose.Schema({
    orderId: ObjectId,
    userId: ObjectId,
    amount: Number,
    currency: String,
    paymentMethod: String,
    transactionStatus: String,
    transactionDate: Date
}, { timestamps: true })

const Transaction = mongoose.model('Trasaction', transaction);

export default Transaction