import Product from '../models/products.mjs';
import Faq from '../models/faq.mjs';
import Review from '../models/reviews.mjs';

export const productPage = async (req, res) => {
    let { slug } = req.params;


    // Validate the ObjectId format and presence of id
    if (!slug) {
        return res.status(400).send({ error: "Invalid or missing product slug" });
    }


    try {
        slug = slug.replace(/-/g, ' ');
        // Fetch the product, FAQ, and review in parallel
        const product = await Product.findOne({ name: slug });


        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        const faq = await Faq.findOne({ productId: product._id });

        const review = await Review.find({ productId: product._id })

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
