import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
                index: true,
            },
            size: {
                type: String,
                trim: true,
            },
            color: {
                type: String,
                trim: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            },
            lastUpdated: {
                type: Date,
                default: Date.now,
            }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0,
        min: 0,
    }
}, { timestamps: true });

const Cart = model('Cart', cartSchema);

export default Cart;
