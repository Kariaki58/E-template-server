import Product from "../../models/products.mjs";

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).send({ error: "Product ID is required" });
        }

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).send({ error: "Product not found" });
        }

        res.status(200).send({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Server error, please contact staff" });
    }
};
