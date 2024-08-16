import mongoose from "mongoose";


const order = new mongoose.Schema({
    userId: mongoose.Schema.ObjectId,
    items: [
        {
            productId: ObjectId,
            size: Number,
            color: String,
            quantity: Number,
            price: Number
        }
    ],
    totalPrice: Number,
    currency: String,
    shippingAddress: mongoose.Schema.ObjectId,
    billingAddress: mongoose.Schema.ObjectId,
    status: String
}, { timeseries: true })

const Order = mongoose.model('Order', order)


export default Order