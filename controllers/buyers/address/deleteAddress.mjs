import mongoose from "mongoose";
import Address from "../../../models/address.mjs";

export const deleteAddress = async (req, res) => {
    const userId = req.user._id; // Assuming user is authenticated and set by middleware
    const addressId = req.params.id;

    if (!addressId) {
        return res.status(400).json({ error: "Address ID is required." });
    }
    if (!mongoose.isValidObjectId(addressId)) {
        return res.status(400).send({ error: "not a valid objectId" })
    }

    try {
        const address = await Address.findOneAndDelete({
            _id: addressId,
            userId: userId
        }).exec(); // Ensure query execution with `exec()` for better handling

        if (!address) {
            return res.status(404).json({ error: "Address not found or unauthorized." });
        }

        res.status(200).json({ message: "Address deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete address." });
    }
};