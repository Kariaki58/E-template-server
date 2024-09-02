import Review from "../../../models/reviews.mjs";

export const editReview = async (req, res) => {
    try {
        const { body: { productId, rating, comment, reviewImage, reviewVideo } } = req;
        const userId = req.user;

        // Validate inputs
        if (!productId) {
            return res.status(400).send({ error: 'Product ID is required' });
        }
        if (!rating) {
            return res.status(400).send({ error: "Please provide a rating" });
        }
        if (!comment) {
            return res.status(400).send({ error: "Please add a comment" });
        }

        // Ensure either reviewImage or reviewVideo is used, not both
        let image = reviewImage;
        let video = reviewVideo;
        if (reviewImage && reviewVideo) {
            video = null;
        }

        // Find the user's review for the specified product
        const userReview = await Review.findOne({ userId, productId });
        if (!userReview) {
            return res.status(404).send({ error: "Review not found" });
        }

        // Update the review with the new details
        userReview.rating = rating;
        userReview.comment = comment;
        userReview.reviewImage = image;
        userReview.reviewVideo = video;

        await userReview.save();

        return res.status(200).send({ message: "Thank you for updating your review" });
    } catch (err) {
        return res.status(500).send({ error: "Server error, please try again later" });
    }
};
