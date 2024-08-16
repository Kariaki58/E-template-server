import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            size: {
                type: String,
            },
            color: {
                type: String,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: mongoose.Types.Decimal128,
                required: true,
                min: 0
            }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0,
        min: 0
    }
}, { timestamps: true });

const Cart = model('Cart', cartSchema);

export default Cart;
