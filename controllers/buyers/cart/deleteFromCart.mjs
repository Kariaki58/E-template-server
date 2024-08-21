import Cart from "../../../models/carts.mjs";

export const removeFromCart = async (req, res) => {
    try {
        const user = req.user;
        const { pos, cid } = req.params;
        let convertToNumber
        try {
            convertToNumber = parseInt(pos)
        } catch (err) {
            return res.status(400).send({ error: "cart must be an integer"})
        }
        // Validate request data
        if (typeof convertToNumber !== 'number' || convertToNumber < 0) {
            return res.status(400).send({ error: "Invalid position. Position must be a non-negative integer." });
        }

        if (!cid) {
            return res.status(400).send({ error: "cart id is required." });
        }

        if (!user) {
            return res.status(401).send({ error: "You are not logged in." });
        }

        const cart = await Cart.findOne({ userId: user }).populate('items.productId');
        if (!cart) {
            return res.status(404).send({ error: "Cart not found." });
        }

        if (convertToNumber >= cart.items.length) {
            return res.status(400).send({ error: "Invalid position. Position out of bounds." });
        }

        const item = cart.items[convertToNumber];
        if (item._id.toString() !== cid) {
            return res.status(400).send({ error: "cart id does not match the item at the specified position." });
        }

        const itemPrice = parseFloat(item.price);
        const itemQuantity = item.quantity;
        cart.items.splice(convertToNumber, 1);

        cart.totalPrice -= itemPrice * itemQuantity;

        await cart.save();

        res.status(200).send({ message: "Item removed from cart successfully.", cart });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Server error, please contact support." });
    }
};
