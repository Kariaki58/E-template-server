import Product from "../models/products.mjs";
import mongoose from 'mongoose';

export const productPage = async (req, res) => {
    try {
        const { id } = req.params;


        // Validate the ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ error: "Invalid product ID format" });
        }

        // Fetch the product by ID
        const product = await Product.findById(id);

        // Handle case where product is not found
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }


        // Return the product information
        return res.status(200).send({ product });
        
    } catch (error) {

        // Return a generic server error message
        return res.status(500).send({ error: "Server error, please try again later" });
    }
};
