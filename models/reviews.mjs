import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // Minimum rating
        max: 5  // Maximum rating
    },
    name: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
        trim: true // Remove leading and trailing spaces
    },
    reviewImage: {
        type: String
    }
}, { timestamps: true });

// Create model
reviewSchema.index({ userId: 1 });
reviewSchema.index({ productId: 1 });

const Review = model('Review', reviewSchema);

export default Review;
