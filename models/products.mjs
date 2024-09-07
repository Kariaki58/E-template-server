import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        trim: true
    },
    percentOff: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    couponPercent: Number,
    sizes: {
        type: [String],
        default: []
    },
    colors: {
        type: [String],
        default: []
    },
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
    coupon: {
        type: 'string'
    },
    couponExpiration: {
        type: Date,
    },
    images: {
        type: [String],
        required: true,
        validate: {
            validator: (v) => v.length > 0,
            message: 'At least one image is required'
        }
    },
    materials: {
        type: [String],
        default: []
    },
    features: {
        type: [String],
        default: []
    },
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


productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: { average: 1 } });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ sizes: 1 });
productSchema.index({ colors: 1 });

const Product = model('Product', productSchema);

export default Product;
