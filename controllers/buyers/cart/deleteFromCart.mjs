import Cart from "../../../models/carts.mjs";

export const removeFromCart = async (req, res) => {
    try {
        const user = req.user;
        const { pos, productId } = req.body;

        // Validate request data
        if (typeof pos !== 'number' || pos < 0) {
            return res.status(400).send({ error: "Invalid position. Position must be a non-negative integer." });
        }

        if (!productId) {
            return res.status(400).send({ error: "productId is required." });
        }

        if (!user) {
            return res.status(401).send({ error: "You are not logged in." });
        }

        const cart = await Cart.findOne({ userId: user });
        if (!cart) {
            return res.status(404).send({ error: "Cart not found." });
        }

        if (pos >= cart.items.length) {
            return res.status(400).send({ error: "Invalid position. Position out of bounds." });
        }

        const item = cart.items[pos];
        if (item.productId.toString() !== productId) {
            return res.status(400).send({ error: "ProductId does not match the item at the specified position." });
        }

        const itemPrice = parseFloat(item.price);
        const itemQuantity = item.quantity;
        cart.items.splice(pos, 1);

        cart.totalPrice -= itemPrice * itemQuantity;

        await cart.save();

        res.status(200).send({ message: "Item removed from cart successfully.", cart });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Server error, please contact support." });
    }
};
