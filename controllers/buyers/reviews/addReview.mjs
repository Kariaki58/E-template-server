import Review from "../../../models/reviews.mjs";

export const addReview = async (req, res) => {
    try {
        const { body: { productId, rating, comment, imageUrl: reviewImage } } = req;
        const userId = req.user;

        // Validate input
        if (!productId) {
            return res.status(400).send({ error: 'Product ID is required' });
        }
        if (!rating) {
            return res.status(400).send({ error: "Please provide a rating" });
        }
        if (!comment) {
            return res.status(400).send({ error: "Please add a comment" });
        }

        // Check if the user has already reviewed this product
        const existingReview = await Review.findOne({ userId, productId }).lean();
        if (existingReview) {
            return res.status(200).send({ message: "You have already given a review for this product" });
        }

        // Create and save the new review
        const newReview = new Review({
            userId, productId, rating, comment, reviewImage
        });
        await newReview.save();

        return res.status(201).send({ message: "Thank you for your review" });
    } catch (error) {
        return res.status(500).send({ error: "Server error, please try again later" });
    }
};
