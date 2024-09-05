import Cart from "../../../models/carts.mjs";

export const getUserCart = async (req, res) => {
    try {
        const user = req.user
        // Efficiently retrieve the user's cart with populated product details
        const userCart = await Cart.findOne({ userId: user })
            .populate({
                path: 'items.productId',
                select: 'name price images stock' // Only select fields that are necessary
            })
            .lean();

        if (!userCart) {
            return res.status(200).json({ message: [], cart: null });
        }

        return res.status(200).json({ message: "Cart retrieved successfully", cart: userCart });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};
