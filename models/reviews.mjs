import mongoose from "mongoose";


const reviews = mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    reviewImage: String,
},  { timestamps: true })


const Review = mongoose.model('Review', reviews)

export default Review
