import Cart from "../../../models/carts.mjs";

export const decrementCart = async (req, res) => {
    try {
        const { productId, quantity, pos } = req.body;
        const user = req.user;

        // Validate required fields
        if (!productId || !quantity || pos === undefined) {
            return res.status(400).json({ error: "productId, pos, and quantity are required" });
        }

        // Validate user authentication
        if (!user) {
            return res.status(401).json({ error: "You are not logged in" });
        }

        // Validate quantity
        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ error: "Quantity must be a positive number" });
        }
        
        const cart = await Cart.findOne({ userId: user }).select('items totalPrice').populate({
            path: 'items.productId'
        });

        if (!cart) {
            return res.status(400).json({ error: "Item not present in your cart" });
        }

        // Ensure valid position
        if (pos < 0 || pos >= cart.items.length) {
            return res.status(400).json({ error: "Invalid position" });
        }

        // Decrement the quantity of the item
        const cartItem = cart.items[pos];
        cartItem.quantity -= quantity;

        // If quantity drops to zero or below, remove the item from the cart
        if (cartItem.quantity <= 0) {
            cart.items.splice(pos, 1);
        }

        // Recalculate the total price using the existing price data
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.productId.price - (item.productId.price * (item.productId.percentOff / 100))) * item.quantity, 0);

        // Save the updated cart with a single operation
        await cart.save();

        return res.status(200).json({ message: "Quantity updated successfully", cart });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
