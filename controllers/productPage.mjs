import mongoose from 'mongoose';
import Product from '../models/products.mjs';
import Faq from '../models/faq.mjs';
import Review from '../models/reviews.mjs';

export const productPage = async (req, res) => {
    const { id } = req.params;

    // Validate the ObjectId format and presence of id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid or missing product ID" });
    }

    try {
        // Fetch the product, FAQ, and review in parallel
        const [product, faq] = await Promise.all([
            Product.findById(id),
            Faq.findOne({ productId: id })
        ]);

        const review = await Review.find({ productId: id })

        // Handle case where product is not found
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        // Return the product information
        return res.status(200).send({ product, faq, review });

    } catch (error) {
        return res.status(500).send({ error: "Server error, please try again later" });
    }
};
