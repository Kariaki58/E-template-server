import Cart from "../../../models/carts.mjs";
import mongoose from "mongoose";

export const clearCart = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ error: "Invalid cart ID" });
        }

        // Attempt to delete the cart by ID
        const result = await Cart.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).send({ error: "Cart not found" });
        }

        return res.status(200).send({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error("Error clearing cart:", error);
        return res.status(500).send({ error: "Internal server error" });
    }
};
