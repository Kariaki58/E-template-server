import Cart from "../../../models/carts.mjs";
import Product from "../../../models/products.mjs";

export const incrementCart = async (req, res) => {
    try {
        const { body: { productId, quantity, pos } } = req;
        const user = req.user;

        // Basic validations
        if (!productId || !quantity || pos === undefined) {
            return res.status(400).send({ error: "productId, pos, and quantity are required" });
        }

        if (!user) {
            return res.status(401).send({ error: "You are not logged in" });
        }

        // Ensure pos is a valid integer
        const position = parseInt(pos);
        if (isNaN(position) || position < 0) {
            return res.status(400).send({ error: "Position must be a non-negative integer" });
        }

        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).send({ error: "Quantity must be a positive number" });
        }

        // Find cart with only necessary fields, reducing data load
        const cart = await Cart.findOne({ userId: user }).select('items totalPrice').populate({
            path: 'items.productId'
        });
        if (!cart || position >= cart.items.length) {
            return res.status(404).send({ error: "Item not present in your cart or invalid position" });
        }

        const item = cart.items[position];
        if (item.productId._id.toString() !== productId) {
            return res.status(400).send({ error: "Product ID mismatch at the given position" });
        }

        // Find the product's price and increment the quantity
        const productPrice = item.productId.price;
        item.quantity += quantity;
        item.price = productPrice;

        // Recalculate total price
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();

        return res.status(200).send({ message: "Quantity updated successfully", cart });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Server error, please contact support." });
    }
};
