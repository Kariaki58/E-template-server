import mongoose from "mongoose";



const reviews = mongoose.Schema({
    productId: mongoose.Schema.ObjectId,
    userId: mongoose.Schema.ObjectId,
    rating: Number,
    comment: String,
    reviewImage: String,
    reviewVideo: String
},  { timestamps: true })


const Review = mongoose.model('Review', reviews)

export default Review