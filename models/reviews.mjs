import mongoose from "mongoose";



const reviews = mongoose.Schema({
    productId: ObjectId,
    userId: ObjectId,
    rating: Number,
    comment: String,
    reviewImage: String,
    reviewVideo: String
},  { timestamps: true })


const Review = mongoose.model('Review', reviews)

export default Review