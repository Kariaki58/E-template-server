import Product from "../models/products.mjs";
import Category from "../models/categories.mjs";

export const category = async (req, res) => {
    try {
        // Fetch all categories
        const categories = await Category.find({});

        // Iterate over categories to check if there are any associated products
        for (let category of categories) {
            const products = await Product.find({ categoryId: category._id });

            // If no products are associated with the category, remove the category
            if (products.length === 0) {
                await Category.findByIdAndDelete(category._id);
            }
        }

        // Fetch the updated list of categories
        const updatedCategories = await Category.find({});
        return res.status(200).send({ message: updatedCategories });

    } catch (err) {
        return res.status(500).send({ error: "Server error, please contact staff" });
    }
};
