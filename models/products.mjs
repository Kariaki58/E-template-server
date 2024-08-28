import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    gender: String,
    percentOff: {
        type: Number,
        min: 0,
        max: 100
    },
    sizes: [String],
    colors: [
        String
    ],
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    images: {
        type: [String],
        required: true
    },
    materials: [String],
    features: [String],
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    }
}, { timestamps: true });

const Product = model('Product', productSchema);

export default Product;
