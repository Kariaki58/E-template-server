import Cart from "../../../models/carts.mjs";

export const removeFromCart = async (req, res) => {
    try {
        const user = req.user;
        const { pos, cid } = req.params;

        // Validate request parameters
        const position = parseInt(pos, 10);
        if (isNaN(position) || position < 0) {
            return res.status(400).json({ error: "Invalid position. Position must be a non-negative integer." });
        }

        if (!cid) {
            return res.status(400).json({ error: "Cart item ID (cid) is required." });
        }
        
        // Fetch the user's cart
        const cart = await Cart.findOne({ userId: user }).populate({
            path: 'items.productId'
        });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found." });
        }

        // Check if the position is within the bounds of the cart items
        if (position >= cart.items.length) {
            return res.status(400).json({ error: "Invalid position. Position out of bounds." });
        }

        const item = cart.items[position];

        // Check if the provided cart item ID matches the item at the specified position
        if (item._id.toString() !== cid) {
            return res.status(400).json({ error: "Cart item ID does not match the item at the specified position." });
        }

        // Calculate the impact on the total price and remove the item
        const itemPrice = item.price;
        const itemQuantity = item.quantity;
        cart.totalPrice -= itemPrice * itemQuantity;
        cart.items.splice(position, 1);

        // Save the updated cart
        await cart.save();

        return res.status(200).json({ message: "Item removed from cart successfully.", cart });
    } catch (err) {
        return res.status(500).json({ error: "Server error, please contact support." });
    }
};
