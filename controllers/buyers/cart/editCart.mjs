import Cart from "../../../models/carts.mjs";

export const editCart = async (req, res) => {
    try {
        const { pos, size, color } = req.body;
        const userId = req.user;

        // Validate input parameters
        if (typeof pos !== 'number' || pos < 0) {
            return res.status(400).json({ error: "Invalid position. Position must be a non-negative number." });
        }

        if (typeof size !== 'string' || typeof color !== 'string') {
            return res.status(400).json({ error: "Size and color must be strings." });
        }

        // Retrieve the cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found." });
        }

        // Check if the position is within the bounds of the cart items
        if (pos >= cart.items.length) {
            return res.status(400).json({ error: "Invalid position. Position out of bounds." });
        }

        // Update the item in the cart
        cart.items[pos].size = size;
        cart.items[pos].color = color;

        // Save the updated cart
        await cart.save();

        return res.status(200).json({ message: "Changes saved successfully.", cart });
    } catch (err) {
        return res.status(500).json({ error: "Server error, please contact support." });
    }
};
