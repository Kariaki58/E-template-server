import Product from "../../models/products.mjs";
import Cart from "../../models/carts.mjs";
import Order from "../../models/orders.mjs";

export const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const products = await Product.find({})
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Product.countDocuments();

        return res.status(200).send({
            message: products,
            total,
            page: Number(page),
            limit: Number(limit)
        });
    } catch (err) {
        return res.status(500).send({ error: "Server error, please contact staff" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).send({ error: "Product ID is required" });
        }

        // Find and delete the product
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).send({ error: "Product not found" });
        }

        // Remove the product from carts
        await Cart.updateMany(
            { 'items.productId': productId },
            { $pull: { items: { productId: productId } } }
        );

        // Remove the product from orders
        await Order.updateMany(
            { 'cartId.items.productId': productId },
            { $pull: { 'cartId.items': { productId: productId } } }
        );

        res.status(200).send({ message: "Product and its references deleted successfully" });
    } catch (err) {
        return res.status(500).send({ error: "Server error, please contact staff" });
    }
};
