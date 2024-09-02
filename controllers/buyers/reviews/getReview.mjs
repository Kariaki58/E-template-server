import Review from "../../../models/reviews.mjs";
import Product from "../../../models/products.mjs";

export const getProductReview = async (req, res) => {
    try {
        const { pid: productId } = req.params;

        // Validate productId
        if (!productId) {
            return res.status(400).send({ error: "Product ID is required" });
        }

        // Check if the product exists
        const productExists = await Product.exists({ _id: productId });
        if (!productExists) {
            return res.status(404).send({ error: "Invalid product ID" });
        }

        // Fetch reviews for the product
        const reviews = await Review.find({ productId })
            .populate({
                path: 'userId',
                select: '-password',  // Exclude password from user data
            })
            .exec();

        return res.status(200).send({ message: reviews });
    } catch (err) {
        return res.status(500).send({ error: "Server error, please try again later" });
    }
};
