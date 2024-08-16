import mongoose from "mongoose";


const cart = mongoose.Schema({
    userId: ObjectId,
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
    currency: String
}, { timestamps: true })


const Cart = mongoose.model('Cart', cart)


export default Cart