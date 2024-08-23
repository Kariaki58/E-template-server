import Product from "../../models/products.mjs";

export const getUploads = async (req, res) => {
    try {
        const products = await Product.find({}).populate('categoryId', 'name');
        return res.status(200).send({ message: products });
    } catch (err) {
        return res.status(500).send({ error: "Server error, please contact staff" });
    }
};
