import Category from "../models/categories.mjs";


export const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).send({ error: "An error occurred while retrieving categories" });
    }
};