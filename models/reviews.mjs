import mongoose from "mongoose";


const reviews = mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
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
    reviewVideo: String
},  { timestamps: true })


const Review = mongoose.model('Review', reviews)

export default Review
