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
    categoryId: {
        type: Types.ObjectId,
        ref: 'Category',
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
    currency: {
        type: String,
        default: 'USD'
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    // sku: {
    //     type: String,
    //     unique: true,
    //     default: null
    // },
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
